import {createContext, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FetchedComputedCourse, FetchedCourse, FileData} from "@/types/fetchedData.ts";
import {v4 as uuidv4} from 'uuid';
import {toast} from 'sonner';

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
    filesContent: { [key: string]: any[] };
    files: FileData[];
    hasFiles: boolean;
    selectedFile: FileData | null;
    setSelectedFile: (file: FileData | null) => void;
    fetchFiles: () => void;
    saveUserEditedCourse: (file: FetchedCourse | FetchedComputedCourse) => void;
    deleteFile: (name: string) => void;
    users: User[];
    currentUserId: string;
    setUserDetails: (details: { nickname: string; avatar: string }) => void;
    socketRef: React.MutableRefObject<WebSocket | null>;
    fetchStatus: { [key: string]: boolean };
    startFetchingProductionCourses: (suffix: string) => void;
    startFetchingTUMSemesters: (suffix: string) => void;
    getFileContent: (fileName: string) => Promise<any>;
    selectCourse: (course: FetchedCourse | FetchedComputedCourse) => void;
    selectedCourse: FetchedCourse | FetchedComputedCourse | null;
    setSelectedCourse: (courseId: FetchedComputedCourse | FetchedCourse | null) => void;
    serverFilesystemConfig: any;
    serverFilesystemConfigFilesMap: any;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

type AppDataContextProps = PropsWithChildren;

