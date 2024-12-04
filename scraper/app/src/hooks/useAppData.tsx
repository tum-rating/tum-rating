import {useContext} from 'react';
import {AppDataContext, AppDataContextType} from "@/context/app-data-context.tsx";

const useAppData = (): AppDataContextType => {
    const context = useContext(AppDataContext);
    if (context === undefined) {
        throw new Error('useAppData must be used within a AppDataProvider');
    }
    return context;
}

export default useAppData;