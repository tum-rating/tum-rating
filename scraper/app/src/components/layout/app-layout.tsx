import {PropsWithChildren, useState} from "react";
import Sidebar from "@/components/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import Topbar from "@/components/topbar.tsx";

const AppLayout = ({children}: PropsWithChildren) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <div className="w-full h-full flex">
            <div className="flex flex-col w-full">
                <Topbar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen}/>
                <main className='col-span-2 flex-grow'>{children}</main>
            </div>
            <Separator orientation='vertical'/>
            <div className="relative">
                <Sidebar isOpen={isSidebarOpen}/>
            </div>

        </div>
    );
}

export default AppLayout;