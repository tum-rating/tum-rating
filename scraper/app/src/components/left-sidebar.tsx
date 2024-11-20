import { useContext, useState, useEffect } from "react";
import { AppDataContext } from "@/context/app-data-context.tsx";
import { TreeView } from "@/components/tree-view.tsx";
import { File } from "lucide-react";
import SidebarSearch from "@/components/sidebar-search.tsx";
import { DatasetOptions } from "@/types/dataset-options.ts";

interface LeftSidebarProps {
    isOpen: boolean;
}

const LeftSidebar = ({ isOpen }: LeftSidebarProps) => {
    const { files, setSelectedFile, deleteFile } = useContext(AppDataContext);
    const [filteredFiles, setFilteredFiles] = useState(files);
    const [sortOptions, setSortOptions] = useState<DatasetOptions>({
        name: { enabled: false, ascending: true, label: 'Name', type: "string" },
    });
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        setFilteredFiles(files);
    }, [files]);

    const handleFileClick = (file) => {
        console.log(file)
        setSelectedFile(file);
    };

    const handleDeleteClick = (fileName: string) => {
        deleteFile(fileName);
    };

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
        if (!searchTerm) {
            setFilteredFiles(files);
        } else {
            const phrases = searchTerm.toLowerCase().split(',').map(phrase => phrase.trim());
            setFilteredFiles(files.filter(file =>
                phrases.every(phrase =>
                    file.name.toLowerCase().includes(phrase)
                )
            ));
        }
    };

    const sortData = (data) => {
        const sortedData = [...data];
        Object.entries(sortOptions).forEach(([key, value]) => {
            if (value?.enabled) {
                sortedData.sort((a, b) => {
                    const aValue = a[key as keyof typeof files[0]];
                    const bValue = b[key as keyof typeof files[0]];
                    if (aValue !== undefined && bValue !== undefined) {
                        if (aValue < bValue) return value!.ascending ? -1 : 1;
                        if (aValue > bValue) return value!.ascending ? 1 : -1;
                    }
                    return 0;
                });
            }
        });
        return sortedData;
    };

    const data = sortData(filteredFiles).map(file => ({
        id: file.name,
        name: file.name,
        icon: () => <File size={16} strokeWidth={1} className="mr-2" />,
        onClick: () => handleFileClick(file),
    }));
    console.log(files)
    console.log(data)
    return (
        <div className={`Sidebar ${isOpen ? 'w-[243px]' : 'w-[0px]'} transition-width duration-300 ease-in-out`}>
            <SidebarSearch onSortChange={setSortOptions} onSearch={handleSearch} listLength={filteredFiles.length} sortOptions={sortOptions} />
            <TreeView data={data} />
        </div>
    );
};

export default LeftSidebar;