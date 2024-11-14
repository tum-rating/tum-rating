import { Button } from "@/components/ui/button.tsx";
import { PanelRightClose } from "lucide-react";

interface TopbarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const Topbar = ({ isSidebarOpen, setIsSidebarOpen }: TopbarProps) => {
    return (
        <div className="relative z-10 min-h-[38px] bg-white w-full flex items-center border-b border-1 border-b-border px-2">
                <Button
                    variant='outline'
                    size='icon'
                    data-state={isSidebarOpen ? 'open' : 'closed'}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`ml-auto ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`}
                >
                    <PanelRightClose className="w-12 h-12" />
                </Button>
        </div>
    );
}

export default Topbar;