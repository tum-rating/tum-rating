import { createContext, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import { FileData } from "@/types/fetchedData.ts";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface User {
    id: string;
    avatar: string;
    selectedFile: string | null;
    nickname: string;
    selectedCourse: string | null;
}

type FileContent = {
    name: string;
    content: string;
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
    fetchStatus: { [key: string]: boolean };
    startFetchingProductionCourses: (suffix: string) => void;
    startFetchingTUMSemesters: (suffix: string) => void;
    getFileContent: (fileName: string) => Promise<FileContent>;
    selectCourse: (courseId: string) => void;
    selectedCourse: string | null;
    setSelectedCourse: (courseId: string | null) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

type AppDataContextProps = PropsWithChildren;

const AppDataProvider = ({ children }: AppDataContextProps) => {
    const [files, setFiles] = useState<FileData[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>(() => {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = uuidv4();
            localStorage.setItem('userId', userId);
        }
        return userId;
    });
    const [fetchStatus, setFetchStatus] = useState<{ [key: string]: boolean }>({});
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
        socketRef.current = socket;

        socket.onopen = () => {
            fetchFiles();
        };

        socket.onmessage = (event) => {
            const {
                action,
                data,
                userId,
                name,
                fetchStatus,
                type,
                selectedFileExists,
                userSelectedFile
            } = JSON.parse(event.data);
            switch (action) {
                case "setUserId":
                    setCurrentUserId(userId);
                    break;
                case "fileList":
                    setFiles(data.map((file: any) => ({
                        id: file.name.slice(0, file.name.indexOf("-", file.name.indexOf("-") + 1)),
                        name: file.name,
                        size: file.size || 0,
                        lastModified: file.lastModified ? new Date(file.lastModified) : null
                    })));
                    if (!selectedFileExists && userSelectedFile) {
                        toast.error(`Your selected file was deleted from the server.`);
                        setSelectedFile(null);
                        setSelectedCourse(null);
                    }
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
                    if (selectedFile && selectedFile.name === name) {
                        setSelectedFile(null);
                        setSelectedCourse(null);
                    }
                    break;
                case "success":
                    fetchFiles();
                    break;
                case "error":
                    console.error(data.message);
                    alert(data.message);
                    break;
                case "fetchStatus":
                    setFetchStatus(prevProgress => ({ ...prevProgress, [type]: fetchStatus }));
                    break;
                case "newFile":
                    fetchFiles();
                    break;
                default:
                    console.error("Unknown action:", action);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.info("WebSocket connection closed");
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
            if (!file.name.includes("courses-production")) {
                setSelectedCourse(null);
            }
        } else {
            setSelectedCourse(null);
        }
    };

    const saveFile = (file: FileData) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            console.log(file)
            // socketRef.current.send(JSON.stringify({action: "saveFile", name: file.name, content: file.content}));
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

    const getFileContent = (fileName: string): Promise<FileContent> => {
        return new Promise((resolve, reject) => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                const handleMessage = (event: MessageEvent) => {
                    const { action, data } = JSON.parse(event.data);
                    if (action === "getFileContent" && data.name === fileName) {
                        socketRef.current?.removeEventListener("message", handleMessage);
                        resolve({ name: data.name, content: data.content });
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

    const contextValue = useMemo(() => ({
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
        fetchStatus,
        startFetchingProductionCourses,
        startFetchingTUMSemesters,
        getFileContent,
        selectCourse,
        selectedCourse,
        setSelectedCourse,
    }), [files, selectedFile, users, currentUserId, fetchStatus, selectedCourse]);

    return (
        <AppDataContext.Provider value={contextValue}>
            {children}
        </AppDataContext.Provider>
    );
};

export { AppDataProvider, AppDataContext };