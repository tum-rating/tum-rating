import useAppData from '@/hooks/useAppData.tsx';
import {Badge} from "@/components/ui/badge.tsx";

const MainPage = () => {
    const {selectedItemId} = useAppData();

    return (
        <div className="bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" >
            app
            {selectedItemId}
            <div>
                <Badge>1</Badge>
            </div>
        </div>
    );
};

export default MainPage;