interface ServerFilesystemConfigFile {
    id: string;
    name: string;
    extension: string;
    serverAction: string;
    regex: RegExp;
    dependencies?: string[];
}

interface ServerFilesystemConfig {
    PORT: string;
    DIRECTORY: string;
    files: ServerFilesystemConfigFile[];
}

interface ServerFilesystemConfigFilesMap {
    [key: string]: ServerFilesystemConfigFile;
}

const serverFilesystemConfig: ServerFilesystemConfig = {
    PORT: "8080",
    DIRECTORY: 'data',
    files: [
        {
            id: "tum-semesters",
            name: "TUM Semesters",
            extension: ".json",
            serverAction: "getTUMSemesters",
            regex: /tum-semesters/,
        },
        {
            id: "courses-production",
            name: "Courses Production",
            extension: ".json",
            serverAction: "getProductionCourses",
            regex: /courses-production/,
        },
        {
            id: "courses-tum-campus",
            name: "Courses TUM Campus",
            extension: ".json",
            serverAction: "getTUMCampusCourses",
            regex: /courses-tum-campus/,
            dependencies: ["tum-semesters"]
        },
        {
            id: 'mrozon-rating-data',
            name: 'Mrozon Rating Data',
            extension: '.json',
            serverAction: 'getMrozonRatingData',
            regex: /mrozon-rating-data/
        }

    ]
}

const serverFilesystemConfigFilesMap: ServerFilesystemConfigFilesMap = Object.fromEntries(serverFilesystemConfig.files.map(file => [file.id, file]))

export {
    serverFilesystemConfig,
    serverFilesystemConfigFilesMap
}