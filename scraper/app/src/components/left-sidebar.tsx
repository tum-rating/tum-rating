import {useContext, useEffect, useState} from "react";
import {AppDataContext} from "@/context/app-data-context.tsx";
import {TreeView} from "@/components/tree-view.tsx";
import SidebarSearch from "@/components/sidebar-search.tsx";
import {DatasetOptions} from "@/types/dataset-options.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

interface LeftSidebarProps {
    isOpen: boolean;
}

const LeftSidebar = ({isOpen}: LeftSidebarProps) => {
    const {files, setSelectedFile, deleteFile, currentUserId, users} = useContext(AppDataContext);
    const [filteredFiles, setFilteredFiles] = useState(files);
    const [sortOptions, setSortOptions] = useState<DatasetOptions>({
        name: {enabled: false, ascending: true, label: 'Name', type: "string"},
    });
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        setFilteredFiles(files);
    }, [files]);

    const handleFileClick = (file) => {
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

    console.log()
    const data = sortData(filteredFiles).map(file => ({
        id: file.name,
        name: file.name,
        onClick: () => handleFileClick(file),
        icon: () => {
            const icons = users.map((user) => {
                if (user.selectedFile === file.name) {
                    return (
                        <Avatar
                            className={`h-6 w-6 ${user.id === currentUserId ? 'border-2 border-blue-500' : 'border-2 border-gray-900'}`}>
                            <AvatarImage src={user.avatar}/>
                            <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                        </Avatar>
                    )
                }
            })
            if (icons.length > 0) {
                return (
                    <div className='flex gap-1 mr-2'>
                        {icons}
                    </div>
                )
            } else return null
        }
    }))


    return (
        <div className={`Sidebar ${isOpen ? 'w-[243px]' : 'w-[0px]'} transition-width duration-300 ease-in-out`}>
            <SidebarSearch onSortChange={setSortOptions} onSearch={handleSearch} listLength={filteredFiles.length}
                           sortOptions={sortOptions}/>
            <TreeView data={data}/>
        </div>
    );
};

export default LeftSidebar;