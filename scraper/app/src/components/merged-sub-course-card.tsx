import {Card} from "@/components/ui/card.tsx";
import {FetchedCourse} from "@/types/fetchedData.ts";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import getTumCampusCourseLink from "@/lib/get-tum-campus-course-link.ts";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group.tsx";
import {Check, MoreHorizontal, Undo2Icon, X} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import SimilarityLabel from "@/components/similarity-label.tsx";
import {Button} from "@/components/ui/button.tsx";

interface MergedSubCourseCardProps {
    subCourse: FetchedCourse;
    setSubCourse: (subCourse: FetchedCourse | null) => void;
    markAsRemoved: (courseId: string) => void;
    revertRemoval: (courseId: string) => void;
}

const MergedSubCourseCard = ({
                                 subCourse,
                                 setSubCourse,
                                 markAsRemoved,
                                 revertRemoval,
                             }: MergedSubCourseCardProps) => {
    const isRemoved = subCourse.removed;

    return (
        <Card
            className={`relative flex flex-col gap-2 p-2 max-w-[250px] ${
                isRemoved
                    ? "bg-gray-200"
                    : subCourse.accepted
                        ? "bg-green-50"
                        : subCourse.accepted === false
                            ? "bg-red-50"
                            : "bg-gray-50"
            }`}
        >
            {
                !isRemoved && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 z-[100]">
                                <MoreHorizontal className="w-4 h-4"/>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                className="font-bold text-red-500"
                                onClick={() => markAsRemoved(subCourse.id)}
                            >
                                Remove from merged courses
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
            {
                isRemoved && (
                    <Button
                        variant="outline"
                        size={'icon'}
                        className="absolute top-2 right-2 z-[100]"
                        onClick={() => revertRemoval(subCourse.id)}
                    >
                        <Undo2Icon className=""/>
                    </Button>
                )
            }

            {isRemoved && (
                <div className="absolute inset-0 flex justify-center items-center opacity-80">
                    <X className="text-red-500 w-16 h-16"/>
                </div>
            )}

            {!isRemoved && (
                <>
                    {subCourse.locked ? (
                        <div className="text-gray-500 text-xs font-bold">
                            🔒 Accepted and Locked
                        </div>
                    ) : (
                        <SimilarityLabel similarity={subCourse.similarity}/>
                    )}
                </>
            )}

            <div className={`flex flex-col gap-1 ${isRemoved && "opacity-40 pointer-events-none"}`}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a
                            href={getTumCampusCourseLink(subCourse.courseId)}
                            target="_blank"
                            className={`text-sm font-bold line-clamp-5 ${
                                isRemoved ? "line-through" : ""
                            }`}
                        >
                            {subCourse.name}
                        </a>
                    </TooltipTrigger>
                    <TooltipContent>{subCourse.name}</TooltipContent>
                </Tooltip>

                <span className={`text-xs`}>{subCourse.offeredInSemesters.join(", ")}</span>
                <span className={`text-xs mb-1`}>{subCourse.professor}</span>
                <div className="flex gap-1 flex-wrap">
                    {subCourse.codes &&
                        subCourse.codes.map((code) => (
                            <Badge key={code} variant="outline" className={`text-xs`}>
                                {code}
                            </Badge>
                        ))}
                </div>
                {!isRemoved && (
                    <ToggleGroup
                        type="single"
                        className={`w-full mt-1`}
                        value={
                            subCourse.accepted
                                ? "accept"
                                : subCourse.accepted === false
                                    ? "decline"
                                    : "none"
                        }
                        onValueChange={(value) => {
                            if (value === "accept") {
                                setSubCourse({...subCourse, accepted: true});
                            } else if (value === "decline") {
                                setSubCourse({...subCourse, accepted: false});
                            } else {
                                setSubCourse({...subCourse, accepted: null});
                            }
                        }}
                    >
                        <ToggleGroupItem
                            variant="outline"
                            disabled={subCourse.locked}
                            className="w-full data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:font-bold"
                            value="accept"
                        >
                            <Check/>
                            Accept
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            variant="outline"
                            disabled={subCourse.locked}
                            className="w-full data-[state=on]:bg-red-600 data-[state=on]:text-white data-[state=on]:font-bold"
                            value="decline"
                        >
                            <X/>
                            Decline
                        </ToggleGroupItem>
                    </ToggleGroup>
                )}
            </div>
        </Card>
    );
};

export default MergedSubCourseCard;
