import { createContext, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { FileData } from "@/types/fetchedData.ts";
import { v4 as uuidv4 } from 'uuid';

interface User {
    id: string;
    avatar: string;
    selectedFile: string | null;
    nickname: string;
    selectedCourse: string | null;
}

interface AppDataContextType {
    files: FileData[];
    hasFiles: boolean;
    selectedFile: FileData | null;
    setSelectedFile: (file: FileData | null) => void;
    fetchFiles: () => void;
    saveFile: (file: FileData) => void;
    deleteFile: (name: string) => void;
    users: User[];
    currentUserId: string;
    setUserDetails: (details: { nickname: string; avatar: string }) => void;
    socketRef: React.MutableRefObject<WebSocket | null>;
    fetchProgress: { [key: string]: number };
    startFetchingProductionCourses: (suffix: string) => void;
    startFetchingTUMSemesters: (suffix: string) => void;
    getFileContent: (fileName: string) => Promise<FileData>;
    selectCourse: (courseId: string) => void;
    selectedCourse: string | null; // Add selectedCourse property
    setSelectedCourse: (courseId: string | null) => void; // Add setSelectedCourse method
}

const AppDataContext = createContext<AppDataContextType>({
    files: [],
    hasFiles: false,
    selectedFile: null,
    setSelectedFile: () => {},
    fetchFiles: () => {},
    saveFile: () => {},
    deleteFile: () => {},
    users: [],
    currentUserId: '',
    setUserDetails: () => {},
    socketRef: { current: null },
    fetchProgress: {},
    startFetchingProductionCourses: () => {},
    startFetchingTUMSemesters: () => {},
    getFileContent: () => Promise.resolve({} as FileData),
    selectCourse: () => {},
    selectedCourse: null, // Initialize selectedCourse
    setSelectedCourse: () => {} // Initialize setSelectedCourse
});

type AppDataContextProps = PropsWithChildren;

const AppDataProvider = ({ children }: AppDataContextProps) => {
    const [files, setFiles] = useState<FileData[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null); // Add selectedCourse state
    const [users, setUsers] = useState<User[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>(uuidv4());
    const [fetchProgress, setFetchProgress] = useState<{ [key: string]: number }>({});
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        socketRef.current = socket;

        socket.onopen = () => {
            fetchFiles();
        };

        socket.onmessage = (event) => {
            const { action, data, userId, name, progress, type, content } = JSON.parse(event.data);
            switch (action) {
                case "setUserId":
                    setCurrentUserId(userId);
                    break;
                case "fileList":
                    console.log("Received file list:", data);
                    setFiles(data.map((file: any) => ({
                        id: file.name.slice(0, file.name.indexOf("-", file.name.indexOf("-") + 1)),
                        name: file.name,
                        size: file.size || 0,
                        lastModified: file.lastModified ? new Date(file.lastModified) : null
                    })));
                    break;
                case "fileContent":
                    setSelectedFile({
                        name: data.name,
                        size: data.size,
                        lastModified: new Date(data.lastModified),
                        id: data.id,
                    });
                    break;
                case "getFileContent":

                    break;
                case "updateUsers":
                    setUsers(data);
                    break;
                case "deleteFile":
                    setFiles(prevFiles => prevFiles.filter(file => file.name !== name));
                    if (selectedFile && selectedFile.name === name) {
                        setSelectedFile(null);
                    }
                    break;
                case "success":
                    fetchFiles();
                    break;
                case "error":
                    console.log(data)
                    alert(data.message);
                    break;
                case "fetchProgress":
                    setFetchProgress(prevProgress => ({ ...prevProgress, [type]: progress }));
                    break;
                case "newFile":
                    fetchFiles();
                    break;
                default:
                    console.error("Unknown action:", action);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    const fetchFiles = () => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ action: "getFiles" }));
        }
    };

    const fetchFileContent = (file: FileData) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ action: "getFile", ...file }));
        }
    };

    const handleSetSelectedFile = (file: FileData | null) => {
        if (file) {
            fetchFileContent(file);
        }
    };

    const saveFile = (file: FileData) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ action: "saveFile", name: file.name, content: file.content }));
        }
    };

    const deleteFile = (name: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ action: "deleteFile", name }));
        }
    };

    const setUserDetails = (details: { nickname: string; avatar: string }) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ action: "setUserDetails", ...details }));
        }
    };

    const startFetchingProductionCourses = (suffix: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ action: "fetchProductionCourses", suffix }));
        }
    };

    const startFetchingTUMSemesters = (suffix: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ action: "fetchTUMSemesters", suffix }));
        }
    };

    const getFileContent = (fileName: string): Promise<FileData> => {
        return new Promise((resolve, reject) => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                const handleMessage = (event: MessageEvent) => {
                    const { action, data } = JSON.parse(event.data);
                    if (action === "getFileContent" && data.name === fileName) {
                        socketRef.current?.removeEventListener("message", handleMessage);
                        resolve(data);
                    }
                };

                socketRef.current.addEventListener("message", handleMessage);
                socketRef.current.send(JSON.stringify({ action: "getFileContent", name: fileName }));
            } else {
                reject(new Error("WebSocket is not open"));
            }
        });
    };

    const selectCourse = (courseId: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ action: "selectCourse", courseId }));
        }
    };

    return (
        <AppDataContext.Provider value={{
            files,
            hasFiles: files.length > 0,
            selectedFile,
            setSelectedFile: handleSetSelectedFile,
            fetchFiles,
            saveFile,
            deleteFile,
            users,
            currentUserId,
            setUserDetails,
            socketRef,
            fetchProgress,
            startFetchingProductionCourses,
            startFetchingTUMSemesters,
            getFileContent,
            selectCourse,
            selectedCourse, // Provide selectedCourse
            setSelectedCourse // Provide setSelectedCourse method
        }}>
            {children}
        </AppDataContext.Provider>
    );
};

export { AppDataProvider, AppDataContext };