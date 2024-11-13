import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
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
}

const icons = {
    "ascending-number": <ArrowUp01 />,
    "descending-number": <ArrowDown01 />,
    "ascending-string": <ArrowUpAZ />,
    "descending-string": <ArrowDownAZ />,
};

const SidebarSearchSortingDropdown = ({ onSortChange }: SidebarSearchSortingDropdownProps) => {
    const [sortOptions, setSortOptions] = useState<DatasetOptions>({
        name: { enabled: false, ascending: true, label: 'Name', type: "string" },
        acceptedCount: { enabled: false, ascending: true, label: 'Accepted Count', type: "number" },
        rejectedCount: { enabled: false, ascending: true, label: 'Rejected Count', type: "number" },
        notResolvedCount: { enabled: false, ascending: true, label: 'Not Resolved Count', type: "number" },
    });

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
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    size='icon'
                    className={`shadow-md transition-transform transform hover:shadow-lg`}
                >
                    <ListFilter size={4} className={`w-12 h-12`} />
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
                            {icons[`${sortOptions[key as keyof DatasetOptions]?.ascending ? "ascending" : "descending"}-${sortOptions[key as keyof DatasetOptions]?.type}`]}
                        </Button>
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SidebarSearchSortingDropdown;