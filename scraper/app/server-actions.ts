import WebSocket, {WebSocketServer} from 'ws';
import axios from "axios";
import {PRODUCTION_API_COURSES_URL, TUM_ONLINE_SEMESTERS_URL} from "./server-actions-config";
import {serverFilesystemConfig, serverFilesystemConfigFilesMap} from "./server-filesystem-config";
import fs from "fs";
import path from "path";

interface FetchParams {
    suffix: string;
    ws: WebSocket;
    wss: WebSocketServer;
}

const broadcastFetchStatus = (wss: WebSocketServer, type: string, status: boolean) => {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({action: "fetchStatus", fetchStatus: status, type}));
        }
    });
};

const broadcastNewFile = (wss: WebSocketServer, fileName: string) => {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({action: "newFile", name: fileName}));
        }
    });
};

const fetchAndSaveProductionCourses = async ({suffix, ws, wss}: FetchParams) => {
    const fileConfig = serverFilesystemConfigFilesMap["courses-production"];
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
    fs.writeFileSync(filePath, JSON.stringify(allCourses, null, 2), "utf-8");
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, false);
    ws.send(JSON.stringify({action: "newFile", name: `${fileConfig.id}-${suffix}${fileConfig.extension}`}));
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
};

const fetchAndSaveTUMSemesters = async ({suffix, ws, wss}: FetchParams) => {
    const fileConfig = serverFilesystemConfigFilesMap["tum-semesters"];
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
    fs.writeFileSync(filePath, JSON.stringify(semesterMap, null, 2), "utf-8");
    ws.send(JSON.stringify({action: "newFile", name: `${fileConfig.id}-${suffix}${fileConfig.extension}`}));
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
}

export {fetchAndSaveProductionCourses, fetchAndSaveTUMSemesters};