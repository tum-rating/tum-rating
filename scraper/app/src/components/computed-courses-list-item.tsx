import { FetchedComputedCourse } from "@/types/fetchedData.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";
import { useState } from "react";

interface ComputedCoursesListItemProps {
    data: FetchedComputedCourse;
    selected: boolean;
    onClick: (id: string | null) => void;
}

const ComputedCoursesListItem = ({ data, selected, onClick }: ComputedCoursesListItemProps) => {
    const [status, setStatus] = useState({
        accepted: data.acceptedCount || 0,
        rejected: data.rejectedCount || 0,
        notResolved: data.notResolvedCount || 0
    });

    const handleResolve = (type: 'accepted' | 'rejected') => {
        const updatedStatus = {
            ...status,
            [type]: status[type] + 1,
            notResolved: status.notResolved - 1
        };
        setStatus(updatedStatus);
    };

    return (
        <div
            onClick={() => onClick(data.id)}
            className={cn(
                'bg-gray-100 hover:bg-gray-200 cursor-pointer px-4 py-4 transition-all duration-100',
                selected ? 'bg-gray-300 hover:bg-gray-300' : ''
            )}
        >
            <span className="text-sm font-medium leading-relaxed">
                {
                    status.notResolved === 0 && (
                        <CheckCircleIcon className="inline-block w-5 h-5 mr-1" />
                    )
                }
                {data.name}
            </span>
            <div className="flex justify-between">
                <div className="flex gap-1 mt-1">
                    <Badge tooltip="accepted" variant="success" onClick={() => handleResolve('accepted')}>{status.accepted}</Badge>
                    <Badge tooltip="rejected" variant="destructive" onClick={() => handleResolve('rejected')}>{status.rejected}</Badge>
                    <Badge tooltip="unresolved">{status.notResolved}</Badge>
                </div>
            </div>
        </div>
    );
};

export default ComputedCoursesListItem;