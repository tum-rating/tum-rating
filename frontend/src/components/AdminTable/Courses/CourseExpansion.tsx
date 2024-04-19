import {Flex,Alert, Button, Center, Text} from "@mantine/core";
import {IconDatabaseX} from "@tabler/icons-react";

import {Course} from "@/courses/types.ts";
import {useDetailCourse} from "@/courses/useCourse.tsx";


interface CourseExpansionProps {
    course: Course;
    editing: boolean;
}

const CourseExpansion = ({course, editing}: CourseExpansionProps) => {
    const {data: courseDetails, isLoading, error, isError, refetch} = useDetailCourse(course.courseId);

    return (
        <Flex wrap={{base: "wrap", sm: "nowrap"}} px="42" pt="lg" pb="xl" gap="md" style={{
            background: "var(--striped-background)"
        }}>
            {isError ? (
                <Center h={270}>
                    <Flex direction="column">
                        <Text fw={600}>Error occurred - {course._id}</Text>
                        <Alert variant="light" color="red" title="Alert title"
                               icon={<IconDatabaseX height={120} width={120}/>}>
                            {error?.message || "An error occurred while fetching the data - error message not provided"}
                        </Alert>
                        <Button variant={"white"} c="black" onClick={() => {
                            refetch()
                        }}>Refetch</Button>
                    </Flex>
                </Center>

            ) : (
                <></>

            )
            }
        </Flex>
    )
}

export {CourseExpansion}

