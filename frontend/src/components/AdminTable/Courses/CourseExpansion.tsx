import {
    Button,
    Divider,
    Flex,
    Grid, JsonInput,
    Modal,
    NumberInput,
    Select,
    Stack,
    Switch,
    TagsInput,
    Text,
    Textarea,
    TextInput
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {IconEditCircle, IconPlus, IconTrashX} from '@tabler/icons-react';
import {MRT_Row} from 'mantine-react-table';
import {HTMLAttributes, useEffect, useState} from 'react';

import classes from '../Shared/styles/ExpansionStyles.module.css';

import {useEditCourse} from '@/admin/courses/useEditCourse.tsx';
import {useRemoveCourse} from '@/admin/courses/useRemoveCourse.tsx';
import {useAddGradesToCourse} from '@/admin/courses/useAddGradesToCourse.tsx';
import {CollectionDetailsReviewsSection} from '@/components/AdminTable/Shared/CollectionDetailsReviewsSection';
import {CollectionDetailsStatusAlert} from '@/components/AdminTable/Shared/CollectionDetailsStatusAlert';
import {Skeleton} from '@/components/Skeleton';
import {Course} from '@/courses/types.ts';
import {useDetailCourse} from '@/courses/useCourse.tsx';
import {getPath, Paths} from '@/routes/paths.ts';


interface CourseExpansionProps extends HTMLAttributes<HTMLElement> {
    courseId: string;
    row?: MRT_Row<Course>;
}

const CourseExpansion = ({courseId, row, ...rest}: CourseExpansionProps) => {
    const {data: courseDetails, isLoading, isError, error, refetch} = useDetailCourse(courseId);

    const {mutate: editCourse} = useEditCourse();
    const {mutate: removeCourse, isSuccess: removeCourseIsSuccess} = useRemoveCourse();
    const {mutate: addGradesToCourse} = useAddGradesToCourse();
    const [useJson, setUseJson] = useState(true);
    const [jsonInput, setJsonInput] = useState('');

    const [editing, setEditing] = useState(false);
    const [statusAlertFlag, setStatusAlertFlag] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    const [grades, setGrades] = useState([
        {grade: '1.0', people: 0},
        {grade: '1.3', people: 0},
        {grade: '1.7', people: 0},
        {grade: '2.0', people: 0},
        {grade: '2.3', people: 0},
        {grade: '2.7', people: 0},
        {grade: '3.0', people: 0},
        {grade: '3.3', people: 0},
        {grade: '3.7', people: 0},
        {grade: '4.0', people: 0},
        {grade: '4.3', people: 0},
        {grade: '4.7', people: 0},
        {grade: '5.0', people: 0},
        {grade: '6.0', people: 0},
    ]);

    useEffect(() => {
        if (courseDetails) {
            ['id', 'courseId', 'courseNumber', 'name', 'professor', 'otherLecturers', 'offeredInSemesters'].forEach((x) => {
                form.setFieldValue(x, courseDetails[x]);
            });
            if(courseDetails.examStats){
                setJsonInput(JSON.stringify(courseDetails.examStats));
            }
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

    const gradesForm = useForm({
        initialValues: {
            semester: '',
            examType: '',
        },
        validate: {
            semester: (value) => !value && 'Semester is required',
            examType: (value) => !value && 'Exam Type is required',
        },
    });

    useEffect(() => {
        setStatusAlertFlag(isError || removeCourseIsSuccess);
    }, [isError || removeCourseIsSuccess]);

    const handleAddGrades = (values: { semester: string, examType: string }) => {
        if (useJson) {
            addGradesToCourse({courseId, ...jsonInput});

        } else {
            addGradesToCourse({courseId, ...values, grades});
            setModalOpened(false);
        }
    };

    const handleGradeChange = (index: number, field: string, value: any) => {
        const newGrades = [...grades];
        newGrades[index][field] = value;
        setGrades(newGrades);
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
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Add/Edit Grades"
            >


                <Switch
                    label={'Use JSON'}
                    checked={useJson}
                    onChange={(event) => setUseJson(event.currentTarget.checked)}
                />


                {
                    useJson ? (
                        <Flex direction='column'>

                            <JsonInput
                                value={jsonInput}
                                style={{marginTop:"10px"}}
                                onChange={setJsonInput}
                                minRows={10}
                                autosize
                                placeholder="Enter JSON"
                            />
                            <Button onClick={()=>{
                                addGradesToCourse({courseId, ...JSON.parse(jsonInput)});
                                setModalOpened(false);
                            }}>
                                Submit
                            </Button>
                        </Flex>

                        ) :

                        <form onSubmit={gradesForm.onSubmit(handleAddGrades)}>
                            <Select
                                label="Semester"
                                placeholder="Select semester"
                                data={[
                                    {value: '2021 W', label: '2021 W'},
                                    {value: '2021 S', label: '2021 S'},
                                    {value: '2022 W', label: '2022 W'},
                                    {value: '2022 S', label: '2022 S'},
                                    {value: '2023 W', label: '2023 W'},
                                    {value: '2023 S', label: '2023 S'},
                                    {value: '2024 W', label: '2024 W'},
                                    {value: '2024 S', label: '2024 S'},
                                    {value: '2025 W', label: '2025 W'},
                                    {value: '2025 S', label: '2025 S'},
                                ]}
                                {...gradesForm.getInputProps('semester')}
                            />
                            <Select
                                label="Exam Type"
                                placeholder="Select exam type"
                                data={[
                                    {value: 'endterm', label: 'Endterm'},
                                    {value: 'retake', label: 'Retake'},
                                ]}
                                {...gradesForm.getInputProps('examType')}
                            />
                            <Divider my="md"/>
                            <Grid>
                                {grades.map((item, index) => (
                                    <Grid.Col span={4} key={index}>
                                        <Flex align="center" gap="xs" p={2}>
                                            <TextInput
                                                label="Grade"
                                                value={item.grade}
                                                readOnly
                                                disabled
                                            />
                                            <NumberInput
                                                label="People"
                                                placeholder="Enter number of people"
                                                value={item.people}
                                                onChange={(value) => handleGradeChange(index, 'people', value)}
                                            />
                                        </Flex>
                                    </Grid.Col>
                                ))}
                            </Grid>
                            <Button type="submit" mt="md">
                                Submit
                            </Button>
                        </form>

                }

            </Modal>
        </Flex>
    );
};

export {CourseExpansion};
