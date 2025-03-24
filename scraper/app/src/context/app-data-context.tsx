import {createContext, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState,} from "react";
import {FetchedComputedCourse, FetchedCourse, FileData,} from "@/types/fetchedData.ts";
import {v4 as uuidv4} from "uuid";
import {toast} from "sonner";
import fastJsonPatch from "fast-json-patch";

interface User {
    id: string;
    avatar: string;
    selectedFile: string | null;
    nickname: string;
    selectedCourse: string | null;
}

interface AppDataContextType {
    filesContent: { [key: string]: FetchedCourse[] };
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
    startFetchingTUMCourses: (suffix: string, semesters: string[]) => void;
    startFetchingMrozonRatingData: (suffix: string) => void;
    keySimilarityMerging: (filesToMerge: FetchedCourse[], suffix: string) => void;
    keySimilarityMergingAi: (
        filesToMerge: FetchedCourse[],
        suffix: string,
    ) => void;
    finishKeySimilarityMerging: (filesToMerge: any[], suffix: string) => void;
    coursesNamesMergingAiForWholeFile: () => void;
    checkCorrectnessBatchedCourses: () => void;
    coursesNamesMergingAi: (
        courses: string[],
        course: FetchedComputedCourse,
    ) => Promise<Record<string, unknown>>;
    getFileContent: (fileName: string) => Promise<FetchedCourse[]>;
    selectCourse: (course: FetchedCourse | FetchedComputedCourse | null) => void;
    selectedCourse: FetchedCourse | FetchedComputedCourse | null;
    setSelectedCourse: (
        courseId: FetchedComputedCourse | FetchedCourse | null,
    ) => void;
    serverFilesystemConfig: Record<string, unknown>;
    serverFilesystemConfigFilesMap: Record<string, unknown>;
    getAndUseFileContent: (file: FileData) => Promise<FetchedCourse[]>;
    //------------------- ai things
    aiWorkers: Record<
        string,
        {
            userId: string;
            progress: number;
            startTime: string;
            status: string;
            logs: any[];
        }
    >;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

type AppDataContextProps = PropsWithChildren;

const AppDataProvider = ({children}: AppDataContextProps) => {
    const [aiWorkers, setAiWorkers] = useState<
        Record<
            string,
            {
                userId: string;
                progress: number;
                startTime: string;
                status: string;
                logs: any[];
            }
        >
    >({});

    //----
    const [files, setFiles] = useState<FileData[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<
        FetchedComputedCourse | FetchedCourse | null
    >(null);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>(() => {
        let userId = localStorage.getItem("userId");
        if (!userId) {
            userId = uuidv4();
            localStorage.setItem("userId", userId);
        }
        return userId;
    });
    const [fetchStatus, setFetchStatus] = useState<{ [key: string]: boolean }>(
        {},
    );
    const [serverFilesystemConfig, setServerFilesystemConfig] = useState<Record<
        string,
        unknown
    > | null>(null);
    const [serverFilesystemConfigFilesMap, setServerFilesystemConfigFilesMap] =
        useState<Record<string, unknown> | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const filesContentRef = useRef<{ [key: string]: FetchedCourse[] }>({});

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const configResponse = await fetch(
                    import.meta.env.VITE_API_URL + "/filesystem-config",
                );
                const configData = await configResponse.json();
                setServerFilesystemConfig(configData);

                const configMapResponse = await fetch(
                    import.meta.env.VITE_API_URL + "/filesystem-config-map",
                );
                const configMapData = await configMapResponse.json();
                setServerFilesystemConfigFilesMap(configMapData);
            } catch (error) {
                console.error("Failed to fetch server filesystem config:", error);
            }
        };

