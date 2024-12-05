import express from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {WebSocketServer} from 'ws';
import Logger from './server-logger';
import {serverFilesystemConfig, serverFilesystemConfigFilesMap} from './server-filesystem-config';
import {handleConnection} from './websocket-handlers';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API = "api";
const API_VERSION = "v1";

const BASE_API_URL = `/${API}/${API_VERSION}`;


const PORT = process.env.PORT || 8080;
const DIRECTORY = process.env.DIRECTORY || './data';

if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server});

Logger.info(`WebSocket server is running on ${PORT}`);

app.use(BASE_API_URL + '/files'
    , express.static(DIRECTORY));

app.get(BASE_API_URL + '/files/:filename', (req, res) => {
    const filePath = path.join(DIRECTORY, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

app.get(BASE_API_URL + '/files/:filename/:id', (req, res) => {
    const filePath = path.join(DIRECTORY, req.params.filename);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        const result = data.find((item: any) => item.id === req.params.id);
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('Item not found');
        }
    } else {
        res.status(404).send('File not found');
    }
})


app.get(`${BASE_API_URL}/filesystem-config`, (req, res) => {
    res.json(serverFilesystemConfig);
});

app.get(`${BASE_API_URL}/filesystem-config-map`, (req, res) => {
    res.json(serverFilesystemConfigFilesMap);
});

app.use(express.static(path.join(__dirname, '../../app/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../app/dist/index.html'));
});

wss.on('connection', (ws, req) => {
    handleConnection(ws, req, wss);
});

server.listen(PORT, () => {
    Logger.info(`Server is running on port ${PORT}`);
});