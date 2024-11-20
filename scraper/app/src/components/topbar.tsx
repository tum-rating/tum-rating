import { useContext } from "react";
import { Button } from "@/components/ui/button.tsx";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { AppDataContext } from "@/context/app-data-context.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

interface TopbarProps {
    isRightSidebarOpen: boolean;
    setIsRightSidebarOpen: (isOpen: boolean) => void;
    isLeftSidebarOpen: boolean;
    setIsLeftSidebarOpen: (isOpen: boolean) => void;
}

const Topbar = ({ isRightSidebarOpen, setIsRightSidebarOpen, isLeftSidebarOpen, setIsLeftSidebarOpen }: TopbarProps) => {
    const { users, currentUserId } = useContext(AppDataContext);

    console.log(currentUserId)
    console.log(users)
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
                {users.map(user => (
                    <div key={user.id} className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar className={`h-6 w-6 ${user.id === currentUserId ? 'border-2 border-blue-500' : 'border-2 border-gray-900'}`}>
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                {user.nickname}
                            </TooltipContent>
                        </Tooltip>
                        {user.selectedFile && <span className="text-sm">{user.selectedFile}</span>}
                    </div>
                ))}
            </div>
            <Button
                variant='outline'
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