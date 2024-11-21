
interface ServerFilesystemConfigFile {
    id: string;
    name: string;
    extension: string;
    serverAction: string;
    regex: RegExp;
}

interface ServerFilesystemConfig {
    PORT: string;
    DIRECTORY: string;
    files: ServerFilesystemConfigFile[];
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
    ]
}

const serverFilesystemConfigFilesMap = serverFilesystemConfig.files.reduce((acc, file) => {
    acc[file.id] = file
    return acc
}, {})


export {
    serverFilesystemConfig,
    serverFilesystemConfigFilesMap
}