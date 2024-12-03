import { useContext } from "react";
import { Button } from "@/components/ui/button.tsx";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { AppDataContext } from "@/context/app-data-context.tsx";
import isCoursesFile from "@/lib/is-courses-file.ts";

interface TopbarProps {
    isRightSidebarOpen: boolean;
    setIsRightSidebarOpen: (isOpen: boolean) => void;
    isLeftSidebarOpen: boolean;
    setIsLeftSidebarOpen: (isOpen: boolean) => void;
}

const Topbar = ({ isRightSidebarOpen, setIsRightSidebarOpen, isLeftSidebarOpen, setIsLeftSidebarOpen }: TopbarProps) => {
    const { selectedFile } = useContext(AppDataContext)!;


    if (!selectedFile) return null;
    const isCoursesFileFlag = isCoursesFile(selectedFile.id);
    return (
        <div className="relative z-10 min-h-[38px] bg-white w-full flex items-center border-b border-1 border-b-border px-2">
            <Button
                variant='outline'
                size='icon'
                data-state={isLeftSidebarOpen ? 'open' : 'closed'}
                onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                className={`mr-auto ${isLeftSidebarOpen ? 'rotate-0' : 'rotate-180'}`}
            >
                <PanelLeftClose className="w-12 h-12" />
            </Button>
            <div className="flex items-center gap-2">

            </div>
            <Button
                variant='outline'
                disabled={!isCoursesFileFlag}
                size='icon'
                data-state={isRightSidebarOpen ? 'open' : 'closed'}
                onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                className={`ml-auto ${isRightSidebarOpen ? 'rotate-0' : 'rotate-180'}`}
            >
                <PanelRightClose className="w-12 h-12" />
            </Button>
        </div>
    );
}

export default Topbar;