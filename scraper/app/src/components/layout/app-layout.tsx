import {PropsWithChildren} from "react";
import Sidebar from "@/components/sidebar.tsx";

const AppLayout = ({children}: PropsWithChildren) => {
    return (
        <div className="w-full h-full grid grid-cols-2 grid-flow-col-dense">
            <main className='col-span-2'>{children}</main>
            <Sidebar/>
        </div>
    );
}

export default AppLayout;