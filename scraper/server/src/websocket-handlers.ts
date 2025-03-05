import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import Logger from "./server-logger";
import { validateConnection } from "./websocket-utils";
import {
  batchMergeCoursesByNamesWithAi,
  fetchAndSaveMrozonRatingData,
  fetchAndSaveProductionCourses,
  fetchAndSaveTUMCourses,
  fetchAndSaveTUMSemesters,
  finishKeySimilarityMerging,
  keySimilarityMerging,
} from "./server-actions";
import fs from "fs";
import path from "path";
import { serverFilesystemConfig } from "./server-filesystem-config";
import { applyPatch, compare } from "fast-json-patch";
import mergeCoursesByNamesWithAi from "./merge-courses-by-names-with-ai";

interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  nickname?: string;
  avatar?: string;
  selectedFile?: string | null;
  selectedCourse?: string | null;
}

interface UserPublicData {
  id: string;
  nickname: string;
  avatar: string;
  selectedFile: string | null;
  selectedCourse: string | null;
}

const clients = new Map<string, ExtendedWebSocket>();
export const aiWorkers: Record<
  string,
  {
    userId: string;
    progress: number;
    startTime: string;
    status: string;
    logs: any[];
  }
> = {};

let isUpdating = false;
export const broadcastAiWorkers = (wss: WebSocketServer) => {
  const message = JSON.stringify({
    action: "updateAiWorkers",
    data: aiWorkers,
  });
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
const broadcastUsers = (wss: WebSocketServer) => {
  // If already updating, skip this update

  if (isUpdating) {
    return;
  }

  try {
    isUpdating = true;

    // Map users to only the data we need to send
    const userList = Array.from(clients.entries()).map(([id, ws]) => ({
      id,
      nickname: ws.nickname || "",
      avatar: ws.avatar || "",
      selectedFile: ws.selectedFile || null,
      selectedCourse: ws.selectedCourse || null,
    }));

    // Send update to all clients
    const message = JSON.stringify({ action: "updateUsers", data: userList });
    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  } finally {
    isUpdating = false;
  }
};

export const handleConnection = (
  ws: ExtendedWebSocket,
  req: http.IncomingMessage,
  wss: WebSocketServer,
) => {
  const userId = String(+new Date());
  ws.userId = userId;

  if (!validateConnection(req)) {
    ws.close(1008, "Invalid connection");
    return;
  }

  clients.set(userId, ws);
  Logger.info(`Client connected: ${userId}`);

  ws.send(
    JSON.stringify({
      action: "updateAiWorkers",
      data: aiWorkers,
    }),
  );

  ws.on("message", (message) => handleMessage(userId, message, wss, ws));
  ws.on("close", () => handleDisconnection(userId, wss));
  ws.on("error", (error) => handleError(userId, error));
};

const handleMessage = async (
  userId: string,
  message: WebSocket.Data,
  wss: WebSocketServer,
  ws: ExtendedWebSocket,
) => {
  try {
    const {
      action,
      name,
      content,
      nickname,
      avatar,
      suffix,
      courseId,
      fileName,
      diffs,
      index,
      updatedItem,
      semesters,
      filesToMerge,
      coursesSets,
      item,
    } = JSON.parse(message.toString());
    Logger.info(`Received action: ${action}`);
    switch (action) {
      case "updateAiWorkers":
        if (fileName && content) {
          if (aiWorkers[fileName]) {
            aiWorkers[fileName] = content;
            broadcastAiWorkers(wss);
            ws.send(
              JSON.stringify({
                action: "success",
                message: "AI worker updated successfully",
              }),
            );
          } else {
            ws.send(
              JSON.stringify({
                action: "error",
                message: "AI worker not found",
              }),
            );
          }
        }
        break;
      case "updateItem":
        if (fileName && updatedItem && typeof index === "number" && diffs) {
          const filePath = path.join(
            serverFilesystemConfig.DIRECTORY,
            fileName,
          );
          if (fs.existsSync(filePath)) {
            const fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            if (index >= 0 && index < fileContent.length) {
              fileContent[index] = applyPatch(
                fileContent[index],
                diffs,
              ).newDocument;
              fs.writeFileSync(
                filePath,
                JSON.stringify(fileContent, null, 2),
                "utf-8",
              );
              ws.send(
                JSON.stringify({
                  action: "success",
                  message: "Item updated successfully",
                }),
              );

              // Broadcast the updated item to all connected clients
              const message = JSON.stringify({
                action: "fileUpdated",
                fileName,
                updatedItem: {
                  index,
                  updatedItem,
                },
              });
              wss.clients.forEach((client: WebSocket) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(message);
                }
              });
            } else {
              ws.send(
                JSON.stringify({
                  action: "error",
                  message: "Invalid item index",
                }),
              );
            }
          } else {
            ws.send(
              JSON.stringify({ action: "error", message: "File not found" }),
            );
          }
        }
        break;
      case "setUserDetails":
        if (nickname && avatar) {
          const user = clients.get(userId);
          if (user) {
            user.nickname = nickname;
            user.avatar = avatar;
            broadcastUsers(wss);
          }
        }
        break;
      case "getFiles":
        broadcastFileList(wss, userId);
        break;
      case "selectFile":
        if (name) {
          const user = clients.get(userId);
          if (user) {
            user.selectedFile = name;
            broadcastUsers(wss);
            if (aiWorkers[name]) {
              ws.send(
                JSON.stringify({
                  action: "aiWorkerInfo",
                  data: aiWorkers[name],
                }),
              );
            }
          }
        }
        break;
      case "selectCourse":
        const user = clients.get(userId);
        if (!user) {
          return;
        } else {
          user.selectedCourse = courseId;
          broadcastUsers(wss);
        }
        break;
      case "saveFile":
        if (name && content) {
          const filePath = path.join(serverFilesystemConfig.DIRECTORY, name);
          fs.writeFileSync(filePath, content, "utf-8");
          ws.send(
            JSON.stringify({
              action: "success",
              message: "File saved successfully",
            }),
          );
        }
        break;
      case "deleteFile":
        if (name) {
          const filePath = path.join(serverFilesystemConfig.DIRECTORY, name);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            broadcastFileList(wss, userId);
          } else {
            ws.send(
              JSON.stringify({ action: "error", message: "File not found" }),
            );
          }
        }
        break;
      case "fetchProductionCourses":
        if (suffix) {
          await fetchAndSaveProductionCourses({ suffix, ws, wss });
        }
        break;
      case "fetchTUMSemesters":
        if (suffix) {
          await fetchAndSaveTUMSemesters({ suffix, ws, wss });
        }
        break;

      case "fetchTUMCourses":
        if (suffix) {
          await fetchAndSaveTUMCourses({ suffix, semesters, ws, wss });
        }
        break;
      case "fetchMrozonRatingData":
        if (suffix) {
          await fetchAndSaveMrozonRatingData({ suffix, ws, wss });
        }
        break;
      case "keySimilarityMerging":
        if (filesToMerge) {
          await keySimilarityMerging({ filesToMerge, ws, wss, suffix });
        }
        break;
      case "finishKeySimilarityMerging":
        if (filesToMerge) {
          await finishKeySimilarityMerging({ filesToMerge, ws, wss, suffix });
        }
        break;
      case "batchMergeCoursesByNamesWithAi":
        if (coursesSets && fileName) {
          const startTime = new Date().toISOString();
          aiWorkers[fileName] = {
            userId,
            progress: 0,
            startTime,
            status: "in-progress",
            logs: [],
          };
          broadcastAiWorkers(wss);
          await batchMergeCoursesByNamesWithAi(coursesSets, fileName, wss, ws);
          aiWorkers[fileName].status = "completed";
          broadcastAiWorkers(wss);
        }
        break;
      case "coursesNamesMergingAi":
        if (content) {
          try {
            const mergedData = await mergeCoursesByNamesWithAi(content, wss);
            const filePath = path.join(
              serverFilesystemConfig.DIRECTORY,
              fileName,
            );
            if (fs.existsSync(filePath)) {
              if (mergedData?.match) {
                const fileContent = JSON.parse(
                  fs.readFileSync(filePath, "utf-8"),
                );

                let acceptedCount = 0;
                let rejectedCount = 0;
                for (let el of item.merged || []) {
                  if (mergedData.merged.includes(el.name)) {
                    el.accepted = true;
                    acceptedCount++;
                  } else {
                    el.accepted = false;
                    rejectedCount++;
                  }
                }
                item.name = mergedData.name;
                item.acceptedCount = acceptedCount;
                item.rejectedCount = rejectedCount;
                item.notResolvedCount = 0;

                const diffs = compare(fileContent[index], item);
                fileContent[index] = applyPatch(
                  fileContent[index],
                  diffs,
                ).newDocument;

                fs.writeFileSync(
                  filePath,
                  JSON.stringify(fileContent, null, 2),
                  "utf-8",
                );

                ws.send(
                  JSON.stringify({
                    action: "success",
                    message: "Courses merged successfully",
                  }),
                );
                const message = JSON.stringify({
                  action: "fileUpdated",
                  fileName,
                  updatedItem: {
                    index,
                    updatedItem: item,
                  },
                });
                wss.clients.forEach((client: WebSocket) => {
                  if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                    broadcastAiWorkers(wss);
                  }
                });
              } else {
                Logger.warn("No match found in mergedData");
              }
            } else {
              Logger.warn(`File not found: ${filePath}`);
            }
          } catch (error) {
            Logger.error(`Error in coursesNamesMergingAi: ${error.message}`);
            ws.send(
              JSON.stringify({
                action: "error",
                message: "An error occurred while merging courses",
              }),
            );
          }
        } else {
          Logger.warn("Content is missing in coursesNamesMergingAi action");
        }
        break;
      case "updateFile":
        if (fileName && diffs) {
          const filePath = path.join(
            serverFilesystemConfig.DIRECTORY,
            fileName,
          );
          if (fs.existsSync(filePath)) {
            const fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            const updatedContent = applyPatch(fileContent, diffs).newDocument;
            fs.writeFileSync(
              filePath,
              JSON.stringify(updatedContent, null, 2),
              "utf-8",
            );
            ws.send(
              JSON.stringify({
                action: "success",
                message: "File updated successfully",
              }),
            );

            // Broadcast the diffs to all connected clients
            const message = JSON.stringify({
              action: "updateFile",
              fileName,
              diffs,
            });
            wss.clients.forEach((client: WebSocket) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(message);
              }
            });
          } else {
            ws.send(
              JSON.stringify({ action: "error", message: "File not found" }),
            );
          }
        }
        break;
      default:
        ws.send(JSON.stringify({ action: "error", message: "Unknown action" }));
    }
  } catch (error) {
    Logger.error(`Error handling message: ${error}`);
    ws.send(
      JSON.stringify({ action: "error", message: "Invalid request format" }),
    );
  }
};

const handleDisconnection = (userId: string, wss: WebSocketServer) => {
  clients.delete(userId);
  Logger.info(`Client disconnected: ${userId}`);
  broadcastUsers(wss);
};

const handleError = (userId: string, error: Error) => {
  Logger.error(`Error from client ${userId}: ${error.message}`);
};

const broadcastFileList = (wss: WebSocketServer, userId: string) => {
  const files = fs
    .readdirSync(serverFilesystemConfig.DIRECTORY)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const stats = fs.statSync(
        path.join(serverFilesystemConfig.DIRECTORY, file),
      );
      return {
        name: file,
        size: stats.size,
        lastModified: stats.mtime,
      };
    });

  wss.clients.forEach((client: ExtendedWebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      const user = clients.get(userId);
      const selectedFileExists = user?.selectedFile
        ? files.some((file) => file.name === user.selectedFile)
        : false;
      client.send(
        JSON.stringify({
          action: "fileList",
          data: files,
          userSelectedFile: user?.selectedFile,
          selectedFileExists,
        }),
      );
    }
  });
};
