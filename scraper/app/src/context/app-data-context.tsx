import { createContext, PropsWithChildren, useEffect, useState, useTransition } from 'react';
import { fetchData } from '../lib/fetch-data.ts';
import {FetchedComputedCourse, FetchedCourse, FetchedData} from '@/types/fetchedData.ts';

interface AppDataContextType {
    appData: FetchedData
    isPending: boolean;
    selectedItemId: string | null;
    setSelectedItemId: (id: string | null) => void;
    computedDataToCheck: FetchedComputedCourse[] | undefined;
    getSelectedItemById: (id: string | null) => FetchedComputedCourse | undefined;
    saveSelectedCourse: (course: FetchedComputedCourse) => void;
}

const AppDataContext = createContext<AppDataContextType>({
    appData: {
        computedCourses: [],
        allCoursesMap: {},
        allCourses: []
    },
    isPending: false,
    selectedItemId: null,
    setSelectedItemId: () => {},
    computedDataToCheck: undefined,
    getSelectedItemById: () => undefined,
    saveSelectedCourse: () => {}
});

type AppDataContextProps = PropsWithChildren;

const AppDataProvider = ({ children }: AppDataContextProps) => {
    const [appData, setAppData] = useState<FetchedData>({ computedCourses: [], allCoursesMap: {}, allCourses: [] });
    const [computedDataToCheck, setComputedDataToCheck] = useState<FetchedComputedCourse[]>([]);
    const [computedCoursesMap, setComputedCoursesMap] = useState(new Map());
    const [isPending, startTransition] = useTransition();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const saveSelectedCourse = (updatedCourse: FetchedComputedCourse) => {
        if (!updatedCourse || !computedDataToCheck) return;

        setComputedDataToCheck((prev) => {
            if (!prev) return prev;
            return prev.map(course => course.id === updatedCourse.id ? updatedCourse : course);
        });
    };

    useEffect(() => {
        startTransition(() => {
            (async () => {
                const data = await fetchData();
                const formattedData: FetchedData = {
                    ...data,
                    allCourses: [],
                    allCoursesMap: data.allCoursesMap,
                    computedCourses: data.computedCourses.map((course: FetchedComputedCourse) => {
                        return {
                            ...course,
                            merged: course.merged?.map((item: FetchedCourse) => ({
                                ...item,
                                accepted: undefined
                            })),
                            acceptedCount: 0,
                            rejectedCount: 0,
                            notResolvedCount: course.merged?.length || 0
                        };
                    })
                };
                const temp: FetchedComputedCourse[] = formattedData.computedCourses
                setComputedDataToCheck(temp);

                const coursesMap = new Map<string, FetchedComputedCourse>();
                temp.forEach(course => coursesMap.set(course.id, course));
                setComputedCoursesMap(coursesMap);

                setAppData(formattedData);
            })();
        });
    }, []);

    const getSelectedItemById = (selectedId: string | null): FetchedComputedCourse | undefined => {
        return selectedId ? computedCoursesMap.get(selectedId) : undefined;
    };

    return (
        <AppDataContext.Provider value={{
            appData,
            isPending,
            selectedItemId,
            setSelectedItemId,
            computedDataToCheck,
            getSelectedItemById,
            saveSelectedCourse
        }}>
            {children}
        </AppDataContext.Provider>
    );
};

export {
    AppDataProvider,
    AppDataContext
}