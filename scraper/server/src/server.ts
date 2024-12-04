import express from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket, { WebSocketServer } from 'ws';
import Logger from './server-logger';
import { fetchAndSaveProductionCourses, fetchAndSaveTUMSemesters } from './server-actions';
import { serverFilesystemConfig } from './server-filesystem-config';
import { handleConnection } from './websocket-handlers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8080;
const DIRECTORY = serverFilesystemConfig.DIRECTORY;

if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

Logger.info(`WebSocket server is running on ${PORT}`);

app.use('/files', express.static(DIRECTORY));

app.get('/files/:filename', (req, res) => {
    const filePath = path.join(DIRECTORY, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

wss.on('connection', (ws, req) => {
    handleConnection(ws, req, wss);
});

server.listen(PORT, () => {
    Logger.info(`Server is running on port ${PORT}`);
});