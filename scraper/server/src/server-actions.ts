import WebSocket, { WebSocketServer } from "ws";
import axios from "axios";
import mergeCoursesByNamesWithAi, {
  AiResponse,
} from "./merge-courses-by-names-with-ai";
import Logger from "./server-logger";
import {
  PRODUCTION_API_COURSES_URL,
  TUM_ONLINE_SEMESTERS_URL,
} from "./server-actions-config";
import {
  serverFilesystemConfig,
  serverFilesystemConfigFilesMap,
} from "./server-filesystem-config";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import {
  fetchAllPages,
  keySimilarityCore,
  summarizeFetchedData,
} from "./server-actions-utils";
import { applyPatch, compare } from "fast-json-patch";
import { aiWorkers, broadcastAiWorkers } from "./websocket-handlers";
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
        JSON.stringify({ action: "fetchStatus", fetchStatus: status, type }),
      );
    }
  });
};

const broadcastNewFile = (wss: WebSocketServer, fileName: string) => {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ action: "newFile", name: fileName }));
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
    summarizedData[i].id = uuidv4();
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

  for (const item of allCourses) {
    for (const key of keysToRemove) {
      delete item[key];
    }
    if (item.merged?.length) {
      item.merged = item.merged.filter((mergedItem,index) => {
        if(index === 0) {
          delete mergedItem.accepted;
          mergedItem.rejectedId = mergedItem.rejectedId || [];
          mergedItem.rejectedId.push(item.id);
          item.rejectedId = item.rejectedId || [];
          item.rejectedId.push(mergedItem.id);
          finalizedData.push(mergedItem);
          return false;
        }
        if (mergedItem.accepted) {
          return true;
        } else {
          delete mergedItem.accepted;
          mergedItem.rejectedId = mergedItem.rejectedId || [];
          mergedItem.rejectedId.push(item.id);
          item.rejectedId = item.rejectedId || [];
          item.rejectedId.push(mergedItem.id);
          finalizedData.push(mergedItem);
          return false;
        }
      });
      if(!item.merged.length){

      }else{
        finalizedData.push(item);
      }
    }else{

      finalizedData.push(item);
    }
  }

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

const fetchAndSaveTUMSemesters = async ({ suffix, ws, wss }: FetchParams) => {
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
    const options = { pageSize: 100, termId };
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
// In `server-actions.ts`
const batchMergeCoursesByNamesWithAi = async (
  coursesSets: string[][],
  fileName: string,
  wss: WebSocketServer,
  ws: WebSocket,
) => {
  const batchSize = 10; // Adjust batch size as needed

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
      JSON.stringify({ action: "success", message: "No courses to merge" }),
    );
    return;
  }

  const totalBatches = Math.ceil(coursesSetWithoutEmpty.length / batchSize);
  // Send total items to process
  // Initialize aiWorker with logs

  // Process in batches
  const allMergedData: AiResponse[] = [];
  let processedCount = 0;

  for (let i = 0; i < coursesSetWithoutEmpty.length; i += batchSize) {
    const batch = coursesSetWithoutEmpty.slice(i, i + batchSize);
    Logger.info(`Processing batch ${i / batchSize + 1} of ${totalBatches}`);


    try {
      const batchResults = await mergeCoursesByNamesWithAi(batch, wss, fileName);
      allMergedData.push(...(batchResults as AiResponse[]));

      // Update processed count and send progress
      processedCount += batch.length;
      aiWorkers[fileName].progress =
        (processedCount / coursesSetWithoutEmpty.length) * 100;
      broadcastAiWorkers(wss);
    } catch (error) {
      Logger.error(`Error processing batch: ${error.message}`);
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
    ws.send(JSON.stringify({ action: "error", message: "File not found" }));
    return;
  }

  const fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // Apply all merged data results
  for (let i = 0; i < allMergedData.length; i++) {
    const data = allMergedData[i];
    const originalIndex = coursesSetWithoutEmptyIdx[i];

    if (data.match) {
      const item = fileContent[originalIndex];
      if (item) {
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
        let rejectedCount = item.merged.length;
        for (let el of item.merged) {
          el.accepted = false;
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
};
