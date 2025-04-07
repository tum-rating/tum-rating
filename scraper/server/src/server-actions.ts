import WebSocket, {WebSocketServer} from "ws";
import axios from "axios";
import mergeCoursesByNamesWithAi, {AiResponse, checkCorrectnessOfMergedCourses} from "./merge-courses-by-names-with-ai";
import Logger from "./server-logger";
import {PRODUCTION_API_COURSES_URL, TUM_ONLINE_SEMESTERS_URL,} from "./server-actions-config";
import {serverFilesystemConfig, serverFilesystemConfigFilesMap,} from "./server-filesystem-config";
import fs from "fs";
import path from "path";
import {v4 as uuidv4} from "uuid";

import {fetchAllPages, keySimilarityCore, summarizeFetchedData,} from "./server-actions-utils";
import {applyPatch, compare} from "fast-json-patch";
import {aiWorkers, broadcastAiWorkers} from "./websocket-handlers";

interface FetchParams {
    suffix: string;
    semesters?: string[];
    filesToMerge?: any[];
    ws: WebSocket;
    wss: WebSocketServer;
    content?: any;
}

const broadcastFetchStatus = (
    wss: WebSocketServer,
    type: string,
    status: boolean,
) => {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({action: "fetchStatus", fetchStatus: status, type}),
            );
        }
    });
};

const broadcastNewFile = (wss: WebSocketServer, fileName: string) => {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({action: "newFile", name: fileName}));
        }
    });
};

