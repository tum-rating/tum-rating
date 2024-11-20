import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { serverFilesystemConfig, serverFilesystemConfigFilesMap } from "./server-filesystem-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = parseInt(serverFilesystemConfig.PORT, 10);
const DIRECTORY = path.join(__dirname, serverFilesystemConfig.DIRECTORY);

if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

(async () => {
    const { WebSocketServer } = await import("ws");
    const wss = new WebSocketServer({ port: PORT });
    const users = new Map();

    console.log(`WebSocket server is running on ws://localhost:${PORT}`);

    const broadcastUsers = () => {
        const userList = Array.from(users.values());
        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify({ action: "updateUsers", data: userList }));
            }
        });
    };

    wss.on("connection", (ws) => {
        const userId = Date.now().toString();
        users.set(userId, { id: userId, avatar: `https://i.ibb.co/3m2w75y/smile-KDc-W-1.jpg`, selectedFile: null, nickname: 'Anonymous' });

        console.log("Client connected", userId);
        ws.send(JSON.stringify({ action: "setUserId", userId })); // Send userId to client
        broadcastUsers();

        ws.on("message", (message) => {
            try {
                const { action, fileName, content, nickname, avatar } = JSON.parse(message.toString());
                console.log(`Received action: ${action}`);
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
                    case "getFiles": {
                        console.log("Fetching file list...");
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
                        console.log("Files fetched:", files);
                        ws.send(JSON.stringify({ action: "fileList", data: files }));
                        break;
                    }
                    case "getFile":
                        if (fileName) {
                            console.log(`Fetching content for file: ${fileName}`);
                            const filePath = path.join(DIRECTORY, fileName);
                            if (fs.existsSync(filePath)) {
                                const fileContent = fs.readFileSync(filePath, "utf-8");
                                console.log("File content:", fileContent);
                                ws.send(JSON.stringify({ action: "fileContent", data: fileContent }));
                                users.get(userId).selectedFile = fileName;
                                broadcastUsers();
                            } else {
                                ws.send(JSON.stringify({ action: "error", message: "File not found" }));
                            }
                        }
                        break;
                    case "saveFile":
                        if (fileName && content) {
                            console.log(`Saving file: ${fileName}`);
                            const filePath = path.join(DIRECTORY, fileName);
                            fs.writeFileSync(filePath, content, "utf-8");
                            ws.send(JSON.stringify({ action: "success", message: "File saved successfully" }));
                        }
                        break;
                    case "deleteFile":
                        if (fileName) {
                            console.log(`Deleting file: ${fileName}`);
                            const filePath = path.join(DIRECTORY, fileName);
                            if (fs.existsSync(filePath)) {
                                fs.unlinkSync(filePath);
                                ws.send(JSON.stringify({ action: "success", message: "File deleted successfully" }));
                            } else {
                                ws.send(JSON.stringify({ action: "error", message: "File not found" }));
                            }
                        }
                        break;
                    default:
                        ws.send(JSON.stringify({ action: "error", message: "Unknown action" }));
                }
            } catch (error) {
                console.error("Error handling message:", error);
                ws.send(JSON.stringify({ action: "error", message: "Invalid request format" }));
            }
        });

        ws.on("close", () => {
            console.log("Client disconnected", userId);
            users.delete(userId);
            broadcastUsers();
        });

        ws.on("error", (error) => {
            console.error("WebSocket error:", error);
        });
    });
})();