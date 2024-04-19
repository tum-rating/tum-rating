import {
    Alert,
    Autocomplete,
    Button,
    Center,
    Divider,
    Flex,
    Pill,
    PillsInput,
    Stack,
    Text,
    TextInput
} from "@mantine/core";
import {IconDatabaseX, IconEditCircle, IconTrashX} from "@tabler/icons-react";
import {useState} from "react";

import {Course} from "@/admin/types.ts";
import {Skeleton} from "@/components/Skeleton";

interface CourseExpansionProps {
    course: Course;
    editing: boolean;
}

const CourseExpansion = ({course: ICourse, editing: IEditing}: CourseExpansionProps) => {
    // Temporary values - no endpoint for this
    const isError = false
    const error = {message: ""}
    const isLoading = false
    const refetch = () => {
    }
    //---

    const [courseDetails, setCourseDetails] = useState<Course>(ICourse);
    const [editing] = useState(IEditing);
    const [newLecturer, setNewLecturer] = useState('');

    return (
        <Flex wrap={{base: "wrap", sm: "nowrap"}} px="42" pt="lg" pb="xl" gap="md" style={{
            background: "var(--striped-background)"
        }}>
            {isError ? (
                <Center h={270}>
                    <Flex direction="column">
                        <Text fw={600}>Error occurred - {ICourse._id}</Text>
                        <Alert variant="light" color="red" title="Alert title"
                               icon={<IconDatabaseX height={120} width={120}/>}>
                            {error?.message || "An error occurred while fetching the data - error message not provided"}
                        </Alert>
                        <Button variant={"white"} c="black" onClick={() => {
                            refetch()
                        }}>Refetch</Button>
                    </Flex>
                </Center>

            ) : <>
                <Flex direction="column" w="80%" gap="xs">
                    <Flex align="center" gap="xs" wrap="wrap">
                        <Text fz="sm" fw={500}>Details</Text>
                    </Flex>
                    <Divider variant="dashed" size="sm"/>
                    <Flex direction="column" gap="xs">
                        <Flex justify="flex-start" gap="xs" wrap="wrap">
                            <Flex align="center" gap="3">
                                <Text style={{whiteSpace: "nowrap"}} fz="xs" fw="bold">Course ID: </Text>
                                <Skeleton
                                    width={155}
                                    height={16}
                                    radius="sm"
                                    loading={isLoading}
                                    component={
                                        <Text truncate fz="xs" fw="600" c="dimmed">{courseDetails?.courseId}</Text>
                                    }>
                                </Skeleton>
                            </Flex>
                            <Flex align="center" gap="3">
                                <Text style={{whiteSpace: "nowrap"}} fz="xs" fw="bold">Created at: </Text>
                                <Skeleton
                                    width={155}
                                    height={16}
                                    radius="sm"
                                    loading={isLoading}
                                    component={
                                        <Text truncate fz="xs" fw="600" c="dimmed">{new Date(courseDetails?.createdAt).toLocaleString()}</Text>
                                    }>
                                </Skeleton>
                            </Flex>
                        </Flex>
                        <form>
                            <Flex wrap="wrap" gap="xs" direction="column">
                                <Skeleton
                                    height={36}
                                    radius="sm"
                                    mt={22}
                                    loading={isLoading}
                                    component={
                                        <TextInput
                                            disabled={!editing}
                                            value={courseDetails?.name}
                                            label="Course Name"
                                            placeholder="Enter course name"
                                            onChange={(event) => setCourseDetails({
                                                ...courseDetails,
                                                name: event.currentTarget.value
                                            })}/>
                                    }>

                                </Skeleton>
                                <Flex gap="xs" wrap={{base: "wrap", sm: "nowrap"}}>
                                    <Flex direction="column" gap="xs" w={{base: "100%", sm: "40%"}}>
                                        <Skeleton
                                            height={36}
                                            radius="sm"
                                            mt={22}
                                            loading={isLoading}
                                            component={
                                                <Autocomplete
                                                    disabled={!editing}
                                                    label="Semester"
                                                    placeholder="Select semester"
                                                    data={['2023 S']}
                                                    value={courseDetails?.offeredInSemesters[0]}
                                                    onChange={(value) => setCourseDetails({
                                                        ...courseDetails,
                                                        offeredInSemesters: [value]
                                                    })}
                                                />
                                            }>

                                        </Skeleton>
                                        <Skeleton
                                            height={36}
                                            radius="sm"
                                            mt={22}
                                            loading={isLoading}
                                            component={
                                                <TextInput
                                                    disabled={!editing}
                                                    value={courseDetails?.professor}
                                                    label="Main Professor"
                                                    placeholder="Enter professor name"
                                                    onChange={(event) => setCourseDetails({
                                                        ...courseDetails,
                                                        professor: event.currentTarget.value
                                                    })}
                                                />}>
                                        </Skeleton>
                                    </Flex>
                                    <Skeleton
                                        height={104}
                                        radius="sm"
                                        mt={22}
                                        loading={isLoading}
                                        component={
                                            <PillsInput
                                                w={{base: "100%", sm: "100%"}}
                                                disabled={!editing}
                                                multiline
                                                label="Other Professors"
                                            >
                                                <Pill.Group h={91} style={{alignItems: "flex-start"}}>
                                                    {
                                                        courseDetails?.otherLecturers.map((lecturer: string) => (
                                                            <Pill disabled={!editing} key={lecturer}
                                                                  withRemoveButton
                                                                  onRemove={() => {
                                                                      setCourseDetails({
                                                                          ...courseDetails,
                                                                          otherLecturers: courseDetails.otherLecturers.filter((l) => l !== lecturer)
                                                                      });
                                                                  }}>{lecturer}</Pill>
                                                        ))
                                                    }
                                                    <PillsInput.Field
                                                        disabled={!editing}
                                                        onChange={(event) => setNewLecturer(event.currentTarget.value)}
                                                        onKeyDown={(event) => {
                                                            if (event.key === 'Enter') {
                                                                if (newLecturer.length <= 3) return;
                                                                if (courseDetails.otherLecturers.includes(newLecturer)) return;
                                                                setCourseDetails({
                                                                    ...courseDetails,
                                                                    otherLecturers: [...courseDetails.otherLecturers, event.currentTarget.value]
                                                                });
                                                                setNewLecturer('');
                                                            }
                                                        }}
                                                        value={newLecturer}
                                                        placeholder=""/>
                                                </Pill.Group>
                                            </PillsInput>}>
                                    </Skeleton>
                                </Flex>
                            </Flex>
                        </form>
                    </Flex>
                </Flex>
                <Flex direction="column" gap="xs">
                    <Flex align="center" gap="xs">
                        <Text fz="sm" fw={500}>Actions</Text>
                    </Flex>
                    <Stack gap="xs">
                        <Button disabled onClick={() => {
                        }} leftSection={<IconTrashX width={16}/>} color="red">Remove Course</Button>
                        <Button color="green" disabled leftSection={<IconEditCircle width={16}/>}
                                onClick={() => {
                                }} variant="default">{!editing ? "Edit Course" : "Save Course"}</Button>
                    </Stack>

                </Flex>
            </>}
        </Flex>
    );
};

export {CourseExpansion}

