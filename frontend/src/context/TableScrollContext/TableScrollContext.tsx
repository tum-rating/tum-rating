import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TableScrollContextProps {
    children: ReactNode;
}

interface TableScrollContextValue {
    scrollY: number;
    setScrollY: React.Dispatch<React.SetStateAction<number>>;
}

const TableScrollContext = createContext<TableScrollContextValue | undefined>(undefined);

export const TableScrollProvider: React.FC<TableScrollContextProps> = ({ children }) => {
    const [scrollY, setScrollY] = useState<number>(0);

    return <TableScrollContext.Provider value={{ scrollY, setScrollY }}>{children}</TableScrollContext.Provider>;
};

export const useTableScrollContext = (): TableScrollContextValue => {
    const context = useContext(TableScrollContext);
    if (context === undefined) {
        throw new Error('useTableScrollContext must be used within a ScrollProvider');
    }
    return context;
};
