import { createContext, PropsWithChildren, useEffect, useState, useTransition } from 'react';
import { fetchData } from '../lib/fetch-data.ts';
import { FetchedComputedCourse, FetchedData } from '@/types/fetchedData.ts';

interface AppDataContextType {
    appData: FetchedData | undefined;
    isPending: boolean;
    selectedItemId: string | null;
    setSelectedItemId: (id: string | null) => void;
    computedDataToCheck: FetchedComputedCourse[] | undefined;
}

const AppDataContext = createContext<AppDataContextType>({
    appData: undefined,
    isPending: false,
    selectedItemId: null,
    setSelectedItemId: () => {},
    computedDataToCheck: undefined,
});

type AppDataContextProps = PropsWithChildren;

const AppDataProvider = ({ children }: AppDataContextProps) => {
    const [appData, setAppData] = useState<FetchedData | undefined>(undefined);
    const [computedDataToCheck, setComputedDataToCheck] = useState<FetchedComputedCourse[] | undefined>(undefined);
    const [isPending, startTransition] = useTransition();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

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
                                accepted: undefined // Changed from null to undefined
                            })),
                            acceptedCount: 0,
                            rejectedCount: 0,
                            notResolvedCount: course.merged?.length || 0
                        };
                    })
                };
                const temp: FetchedComputedCourse[] = formattedData.computedCourses.filter(item => item.merged && item.merged.length > 1);
                setComputedDataToCheck(temp);
                setAppData(formattedData);
            })();
        });
    }, []);

    return (
        <AppDataContext.Provider value={{ appData, isPending, selectedItemId, setSelectedItemId, computedDataToCheck }}>
            {children}
        </AppDataContext.Provider>
    );
};

export {
    AppDataProvider,
    AppDataContext
}