import {PropsWithChildren, useState} from "react";
import Sidebar from "@/components/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {PanelRightClose} from "lucide-react";

const AppLayout = ({children}: PropsWithChildren) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <div className="w-full h-full grid grid-cols-2 grid-flow-col-dense">
            <main className='col-span-2'>{children}</main>
            <Separator orientation='vertical'/>
            <div className="relative">
                <Button
                    variant='default'
                    size='icon'
                    data-state={isSidebarOpen ? 'open' : 'closed'}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`
                    absolute top-3 left-[calc(-40px)] z-10 
                    shadow-md transition-transform transform hover:scale-105 hover:shadow-lg ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`}
                >
                    <PanelRightClose className="w-12 h-12"/>
                </Button>
                <Sidebar isOpen={isSidebarOpen}/>
            </div>

        </div>
    );
}

export default AppLayout;