const keySimilarityMerging = async ({
                                        filesToMerge = [],
                                        ws,
                                        wss,
                                        suffix,
                                    }: FetchParams) => {
    if (!suffix) {
        suffix = "merged" + new Date().getTime();
    }
    const fileConfig = serverFilesystemConfigFilesMap["mrozon-rating-data"];
    const filePath = path.join(
        serverFilesystemConfig.DIRECTORY,
        `${suffix}-merged${fileConfig.extension}`,
    );

    broadcastFetchStatus(wss, `merged-${suffix}`, true);

    let allCourses = [];
    for (const file of filesToMerge) {
        let filePath = path.join(serverFilesystemConfig.DIRECTORY, `${file}`);
        const content = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(content);
        allCourses.push(...data);
    }
    const summarizedData = keySimilarityCore(allCourses, "name", "courseId");

    for (let i = 0; i < summarizedData.length; i++) {
        summarizedData[i].notResolvedCount = (summarizedData[i].merged || []).filter(x => !x.locked).length;
        summarizedData[i].rejectedCount = 0;
        summarizedData[i].acceptedCount = 0;
    }

    fs.writeFileSync(filePath, JSON.stringify(summarizedData, null, 2), "utf-8");

    broadcastFetchStatus(wss, `merged-${suffix}`, false);
    ws.send(
        JSON.stringify({
            action: "newFile",
            name: `${suffix}-merged${fileConfig.extension}`,
        }),
    );
    broadcastNewFile(wss, `merged-${suffix}${fileConfig.extension}`);
};
const finishKeySimilarityMerging = async ({
                                              filesToMerge = [],
                                              ws,
                                              wss,
                                              suffix,
                                          }: FetchParams) => {
    const keysToRemove = ["acceptedCount", "rejectedCount", "notResolvedCount"];
    suffix = suffix || `merged${Date.now()}`;
    const fileConfig = serverFilesystemConfigFilesMap["mrozon-rating-data"];
    const filePath = path.join(
        serverFilesystemConfig.DIRECTORY,
        `${suffix}-finalized-merge${fileConfig.extension}`,
    );

    broadcastFetchStatus(wss, `merged-${suffix}`, true);
    broadcastFetchStatus(wss, filePath, true);

    const allCourses = filesToMerge.flatMap((file) => {
        const content = fs.readFileSync(
            path.join(serverFilesystemConfig.DIRECTORY, file),
            "utf-8",
        );
        return JSON.parse(content);
    });


    const finalizedData = [];

    for (const course of allCourses) {
        for (const key of keysToRemove) {
            delete course[key];
        }

        if (course.merged?.length) {
            const mergedCourses = course.merged;
            const baseCourse = mergedCourses[0];

            delete baseCourse.accepted;
            baseCourse.locked = true;

            for (let i = 1; i < mergedCourses.length; i++) {
                const mergedCourse = mergedCourses[i];
                const isAccepted = mergedCourse.accepted || mergedCourse.locked;
                if (isAccepted) {
                    mergedCourse.locked = true;
                    delete mergedCourse.merged
                } else {
                    baseCourse.rejectedId = baseCourse.rejectedId
                        ? [...baseCourse.rejectedId, mergedCourse.id]
                        : [mergedCourse.id];
                    mergedCourse.rejectedId = mergedCourse.rejectedId
                        ? [...mergedCourse.rejectedId, baseCourse.id]
                        : [baseCourse.id];
                    mergedCourse.locked = false;
                }
                delete mergedCourse.similarity;
                delete mergedCourse.accepted;
            }

            const lockedCourses = [];
            const unlockedCourses = [];

            for (let i = 1; i < mergedCourses.length; i++) {
                const mergedCourse = mergedCourses[i];
                if (mergedCourse.locked) {
                    lockedCourses.push(mergedCourse);
                } else {
                    delete mergedCourse.locked;
                    unlockedCourses.push(mergedCourse);
                }
            }

            if (lockedCourses.length > 0) {
                delete baseCourse.merged
                course.merged = [baseCourse, ...lockedCourses];
                finalizedData.push(course, ...unlockedCourses);
            } else {
                const remainingCourses = mergedCourses.slice(1);
                const newCourse = {...baseCourse};
                delete newCourse.locked;
                remainingCourses.forEach(mergedCourse => delete mergedCourse.locked);
                finalizedData.push(newCourse, ...remainingCourses);
            }
        } else {
            delete course.merged
            finalizedData.push(course);
        }
    }


    // }
    //   if (item.merged?.length) {
    //     item.merged = item.merged.filter((mergedItem,index) => {
    //       if(index === 0) {
    //         delete mergedItem.accepted;
    //         mergedItem.rejectedId = mergedItem.rejectedId || [];
    //         mergedItem.rejectedId.push(item.id);
    //         item.rejectedId = item.rejectedId || [];
    //         item.rejectedId.push(mergedItem.id);
    //         finalizedData.push(mergedItem);
    //         return false;
    //       }
    //       if (mergedItem.accepted) {
    //         return true;
    //       } else {
    //         delete mergedItem.accepted;
    //         mergedItem.rejectedId = mergedItem.rejectedId || [];
    //         mergedItem.rejectedId.push(item.id);
    //         item.rejectedId = item.rejectedId || [];
    //         item.rejectedId.push(mergedItem.id);
    //         finalizedData.push(mergedItem);
    //         return false;
    //       }
    //     });
    //     if(!item.merged.length){
    //
    //     }else{
    //       finalizedData.push(item);
    //     }
    //   }else{
    //
    //     finalizedData.push(item);
    //   }
    // }

    fs.writeFileSync(filePath, JSON.stringify(finalizedData, null, 2), "utf-8");

    broadcastFetchStatus(wss, `merged-${suffix}`, false);
    broadcastFetchStatus(wss, filePath, false);
    ws.send(
        JSON.stringify({
            action: "newFile",
            name: `${suffix}-finalized-merge${fileConfig.extension}`,
        }),
    );
    broadcastNewFile(wss, `merged-${suffix}${fileConfig.extension}`);
};

const fetchAndSaveMrozonRatingData = async ({
                                                suffix,
                                                ws,
                                                wss,
                                            }: FetchParams) => {
    const baseUrl = "https://mcmikecreations.github.io/tum_info/api/courses.json";
    const fileConfig = serverFilesystemConfigFilesMap["mrozon-rating-data"];
    const filePath = path.join(
        serverFilesystemConfig.DIRECTORY,
        `${fileConfig.id}-${suffix}${fileConfig.extension}`,
    );
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, true);
    const response = await axios.get(baseUrl);
    const data = response.data;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, false);
    ws.send(
        JSON.stringify({
            action: "newFile",
            name: `${fileConfig.id}-${suffix}${fileConfig.extension}`,
        }),
    );
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
};

