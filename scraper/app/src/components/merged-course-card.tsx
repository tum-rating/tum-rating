import {FetchedComputedCourse, FetchedCourse} from "@/types/fetchedData.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {useEffect, useState} from "react";
import {Label} from "@radix-ui/react-label";
import {Input} from "./ui/input";
import {InputTags} from "./ui/input-tags";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft, ArrowRight, CheckIcon} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import MergedSubCourseCard from "@/components/merged-sub-course-card.tsx";
import Masonry from "@/components/masonry.tsx";
import {Badge} from "./ui/badge";

const MergedCourseCard = ({course}: { course: FetchedComputedCourse | undefined }) => {
    const [internalCourse, setInternalCourse] = useState<FetchedComputedCourse | undefined>(undefined);
    // const {saveSelectedCourse} = useAppData()!;

    useEffect(() => {
        if (course) {
            setInternalCourse(course);
        }
    }, [course]);

    const updateInternalCourse = (key: string, value: unknown) => {
        if (!internalCourse) return;

        const updatedCourse = {...internalCourse, [key]: value};

        if (key === "merged" && Array.isArray(value)) {
            const acceptedCount = value?.filter((item: FetchedCourse) => item.accepted === true).length ?? 0;
            const rejectedCount = value?.filter((item: FetchedCourse) => item.accepted === false).length ?? 0;
            const notResolvedCount = (value?.length ?? 0) - acceptedCount - rejectedCount;

            updatedCourse.acceptedCount = acceptedCount;
            updatedCourse.rejectedCount = rejectedCount;
            updatedCourse.notResolvedCount = notResolvedCount;
        }

        setInternalCourse(updatedCourse);
    };

    if (!internalCourse) return <div>No course selected</div>;

    return (
        <div className="relative z-10 w-full h-full flex justify-center items-center gap-4">
            <ScrollArea className='w-full h-screen'>
                <div className='relative bg-gray-100/40 p-4 h-full flex flex-col gap-0'>
                    <Label className='text-md font-bold' htmlFor="course-name">Merged Course Name</Label>
                    <Textarea
                        className='font-extrabold shadow-xl text-[26px] mt-1'
                        value={internalCourse.name}
                        id="course-name"
                        onChange={(e) => updateInternalCourse("name", e.target.value)}
                    />
                    <div className='flex mt-[35px] gap-4'>
                        <div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label className='text-sm font-bold' htmlFor="course-professor">Professor</Label>
                                <Input
                                    id="course-professor"
                                    value={internalCourse.professor}
                                    onChange={(e) => updateInternalCourse("professor", e.target.value)}
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                                <Label className='text-sm font-bold' htmlFor="course-codes">Codes</Label>
                                <InputTags
                                    id="course-codes"
                                    className="bg-transparent"
                                    value={internalCourse.codes || []}
                                    onChange={(codes) => updateInternalCourse("codes", codes)}
                                    placeholder="Enter values, comma separated..."
                                />
                            </div>
                            <div className="w-full max-w-sm gap-1.5 mt-3">
                                <Label className='text-sm font-bold' htmlFor="course-semesters">Offered in
                                    semesters</Label>
                                <InputTags
                                    id="course-semesters"
                                    className="bg-transparent"
                                    value={internalCourse.offeredInSemesters || []}
                                    onChange={(semesters) => updateInternalCourse("offeredInSemesters", semesters)}
                                    placeholder="Enter values, comma separated..."
                                />
                            </div>
                        </div>
                        <div className='w-full'>
                            <Label className='text-sm font-bold' htmlFor="course-semesters">Merged with</Label>
                            <div className={`masonry`}>
                                <Masonry>
                                    {internalCourse.merged ? internalCourse.merged.map((x) => (
                                        <MergedSubCourseCard subCourse={x} key={x.id}
                                                             setSubCourse={(updatedSubCourse) => {
                                                                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                 // @ts-expect-error
                                                                 const updatedMerged = internalCourse.merged.map((sub) => sub.id === updatedSubCourse.id ? updatedSubCourse : sub);
                                                                 updateInternalCourse("merged", updatedMerged);
                                                             }}/>
                                    )) : null}

                                </Masonry>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sticky right-[30px] bottom-[50px] controls">
                    <div className="flex flex-col mt-3 items-end justify-end px-2 mr-2">
                        <div>
                            <Badge
                                variant={(internalCourse.acceptedCount ?? 0) + (internalCourse.rejectedCount ?? 0) === (internalCourse.merged?.length ?? 0) ? 'blue' : 'subtle'}
                                className='mb-2'>
                                Resolved {(internalCourse.acceptedCount ?? 0) + (internalCourse.rejectedCount ?? 0)} / {internalCourse.merged?.length ?? 0}
                                {
                                    (internalCourse.acceptedCount ?? 0) + (internalCourse.rejectedCount ?? 0) === (internalCourse.merged?.length ?? 0) && (
                                        <CheckIcon className='inline-block w-5 h-4 ml-[3px]'/>
                                    )
                                }
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button variant='outline' tooltip='Previous'>
                                <ArrowLeft/>
                            </Button>
                            <Button variant='outline' tooltip='Next'>
                                <ArrowRight/>
                            </Button>
                            <Button
                                disabled={(internalCourse.acceptedCount ?? 0) + (internalCourse.rejectedCount ?? 0) !== (internalCourse.merged?.length ?? 0)}
                                onClick={() => {
                                    // saveSelectedCourse(internalCourse)
                                }}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default MergedCourseCard;
