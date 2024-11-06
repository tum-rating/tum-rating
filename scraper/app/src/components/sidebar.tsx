import VirtualList from "@/components/ui/virtual-list.tsx";
import useAppData from "@/hooks/useAppData.tsx";
import {useEffect, useState} from "react";
import {FetchedComputedCourse} from "@/types/fetchedData.ts";
import ComputedCoursesListItem from "@/components/computed-courses-list-item.tsx";

const Sidebar = () => {
    const {appData, isPending,computedDataToCheck} = useAppData();
    const [computedCourses, setComputedCourses] = useState<FetchedComputedCourse[]>([]);
    useEffect(() => {
        if (appData) {
            setComputedCourses(computedDataToCheck);
        }
    }, [appData]);
    return (
        <div className="Sidebar">
           <VirtualList data={computedCourses} renderer={(row)=> <ComputedCoursesListItem data={row}/>} />
        </div>
    )
}

export default Sidebar