const fetchAndSaveProductionCourses = async ({
                                                 suffix,
                                                 ws,
                                                 wss,
                                             }: FetchParams) => {
    const fileConfig = serverFilesystemConfigFilesMap["courses-production"];
    const filePath = path.join(
        serverFilesystemConfig.DIRECTORY,
        `${fileConfig.id}-${suffix}${fileConfig.extension}`,
    );
    const allCourses = [];
    let pageNumber = 1;
    const pageSize = 500;

    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, true);
    while (pageNumber) {
        const response = await axios.get(
            PRODUCTION_API_COURSES_URL +
            `?page-number=${pageNumber}&page-size=${pageSize}`,
        );
        const data = response.data;
        allCourses.push(...data.results);
        pageNumber = data.nextPageNumber;
    }
    fs.writeFileSync(filePath, JSON.stringify(allCourses, null, 2), "utf-8");
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, false);
    ws.send(
        JSON.stringify({
            action: "newFile",
            name: `${fileConfig.id}-${suffix}${fileConfig.extension}`,
        }),
    );
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
};

const fetchAndSaveTUMSemesters = async ({suffix, ws, wss}: FetchParams) => {
    const fileConfig = serverFilesystemConfigFilesMap["tum-semesters"];
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, true);
    const filePath = path.join(
        serverFilesystemConfig.DIRECTORY,
        `${fileConfig.id}-${suffix}${fileConfig.extension}`,
    );

    const url = `${TUM_ONLINE_SEMESTERS_URL}`;
    const response = await axios.get(url);
    const semesters = response.data.semesters;
    const semesterMap = semesters.reduce(
        (
            acc: Record<string, string>,
            semester: {
                id: string;
                shortName: { value: string };
            },
        ) => {
            const id = semester.id;
            acc[id] = semester.shortName.value;
            return acc;
        },
        {},
    );

    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, false);
    fs.writeFileSync(filePath, JSON.stringify(semesterMap, null, 2), "utf-8");
    ws.send(
        JSON.stringify({
            action: "newFile",
            name: `${fileConfig.id}-${suffix}${fileConfig.extension}`,
        }),
    );
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
};

const fetchAndSaveTUMCourses = async ({
                                          suffix,
                                          semesters = [],
                                          ws,
                                          wss,
                                      }: FetchParams) => {
    const fileConfig = serverFilesystemConfigFilesMap["courses-tum-campus"];
    const filePath = path.join(
        serverFilesystemConfig.DIRECTORY,
        `${fileConfig.id}-${suffix}${fileConfig.extension}`,
    );
    const allCourses = [];

    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, true);
    for (const termId of semesters) {
        const options = {pageSize: 100, termId};
        const courses = await fetchAllPages(options);
        allCourses.push(...courses);
    }

    const summarizedData = await summarizeFetchedData(allCourses);

    fs.writeFileSync(filePath, JSON.stringify(summarizedData, null, 2), "utf-8");
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, false);
    ws.send(
        JSON.stringify({
            action: "newFile",
            name: `${fileConfig.id}-${suffix}${fileConfig.extension}`,
        }),
    );
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
};

