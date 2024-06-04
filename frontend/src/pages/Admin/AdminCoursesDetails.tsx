import {useParams} from 'react-router-dom';

import { AdminCollectionDetailsWrapper } from '@/components/AdminCollectionDetailsWrapper';
import {CourseExpansion} from "@/components/AdminTable/Courses/CourseExpansion.tsx";

const AdminCoursesDetails = () => {
    const { adminCourseId: id} = useParams();
    return (
        <AdminCollectionDetailsWrapper>
            <CourseExpansion courseId={id} style={{
                borderRadius: "var(--mantine-radius-xs)"
            }} />
        </AdminCollectionDetailsWrapper>
    );
};

export { AdminCoursesDetails };
