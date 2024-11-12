import {FetchedComputedCourse} from "@/types/fetchedData.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {cn} from "@/lib/utils";
import {CheckCircleIcon} from "lucide-react";
import {useEffect, useState} from "react";

interface ComputedCoursesListItemProps {
    data: FetchedComputedCourse;
    selected: boolean;
    onClick: (id: string | null) => void;
}

const ComputedCoursesListItem = ({data, selected, onClick}: ComputedCoursesListItemProps) => {
    const [status, setStatus] = useState({
        accepted: data.acceptedCount || 0,
        rejected: data.rejectedCount || 0,
        notResolved: data.notResolvedCount || 0
    });


    useEffect(() => {
        setStatus({
            accepted: data.acceptedCount || 0,
            rejected: data.rejectedCount || 0,
            notResolved: data.notResolvedCount || 0
        });
    }, [data]);

    return (
        <div
            onClick={() => onClick(data.id)}
            tabIndex={0}
            role="button"
            className={cn(
                'bg-gray-100 hover:bg-gray-200 cursor-pointer px-4 py-4 transition-all duration-100',
                selected ? 'bg-gray-300 hover:bg-gray-300' : ''
            )}
        >
            <span className="text-sm font-medium leading-relaxed ">
                {
                    status.notResolved === 0 && (
                        <CheckCircleIcon className="inline-block w-5 h-5 mr-1"/>
                    )
                }{data.name}
                <span className="text-xs text-gray-500 block">{data.professor}</span>
            </span>

            <div className="flex justify-between">
                <div className="flex gap-1 mt-1">
                    <Badge tooltip="accepted" variant="success"
                    >{status.accepted}</Badge>
                    <Badge tooltip="rejected" variant="destructive"
                    >{status.rejected}</Badge>
                    <Badge tooltip="unresolved">{status.notResolved}</Badge>
                </div>
            </div>
        </div>
    );
};

export default ComputedCoursesListItem;