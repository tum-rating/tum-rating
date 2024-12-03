import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import WebSocket, {WebSocketServer} from 'ws';
import Logger from './server-logger';
import {fetchAndSaveProductionCourses, fetchAndSaveTUMSemesters} from "./server-actions";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const DIRECTORY = path.join(__dirname, 'data');

if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

const wss = new WebSocketServer({port: PORT});
const users = new Map();

Logger.info(`WebSocket server is running on ${PORT}`);

const broadcastUsers = () => {
    const userList = Array.from(users.values());
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({action: 'updateUsers', data: userList}));
        }
    });
};

const broadcastFileList = (wss: WebSocketServer, userId: string) => {
    const files = fs.readdirSync(DIRECTORY)
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const stats = fs.statSync(path.join(DIRECTORY, file));
            return {
                name: file,
                size: stats.size,
                lastModified: stats.mtime
            };
        });

    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            const user = Array.from(users.values()).find(u => u.id === userId);
            const selectedFileExists = user?.selectedFile ? files.some(file => file.name === user.selectedFile) : false;
            client.send(JSON.stringify({
                action: 'fileList',
                data: files,
                userSelectedFile: user.selectedFile,
                selectedFileExists
            }));
        }
    });
};

wss.on('connection', (ws) => {
    const userId = String(+new Date());
    users.set(userId, {
        id: userId,
        avatar: 'https://i.ibb.co/3m2w75y/smile-KDc-W-1.jpg',
        selectedFile: null,
        nickname: 'Anonymous',
        selectedCourse: null
    });

    Logger.info(`Client connected: ${userId}`);
    ws.send(JSON.stringify({action: 'setUserId', userId}));
    broadcastUsers();

    ws.on('message', async (message) => {
        try {
            const {action, name, content, nickname, avatar, suffix, courseId} = JSON.parse(message.toString());
            Logger.info(`Received action: ${action}`);
            switch (action) {
                case 'setUserDetails':
                    if (nickname && avatar) {
                        const user = users.get(userId);
                        if (user) {
                            user.nickname = nickname;
                            user.avatar = avatar;
                            broadcastUsers();
                        }
                    }
                    break;
                case 'getFiles': {
                    Logger.info('Fetching file list...');
                    const files = fs.readdirSync(DIRECTORY)
                        .filter(file => file.endsWith('.json'))
                        .map(file => {
                            const stats = fs.statSync(path.join(DIRECTORY, file));
                            return {
                                name: file,
                                size: stats.size,
                                lastModified: stats.mtime
                            };
                        });
                    Logger.info('Files fetched');
                    ws.send(JSON.stringify({action: 'fileList', data: files}));
                    break;
                }
                case 'getFile':
                    if (name) {
                        Logger.info(`Fetching content for file: ${name}`);
                        const filePath = path.join(DIRECTORY, name);
                        if (fs.existsSync(filePath)) {
                            const stats = fs.statSync(filePath);
                            ws.send(JSON.stringify({
                                action: 'fileContent',
                                data: {
                                    name,
                                    size: stats.size,
                                    lastModified: stats.mtime,
                                    id: name.slice(0, name.indexOf("-", name.indexOf("-") + 1))
                                }
                            }));
                            users.get(userId).selectedFile = name;
                            broadcastUsers();
                        } else {
                            ws.send(JSON.stringify({action: 'error', message: 'File not found'}));
                        }
                    }
                    break;
                case 'saveFile':
                    if (name && content) {
                        Logger.info(`Saving file: ${name}`);
                        const filePath = path.join(DIRECTORY, name);
                        fs.writeFileSync(filePath, content, 'utf-8');
                        ws.send(JSON.stringify({action: 'success', message: 'File saved successfully'}));
                    }
                    break;
                case 'deleteFile':
                    if (name) {
                        Logger.info(`Deleting file: ${name}`);
                        const filePath = path.join(DIRECTORY, name);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                            broadcastFileList(wss, userId);
                        } else {
                            ws.send(JSON.stringify({action: 'error', message: 'File not found'}));
                        }
                    }
                    break;
                case "getFileContent":
                    if (name) {
                        Logger.info(`Fetching content for file: ${name}`);
                        const filePath = path.join(DIRECTORY, name);
                        if (fs.existsSync(filePath)) {
                            const content = fs.readFileSync(filePath, 'utf-8');
                            ws.send(JSON.stringify({
                                action: "getFileContent",
                                data: {
                                    name,
                                    content
                                }
                            }));
                        } else {
                            ws.send(JSON.stringify({action: "error", message: "File not found"}));
                        }
                    }
                    break;
                case 'selectCourse':
                    if (courseId) {
                        const user = users.get(userId);
                        if (user) {
                            user.selectedCourse = courseId;
                            broadcastUsers();
                        }
                    }
                    break;
                case "fetchProductionCourses":
                    if (suffix) {
                        await fetchAndSaveProductionCourses({suffix, ws, wss});
                    }
                    break;
                case "fetchTUMSemesters":
                    Logger.info(suffix);
                    if (suffix) {
                        await fetchAndSaveTUMSemesters({suffix, ws, wss});
                    }
                    break;
                default:
                    ws.send(JSON.stringify({action: 'error', message: 'Unknown action'}));
            }
        } catch (error) {
            Logger.error(`Error handling message: ${error}`);
            ws.send(JSON.stringify({action: 'error', message: 'Invalid request format'}));
        }
    });

    ws.on('close', () => {
        Logger.info(`Client disconnected: ${userId}`);
        users.delete(userId);
        broadcastUsers();
    });

    ws.on('error', (error) => {
        Logger.error(`WebSocket error: ${error}`);
    });
});