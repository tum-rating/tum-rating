import useAppData from '@/hooks/useAppData.tsx';
import MergedCourseCard from "@/components/merged-course-card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft, ArrowRight} from "lucide-react";

const MainPage = () => {
    const { selectedItemId, getSelectedItemById } = useAppData();
    const selectedCourse = getSelectedItemById(selectedItemId);


    if(!selectedCourse){
        return (
            <div className="flex justify-center items-center h-full w-full">
                <div className="text-2xl">No course selected</div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-full">
            <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="flex justify-between relative z-10 w-[720px] my-auto">
                <Button>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="text-2xl font-bold max-w-xl truncate">{selectedCourse.name}</div>
                <Button>
                    <ArrowRight className="w-6 h-6" />
                </Button>
            </div>
            <MergedCourseCard course={selectedCourse} />
        </div>
    );
};

export default MainPage;