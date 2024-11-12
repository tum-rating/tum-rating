import {createContext, PropsWithChildren, useEffect, useState, useTransition} from 'react';
import {fetchData} from '../lib/fetch-data.ts';
import {FetchedComputedCourse, FetchedData} from '@/types/fetchedData.ts';

interface AppDataContextType {
    appData: FetchedData | undefined;
    isPending: boolean;
    selectedItemId: string | null;
    setSelectedItemId: (id: string | null) => void;
    computedDataToCheck: FetchedComputedCourse[] | undefined;
    getSelectedItemById: (id: string | null) => FetchedComputedCourse | undefined;
    saveSelectedCourse: (course: FetchedComputedCourse) => void;
}

const AppDataContext = createContext<AppDataContextType>({
    appData: undefined,
    isPending: false,
    selectedItemId: null,
    setSelectedItemId: () => {
    },
    computedDataToCheck: undefined,
    getSelectedItemById: (id: string | null) => undefined,
    saveSelectedCourse: () => {
    }
});

type AppDataContextProps = PropsWithChildren;

const AppDataProvider = ({children}: AppDataContextProps) => {
    const [appData, setAppData] = useState<FetchedData | undefined>(undefined);
    const [computedDataToCheck, setComputedDataToCheck] = useState<FetchedComputedCourse[] | undefined>(undefined);
    const [computedCoursesMap, setComputedCoursesMap] = useState<Map<string, FetchedComputedCourse>>(new Map());
    const [isPending, startTransition] = useTransition();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);


    const saveSelectedCourse = (updatedCourse: FetchedComputedCourse) => {
        //update computedDataToCheck
        if (!updatedCourse) return;
        if (!computedDataToCheck) return;

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
                    allCoursesMap: Object.fromEntries(data.allCoursesMap.map((item: any) => [item.key, item.value])),
                    computedCourses: data.computedCourses.map(course => {
                        return {
                            ...course,
                            merged: course.merged?.map(item => ({
                                ...item,
                                accepted: undefined
                            })),
                            acceptedCount: 0,
                            rejectedCount: 0,
                            notResolvedCount: course.merged?.length || 0
                        };
                    })
                };
                const temp: FetchedComputedCourse[] = formattedData.computedCourses.filter(item => item.merged && item.merged.length > 1);
                setComputedDataToCheck(temp);

                // Create an indexed map of computed courses
                const coursesMap = new Map<string, FetchedComputedCourse>();
                temp.forEach(course => coursesMap.set(course.id, course));
                setComputedCoursesMap(coursesMap);

                setAppData(formattedData);
            })();
        });
    }, []);

    const getSelectedItemById = (id: string | null): FetchedComputedCourse | undefined => {
        return id ? computedCoursesMap.get(id) : undefined;
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