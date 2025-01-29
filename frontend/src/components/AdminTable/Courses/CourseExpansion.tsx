import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Divider,
    Flex,
    JsonInput,
    Modal,
    Stack,
    Tabs,
    TagsInput,
    Text,
    TextInput,
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {IconEditCircle, IconPlus, IconTrashX, IconX} from '@tabler/icons-react';
import {MRT_Row} from 'mantine-react-table';
import {HTMLAttributes, useEffect, useState} from 'react';

import classes from '../Shared/styles/ExpansionStyles.module.css';

import {useAddGradesToCourse} from '@/admin/courses/useAddGradesToCourse.tsx';
import {useEditCourse} from '@/admin/courses/useEditCourse.tsx';
import {useRemoveCourse} from '@/admin/courses/useRemoveCourse.tsx';
import {CollectionDetailsReviewsSection} from '@/components/AdminTable/Shared/CollectionDetailsReviewsSection';
import {CollectionDetailsStatusAlert} from '@/components/AdminTable/Shared/CollectionDetailsStatusAlert';
import {Skeleton} from '@/components/Skeleton';
import {Course} from '@/courses/types.ts';
import {useDetailCourse} from '@/courses/useCourse.tsx';
import {getPath, Paths} from '@/routes/paths.ts';
import {CopyButton} from "@/components/CopyButton";

interface CourseExpansionProps extends HTMLAttributes<HTMLElement> {
    courseId: string;
    row?: MRT_Row<Course>;
}

