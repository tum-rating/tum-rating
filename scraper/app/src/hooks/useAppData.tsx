import {useContext} from 'react';
import {AppDataContext} from "@/context/app-data-context.tsx";

const useAppData = () => {
    const context = useContext(AppDataContext);
    if (context === undefined) {
        throw new Error('useAppData must be used within a AppDataProvider');
    }
    return useContext(AppDataContext);
}

export default useAppData;