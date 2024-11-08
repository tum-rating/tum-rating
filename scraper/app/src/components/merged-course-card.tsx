import {FetchedComputedCourse} from "@/types/fetchedData.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {useEffect, useState} from "react";
import {Label} from "@radix-ui/react-label";
import {Input} from "./ui/input";
import {InputTags} from "./ui/input-tags";
import {Card} from "@/components/ui/card.tsx";

const MergedCourseCard = ({course}: { course: FetchedComputedCourse | undefined }) => {
    const [internalCourse, setInternalCourse] = useState<FetchedComputedCourse | undefined>(undefined);

    useEffect(() => {
        if (course) {
            setInternalCourse(course);
        }
    }, [course]);

    if (!internalCourse) return <div>No course selected</div>;

    return (
        <div className="relative z-10 w-full h-full flex justify-center items-center">
            <div className='w-[720px] bg-gray-100/40 p-4'>
                <Label className='text-md font-bold' htmlFor="course-name">Merged Course Name</Label>
                <Textarea
                    className='font-extrabold shadow-xl text-[26px] mt-1'
                    value={internalCourse.name}
                    id="course-name"
                    onChange={(e) => setInternalCourse({...internalCourse, name: e.target.value})}
                />
                <div className='flex mt-[35px] gap-4'>
                    <div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label className='text-sm font-bold' htmlFor="course-professor">Professor</Label>
                            <Input
                                id="course-professor"
                                value={internalCourse.professor}
                                onChange={(e) => setInternalCourse({...internalCourse, professor: e.target.value})}/>
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                            <Label className='text-sm font-bold' htmlFor="course-codes">Codes</Label>
                            <InputTags
                                id="course-codes"
                                className="bg-transparent"
                                value={internalCourse.codes || []}
                                onChange={(codes) => {
                                    console.log(codes)
                                    setInternalCourse({...internalCourse, codes})
                                }}
                                placeholder="Enter values, comma separated..."
                            />
                        </div>
                        <div className="w-full max-w-sm gap-1.5 mt-3">
                            <Label className='text-sm font-bold' htmlFor="course-semesters">Offered in semesters</Label>
                            <InputTags
                                id="course-semesters"
                                className="bg-transparent"
                                value={internalCourse.offeredInSemesters || []}
                                onChange={(semesters) => setInternalCourse({...internalCourse, semesters})}
                                placeholder="Enter values, comma separated..."/>
                        </div>
                    </div>
                    <div>
                        <Label className='text-sm font-bold' htmlFor="course-semesters">Merged with</Label>
                        {internalCourse.merged ? internalCourse.merged.map((x)=>{
                            return (
                                <Card className='flex items-center gap-2 p-2'>
                                    <div>{x.name}</div>
                                    <div>{x.codes.join(', ')}</div>
                                </Card>
                            )
                        }) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MergedCourseCard;