const AppDataProvider = ({children}: AppDataContextProps) => {
        const [filesContent, setFilesContent] = useState<{ [key: string]: any }>({});
        const [files, setFiles] = useState<FileData[]>([]);
        const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
        const [selectedCourse, setSelectedCourse] = useState<FetchedComputedCourse | FetchedCourse | null>(null);
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
        const [serverFilesystemConfig, setServerFilesystemConfig] = useState<any>(null);
        const [serverFilesystemConfigFilesMap, setServerFilesystemConfigFilesMap] = useState<any>(null);
        const socketRef = useRef<WebSocket | null>(null);
        // const messageTracker = useRef<{[key: string]: boolean}>({});

        useEffect(() => {
            const fetchConfig = async () => {
                try {
                    const configResponse = await fetch(import.meta.env.VITE_API_URL + '/filesystem-config');
                    const configData = await configResponse.json();
                    setServerFilesystemConfig(configData);

                    const configMapResponse = await fetch(import.meta.env.VITE_API_URL + '/filesystem-config-map');
                    const configMapData = await configMapResponse.json();
                    setServerFilesystemConfigFilesMap(configMapData);
                } catch (error) {
                    console.error('Failed to fetch server filesystem config:', error);
                }
            };

            fetchConfig();
        }, []);
        ;

        useEffect(() => {
            //https://github.com/facebook/create-react-app/issues/10387#issuecomment-1480780782
            // TODO check what is going on with doubled ws message (---------------------:
            if (!(window.__webSocketClient instanceof WebSocket)) {
                window.__webSocketClient = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)
            } else if (
                window.__webSocketClient.readyState === WebSocket.CLOSED ||
                window.__webSocketClient.readyState === WebSocket.CLOSING
            ) {
                window.__webSocketClient = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)
            }
            const socket = window.__webSocketClient;
            socketRef.current = socket;

            socketRef.current.onopen = () => {
                fetchFiles();
            };

            socketRef.current.onmessage = (event) => {
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
                        if (data.length) {
                            let tempFilesContent = {...filesContent};
                            for (let i = 0; i < data.length; i++) {
                                if (!tempFilesContent[data[i].name]) {
                                    tempFilesContent[data[i].name] = undefined
                                } else {
                                    tempFilesContent[data[i].name] = filesContent[data[i].name]
                                }
                            }
                            setFilesContent(tempFilesContent)
                        }
                        if (!selectedFileExists && userSelectedFile) {
                            toast.error(`Your selected file was deleted from the server.`);
                            setSelectedFile(null);
                            setSelectedCourse(null);
                        }
                        break;
                    case "fileContent":
                        // setSelectedFile({
                        //     name: data.name,
                        //     size: data.size,
                        //     lastModified: new Date(data.lastModified),
                        //     id: data.id,
                        // });
                        break;

                    case "getFileContent":
                        break;
                    case "updateUsers":
                        console.log("update users", data)
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
                        setFetchStatus(prevProgress => ({...prevProgress, [type]: fetchStatus}));
                        break;
                    case "newFile":
                        fetchFiles();
                        break;
                    default:
                        console.error("Unknown action:", action);
                }
            };

            socketRef.current.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            socketRef.current.onclose = () => {
                console.info("WebSocket connection closed");
            };

            return () => {
                console.log("CLEAN UP LISTENER!")
                socketRef.current?.removeEventListener("message", () => {
                });

                if (socketRef.current?.readyState === WebSocket.OPEN) {
                    console.log("closing socket!")
                    socketRef.current?.close()
                }
            };
        }, []);

        const fetchFiles = () => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({action: "getFiles"}));
            }
        };

        const fetchFileContent = (file: FileData) => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({action: "getFile", ...file}));
            }
        };

        const handleSetSelectedFile = async (file: FileData | null) => {
            console.log(file)
            if (file) {

                const data = await getFileContent(file.name);
                console.log(data)
                const fileNameWithoutExtension = file.name.slice(0, file.name.lastIndexOf('.'));
                setFilesContent(prevState => {
                    return {...prevState, [fileNameWithoutExtension]: data}
                })
                console.log(filesContent)

                if (!file.name.includes("courses-production")) {
                    setSelectedCourse(null);
                }
            } else {
                setSelectedCourse(null);
            }
        };

        const saveUserEditedCourse = (updatedCourse: FetchedCourse | FetchedComputedCourse) => {
            if (!selectedFile) return;
            const fileNameWithoutExtension = selectedFile.name.slice(0, selectedFile.name.lastIndexOf('.'));
            const selectedFileContent = filesContent[fileNameWithoutExtension];
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                if (!selectedFileContent) return;
                let indexOfUpdatedFile = 0
                for (let i = 0; i < selectedFileContent.length; i++) {
                    if (selectedFileContent[i].id === updatedCourse.id) {
                        indexOfUpdatedFile = i;
                        selectedFileContent[i] = updatedCourse;
                        break;
                    }
                }
            }

            setFilesContent(prevState => {
                return {...prevState, [fileNameWithoutExtension]: selectedFileContent}
            });
            // console.log(diffs)
            // if (socketRef.current?.readyState === WebSocket.OPEN) {
            //     socketRef.current.send(JSON.stringify({action: "updateFile", fileName, diffs}));
            // }
        }

        const deleteFile = (name: string) => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({action: "deleteFile", name}));
            }
        };

        const setUserDetails = useCallback((details: { nickname: string; avatar: string }) => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                console.log(socketRef)
                console.log(socketRef.current)
                console.log(setUserDetails, details)
                socketRef.current.send(JSON.stringify({action: "setUserDetails", ...details}));
            }
        }, []);

        const startFetchingProductionCourses = (suffix: string) => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({action: "fetchProductionCourses", suffix}));
            }
        };

        const startFetchingTUMSemesters = (suffix: string) => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({action: "fetchTUMSemesters", suffix}));
            }
        };

        const getFileContent = async (fileName: string) => {
            const response = await fetch(import.meta.env.VITE_API_URL + `/files/${fileName}`);


            const data = await response.json();
            if (!response.ok) {
                throw new Error(`Failed to fetch file content`);
            }

            return data;


            // return filesContent[fileNameWithoutExtension];

            // return response.then(async (res) => {
            //     if (res.ok) {
            //         const content = await res.text();
            //         return {name: fileName, content};
            //     } else {
            //         throw new Error(`Failed to fetch file content: ${res.status} - ${res.statusText}`);
            //     }
            // });
            // return new Promise((resolve, reject) => {
            //     if (socketRef.current?.readyState === WebSocket.OPEN) {
            //         const handleMessage = (event: MessageEvent) => {
            //             const {action, data} = JSON.parse(event.data);
            //             if (action === "getFileContent" && data.name === fileName) {
            //                 socketRef.current?.removeEventListener("message", handleMessage);
            //                 resolve({name: data.name, content: data.content});
            //             }
            //         };
            //
            //         socketRef.current.addEventListener("message", handleMessage);
            //         socketRef.current.send(JSON.stringify({action: "getFileContent", name: fileName}));
            //     } else {
            //         reject(new Error("WebSocket is not open"));
            //     }
            // });
        };

        const selectCourse = (course: FetchedComputedCourse | FetchedCourse | null) => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                if (!course) return;
                setSelectedCourse(course)
                socketRef.current.send(JSON.stringify({action: "selectCourse", courseId: course.id}));
            }
        };

        const contextValue = useMemo(() => ({
            filesContent,
            files,
            hasFiles: files.length > 0,
            selectedFile,
            setSelectedFile: handleSetSelectedFile,
            fetchFiles,
            saveUserEditedCourse,
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
            serverFilesystemConfig,
            serverFilesystemConfigFilesMap,
        }), [files, selectedFile, users, currentUserId, fetchStatus, selectedCourse, serverFilesystemConfig, serverFilesystemConfigFilesMap]);

        return (
            <AppDataContext.Provider value={contextValue}>
                {children}
            </AppDataContext.Provider>
        );
    }
;

export {AppDataProvider, AppDataContext, type AppDataContextType};