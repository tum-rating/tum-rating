import WebSocket, { WebSocketServer } from 'ws';
import axios from 'axios';
import mergeCoursesByNamesWithAi from "./merge-courses-by-names-with-ai";
import Logger from "./server-logger";
import { PRODUCTION_API_COURSES_URL, TUM_ONLINE_SEMESTERS_URL } from './server-actions-config';
import { serverFilesystemConfig, serverFilesystemConfigFilesMap } from './server-filesystem-config';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { fetchAllPages, keySimilarityCore, summarizeFetchedData } from './server-actions-utils';

interface FetchParams {
    suffix: string;
    semesters?: string[];
    filesToMerge?: any[];
    ws: WebSocket;
    wss: WebSocketServer;
    content?: any;
}

const broadcastFetchStatus = (wss: WebSocketServer, type: string, status: boolean) => {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ action: 'fetchStatus', fetchStatus: status, type }));
        }
    });
};

const broadcastNewFile = (wss: WebSocketServer, fileName: string) => {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ action: 'newFile', name: fileName }));
        }
    });
};

const keySimilarityMerging = async ({ filesToMerge = [], ws, wss, suffix }: FetchParams) => {
    if (!suffix) {
        suffix = "merged" + new Date().getTime();
    }
    const fileConfig = serverFilesystemConfigFilesMap['mrozon-rating-data'];
    const filePath = path.join(serverFilesystemConfig.DIRECTORY, `${suffix}-merged${fileConfig.extension}`);

    broadcastFetchStatus(wss, `merged-${suffix}`, true);

    let allCourses = [];
    console.log(filesToMerge)
    for (const file of filesToMerge) {
        let filePath = path.join(serverFilesystemConfig.DIRECTORY, `${file}`);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        allCourses.push(...data);
    }
    const summarizedData = keySimilarityCore(allCourses, "name", "courseId");

    for (let i = 0; i < summarizedData.length; i++) {
        summarizedData[i].id = uuidv4();
    }

    console.log(filePath)
    fs.writeFileSync(filePath, JSON.stringify(summarizedData, null, 2), 'utf-8');

    console.log(2)
    broadcastFetchStatus(wss, `merged-${suffix}`, false);
    ws.send(JSON.stringify({ action: 'newFile', name: `${suffix}-merged${fileConfig.extension}` }));
    broadcastNewFile(wss, `merged-${suffix}${fileConfig.extension}`);
}

const finishKeySimilarityMerging = async ({ filesToMerge = [], ws, wss, suffix }: FetchParams) => {
    const keysToRemove = ["acceptedCount", "rejectedCount", "notResolvedCount"];
    if (!suffix) {
        suffix = "merged" + new Date().getTime();
    }
    const fileConfig = serverFilesystemConfigFilesMap['mrozon-rating-data'];
    const filePath = path.join(serverFilesystemConfig.DIRECTORY, `${suffix}-finalized-merge${fileConfig.extension}`);
    broadcastFetchStatus(wss, `merged-${suffix}`, true);
    broadcastFetchStatus(wss, filePath, true);
    let allCourses = [];
    console.log(filesToMerge)
    for (const file of filesToMerge) {
        let filePath = path.join(serverFilesystemConfig.DIRECTORY, `${file}`);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        allCourses.push(...data);
    }
    const finalizedData = []
    for (let i = 0; i < allCourses.length; i++) {
        let item = allCourses[i];
        for (let key of keysToRemove) {
            delete item[key];
        }
        if (item.merged.length) {
            const mergedItems = []
            for (let j = 0; j < item.merged.length; j++) {
                let mergedItem = item.merged[j];
                if (mergedItem.accepted) {
                    mergedItems.push(mergedItem);
                } else {
                    delete mergedItem.accepted;
                    if (mergedItem.rejectedId) {
                        mergedItem.rejectedId.push(item.id)
                    } else {
                        mergedItem.rejectedId = [item.id]
                    }
                    finalizedData.push(mergedItem);
                }
            }
            item.merged = mergedItems
        }
        finalizedData.push(item);
    }
    console.log(filePath)
    fs.writeFileSync(filePath, JSON.stringify(finalizedData, null, 2), 'utf-8');
    broadcastFetchStatus(wss, `merged-${suffix}`, false);
    broadcastFetchStatus(wss, filePath, false);
    ws.send(JSON.stringify({ action: 'newFile', name: `${suffix}-finalized-merge${fileConfig.extension}` }));
    broadcastNewFile(wss, `merged-${suffix}${fileConfig.extension}`);
}

const fetchAndSaveMrozonRatingData = async ({ suffix, ws, wss }: FetchParams) => {
    const baseUrl = "https://mcmikecreations.github.io/tum_info/api/courses.json"
    const fileConfig = serverFilesystemConfigFilesMap['mrozon-rating-data'];
    const filePath = path.join(serverFilesystemConfig.DIRECTORY, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, true);
    const response = await axios.get(baseUrl);
    const data = response.data;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, false);
    ws.send(JSON.stringify({ action: 'newFile', name: `${fileConfig.id}-${suffix}${fileConfig.extension}` }));
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
}

