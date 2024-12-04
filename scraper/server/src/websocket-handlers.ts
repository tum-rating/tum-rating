import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import Logger from './server-logger';
import { validateConnection, handleReconnection, handleTimeout } from './websocket-utils';
import { fetchAndSaveProductionCourses, fetchAndSaveTUMSemesters } from './server-actions';
import fs from 'fs';
import path from 'path';
import { serverFilesystemConfig } from './server-filesystem-config';
import {applyPatch} from "fast-json-patch";

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

let isUpdating = false;

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
            nickname: ws.nickname || '',
            avatar: ws.avatar || '',
            selectedFile: ws.selectedFile || null,
            selectedCourse: ws.selectedCourse || null
        }));

        // Send update to all clients
        const message = JSON.stringify({ action: 'updateUsers', data: userList });
        wss.clients.forEach((client: WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    } finally {
        isUpdating = false;
    }
};

export const handleConnection = (ws: ExtendedWebSocket, req: http.IncomingMessage, wss: WebSocketServer) => {
    const userId = String(+new Date());
    ws.userId = userId;

    if (!validateConnection(req)) {
        ws.close(1008, 'Invalid connection');
        return;
    }

    clients.set(userId, ws);
    Logger.info(`Client connected: ${userId}`);

    ws.on('message', (message) => handleMessage(userId, message, wss, ws));
    ws.on('close', () => handleDisconnection(userId, wss));
    ws.on('error', (error) => handleError(userId, error));

    handleReconnection(ws, userId);
    handleTimeout(ws, userId);

    // Broadcast updated user list when a new user connects
    broadcastUsers(wss);
};

const handleMessage = async (userId: string, message: WebSocket.Data, wss: WebSocketServer, ws: ExtendedWebSocket) => {
    try {
        const { action, name, content, nickname, avatar, suffix, courseId,fileName,diffs } = JSON.parse(message.toString());
        Logger.info(`Received action: ${action}`);
        switch (action) {
            case 'setUserDetails':
                if (nickname && avatar) {
                    const user = clients.get(userId);
                    if (user) {
                        user.nickname = nickname;
                        user.avatar = avatar;
                        broadcastUsers(wss);
                    }
                }
                break;
            case 'getFiles':
                broadcastFileList(wss, userId);
                break;
            // case 'getFile':
            //     if (name) {
            //         const filePath = path.join(serverFilesystemConfig.DIRECTORY, name);
            //         if (fs.existsSync(filePath)) {
            //             const stats = fs.statSync(filePath);
            //             ws.send(JSON.stringify({
            //                 action: 'fileContent',
            //                 data: {
            //                     name,
            //                     size: stats.size,
            //                     lastModified: stats.mtime,
            //                     id: name.slice(0, name.indexOf("-", name.indexOf("-") + 1))
            //                 }
            //             }));
            //             const user = clients.get(userId);
            //             if (user) {
            //                 user.selectedFile = name;
            //                 broadcastUsers(wss);
            //             }
            //         } else {
            //             ws.send(JSON.stringify({ action: 'error', message: 'File not found' }));
            //         }
            //     }
            //     break;
            case 'selectCourse':
                if (courseId) {
                    const user = clients.get(userId);
                    if (user) {
                        user.selectedCourse = courseId;
                        broadcastUsers(wss);
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
            case 'updateFile':
                if (fileName && diffs) {
                    const filePath = path.join(serverFilesystemConfig.DIRECTORY, fileName);
                    if (fs.existsSync(filePath)) {
                        const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                        const updatedContent = applyPatch(fileContent, diffs).newDocument;
                        fs.writeFileSync(filePath, JSON.stringify(updatedContent, null, 2), 'utf-8');
                        ws.send(JSON.stringify({ action: 'success', message: 'File updated successfully' }));

                        // Broadcast the diffs to all connected clients
                        const message = JSON.stringify({ action: 'updateFile', fileName, diffs });
                        wss.clients.forEach((client: WebSocket) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(message);
                            }
                        });
                    } else {
                        ws.send(JSON.stringify({ action: 'error', message: 'File not found' }));
                    }
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

const handleDisconnection = (userId: string, wss: WebSocketServer) => {
    clients.delete(userId);
    Logger.info(`Client disconnected: ${userId}`);
    broadcastUsers(wss);
};

const handleError = (userId: string, error: Error) => {
    Logger.error(`Error from client ${userId}: ${error.message}`);
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

    wss.clients.forEach((client: ExtendedWebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            const user = clients.get(userId);
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