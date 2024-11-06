import {FetchedComputedCourse, FetchedCourse} from "@/types/fetchedData.ts";

interface ComputedCoursesListItemProps {
    data: FetchedComputedCourse;
}

const ComputedCoursesListItem = ({data}: ComputedCoursesListItemProps) => {
    return (
        <div>
            <span>{data.name}</span>
        </div>
    )
}

export default ComputedCoursesListItem;