import {FetchedComputedCourse} from "@/types/fetchedData.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {cn} from "@/lib/utils";
import {CircleCheck} from "lucide-react";
import {useEffect, useState} from "react";

interface ComputedCoursesListItemProps {
    data: FetchedComputedCourse;
    selected: boolean;
    onClick: (id: string | null) => void;
    searchTerm: string;
}

const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm.split(',').map(term => term.trim()).join('|')})`, 'gi');
    return text.split(regex).map((part, index) =>
        regex.test(part) ? <span key={index} className="bg-yellow-200">{part}</span> : part
    );
};

const ComputedCoursesListItem = ({data, selected, onClick, searchTerm}: ComputedCoursesListItemProps) => {
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
                'bg-gray-100 hover:bg-gray-200 cursor-pointer pr-4  transition-all duration-100',
                'border-b-[1px] border-b-border',
                'flex',
                selected ? 'bg-gray-300 hover:bg-gray-300' : ''
            )}
        >

            <div className={`min-w-[8px] h-auto mr-4  ${status.notResolved === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}/>
            <div className="py-4">
                <span className="text-sm font-bold leading-relaxed ">
                    {status.notResolved === 0 && (
                        <CircleCheck className="inline-block w-5 h-5 mr-1 fill-blue-500 stroke-white"/>
                    )}
                    {highlightText(data.name, searchTerm)}
                    <span className="text-xs text-gray-500 block">
                        {highlightText(data.professor, searchTerm)}
                    </span>
                </span>

                <div className="flex justify-between">
                    <div className="flex gap-1 mt-1">
                        <Badge tooltip="accepted" variant="success">{status.accepted}</Badge>
                        <Badge tooltip="rejected" variant="destructive">{status.rejected}</Badge>
                        <Badge tooltip="unresolved">{status.notResolved}</Badge>
                    </div>
                </div>
                {searchTerm && data.merged && data.merged.length > 0 && (
                    <div className="mt-2">
                        {data.merged.map((mergedItem, index) => (
                            <div key={index} className="ml-4">
                                <span className="text-sm font-bold leading-relaxed text-gray-800 ">
                                    {highlightText(mergedItem.name, searchTerm)}
                                    <span className="text-xs text-gray-500 block">
                                        {highlightText(mergedItem.professor, searchTerm)}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComputedCoursesListItem;