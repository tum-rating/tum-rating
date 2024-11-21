import { createContext, PropsWithChildren, useEffect, useState, useRef } from 'react';
import { FileData } from "@/types/fetchedData.ts";
import { v4 as uuidv4 } from 'uuid';

interface User {
    id: string;
    avatar: string;
    selectedFile: string | null;
    nickname: string;
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
    socketRef: { current: null }
});

type AppDataContextProps = PropsWithChildren;

const AppDataProvider = ({ children }: AppDataContextProps) => {
    const [files, setFiles] = useState<FileData[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>(uuidv4());
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        socketRef.current = socket;

        socket.onopen = () => {
            fetchFiles();
        };

        socket.onmessage = (event) => {
            const { action, data, userId, name } = JSON.parse(event.data);
            switch (action) {
                case "setUserId":
                    setCurrentUserId(userId);
                    break;
                case "fileList":
                    setFiles(data.map((file: any) => ({
                        name: file.name,
                        content: "",
                        size: file.size || 0,
                        lastModified: file.lastModified ? new Date(file.lastModified) : null
                    })));
                    break;
                case "fileContent":
                    setSelectedFile({
                        ...data
                    });
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
                    alert(data.message);
                    break;
                default:
                    console.error("Unknown action:", action);
            }
        };

        return () => {
            socket.close();
        };
    }, [selectedFile]);

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
            socketRef
        }}>
            {children}
        </AppDataContext.Provider>
    );
};

export { AppDataProvider, AppDataContext };