import {createContext, PropsWithChildren, useEffect, useState, useTransition} from 'react';
import {fetchData} from '../lib/fetch-data.ts';
import {FetchedComputedCourse, FetchedData} from '@/types/fetchedData.ts';
import PageLoader from "@/components/page-loader.tsx";

interface AppDataContextType {
    appData: FetchedData | undefined;
    isPending: boolean;
    selectedItemId: string | null;
    setSelectedItemId: (id: string | null) => void;
    computedDataToCheck: FetchedComputedCourse | undefined;
}

const AppDataContext = createContext<AppDataContextType>({
    appData: undefined,
    isPending: false,
    selectedItemId: null,
    setSelectedItemId: () => {
    },
    computedDataToCheck: undefined,
});

type AppDataContextProps = PropsWithChildren;

const AppDataProvider = ({children}: AppDataContextProps) => {
    const [appData, setAppData] = useState<FetchedData | undefined>(undefined);
    const [computedDataToCheck, setComputedDataToCheck] = useState<FetchedData | undefined>(undefined);
    const [isPending, startTransition] = useTransition();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);


    useEffect(() => {
        startTransition(() => {
            (async () => {
                const data = await fetchData();
                setAppData(data);
                //to check means that there is at least 2 items in merged key
                if (data.computedCourses.length > 1) {
                    const temp = data.computedCourses.filter((item) => item.merged.length > 1);
                    setComputedDataToCheck(temp);
                }

            })();
        });
    }, []);

    return (
        <AppDataContext.Provider value={{appData, isPending, selectedItemId, setSelectedItemId, computedDataToCheck}}>
            {isPending ? <PageLoader/> : children}
        </AppDataContext.Provider>
    );
};

export {
    AppDataProvider,
    AppDataContext
}