const CourseExpansion = ({courseId, row, ...rest}: CourseExpansionProps) => {
    const {data: courseDetails, isLoading, isError, error, refetch} = useDetailCourse(courseId);

    const {mutate: editCourse} = useEditCourse();
    const {mutate: removeCourse, isSuccess: removeCourseIsSuccess} = useRemoveCourse();
    const {mutate: addGradesToCourse} = useAddGradesToCourse();
    const [jsonInputs, setJsonInputs] = useState([{id: "1", value: ''}]);
    const [activeTab, setActiveTab] = useState("1");

    const [editing, setEditing] = useState(false);
    const [statusAlertFlag, setStatusAlertFlag] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);

    useEffect(() => {
        if (courseDetails) {
            ['id', 'courseId', 'courseNumber', 'name', 'professor', 'otherLecturers', 'offeredInSemesters'].forEach((x) => {
                form.setFieldValue(x, courseDetails[x]);
            });
        }

    }, [courseDetails]);

    const form = useForm({
        initialValues: {
            courseId: '',
            courseNumber: '',
            name: '',
            professor: '',
            otherLecturers: [],
            offeredInSemesters: [],
            id: '',
        },
        validate: {
            courseId: (value) => !value && 'Course ID is required',
            courseNumber: (value) => !value && 'Course Number is required',
            name: (value) => !value && 'Course Name is required',
            professor: (value) => !value && 'Main Professor is required',
            offeredInSemesters: (value) => !value.length && 'Semester is required',
        },
    });

    useEffect(() => {
        setStatusAlertFlag(isError || removeCourseIsSuccess);
    }, [isError || removeCourseIsSuccess]);

    const handleAddTab = () => {
        const newId = String(jsonInputs.length ? Number(jsonInputs[jsonInputs.length - 1].id) + 1 : 1);
        setJsonInputs([...jsonInputs, {id: newId, value: ''}]);
        setActiveTab(String(newId));
    };

    const handleJsonInputChange = (id, value) => {
        setJsonInputs(jsonInputs.map(input => input.id === id ? {...input, value} : input));
    };

    const handleRemoveTab = (id) => {
        setJsonInputs(jsonInputs.filter(input => input.id !== id));
        setActiveTab(null)
    };

    const handleSubmit = () => {
        jsonInputs.forEach(input => {
            if (input.value === '') return;
            addGradesToCourse({courseId, ...JSON.parse(input.value)});
        });
        setModalOpened(false);
    };

    return (
        <Flex wrap={{base: 'wrap', sm: 'nowrap'}} className={classes.expansionContainer} gap="md" {...rest}>
            {statusAlertFlag ? (
                <Flex justify="center" w="100%" direction="column" gap="lg">
                    <CollectionDetailsStatusAlert status={isError} message={error?.message} type="error"/>
                    <CollectionDetailsStatusAlert status={removeCourseIsSuccess} message="Course removed"
                                                  type="success"/>
                    {isError && (
                        <Button
                            variant="subtle"
                            onClick={() => {
                                refetch();
                            }}
                        >
                            Refetch
                        </Button>
                    )}
                </Flex>
            ) : (
                <>
                    <Flex direction="column" gap="xs" className={classes.expansionDetails}>
                        <Flex align="center" gap="xs" wrap="wrap">
                            <Text fz="sm" fw={500}>
                                Details
                            </Text>
                        </Flex>
                        <Divider variant="dashed" size="sm"/>
                        <Flex direction="column" gap="xs">
                            <Flex justify="flex-start" gap="xs" wrap="wrap">
                                <Flex align="center" gap="3">
                                    <Text style={{whiteSpace: 'nowrap'}} fz="xs" fw="bold">
                                        Course ID:{' '}
                                    </Text>
                                    <Skeleton
                                        width={155}
                                        height={16}
                                        radius="sm"
                                        loading={isLoading}
                                        component={
                                            <>
                                                <Button
                                                    px={4}
                                                    m={0}
                                                    h={20}
                                                    variant="subtle"
                                                    fz="xs"
                                                    fw="600"
                                                    c={'blue'}
                                                    onClick={() => {
                                                        const dynamicPath = getPath(Paths.adminCoursesDetails).replace(':adminCourseId', courseId);
                                                        window.open(dynamicPath, '_blank');
                                                    }}
                                                >
                                                    {courseId}
                                                </Button>
                                                <CopyButton value={courseId}/>
                                            </>
                                        }
                                    ></Skeleton>
                                </Flex>
                                <Flex align="center" gap="3">
                                    <Text style={{whiteSpace: 'nowrap'}} fz="xs" fw="bold">
                                        Created at:{' '}
                                    </Text>
                                    <Skeleton
                                        width={155}
                                        height={16}
                                        radius="sm"
                                        loading={isLoading}
                                        component={
                                            <Text truncate fz="xs" fw="600" c="dimmed">
                                                {new Date(courseDetails?.createdAt).toLocaleString()}
                                            </Text>
                                        }
                                    ></Skeleton>
                                </Flex>
                            </Flex>
                            <form>
                                <Flex wrap="wrap" gap="xs" direction="column">
                                    <Skeleton height={36} radius="sm" mt={22} loading={isLoading}
                                              component={<TextInput label="Course Name" disabled={!editing}
                                                                    placeholder="Enter course name"
                                                                    value={form.values.name} error={form.errors.name}
                                                                    onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}/>}></Skeleton>
                                    <Flex gap="xs" wrap={{base: 'wrap', sm: 'nowrap'}} w="100%">
                                        <Skeleton height={36} radius="sm" mt={22} loading={isLoading}
                                                  component={<TextInput w={{base: '100%', sm: '50%'}}
                                                                        disabled={!editing} label="Course ID"
                                                                        placeholder="Enter course id"
                                                                        value={form.values.courseId}
                                                                        error={form.errors.courseId}
                                                                        onChange={(event) => form.setFieldValue('courseId', event.currentTarget.value)}/>}></Skeleton>
                                        <Skeleton height={36} radius="sm" mt={22} loading={isLoading}
                                                  component={<TextInput w={{base: '100%', sm: '50%'}}
                                                                        disabled={!editing} label="Course Number"
                                                                        placeholder="Enter course number"
                                                                        value={form.values.courseNumber}
                                                                        error={form.errors.courseNumber}
                                                                        onChange={(event) => form.setFieldValue('courseNumber', event.currentTarget.value)}/>}></Skeleton>
                                    </Flex>

                                    <Flex direction="column" gap="xs" w="100%">
                                        <Skeleton height={36} radius="sm" mt={22} loading={isLoading}
                                                  component={<TextInput label="Main Professor" disabled={!editing}
                                                                        placeholder="Enter professor name"
                                                                        value={form.values.professor}
                                                                        error={form.errors.professor}
                                                                        onChange={(event) => form.setFieldValue('professor', event.currentTarget.value)}/>}></Skeleton>
                                    </Flex>
                                    <Flex gap="xs" wrap={{base: 'wrap', sm: 'nowrap'}} w="100%">
                                        <Skeleton
                                            height={104}
                                            radius="sm"
                                            mt={22}
                                            loading={isLoading}
                                            component={
                                                <TagsInput
                                                    w={{base: '100%', sm: '50%'}}
                                                    disabled={!editing}
                                                    label="Semester"
                                                    error={form.errors.offeredInSemesters}
                                                    placeholder="Click enter to add semester"
                                                    value={form.values.offeredInSemesters}
                                                    onRemove={(value) => {
                                                        form.setFieldValue(
                                                            'offeredInSemesters',
                                                            form.values.offeredInSemesters.filter((v) => v !== value),
                                                        );
                                                    }}
                                                    onOptionSubmit={(value) => {
                                                        form.setFieldValue('offeredInSemesters', [...form.values.offeredInSemesters, value]);
                                                    }}
                                                />
                                            }
                                        ></Skeleton>
                                        <Skeleton
                                            height={104}
                                            radius="sm"
                                            mt={22}
                                            loading={isLoading}
                                            component={
                                                <TagsInput
                                                    w={{base: '100%', sm: '50%'}}
                                                    disabled={!editing}
                                                    label="Other professors"
                                                    placeholder="Click enter to add other professors"
                                                    value={form.values.otherLecturers}
                                                    error={form.errors.otherLecturers}
                                                    onRemove={(value) => {
                                                        form.setFieldValue(
                                                            'otherLecturers',
                                                            form.values.otherLecturers.filter((v) => v !== value),
                                                        );
                                                    }}
                                                    onOptionSubmit={(value) => {
                                                        form.setFieldValue('otherLecturers', [...form.values.otherLecturers, value]);
                                                    }}
                                                />
                                            }
                                        ></Skeleton>
                                    </Flex>
                                </Flex>
                            </form>
                        </Flex>
                    </Flex>
                    <CollectionDetailsReviewsSection courseId={courseId}/>
                    <Flex direction="column" gap="xs" className={classes.expansionActions}>
                        <Flex align="center" gap="xs">
                            <Text fz="sm" fw={500}>
                                Actions
                            </Text>
                        </Flex>
                        <Stack gap="xs">
                            <Button
                                color="green"
                                leftSection={<IconEditCircle width={16}/>}
                                onClick={() => {
                                    if (editing) {
                                        editCourse(form.values);
                                        setEditing(false);
                                    } else {
                                        setEditing(true);
                                    }
                                }}
                                variant="default"
                            >
                                {!editing ? 'Edit Course' : 'Save Course'}
                            </Button>
                            <Button
                                onClick={() => {
                                    try {
                                        removeCourse(courseId);
                                    } catch (e) {
                                    } finally {
                                        row && row.toggleExpanded();
                                    }
                                }}
                                leftSection={<IconTrashX width={16}/>}
                                color="red"
                            >
                                Remove Course
                            </Button>
                            <Button
                                onClick={() => setModalOpened(true)}
                                leftSection={<IconPlus width={16}/>}
                                color="blue"
                            >
                                Add/Edit Grades
                            </Button>
                        </Stack>
                    </Flex>
                </>
            )}
            <Modal.Root opened={modalOpened}
                        size={'80%'}
                        onClose={() => setModalOpened(false)}
                        closeOnClickOutside={false}>
                <Modal.Overlay/>
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>Add/Edit JSON</Modal.Title>
                        <Modal.CloseButton/>
                    </Modal.Header>
                    <Modal.Body w={'100%'}>
                        <Flex w={'100%'}>
                            <Tabs value={activeTab} onChange={setActiveTab} w={'100%'}>
                                <Tabs.List>
                                    {courseDetails?.examStats && (
                                        <Tabs.Tab value="examStats">Exam Stats</Tabs.Tab>
                                    )}
                                    {jsonInputs.map(input => (
                                        <Tabs.Tab key={input.id} value={input.id}>
                                            <Flex align={'center'} gap={2}>
                                                {`JSON ${input.id}`}
                                                <ActionIcon variant='subtle' size={'sm'} color={'red'}
                                                            onClick={() => handleRemoveTab(input.id)} ml={4}>
                                                    <IconX size={15}/>
                                                </ActionIcon>
                                            </Flex>
                                        </Tabs.Tab>
                                    ))}
                                    <ActionIcon onClick={handleAddTab} ml={'auto'}>
                                        <IconPlus size={16}/>
                                    </ActionIcon>
                                </Tabs.List>
                                {courseDetails?.examStats && (
                                    <Tabs.Panel value="examStats">
                                        <Box my={20} mt={10} style={{
                                            maxHeight: 500,
                                            height: "100%",
                                            overflowY: "scroll",
                                            position: 'relative'
                                        }}>
                                            <JsonInput
                                                value={JSON.stringify(courseDetails.examStats, null, 2)}
                                                readOnly
                                                style={{
                                                    border: "none"
                                                }}
                                                autosize
                                                label="Exam Stats"
                                                placeholder="Exam Stats JSON"
                                            />
                                        </Box>
                                    </Tabs.Panel>
                                )}
                                {jsonInputs.map(input => (
                                    <Tabs.Panel key={input.id} value={input.id}>
                                        <Box my={20} mt={10} style={{
                                            maxHeight: 500,
                                            height: "100%",
                                            overflowY: "scroll",
                                            position: 'relative'
                                        }}>
                                            <JsonInput
                                                value={input.value}
                                                onChange={(value) => handleJsonInputChange(input.id, value)}
                                                style={{
                                                    border: "none"
                                                }}
                                                autosize
                                                label={`Grades in JSON ${input.id}`}
                                                placeholder="Enter JSON"
                                            />
                                        </Box>
                                    </Tabs.Panel>
                                ))}
                                <Tabs.Panel value={'null'}>
                                    <Text>No tab selected</Text>
                                </Tabs.Panel>
                            </Tabs>
                        </Flex>
                        <Flex py={2} direction={'row'} justify={'space-between'}>
                            <Flex direction='column' gap={2}>
                                <Text size={'xs'} fw={'bold'}>
                                    Semesters from examStats:
                                </Text>
                                <Flex gap={4}>
                                    {
                                        Object.entries(courseDetails.examStats)
                                            .flatMap(([semester, exams]) =>
                                                Object.entries(exams).map(([examType]) => ({
                                                    semester,
                                                    examType,
                                                }))
                                            )
                                            .sort((a, b) => {
                                                const [yearA, seasonA] = a.semester.split(' ');
                                                const [yearB, seasonB] = b.semester.split(' ');
                                                if (yearA !== yearB) {
                                                    return parseInt(yearB) - parseInt(yearA);
                                                }
                                                if (seasonA !== seasonB) {
                                                    return seasonA === 'W' ? -1 : 1;
                                                }
                                                return a.examType === 'endterm' ? -1 : 1;
                                            }).map((item, index) => {
                                            return (
                                                <Badge
                                                    variant="gradient"
                                                    gradient={item.examType === "retake" ? {
                                                        from: 'yellow',
                                                        to: 'orange',
                                                        deg: 90
                                                    } : {
                                                        from: 'indigo',
                                                        to: 'blue',
                                                        deg: 90
                                                    }}
                                                    key={index}
                                                >
                                                    {item.semester} {item.examType}
                                                </Badge>
                                            )
                                        })

                                    }
                                </Flex>
                            </Flex>
                            <Button onClick={handleSubmit}>
                                Submit added JSON
                            </Button>
                        </Flex>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
        </Flex>
    );
};

export {CourseExpansion};