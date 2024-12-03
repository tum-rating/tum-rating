import {PropsWithChildren, useContext, useEffect, useState} from "react";
import RightSidebar from "@/components/right-sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import Topbar from "@/components/topbar.tsx";
import LeftSidebar from "@/components/left-sidebar.tsx";
import {AppDataContext} from "@/context/app-data-context.tsx";
import isCoursesFile from "@/lib/is-courses-file.ts";

const AppLayout = ({children}: PropsWithChildren) => {
    const {selectedFile} = useContext(AppDataContext)!;
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);


    useEffect(() => {
        if (selectedFile) {
            if (isCoursesFile(selectedFile.id)) {
                setIsRightSidebarOpen(true);
            } else {
                setIsRightSidebarOpen(false);
            }
        } else {
            setIsRightSidebarOpen(false);
        }
    }, [selectedFile]);


    return (
        <div className="w-full h-full flex">
            <div className="relative">
                <LeftSidebar isOpen={isLeftSidebarOpen}/>
            </div>
            <Separator orientation='vertical'/>
            <div className="flex flex-col w-full">
                <Topbar
                    setIsRightSidebarOpen={setIsRightSidebarOpen}
                    isRightSidebarOpen={isRightSidebarOpen}
                    setIsLeftSidebarOpen={setIsLeftSidebarOpen}
                    isLeftSidebarOpen={isLeftSidebarOpen}
                />
                <main className='col-span-2 flex-grow'>{children}</main>
            </div>
            <Separator orientation='vertical'/>
            <div className="relative">
                <div
                    className={`Sidebar ${isRightSidebarOpen ? 'w-[400px]' : 'w-[0px]'} transition-width duration-300 ease-in-out`}>
                    {selectedFile && isRightSidebarOpen && (
                        <RightSidebar/>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AppLayout;