const fetchAndSaveProductionCourses = async ({ suffix, ws, wss }: FetchParams) => {
    const fileConfig = serverFilesystemConfigFilesMap['courses-production'];
    const filePath = path.join(serverFilesystemConfig.DIRECTORY, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
    const allCourses = [];
    let pageNumber = 1;
    const pageSize = 500;

    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, true);
    while (pageNumber) {
        const response = await axios.get(PRODUCTION_API_COURSES_URL + `?page-number=${pageNumber}&page-size=${pageSize}`);
        const data = response.data;
        allCourses.push(...data.results);
        pageNumber = data.nextPageNumber;
    }
    fs.writeFileSync(filePath, JSON.stringify(allCourses, null, 2), 'utf-8');
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, false);
    ws.send(JSON.stringify({ action: 'newFile', name: `${fileConfig.id}-${suffix}${fileConfig.extension}` }));
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
};

const fetchAndSaveTUMSemesters = async ({ suffix, ws, wss }: FetchParams) => {
    const fileConfig = serverFilesystemConfigFilesMap['tum-semesters'];
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, true);
    const filePath = path.join(serverFilesystemConfig.DIRECTORY, `${fileConfig.id}-${suffix}${fileConfig.extension}`);

    const url = `${TUM_ONLINE_SEMESTERS_URL}`;
    const response = await axios.get(url);
    const semesters = response.data.semesters;
    const semesterMap = semesters.reduce((acc: Record<string, string>, semester: {
        id: string;
        shortName: { value: string }
    }) => {
        const id = semester.id;
        acc[id] = semester.shortName.value;
        return acc;
    }, {});

    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, false);
    fs.writeFileSync(filePath, JSON.stringify(semesterMap, null, 2), 'utf-8');
    ws.send(JSON.stringify({ action: 'newFile', name: `${fileConfig.id}-${suffix}${fileConfig.extension}` }));
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
};

const fetchAndSaveTUMCourses = async ({ suffix, semesters = [], ws, wss }: FetchParams) => {
    const fileConfig = serverFilesystemConfigFilesMap['courses-tum-campus'];
    const filePath = path.join(serverFilesystemConfig.DIRECTORY, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
    const allCourses = [];

    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, true);
    for (const termId of semesters) {
        const options = { pageSize: 100, termId };
        const courses = await fetchAllPages(options);
        allCourses.push(...courses);
    }

    const summarizedData = await summarizeFetchedData(allCourses);

    fs.writeFileSync(filePath, JSON.stringify(summarizedData, null, 2), 'utf-8');
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, false);
    ws.send(JSON.stringify({ action: 'newFile', name: `${fileConfig.id}-${suffix}${fileConfig.extension}` }));
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
};
const batchMergeCoursesByNamesWithAi = async (coursesSets: string[][], fileName: string, wss: WebSocketServer, ws: ExtendedWebSocket) => {
    const batchSize = 10; // Adjust the batch size as needed
    for (let i = 0; i < coursesSets.length; i += batchSize) {
        const batch = coursesSets.slice(i, i + batchSize);
        try {
            const mergedData = await mergeCoursesByNamesWithAi(batch);
            const filePath = path.join(serverFilesystemConfig.DIRECTORY, fileName);
            if (fs.existsSync(filePath)) {
                const fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                mergedData.forEach((data, index) => {
                    if (data.match) {
                        const itemIndex = i + index;
                        const item = fileContent[itemIndex];
                        let acceptedCount = 0;
                        let rejectedCount = 0;
                        for (let el of item.merged) {
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
                        const diffs = compare(fileContent[itemIndex], item);
                        fileContent[itemIndex] = applyPatch(fileContent[itemIndex], diffs).newDocument;
                    }
                });
                fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), "utf-8");
                ws.send(JSON.stringify({ action: "success", message: "Courses merged successfully" }));
                const message = JSON.stringify({ action: "fileUpdated", fileName, updatedItems: mergedData });
                wss.clients.forEach((client: WebSocket) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });
            } else {
                Logger.warn(`File not found: ${filePath}`);
            }
        } catch (error) {
            Logger.error(`Error in batchMergeCoursesByNamesWithAi: ${error.message}`);
            ws.send(JSON.stringify({ action: "error", message: "An error occurred while merging courses" }));
        }
    }
};

export {
    fetchAndSaveProductionCourses,
    fetchAndSaveTUMSemesters,
    fetchAndSaveTUMCourses,
    fetchAndSaveMrozonRatingData,
    keySimilarityMerging,
    finishKeySimilarityMerging
};