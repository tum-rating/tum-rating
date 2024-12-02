import {useCallback, useContext, useMemo, useState} from "react";
import {AppDataContext} from "@/context/app-data-context.tsx";
import SidebarSearch from "@/components/sidebar-search.tsx";
import {DatasetOptions} from "@/types/dataset-options.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {File} from "lucide-react";
import FetchDialog from "@/components/fetch-dialog.tsx";

interface LeftSidebarProps {
    isOpen: boolean;
}

const LeftSidebar = ({isOpen}: LeftSidebarProps) => {
    const {files, setSelectedFile, deleteFile, currentUserId, users, fetchStatus} = useContext(AppDataContext)!;
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortOptions, setSortOptions] = useState<DatasetOptions>({
        name: {enabled: false, ascending: true, label: 'Name', type: "string"},
    });

    const handleFileClick = useCallback((file) => {
        setSelectedFile(file);
    }, [setSelectedFile]);

    const handleDeleteClick = useCallback((fileName: string) => {
        deleteFile(fileName);
    }, [deleteFile]);

    const handleSearch = useCallback((searchTerm: string) => {
        setSearchTerm(searchTerm);
    }, []);

    const filteredFiles = useMemo(() => {
        if (!searchTerm) return files;

        const phrases = searchTerm.toLowerCase().split(',').map(phrase => phrase.trim());
        return files.filter(file =>
            phrases.every(phrase =>
                file.name.toLowerCase().includes(phrase)
            )
        );
    }, [files, searchTerm]);

    const sortedFiles = useMemo(() => {
        const sortedData = [...filteredFiles];
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
    }, [filteredFiles, sortOptions]);

    const fileData = useMemo(() => sortedFiles.map(file => ({
        id: file.name,
        name: file.name,
        onClick: () => handleFileClick(file),
        icon: () => {
            const icons = users.map((user) => {
                if (user.selectedFile === file.name) {
                    return (
                        <Avatar
                            key={user.id}
                            className={`h-6 w-6 ${user.id === currentUserId ? 'border-2 border-blue-500' : 'border-2 border-gray-900'}`}>
                            <AvatarImage src={user.avatar}/>
                            <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                        </Avatar>
                    );
                }
                return null;
            }).filter(Boolean);
            return icons.length > 0 ? <div className='flex gap-1 mr-2'>{icons}</div> : null;
        },

    })), [sortedFiles, users, currentUserId, handleFileClick, fetchStatus]);

    console.log(fetchStatus)
    return (
        <div
            className={`Sidebar flex flex-col justify-between ${isOpen ? 'w-[280px]' : 'w-[0px]'} h-full transition-width duration-300 ease-in-out`}>
            <div className="flex flex-col">
                <SidebarSearch onSortChange={setSortOptions} onSearch={handleSearch} listLength={filteredFiles.length}
                               sortOptions={sortOptions}/>
                <div className='flex flex-col'>
                    {fileData.map(x => (
                        <Button key={x.id} variant='ghost'
                                className="flex justify-between w-full gap-2 cursor-pointer px-1 pl-4 hover:bg-gray-100"
                             onClick={() => handleFileClick(x)}>
                            <div className="flex gap-2 items-center">
                                <File className="w-6 h-6"/>
                                <span className="text-sm font-bold truncate max-w-[197px]">{x.name}</span>
                            </div>
                            <div className='flex gap-1 items-center'>
                                {x.icon()}
                            </div>
                        </Button>
                    ))}
                    {
                        Object.entries(fetchStatus).map(([key, value]) => {
                            if (value) {
                                return (
                                    <Button key={key} variant='ghost'
                                            className="flex justify-between w-full gap-2 cursor-pointer px-1 pl-4 hover:bg-gray-100"
                                            loading={fetchStatus[key.replace(/(\.\w+)+$/, "")]}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <File className="w-6 h-6"/>
                                            <span className="text-sm font-bold truncate max-w-[197px]">{key}</span>
                                        </div>
                                        <div className='flex gap-1 items-center'>
                                            <div className="animate-pulse h-6 w-6 bg-gray-300 rounded-full"/>
                                        </div>
                                    </Button>
                                );
                            }
                            return null;
                        })
                    }
                </div>
            </div>
            <div>
                <Separator/>
                <div className='px-4 py-3'>
                    <span className="text-xs font-bold text-gray-500 block">Server actions</span>
                    <div className='flex flex-col gap-1 mt-2'>
                        <FetchDialog>
                            <Button variant='outline' onClick={() => setSelectedFile(null)}>Fetch data</Button>
                        </FetchDialog>
                        <Button variant='outline' onClick={() => window.location.reload()}>Reload</Button>
                    </div>
                </div>
                <Separator/>
                <div className='px-4 py-3'>
                    <span className="text-xs font-bold text-gray-500 block">Active users</span>
                    <div className='flex flex-col gap-1 mt-2'>
                        {users.map(user => (
                            <div key={user.id} className="flex items-center gap-1">
                                <Avatar
                                    className={`h-6 w-6 ${user.id === currentUserId ? 'border-2 border-blue-500' : 'border-2 border-gray-900'}`}>
                                    <AvatarImage src={user.avatar}/>
                                    <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-bold">{user.nickname}</span>
                                {user.id === currentUserId &&
                                    <span className="text-xs font-bold text-blue-500 block">(You)</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftSidebar;