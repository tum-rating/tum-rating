import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import Logger from './server-logger';
import { validateConnection, handleReconnection, handleTimeout } from './websocket-utils';
import { fetchAndSaveProductionCourses, fetchAndSaveTUMSemesters } from './server-actions';
import fs from 'fs';
import path from 'path';
import { serverFilesystemConfig } from './server-filesystem-config';

const clients = new Map<string, WebSocket>();

export const handleConnection = (ws: WebSocket, req: http.IncomingMessage, wss: WebSocketServer) => {
    const userId = String(+new Date());

    if (!validateConnection(req)) {
        ws.close(1008, 'Invalid connection');
        return;
    }

    clients.set(userId, ws);
    Logger.info(`Client connected: ${userId}`);

    ws.on('message', (message) => handleMessage(userId, message, wss,ws));
    ws.on('close', () => handleDisconnection(userId));
    ws.on('error', (error) => handleError(userId, error));

    handleReconnection(ws, userId);
    handleTimeout(ws, userId);
};

const handleMessage = async (userId: string, message: WebSocket.Data, wss: WebSocketServer,ws: WebSocket) => {
    try {
        const { action, name, content, nickname, avatar, suffix, courseId } = JSON.parse(message.toString());
        Logger.info(`Received action: ${action}`);
        switch (action) {
            case 'setUserDetails':
                if (nickname && avatar) {
                    const user = clients.get(userId);
                    if (user) {
                        (user as any).nickname = nickname;
                        (user as any).avatar = avatar;
                        broadcastUsers(wss);
                    }
                }
                break;
            case 'getFiles':
                broadcastFileList(wss, userId);
                break;
            case 'getFile':
                if (name) {
                    const filePath = path.join(serverFilesystemConfig.DIRECTORY, name);
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
                        const user = clients.get(userId);
                        if (user) {
                            (user as any).selectedFile = name;
                        }
                        broadcastUsers(wss);
                    } else {
                        ws.send(JSON.stringify({ action: 'error', message: 'File not found' }));
                    }
                }
                break;
            case 'saveFile':
                if (name && content) {
                    const filePath = path.join(serverFilesystemConfig.DIRECTORY, name);
                    fs.writeFileSync(filePath, content, 'utf-8');
                    ws.send(JSON.stringify({ action: 'success', message: 'File saved successfully' }));
                }
                break;
            case 'deleteFile':
                if (name) {
                    const filePath = path.join(serverFilesystemConfig.DIRECTORY, name);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        broadcastFileList(wss, userId);
                    } else {
                        ws.send(JSON.stringify({ action: 'error', message: 'File not found' }));
                    }
                }
                break;
            case 'getFileContent':
                if (name) {
                    const filePath = path.join(serverFilesystemConfig.DIRECTORY, name);
                    if (fs.existsSync(filePath)) {
                        const content = fs.readFileSync(filePath, 'utf-8');
                        ws.send(JSON.stringify({
                            action: 'getFileContent',
                            data: {
                                name,
                                content
                            }
                        }));
                    } else {
                        ws.send(JSON.stringify({ action: 'error', message: 'File not found' }));
                    }
                }
                break;
            case 'selectCourse':
                if (courseId) {
                    const user = clients.get(userId);
                    if (user) {
                        (user as any).selectedCourse = courseId;
                        broadcastUsers(wss);
                    }
                }
                break;
            case 'fetchProductionCourses':
                if (suffix) {
                    await fetchAndSaveProductionCourses({ suffix, ws, wss });
                }
                break;
            case 'fetchTUMSemesters':
                if (suffix) {
                    await fetchAndSaveTUMSemesters({ suffix, ws, wss });
                }
                break;
            default:
                ws.send(JSON.stringify({ action: 'error', message: 'Unknown action' }));
        }
    } catch (error) {
        Logger.error(`Error handling message: ${error}`);
        ws.send(JSON.stringify({ action: 'error', message: 'Invalid request format' }));
    }
};

const handleDisconnection = (userId: string) => {
    clients.delete(userId);
    Logger.info(`Client disconnected: ${userId}`);
};

const handleError = (userId: string, error: Error) => {
    Logger.error(`Error from client ${userId}: ${error.message}`);
};

const broadcastUsers = (wss: WebSocketServer) => {
    const userList = Array.from(clients.values());
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ action: 'updateUsers', data: userList }));
        }
    });
};

const broadcastFileList = (wss: WebSocketServer, userId: string) => {
    const files = fs.readdirSync(serverFilesystemConfig.DIRECTORY)
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const stats = fs.statSync(path.join(serverFilesystemConfig.DIRECTORY, file));
            return {
                name: file,
                size: stats.size,
                lastModified: stats.mtime
            };
        });

    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            const user = Array.from(clients.values()).find(u => (u as any).id === userId);
            const selectedFileExists = user?.selectedFile ? files.some(file => file.name === user.selectedFile) : false;
            client.send(JSON.stringify({
                action: 'fileList',
                data: files,
                userSelectedFile: user?.selectedFile,
                selectedFileExists
            }));
        }
    });
};