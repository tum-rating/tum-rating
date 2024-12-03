import SearchInput from "@/components/ui/search-input.tsx";
import SidebarSearchSortingDropdown from "@/components/sidebar-search-sorting-dropdown.tsx";
import {DatasetOptions} from "@/types/dataset-options.ts";

interface SidebarSearchProps {
    onSortChange: (options: DatasetOptions) => void;
    onSearch: (searchTerm: string) => void;
    listLength: number;
    sortOptions: DatasetOptions;
}

const SidebarSearch = ({onSortChange, onSearch, listLength, sortOptions}: SidebarSearchProps) => {
    return (
        <div className="flex items-center shadow-2xl border-b border-1 border-b-border my-[1px] pr-2 w-full">
            <SearchInput
                className={"w-full rounded-none border-none "}
                placeholder={"Search by course name, professor, or code"}
                onChange={(e) => onSearch(e.target.value)}
                rightSection={
                    <div className='flex items-center gap-1'>
                        <p className="text-xs text-gray-500">{listLength}</p>
                    </div>
                }

            />
            <SidebarSearchSortingDropdown sortOptionsObject={sortOptions} onSortChange={onSortChange}/>
        </div>
    );
};

export default SidebarSearch;
