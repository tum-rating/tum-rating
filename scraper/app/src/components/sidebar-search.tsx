import { useState } from "react";
import SearchInput from "@/components/ui/search-input.tsx";
import SidebarSearchSortingDropdown from "@/components/sidebar-search-sorting-dropdown.tsx";

const SidebarSearch = ({ onSortChange }) => {
    return (
        <div className="flex items-center shadow-2xl border-gray-500 my-[1px] pr-2 w-full">
            <SearchInput
                className={"w-full rounded-none border-none "}
                placeholder={"Search by course name, professor, or code"}
            />
            <SidebarSearchSortingDropdown onSortChange={onSortChange} />
        </div>
    );
};

export default SidebarSearch;