        fetchConfig();
    }, []);

    useEffect(() => {
        if (!(window.__webSocketClient instanceof WebSocket)) {
            window.__webSocketClient = new WebSocket(
                import.meta.env.VITE_WEBSOCKET_URL,
            );
        } else if (
            window.__webSocketClient.readyState === WebSocket.CLOSED ||
            window.__webSocketClient.readyState === WebSocket.CLOSING
        ) {
            window.__webSocketClient = new WebSocket(
                import.meta.env.VITE_WEBSOCKET_URL,
            );
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
                userSelectedFile,
                updatedItem,
                updatedItems,
                fileName,
            } = JSON.parse(event.data);
            switch (action) {
                case "coursesNamesMergingAi":
                    break;
                case "updateAiWorkers":
                    console.log(data);
                    setAiWorkers(data);
                    break;
                case "setUserId":
                    setCurrentUserId(userId);
                    break;
                case "fileList":
                    setFiles(
                        data.map((file: any) => ({
                            id: file.name.replace(/\.json$/, ""),
                            name: file.name,
                            size: file.size || 0,
                            lastModified: file.lastModified
                                ? new Date(file.lastModified)
                                : null,
                        })),
                    );
                    if (data.length) {
                        const tempFilesContent = {...filesContentRef.current};
                        data.forEach((file: any) => {
                            const fileNameWithoutExtension = file.name.replace(/\.json$/, "");
                            if (!tempFilesContent[fileNameWithoutExtension]) {
                                tempFilesContent[fileNameWithoutExtension] = [];
                            }
                        });
                        filesContentRef.current = tempFilesContent;
                    }
                    if (!selectedFileExists && userSelectedFile) {
                        toast.error(`Your selected file was deleted from the server.`);
                        setSelectedFile(null);
                        setSelectedCourse(null);
                    }
                    break;

                case "fileContent":
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
                    setFetchStatus((prevProgress) => ({
                        ...prevProgress,
                        [type]: fetchStatus,
                    }));
                    break;
                case "newFile":
                    fetchFiles();
                    break;
                case "fileUpdated": {
                    if (updatedItems) {
                        console.log(updatedItems)
                        const fileNameWithoutExtension = fileName.slice(
                            0,
                            fileName.lastIndexOf("."),
                        );
                        console.log(updatedItems);
                        filesContentRef.current[fileNameWithoutExtension] = updatedItems;
                    } else {
                        const fileNameWithoutExtension = fileName.slice(
                            0,
                            fileName.lastIndexOf("."),
                        );
                        const currentFilesContent =
                            filesContentRef.current[fileNameWithoutExtension];
                        if (!currentFilesContent) return;
                        const updatedFileContent = [...currentFilesContent];
                        updatedFileContent[updatedItem.index] = updatedItem.updatedItem;
                        filesContentRef.current[fileNameWithoutExtension] =
                            updatedFileContent;
                    }
                    break;
                }
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
            socketRef.current?.removeEventListener("message", () => {
            });

            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current?.close();
            }
        };
    }, []);

    const fetchFiles = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({action: "getFiles"}));
        }
    };

    const handleSetSelectedFile = async (file: FileData | null) => {
        if (file) {
            const data = await getFileContent(file.name);
            const fileNameWithoutExtension = file.name.replace(/\.json$/, "");
            filesContentRef.current[fileNameWithoutExtension] = data;
            if (!file.name.includes("courses-production")) {
                setSelectedCourse(null);
            }
            selectFile(file);
            setSelectedFile(file);
        } else {
            setSelectedCourse(null);
        }
    };

    const getAndUseFileContent = async (file: FileData | null) => {
        if (file) {
            const data = await getFileContent(file.name);
            const fileNameWithoutExtension = file.name.slice(
                0,
                file.name.lastIndexOf("."),
            );
            filesContentRef.current[fileNameWithoutExtension] = data;
            return data;
        }
        return null;
    };

    const saveUserEditedCourse = (
        updatedCourse: FetchedCourse | FetchedComputedCourse,
    ) => {
        if (!selectedFile) return;
        const fileNameWithoutExtension = selectedFile.name.slice(
            0,
            selectedFile.name.lastIndexOf("."),
        );
        const selectedFileContent =
            filesContentRef.current[fileNameWithoutExtension];
        if (!selectedFileContent) return;

        const originalCourseIndex = selectedFileContent.findIndex(
            (course) => course.id === updatedCourse.id,
        );
        if (originalCourseIndex === -1) return;

        const originalCourse = selectedFileContent[originalCourseIndex];
        const diffs = fastJsonPatch.compare(originalCourse, updatedCourse);

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({
                    action: "updateItem",
                    fileName: selectedFile.name,
                    updatedItem: updatedCourse,
                    index: originalCourseIndex,
                    diffs,
                }),
            );
        }
    };

    const deleteFile = (name: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({action: "deleteFile", name}));
        }
    };

    const setUserDetails = useCallback(
        (details: { nickname: string; avatar: string }) => {
            if (
                socketRef.current &&
                socketRef.current.readyState === WebSocket.OPEN
            ) {
                socketRef.current.send(
                    JSON.stringify({action: "setUserDetails", ...details}),
                );
            }
        },
        [],
    );

    const startFetchingProductionCourses = (suffix: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({action: "fetchProductionCourses", suffix}),
            );
        }
    };

    const startFetchingTUMSemesters = (suffix: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({action: "fetchTUMSemesters", suffix}),
            );
        }
    };

    const startFetchingTUMCourses = (suffix: string, semesters: string[]) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({action: "fetchTUMCourses", suffix, semesters}),
            );
        }
    };

    const startFetchingMrozonRatingData = (suffix: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({action: "fetchMrozonRatingData", suffix}),
            );
        }
    };

    const keySimilarityMerging = (
        filesToMerge: FetchedCourse[],
        suffix: string,
    ) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({
                    action: "keySimilarityMerging",
                    filesToMerge,
                    suffix,
                }),
            );
        }
    };

    const finishKeySimilarityMerging = (filesToMerge: any[], suffix: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({
                    action: "finishKeySimilarityMerging",
                    filesToMerge,
                    suffix,
                }),
            );
        }
    };

    const getFileContent = async (fileName: string): Promise<FetchedCourse[]> => {
        const response = await fetch(
            import.meta.env.VITE_API_URL + `/files/${fileName}`,
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to fetch file content`);
        }
        return data;
    };

    const selectFile = (file: FileData) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({action: "selectFile", name: file.name}),
            );
        }
    };

    const selectCourse = (
        course: FetchedComputedCourse | FetchedCourse | null,
    ) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            if (!course) {
                setSelectedCourse(null);
                socketRef.current.send(
                    JSON.stringify({action: "selectCourse", courseId: null}),
                );
            } else {
                setSelectedCourse(course);
                socketRef.current.send(
                    JSON.stringify({action: "selectCourse", courseId: course.id}),
                );
            }
        }
    };

    const keySimilarityMergingAi = (
        filesToMerge: FetchedCourse[],
        suffix: string,
    ) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({
                    action: "keySimilarityMergingAi",
                    filesToMerge,
                    suffix,
                }),
            );
        }
    };

    const coursesNamesMergingAiForWholeFile = async () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const fileNameWithoutExtension = selectedFile.name.replace(/\.json$/, "");
            const coursesSets = filesContentRef.current[fileNameWithoutExtension].map(
                (course) => course.merged.map((subCourse) => subCourse.name),
            );
            socketRef.current.send(
                JSON.stringify({
                    action: "batchMergeCoursesByNamesWithAi",
                    coursesSets,
                    fileName: selectedFile.name,
                }),
            );
        }
    };
    const checkCorrectnessBatchedCourses = async () => {
        console.log(3)
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            console.log(6)
            const fileNameWithoutExtension = selectedFile.name.replace(/\.json$/, "");
            const coursesSets = filesContentRef.current[fileNameWithoutExtension].map((course) => {
                    return {
                        baseName: course.name,
                        subCoursesNames: course.merged.map(x=>x.name)
                    }
                }
            );
            console.log(coursesSets)
            socketRef.current.send(
                JSON.stringify({
                    action: "checkCorrectnessBatchedCourses",
                    coursesSets,
                    fileName: selectedFile.name,
                }))
        }
    }

    const updateAiWorkers = (fileName: string, data: any) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({
                    action: "updateAiWorkers",
                    fileName,
                    content: data,
                }),
            );
        }
    };

    const coursesNamesMergingAi = async (
        courses: string[],
        item: FetchedCourse,
    ): Promise<Record<string, unknown>> => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const fileNameWithoutExtension = selectedFile.name.slice(
                0,
                selectedFile.name.lastIndexOf("."),
            );
            const selectedFileContent =
                filesContentRef.current[fileNameWithoutExtension];
            if (!selectedFileContent) return;

            const originalCourseIndex = selectedFileContent.findIndex(
                (x) => x.id === item.id,
            );
            if (originalCourseIndex === -1) return;

            const originalCourse = selectedFileContent[originalCourseIndex];
            socketRef.current.send(
                JSON.stringify({
                    action: "coursesNamesMergingAi",
                    content: courses,
                    item: item,
                    index: originalCourseIndex,
                    fileName: selectedFile?.name,
                }),
            );
        }
        return Promise.reject("WebSocket is not open");
    };
    const contextValue = useMemo(
        () => ({
            filesContent: filesContentRef.current,
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
            startFetchingMrozonRatingData,
            startFetchingTUMCourses,
            keySimilarityMerging,
            keySimilarityMergingAi,
            coursesNamesMergingAi,
            coursesNamesMergingAiForWholeFile,
            checkCorrectnessBatchedCourses,
            finishKeySimilarityMerging,
            getFileContent,
            selectCourse,
            selectedCourse,
            setSelectedCourse,
            serverFilesystemConfig,
            serverFilesystemConfigFilesMap,
            getAndUseFileContent,
            updateAiWorkers,
            aiWorkers,
        }),
        [
            files,
            selectedFile,
            users,
            currentUserId,
            fetchStatus,
            selectedCourse,
            serverFilesystemConfig,
            serverFilesystemConfigFilesMap,
            filesContentRef.current,
            aiWorkers,
        ],
    );
    return (
        <AppDataContext.Provider value={contextValue}>
            {children}
        </AppDataContext.Provider>
    );
};

export {AppDataProvider, AppDataContext, type AppDataContextType};