const checkCorrectnessBatchedCoursesByNamesWithAi = async (
    coursesSets: string[][],
    fileName: string,
    wss: WebSocketServer,
    ws: WebSocket,
) => {
    const MAX_COURSES_PER_BATCH = 10; // Maximum courses per batch

    // Filter out empty sets while keeping track of original indices

    const coursesSetWithoutEmptyIdx: number[] = [];
    const coursesSetWithoutEmpty = coursesSets.reduce((acc, set, index) => {
        if (set.length) {
            coursesSetWithoutEmptyIdx.push(index);
            acc.push(set);
        }
        return acc;
    }, [] as string[][]);

    if (coursesSetWithoutEmpty.length === 0) {
        Logger.info("No non-empty course sets to process");
        ws.send(
            JSON.stringify({action: "success", message: "No courses to merge"}),
        );
        return;
    }

    // Create batches based on course count
    const batches: string[][][] = [];
    let currentBatch: string[][] = [];
    let currentBatchSize = 0;

    for (const courseSet of coursesSetWithoutEmpty) {
        // If adding this course set would exceed the limit, start a new batch
        if (currentBatchSize + courseSet.length > MAX_COURSES_PER_BATCH && currentBatchSize > 0) {
            batches.push(currentBatch);
            currentBatch = [];
            currentBatchSize = 0;
        }

        currentBatch.push(courseSet);
        currentBatchSize += courseSet.length;
    }

    // Add the last batch if not empty
    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }

    const totalBatches = batches.length;
    Logger.info(`Created ${totalBatches} batches based on course count`);

    // Process each batch
    const allMergedData: AiResponse[] = [];
    let processedCount = 0;
    let processedSets = 0;

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        Logger.info(`Processing batch ${i + 1} of ${totalBatches} with ${batch.reduce((sum, set) => sum + set.length, 0)} courses`);

        try {
            const batchResults = await checkCorrectnessOfMergedCourses(batch, wss, fileName);
            allMergedData.push(...(batchResults as AiResponse[]));

            // Update processed count and send progress
            processedSets += batch.length;
            processedCount += batch.reduce((sum, set) => sum + set.length, 0);
            aiWorkers[fileName].progress = (processedSets / coursesSetWithoutEmpty.length) * 100;
            broadcastAiWorkers(wss);
        } catch (error) {
            Logger.error(`Error processing batch: ${error instanceof Error ? error.message : String(error)}`);
            aiWorkers[fileName].status = "error";
            broadcastAiWorkers(wss);
            ws.send(
                JSON.stringify({
                    action: "error",
                    message: "An error occurred while merging courses",
                }),
            );
            return;
        }
    }

    aiWorkers[fileName].status = "completed";
    broadcastAiWorkers(wss);
    ws.send(
        JSON.stringify({
            action: "success",
            message: "Courses merged successfully",
        }),
    );

    if (allMergedData.length === 0) {
        Logger.warn("No results returned from AI service");
        ws.send(
            JSON.stringify({
                action: "error",
                message: "No results returned from AI service",
            }),
        );
        return;
    }

    const filePath = path.join(serverFilesystemConfig.DIRECTORY, fileName);
    if (!fs.existsSync(filePath)) {
        Logger.warn(`File not found: ${filePath}`);
        ws.send(JSON.stringify({action: "error", message: "File not found"}));
        return;
    }
    const fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(allMergedData)

    console.log(allMergedData)
    for (let i = 0; i < allMergedData.length; i++) {
        const data = allMergedData[i];
        const originalIndex = coursesSetWithoutEmptyIdx[i];

        if (data.badMerge) {
            const item = fileContent[originalIndex];
            if (item) {
                item["badMerge"] = true;

                // let acceptedCount = 0;
                // let rejectedCount = 0;
                //
                for (let i = 0; i < item.merged.length; i++) {
                    const el = item.merged[i];
                    if(i === 0){

                    }else{
                        el.locked = false
                    }
                }
                //
                // item.name = data.name;
                // item.acceptedCount = acceptedCount;
                // item.rejectedCount = rejectedCount;
                // item.notResolvedCount = 0;
                //
                const diffs = compare(fileContent[originalIndex], item);
                fileContent[originalIndex] = applyPatch(
                    fileContent[originalIndex],
                    diffs,
                ).newDocument;
            }
        } else {
            // const item = fileContent[originalIndex];
            // if (item) {
            //     let acceptedCount = 0;
            //     let rejectedCount = item.merged.filter(x => !x.locked).length;
            //     for (let el of item.merged) {
            //         if (!el.locked) {
            //             el.accepted = false;
            //         }
            //     }
            //     item.acceptedCount = acceptedCount;
            //     item.rejectedCount = rejectedCount;
            //     item.notResolvedCount = 0;
            //     fileContent[originalIndex] = item;
            }
        }

    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), "utf-8");

    ws.send(
        JSON.stringify({
            action: "success",
            message: "Courses merged successfully",
        }),
    );

    const message = JSON.stringify({
        action: "fileUpdated",
        fileName,
        updatedItems: fileContent,
    });

    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });


}





