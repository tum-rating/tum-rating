import {Button, Divider, Flex, Stack, TagsInput, Text, TextInput} from '@mantine/core';
import {useForm} from '@mantine/form';
import {IconEditCircle, IconTrashX} from '@tabler/icons-react';
import {MRT_Row} from 'mantine-react-table';
import {HTMLAttributes, useEffect, useState} from 'react';

import classes from '../Shared/styles/ExpansionStyles.module.css';

import {useEditCourse} from '@/admin/courses/useEditCourse.tsx';
import {useRemoveCourse} from '@/admin/courses/useRemoveCourse.tsx';
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

    const [editing, setEditing] = useState(false);

    const [statusAlertFlag, setStatusAlertFlag] = useState(false);

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

    return (
        <Flex wrap={{base: 'wrap', sm: 'nowrap'}} className={classes.expansionContainer} gap="md" {...rest}>
            {statusAlertFlag ? (
                <Flex justify="center" w="100%" direction="column" gap="lg">
                    <CollectionDetailsStatusAlert status={isError} message={error?.message} type="error" />
                    <CollectionDetailsStatusAlert status={removeCourseIsSuccess} message="Course removed" type="success" />
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
                        <Divider variant="dashed" size="sm" />
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
                                    <Skeleton height={36} radius="sm" mt={22} loading={isLoading} component={<TextInput label="Course Name" disabled={!editing} placeholder="Enter course name" value={form.values.name} error={form.errors.name} onChange={(event) => form.setFieldValue('name', event.currentTarget.value)} />}></Skeleton>
                                    <Flex gap="xs" wrap={{base: 'wrap', sm: 'nowrap'}} w="100%">
                                        <Skeleton height={36} radius="sm" mt={22} loading={isLoading} component={<TextInput w={{base: '100%', sm: '50%'}} disabled={!editing} label="Course ID" placeholder="Enter course id" value={form.values.courseId} error={form.errors.courseId} onChange={(event) => form.setFieldValue('courseId', event.currentTarget.value)} />}></Skeleton>
                                        <Skeleton height={36} radius="sm" mt={22} loading={isLoading} component={<TextInput w={{base: '100%', sm: '50%'}} disabled={!editing} label="Course Number" placeholder="Enter course number" value={form.values.courseNumber} error={form.errors.courseNumber} onChange={(event) => form.setFieldValue('courseNumber', event.currentTarget.value)} />}></Skeleton>
                                    </Flex>

                                    <Flex direction="column" gap="xs" w="100%">
                                        <Skeleton height={36} radius="sm" mt={22} loading={isLoading} component={<TextInput label="Main Professor" disabled={!editing} placeholder="Enter professor name" value={form.values.professor} error={form.errors.professor} onChange={(event) => form.setFieldValue('professor', event.currentTarget.value)} />}></Skeleton>
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
                    <CollectionDetailsReviewsSection courseId={courseId} />
                    <Flex direction="column" gap="xs" className={classes.expansionActions}>
                        <Flex align="center" gap="xs">
                            <Text fz="sm" fw={500}>
                                Actions
                            </Text>
                        </Flex>
                        <Stack gap="xs">
                            <Button
                                color="green"
                                leftSection={<IconEditCircle width={16} />}
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
                                leftSection={<IconTrashX width={16} />}
                                color="red"
                            >
                                Remove Course
                            </Button>
                        </Stack>
                    </Flex>
                </>
            )}
        </Flex>
    );
};

export {CourseExpansion};
