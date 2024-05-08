import {Course} from "@/courses/types.ts";
import {isMobile} from "react-device-detect";
import {Flex} from "@mantine/core";
import {NumberRatingBadge} from "@/components/Course";
import {MRT_Column, MRT_ColumnDef} from "mantine-react-table";

const useCoursesTableColumns = () =>{
    const columns: MRT_ColumnDef<Course>[] = [
        {
            header: 'Course',
            accessorKey: 'name',
            grow: true,
            // Cell: (element: Course) => {
            //     return (
            //         <>
            //         <span style={{ fontWeight: 500 }}>
            //             {element.name}{' '}
            //             {isMobile ? (
            //                 <>
            //                     <br /> <span style={{ color: 'var(--mantine-color-dimmed' }}>{element.professor}</span>
            //                 </>
            //             ) : null}
            //         </span>
            //         </>
            //     );
            // },
        },
        {
            header: 'Professor',
            accessorKey: 'professor',
            size: 100,
        },
        {
            header: 'How interesting',
            accessorKey: 'howInterestingRatingAverage',
            size: 60,
            // Cell: (element: Course) => {
            //     return (
            //         <>jig
            //             <Flex align="center" gap="xs">
            //                 <NumberRatingBadge score={element.howInterestingRatingAverage} />
            //             </Flex>
            //         </>
            //     );
            // },
        },
        {
            header: 'How easy',
            accessorKey: 'howEasyRatingAverage',
            size: 50,
            // Cell: (element: Course) => {
            //     return (
            //         <>
            //             <Flex align="center" gap="xs">
            //                 <NumberRatingBadge score={element.howEasyRatingAverage} />
            //             </Flex>
            //         </>
            //     );
            // },
        },
    ];

    return {columns}
}

export {useCoursesTableColumns}