const batchMergeCoursesByNamesWithAi = async (
    coursesSets: string[][],
    fileName: string,
    wss: WebSocketServer,
    ws: WebSocket,
) => {
    const MAX_COURSES_PER_BATCH = 17; // Maximum courses per batch

    // Filter out empty sets while keeping track of original indices
    const coursesSetWithoutEmptyIdx: number[] = [];
    const coursesSetWithoutEmpty = coursesSets.reduce((acc, set, index) => {
        if (set.length) {
            coursesSetWithoutEmptyIdx.push(index);
            acc.push(set);
        }
        return acc;
    }, [] as string[][]);

    if (coursesSetWithoutEmpty.length === 0) {
        Logger.info("No non-empty course sets to process");
        ws.send(
            JSON.stringify({action: "success", message: "No courses to merge"}),
        );
        return;
    }

    // Create batches based on course count
    const batches: string[][][] = [];
    let currentBatch: string[][] = [];
    let currentBatchSize = 0;

    for (const courseSet of coursesSetWithoutEmpty) {
        // If adding this course set would exceed the limit, start a new batch
        if (currentBatchSize + courseSet.length > MAX_COURSES_PER_BATCH && currentBatchSize > 0) {
            batches.push(currentBatch);
            currentBatch = [];
            currentBatchSize = 0;
        }

        currentBatch.push(courseSet);
        currentBatchSize += courseSet.length;
    }

    // Add the last batch if not empty
    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }

    const totalBatches = batches.length;
    Logger.info(`Created ${totalBatches} batches based on course count`);

    // Process each batch
    const allMergedData: AiResponse[] = [];
    let processedCount = 0;
    let processedSets = 0;

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        Logger.info(`Processing batch ${i + 1} of ${totalBatches} with ${batch.reduce((sum, set) => sum + set.length, 0)} courses`);

        try {
            const batchResults = await mergeCoursesByNamesWithAi(batch, wss, fileName);
            allMergedData.push(...(batchResults as AiResponse[]));

            // Update processed count and send progress
            processedSets += batch.length;
            processedCount += batch.reduce((sum, set) => sum + set.length, 0);
            aiWorkers[fileName].progress = (processedSets / coursesSetWithoutEmpty.length) * 100;
            broadcastAiWorkers(wss);
        } catch (error) {
            Logger.error(`Error processing batch: ${error instanceof Error ? error.message : String(error)}`);
            aiWorkers[fileName].status = "error";
            broadcastAiWorkers(wss);
            ws.send(
                JSON.stringify({
                    action: "error",
                    message: "An error occurred while merging courses",
                }),
            );
            return;
        }
    }

    aiWorkers[fileName].status = "completed";
    broadcastAiWorkers(wss);
    ws.send(
        JSON.stringify({
            action: "success",
            message: "Courses merged successfully",
        }),
    );

    if (allMergedData.length === 0) {
        Logger.warn("No results returned from AI service");
        ws.send(
            JSON.stringify({
                action: "error",
                message: "No results returned from AI service",
            }),
        );
        return;
    }

    const filePath = path.join(serverFilesystemConfig.DIRECTORY, fileName);
    if (!fs.existsSync(filePath)) {
        Logger.warn(`File not found: ${filePath}`);
        ws.send(JSON.stringify({action: "error", message: "File not found"}));
        return;
    }
    const fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    fileContent.forEach((item: any) => {
        if(item.merged){
            item.merged.forEach((mergedItem: any) => {
                delete mergedItem.accepted;
                delete mergedItem.locked;
            });
        }
    });

    for (let i = 0; i < allMergedData.length; i++) {
        const data = allMergedData[i];
        const originalIndex = coursesSetWithoutEmptyIdx[i];

        if (data.match) {
            const item = fileContent[originalIndex];
            if (item) {
                let acceptedCount = 0;
                let rejectedCount = 0;

                for (let el of item.merged) {
                    if (el.locked) continue;
                    if (data.merged.includes(el.name)) {
                        el.accepted = true;
                        acceptedCount++;
                    } else {
                        el.accepted = false;
                        rejectedCount++;
                    }
                }

                item.name = data.name;
                item.acceptedCount = acceptedCount;
                item.rejectedCount = rejectedCount;
                item.notResolvedCount = 0;

                const diffs = compare(fileContent[originalIndex], item);
                fileContent[originalIndex] = applyPatch(
                    fileContent[originalIndex],
                    diffs,
                ).newDocument;
            }
        } else {
            const item = fileContent[originalIndex];
            if (item) {
                let acceptedCount = 0;
                let rejectedCount = item.merged.filter(x => !x.locked).length;
                for (let el of item.merged) {
                    if (!el.locked) {
                        el.accepted = false;
                    }
                }
                item.acceptedCount = acceptedCount;
                item.rejectedCount = rejectedCount;
                item.notResolvedCount = 0;
                fileContent[originalIndex] = item;
            }
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), "utf-8");

    ws.send(
        JSON.stringify({
            action: "success",
            message: "Courses merged successfully",
        }),
    );

    const message = JSON.stringify({
        action: "fileUpdated",
        fileName,
        updatedItems: fileContent,
    });

    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};
export {
    fetchAndSaveProductionCourses,
    fetchAndSaveTUMSemesters,
    fetchAndSaveTUMCourses,
    fetchAndSaveMrozonRatingData,
    keySimilarityMerging,
    finishKeySimilarityMerging,
    batchMergeCoursesByNamesWithAi,
    checkCorrectnessBatchedCoursesByNamesWithAi
};
