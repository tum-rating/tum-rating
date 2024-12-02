import fs from "fs";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import {serverFilesystemConfig} from "./server-filesystem-config.js";
import {fetchAndSaveProductionCourses, fetchAndSaveTUMSemesters} from "./server-actions.ts";
import Logger from './server-logger.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = parseInt(serverFilesystemConfig.PORT, 10);
const DIRECTORY = path.join(__dirname, serverFilesystemConfig.DIRECTORY);

if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

(async () => {
    const {WebSocketServer} = await import("ws");
    const wss = new WebSocketServer({port: PORT});
    const users = new Map();

    Logger.info(`WebSocket server is running on ${PORT}`);

    const broadcastUsers = () => {
        const userList = Array.from(users.values());
        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify({action: "updateUsers", data: userList}));
            }
        });
    };

    const broadcastFileDeletion = (fileName) => {
        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify({action: "deleteFile", name: fileName}));
            }
        });
    };

    const broadcastFileSave = (fileName) => {
        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify({action: "fileList", name: fileName}));
            }
        });
    };

    // scraper/app/server.ts
    wss.on("connection", (ws) => {
        const userId = Date.now().toString();
        users.set(userId, {
            id: userId,
            avatar: `https://i.ibb.co/3m2w75y/smile-KDc-W-1.jpg`,
            selectedFile: null,
            nickname: 'Anonymous',
            selectedCourse: null // Add selectedCourse property
        });

        Logger.info(`Client connected: ${userId}`);
        ws.send(JSON.stringify({action: "setUserId", userId})); // Send userId to client
        broadcastUsers();

        const handleMessage = async (message) => {
            try {
                const {action, name, content, nickname, avatar, suffix, courseId} = JSON.parse(message.toString());
                Logger.info(`Received action: ${action}`);
                switch (action) {
                    case "setUserDetails":
                        if (nickname && avatar) {
                            const user = users.get(userId);
                            if (user) {
                                user.nickname = nickname;
                                user.avatar = avatar;
                                broadcastUsers();
                            }
                        }
                        break;
                    case "fetchProductionCourses":
                        if (suffix) {
                            await fetchAndSaveProductionCourses({suffix, ws});
                        }
                        break;
                    case "fetchTUMSemesters":
                        Logger.info(suffix);
                        if (suffix) {
                            await fetchAndSaveTUMSemesters({suffix, ws});
                        }
                        break;
                    case "getFiles": {
                        Logger.info("Fetching file list...");
                        const files = fs.readdirSync(DIRECTORY)
                            .filter(file => file.endsWith(".json"))
                            .map(file => {
                                const stats = fs.statSync(path.join(DIRECTORY, file));
                                return {
                                    name: file,
                                    size: stats.size,
                                    lastModified: stats.mtime
                                };
                            });
                        Logger.info("Files fetched");
                        ws.send(JSON.stringify({action: "fileList", data: files}));
                        break;
                    }
                    case "getFile":
                        if (name) {
                            Logger.info(`Fetching content for file: ${name}`);
                            const filePath = path.join(DIRECTORY, name);
                            if (fs.existsSync(filePath)) {
                                const stats = fs.statSync(path.join(DIRECTORY, name));
                                ws.send(JSON.stringify({
                                    action: "fileContent", data: {
                                        name: name,
                                        size: stats.size,
                                        lastModified: stats.mtime,
                                        avatar: users.get(userId).avatar,
                                        id: name.slice(0, name.indexOf("-", name.indexOf("-") + 1)),
                                        nickname: users.get(userId).nickname
                                    }
                                }));
                                users.get(userId).selectedFile = name;
                                broadcastUsers();
                            } else {
                                ws.send(JSON.stringify({action: "error", message: "File not found"}));
                            }
                        }
                        break;
                    case "getFileContent":
                        if (name) {
                            Logger.info(`Fetching content for file: ${name}`);
                            const filePath = path.join(DIRECTORY, name);
                            if (fs.existsSync(filePath)) {
                                ws.send(JSON.stringify({
                                    action: "getFileContent", data: {
                                        name: name,
                                        content: JSON.parse(fs.readFileSync(filePath, "utf-8")),
                                    }
                                }));
                            } else {
                                ws.send(JSON.stringify({action: "error", message: "File not found"}));
                            }
                        }
                        break;
                    case "saveFile":
                        if (name && content) {
                            Logger.info(`Saving file: ${name}`);
                            const filePath = path.join(DIRECTORY, name);
                            fs.writeFileSync(filePath, content, "utf-8");
                            ws.send(JSON.stringify({action: "success", message: "File saved successfully"}));
                        }
                        break;
                    case "deleteFile":
                        if (name) {
                            Logger.info(`Deleting file: ${name}`);
                            const filePath = path.join(DIRECTORY, name);
                            if (fs.existsSync(filePath)) {
                                fs.unlinkSync(filePath);
                                ws.send(JSON.stringify({action: "success", message: "File deleted successfully"}));
                                broadcastFileDeletion(name);
                            } else {
                                ws.send(JSON.stringify({action: "error", message: "File not found"}));
                            }
                        }
                        break;
                    case "selectCourse":
                        if (courseId) {
                            const user = users.get(userId);
                            if (user) {
                                console.log("selecting cousres",courseId)
                                user.selectedCourse = courseId;
                                broadcastUsers();
                            }
                        }
                        break;
                    default:
                        ws.send(JSON.stringify({action: "error", message: "Unknown action"}));
                }
            } catch (error) {
                Logger.error(`Error handling message: ${error}`);
                ws.send(JSON.stringify({action: "error", message: "Invalid request format"}));
            }
        };

        ws.on("message", handleMessage);

        ws.on("close", () => {
            Logger.info(`Client disconnected: ${userId}`);
            users.delete(userId);
            broadcastUsers();
        });

        ws.on("error", (error) => {
            Logger.error(`WebSocket error: ${error}`);
        });
    });
})();