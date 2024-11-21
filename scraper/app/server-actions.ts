import axios from "axios";
import {PRODUCTION_API_COURSES_URL, TUM_ONLINE_SEMESTERS_URL} from "./server-actions-config";
import {serverFilesystemConfig, serverFilesystemConfigFilesMap} from "./server-filesystem-config";
import fs from "fs";
import path from "path";

const fetchAndSaveProductionCourses = async ({suffix, ws}) => {
    const fileConfig = serverFilesystemConfigFilesMap["courses-production"];
    const filePath = path.join(serverFilesystemConfig.DIRECTORY, `${fileConfig.id}-${suffix}${fileConfig.extension}`);

    const allCourses = [];
    let pageNumber = 1;
    const pageSize = 500;
    let totalCourses = 0;

    while (pageNumber) {
        // `https://tum-rating.de/api/v1/courses?page-number=${pageNumber}&page-size=${pageSize}`
        const response = await axios.get(PRODUCTION_API_COURSES_URL + `?page-number=${pageNumber}&page-size=${pageSize}`);
        const data = response.data;
        allCourses.push(...data.results);
        totalCourses += data.results.length;
        console.log(data.nextPageNumber)
        pageNumber = data.nextPageNumber;

        // Send progress update
        ws.send(JSON.stringify({action: "fetchProgress", progress: totalCourses, type: "courses-production"}));
    }

    // Save the fetched data to a file
    fs.writeFileSync(filePath, JSON.stringify(allCourses, null, 2), "utf-8");

    // Notify clients about the new file
    ws.send(JSON.stringify({action: "newFile", name: `${fileConfig.id}-${suffix}${fileConfig.extension}`}));
};

const fetchAndSaveTUMSemesters = async ({suffix, ws}) => {
    const fileConfig = serverFilesystemConfigFilesMap["tum-semesters"];
    console.log(fileConfig)
    const filePath = path.join(serverFilesystemConfig.DIRECTORY, `${fileConfig.id}-${suffix}${fileConfig.extension}`);

    const url = `${TUM_ONLINE_SEMESTERS_URL}`;
    const response = await axios.get(url);
    const semesters = response.data.semesters;
    const semesterMap = semesters.reduce((acc, semester) => {
        const id = semester.id;
        acc[id] = semester.shortName.value;
        return acc;
    }, {});

    // Send progress update
    ws.send(JSON.stringify({action: "fetchProgress", progress: semesters.length, type: "tum-semesters"}));

    // Save the fetched data to a file
    fs.writeFileSync(filePath, JSON.stringify(semesterMap, null, 2), "utf-8");

    // Notify clients about the new file
    ws.send(JSON.stringify({action: "newFile", name: `${fileConfig.id}-${suffix}${fileConfig.extension}`}));
};

export {fetchAndSaveProductionCourses, fetchAndSaveTUMSemesters};