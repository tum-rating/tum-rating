import WebSocket, {WebSocketServer} from 'ws';
import axios from 'axios';
import {PRODUCTION_API_COURSES_URL, TUM_ONLINE_SEMESTERS_URL} from './server-actions-config';
import {serverFilesystemConfig, serverFilesystemConfigFilesMap} from './server-filesystem-config';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4} from 'uuid';


import {fetchAllPages, keySimilarityCore, summarizeFetchedData} from './server-actions-utils';

interface FetchParams {
    suffix: string;
    semesters?: string[];
    filesToMerge?: any[]
    ws: WebSocket;
    wss: WebSocketServer;
    content?: any;
}

const broadcastFetchStatus = (wss: WebSocketServer, type: string, status: boolean) => {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({action: 'fetchStatus', fetchStatus: status, type}));
        }
    });
};

const broadcastNewFile = (wss: WebSocketServer, fileName: string) => {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({action: 'newFile', name: fileName}));
        }
    });
};

// const createIds = (data: any[]) => {
//     return data.map((item, index) => {
//         return {...item, id: uuidv4()};
//     });
// }

const keySimilarityMerging = async ({filesToMerge, ws, wss, suffix}: FetchParams) => {
    if (!suffix) {
        suffix = "merged" + new Date().getTime();
    }
    const fileConfig = serverFilesystemConfigFilesMap['mrozon-rating-data'];
    const filePath = path.join(serverFilesystemConfig.DIRECTORY, `${suffix}-merged${fileConfig.extension}`);


    broadcastFetchStatus(wss, `merged-${suffix}`, true);

    let allCourses = [];
    console.log(filesToMerge)
    for (const file of filesToMerge) {
        let filePath = path.join(serverFilesystemConfig.DIRECTORY, `${file}`);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        allCourses.push(...data);
    }
    const summarizedData = keySimilarityCore(allCourses, "name", "courseId");

    for(let i = 0; i < summarizedData.length; i++){
        summarizedData[i].id = uuidv4();
    }

    console.log(filePath)
    fs.writeFileSync(filePath, JSON.stringify(summarizedData, null, 2), 'utf-8');

    console.log(2)
    broadcastFetchStatus(wss, `merged-${suffix}`, false);
    ws.send(JSON.stringify({action: 'newFile', name: `${suffix}-merged${fileConfig.extension}`}));
    broadcastNewFile(wss, `merged-${suffix}${fileConfig.extension}`);


}


const fetchAndSaveMrozonRatingData = async ({suffix, ws, wss}: FetchParams) => {
    const baseUrl = "https://mcmikecreations.github.io/tum_info/api/courses.json"
    const fileConfig = serverFilesystemConfigFilesMap['mrozon-rating-data'];
    const filePath = path.join(serverFilesystemConfig.DIRECTORY, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, true);
    const response = await axios.get(baseUrl);
    const data = response.data;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, false);
    ws.send(JSON.stringify({action: 'newFile', name: `${fileConfig.id}-${suffix}${fileConfig.extension}`}));
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
}

const fetchAndSaveProductionCourses = async ({suffix, ws, wss}: FetchParams) => {
    const fileConfig = serverFilesystemConfigFilesMap['courses-production'];
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
    fs.writeFileSync(filePath, JSON.stringify(allCourses, null, 2), 'utf-8');
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, false);
    ws.send(JSON.stringify({action: 'newFile', name: `${fileConfig.id}-${suffix}${fileConfig.extension}`}));
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
};

const fetchAndSaveTUMSemesters = async ({suffix, ws, wss}: FetchParams) => {
    const fileConfig = serverFilesystemConfigFilesMap['tum-semesters'];
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
    fs.writeFileSync(filePath, JSON.stringify(semesterMap, null, 2), 'utf-8');
    ws.send(JSON.stringify({action: 'newFile', name: `${fileConfig.id}-${suffix}${fileConfig.extension}`}));
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
};


const fetchAndSaveTUMCourses = async ({suffix, semesters, ws, wss}: FetchParams) => {
    const fileConfig = serverFilesystemConfigFilesMap['courses-tum-campus'];
    const filePath = path.join(serverFilesystemConfig.DIRECTORY, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
    const allCourses = [];

    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, true);
    for (const termId of semesters) {
        const options = {pageSize: 100, termId};
        const courses = await fetchAllPages(options);
        allCourses.push(...courses);
    }

    //parse allcourses


    const summarizedData = await summarizeFetchedData(allCourses);


    fs.writeFileSync(filePath, JSON.stringify(summarizedData, null, 2), 'utf-8');
    broadcastFetchStatus(wss, `${fileConfig.id}-${suffix}`, false);
    ws.send(JSON.stringify({action: 'newFile', name: `${fileConfig.id}-${suffix}${fileConfig.extension}`}));
    broadcastNewFile(wss, `${fileConfig.id}-${suffix}${fileConfig.extension}`);
};


const mergeCoursesNamesAi = ({content,ws,wss}) =>{

}

export {
    fetchAndSaveProductionCourses,
    fetchAndSaveTUMSemesters,
    fetchAndSaveTUMCourses,
    fetchAndSaveMrozonRatingData,
    keySimilarityMerging
};