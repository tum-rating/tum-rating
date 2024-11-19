import { PropsWithChildren, useState } from "react";
import RightSidebar from "@/components/right-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import Topbar from "@/components/topbar.tsx";
import LeftSidebar from "@/components/left-sidebar.tsx";

const AppLayout = ({ children }: PropsWithChildren) => {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

    return (
        <div className="w-full h-full flex">
            <div className="relative">
                <LeftSidebar isOpen={isLeftSidebarOpen} />
            </div>
            <Separator orientation='vertical' />
            <div className="flex flex-col w-full">
                <Topbar
                    setIsRightSidebarOpen={setIsRightSidebarOpen}
                    isRightSidebarOpen={isRightSidebarOpen}
                    setIsLeftSidebarOpen={setIsLeftSidebarOpen}
                    isLeftSidebarOpen={isLeftSidebarOpen}
                />
                <main className='col-span-2 flex-grow'>{children}</main>
            </div>
            <Separator orientation='vertical' />
            <div className="relative">
                <RightSidebar isOpen={isRightSidebarOpen} />
            </div>
        </div>
    );
}

export default AppLayout;