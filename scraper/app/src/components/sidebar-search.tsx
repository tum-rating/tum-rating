import SearchInput from "@/components/ui/search-input.tsx";
import SidebarSearchSortingDropdown from "@/components/sidebar-search-sorting-dropdown.tsx";
import {DatasetOptions} from "@/types/dataset-options.ts";
import {Tooltip, TooltipTrigger} from "@/components/ui/tooltip.tsx";

interface SidebarSearchProps {
    onSortChange: (options: DatasetOptions) => void;
    onSearch: (searchTerm: string) => void;
    listLength: number;
    filteredCoursesMergedStatusesCount?: {
        merged: number;
        mergedRejected: number;
        mergedLocked: number;
        mergedNotResolved: number;
        mergedAccepted: number;
    };
    sortOptions: DatasetOptions;
}

const SidebarSearch = ({
                           onSortChange,
                           onSearch,
                           listLength,
                           sortOptions,
                           filteredCoursesMergedStatusesCount
                       }: SidebarSearchProps) => {
    const mergedAccepted = filteredCoursesMergedStatusesCount?.mergedAccepted || 0;
    const mergedRejected = filteredCoursesMergedStatusesCount?.mergedRejected || 0;
    const mergedNotResolved = filteredCoursesMergedStatusesCount?.mergedNotResolved || 0;
    const mergedLocked = filteredCoursesMergedStatusesCount?.mergedLocked || 0;

    return (
        <div className="flex items-center shadow-2xl border-b border-1 border-b-border my-[1px] pr-2 w-full">
            <SearchInput
                className={"w-full rounded-none border-none "}
                onChange={(e) => onSearch(e.target.value)}
                rightSection={
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='flex items-center gap-1'>
                                <p className="text-xs text-gray-500">
                                    {listLength}
                                    {mergedAccepted || mergedRejected || mergedNotResolved || mergedLocked && <>
                                        <span className="text-success">{mergedAccepted}</span>:
                                        <span className="text-destructive">{mergedRejected}</span>:
                                        <span>{mergedNotResolved}</span>:
                                        <span className="text-gold">{mergedLocked}</span>
                                    </>
                                    }
                                </p>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-bold text-gray-500">Total: {listLength}</p>
                                {mergedAccepted || mergedRejected || mergedNotResolved || mergedLocked && <>
                                    <p className="text-xs font-bold text-success">Accepted: {mergedAccepted}</p>
                                    <p className="text-xs font-bold text-destructive">Rejected: {mergedRejected}</p>
                                    <p className="text-xs font-bold">Not Resolved: {mergedNotResolved}</p>
                                    <p className="text-xs font-bold text-gold">Locked: {mergedLocked}</p>
                                </>}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                }
            />
            <SidebarSearchSortingDropdown sortOptionsObject={sortOptions} onSortChange={onSortChange}/>
        </div>
    )
        ;
};

export default SidebarSearch;
