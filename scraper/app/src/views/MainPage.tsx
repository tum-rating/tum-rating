import useAppData from '@/hooks/useAppData.tsx';
import MergedCourseCard from "@/components/merged-course-card.tsx";

const MainPage = () => {
    const {selectedItemId, getSelectedItemById} = useAppData();
    const selectedCourse = getSelectedItemById(selectedItemId);


    if (!selectedCourse) {
        return (
            <div className="flex justify-center items-center h-full w-full relative">
                <div
                    className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"/>
                <div className="relative font-bold text-lg ">No course selected</div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-full overflow-y-hidden">
            <div
                className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"/>

            <MergedCourseCard course={selectedCourse}/>
        </div>
    );
};

export default MainPage;