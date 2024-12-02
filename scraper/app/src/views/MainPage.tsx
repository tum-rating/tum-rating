import { useContext } from "react";
import { AppDataContext } from "@/context/app-data-context.tsx";
import SelectedFileCard from "@/components/selected-file-card.tsx";
import MergedCourseCard from "@/components/merged-course-card.tsx";

const MainPage = () => {
    const { selectedFile, selectedCourse } = useContext(AppDataContext)!;
    return (
        <div className="relative w-full h-full overflow-y-hidden">
            <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            {selectedFile ? (
                selectedCourse ? (
                    <>
                        dd
                    </>
                    // <MergedCourseCard course={selectedCourse || null} />
                ) : (
                    <SelectedFileCard />
                )
            ) : (
                <div className="flex justify-center items-center h-full w-full relative">
                    <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    <div className="relative font-bold text-lg">No file selected</div>
                </div>
            )}
        </div>
    );
};

export default MainPage;