import {Input} from "@/components/ui/input.tsx";
import {Search} from "lucide-react";
const SidebarSearch = () => {

    return (
        <div className="flex my-1">
            <Input
                leftSection={<Search size={16} />}
                rightSection={<div className="w-1 h-1 bg-gray-300 rounded-full"/>}
                type='search'
                placeholder='Search'
                className='w-full border-0 rounded-none'
            />
        </div>
    )
}

export default SidebarSearch;