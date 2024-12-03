import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUp01, ArrowDown01, ArrowUpAZ, ArrowDownAZ, ListFilter } from "lucide-react";
import { DatasetOptions } from "@/types/dataset-options";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Label } from "@/components/ui/label.tsx";

interface SidebarSearchSortingDropdownProps {
    onSortChange: (options: DatasetOptions) => void;
    sortOptionsObject: DatasetOptions;
}

const icons = {
    "ascending-number": <ArrowUp01 />,
    "descending-number": <ArrowDown01 />,
    "ascending-string": <ArrowUpAZ />,
    "descending-string": <ArrowDownAZ />,
};

const SidebarSearchSortingDropdown = ({ onSortChange, sortOptionsObject }: SidebarSearchSortingDropdownProps) => {
    const [sortOptions, setSortOptions] = useState<DatasetOptions>(sortOptionsObject);

    const handleSortChange = (key: keyof DatasetOptions) => {
        setSortOptions((prev) => {
            const newOptions = { ...prev, [key]: { ...prev[key], enabled: !prev[key]?.enabled } };
            onSortChange(newOptions);
            return newOptions;
        });
    };

    const handleOrderChange = (key: keyof DatasetOptions) => {
        setSortOptions((prev) => {
            const newOptions = { ...prev, [key]: { ...prev[key], ascending: !prev[key]?.ascending } };
            onSortChange(newOptions);
            return newOptions;
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger >
                <Button
                    variant='outline'
                    size='icon'
                    className={`relative shadow-md transition-transform transform `}
                >
                    <ListFilter className={`w-12 h-12`} />
                    {
                        Object.values(sortOptions).some(option => option.enabled) && <div className="rounded-full w-2 h-2 bg-blue-500 absolute top-[-3px] right-[-3px]"></div>
                    }
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 px-2">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(sortOptions).map((key) => (
                    <div key={key} className="flex items-center justify-between">
                        <Checkbox
                            id={key}
                            checked={sortOptions[key as keyof DatasetOptions]?.enabled}
                            onCheckedChange={() => handleSortChange(key as keyof DatasetOptions)}
                            onSelect={(e) => e.preventDefault()} // Prevent menu from closing
                        />
                        <Label
                            htmlFor={key}
                            className={`cursor-pointer w-full pl-2`}
                        >{sortOptions[key as keyof DatasetOptions]?.label}</Label>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={!sortOptions[key as keyof DatasetOptions]?.enabled}
                            onClick={() => handleOrderChange(key as keyof DatasetOptions)}
                        >
                            {icons[`${sortOptions[key as keyof DatasetOptions]?.ascending ? "ascending" : "descending"}-${sortOptions[key as keyof DatasetOptions]?.type}` as keyof typeof icons]}
                        </Button>
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SidebarSearchSortingDropdown;