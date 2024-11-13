import {Card} from "@/components/ui/card.tsx";
import {FetchedCourse} from "@/types/fetchedData.ts";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import getTumCampusCourseLink from "@/lib/get-tum-campus-course-link.ts";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group.tsx";
import {Check, X} from "lucide-react";
import SimilarityLabel from "@/components/similarity-label.tsx";


interface MergedSubCourseCardProps {
    subCourse: FetchedCourse;
    setSubCourse: (subCourse: FetchedCourse) => void;
}

const MergedSubCourseCard = ({subCourse, setSubCourse}: MergedSubCourseCardProps) => {
    console.log(subCourse)
    return (
        <Card
            className={`relative flex flex-col gap-2 p-2 max-w-[250px] ${subCourse.accepted ? 'bg-green-50' : subCourse.accepted === false ? 'bg-red-50' : 'bg-gray-50'}`}>
            <SimilarityLabel similarity={subCourse.similarity}/>
            <div className={`flex flex-col gap-1`}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a href={getTumCampusCourseLink(subCourse.courseId)}
                           target='_blank'
                           className={`text-sm font-bold line-clamp-5`}>{subCourse.name}</a>
                    </TooltipTrigger>
                    <TooltipContent>
                        {subCourse.name}
                    </TooltipContent>
                </Tooltip>

                <span className={`text-xs`}>
                {subCourse.offeredInSemesters.join(', ')}
                </span>
                <span className={`text-xs mb-1`}>
                    {subCourse.professor}
                </span>
                <div className='flex gap-1 flex-wrap'>
                    {
                        subCourse.codes && subCourse.codes.map((code) => {
                            return (
                                <Badge key={code} variant='outline' className={`text-xs`}>{code}</Badge>
                            )
                        })}
                </div>
                <ToggleGroup type="single" className={`w-full mt-1 `}
                             value={subCourse.accepted ? 'accept' : subCourse.accepted === false ? 'decline' : 'none'}
                             onValueChange={(value) => {
                                 if (value === 'accept') {
                                     setSubCourse({...subCourse, accepted: true})
                                 } else if (value === 'decline') {
                                     setSubCourse({...subCourse, accepted: false})
                                 } else {
                                     setSubCourse({...subCourse, accepted: null})
                                 }
                             }}
                >
                    <ToggleGroupItem variant='outline'
                                     className='w-full data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:font-bold'

                                     value="accept">
                        <Check/>
                        Accept
                    </ToggleGroupItem>
                    <ToggleGroupItem variant='outline'
                                     className='w-full data-[state=on]:bg-red-600 data-[state=on]:text-white data-[state=on]:font-bold'
                                     value="decline">
                        <X/>
                        Decline
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </Card>
    )
}


export default MergedSubCourseCard;