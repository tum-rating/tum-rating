import {useContext} from 'react';
import {AppDataContext} from "@/context/app-data-context.tsx";

const useAppData = () => useContext(AppDataContext);

export default useAppData;