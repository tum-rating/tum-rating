import {useContext, useEffect, useState} from "react";
import {AppDataContext} from "@/context/app-data-context.tsx";
import SidebarSearch from "@/components/sidebar-search.tsx";
import {DatasetOptions} from "@/types/dataset-options.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {File} from "lucide-react";

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
        <div
            className={`Sidebar flex flex-col justify-between ${isOpen ? 'w-[243px]' : 'w-[0px]'} h-full transition-width duration-300 ease-in-out`}>
            <div className="flex flex-col">
                <SidebarSearch onSortChange={setSortOptions} onSearch={handleSearch} listLength={filteredFiles.length}
                               sortOptions={sortOptions}/>
                <div className={'flex flex-col'}>
                    {
                        data.map(x => (
                            <Button key={x.id} variant={'ghost'}
                                    className="flex justify-between w-full gap-2 cursor-pointer px-1 pl-4 hover:bg-gray-100"
                                    onClick={x.onClick}>
                                <div className="flex gap-2 items-center">
                                    <File className="w-6 h-6"/>
                                    <span className="text-sm font-bold truncate">
                                    {x.name}
                                </span>
                                </div>
                                <div className={`flex gap-1 items-center`}>
                                    {x.icon()}
                                </div>
                            </Button>
                        ))
                    }
                </div>
            </div>
            <div>
                <Separator/>
                <div className={'px-4 py-3'}>
                    <span className="text-xs font-bold text-gray-500 block">Server actions</span>
                    <div className={'flex flex-col gap-1 mt-2'}>
                        <Button variant={'outline'}
                                onClick={() => window.location.reload()}>
                            Reload
                        </Button>
                    </div>
                </div>
                <div className={'px-4 py-3'}>
                    <span className="text-xs font-bold text-gray-500 block">Active users</span>
                    <div className={'flex flex-col gap-1 mt-2'}>
                        {users.map(user => (
                            <div key={user.id} className="flex items-center gap-1 ">
                                <Avatar
                                    className={`h-6 w-6 ${user.id === currentUserId ? 'border-2 border-blue-500' : 'border-2 border-gray-900'}`}>
                                    <AvatarImage src={user.avatar}/>
                                    <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-bold">
                                    {user.nickname}
                                </span>
                                {
                                    user.id === currentUserId && (
                                        <span className="text-xs font-bold text-blue-500 block">(You)</span>
                                    )
                                }
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LeftSidebar;