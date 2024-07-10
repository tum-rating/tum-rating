import React, {createContext, ReactNode, useContext, useState} from 'react';

interface SearchContextProps {
    children: ReactNode;
}

interface SearchContextValue {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export const SearchProvider: React.FC<SearchContextProps> = ({children}) => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    return <SearchContext.Provider value={{searchQuery, setSearchQuery}}>{children}</SearchContext.Provider>;
};

export const useSearchContext = (): SearchContextValue => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
};
