import {useEffect, useState} from "react";
import VirtualList from "@/components/ui/virtual-list";
import useAppData from "@/hooks/useAppData";
import {FetchedComputedCourse} from "@/types/fetchedData";
import ComputedCoursesListItem from "@/components/computed-courses-list-item";
import {Skeleton} from "@/components/ui/skeleton";
import {Separator} from "@/components/ui/separator";
import SidebarSearch from "@/components/sidebar-search";
import {DatasetOptions} from "@/types/dataset-options";

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar = ({isOpen}: SidebarProps) => {
    const {isPending, computedDataToCheck, selectedItemId, setSelectedItemId} = useAppData();
    const [computedCourses, setComputedCourses] = useState<FetchedComputedCourse[]>([]);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [sortOptions, setSortOptions] = useState<DatasetOptions>({
        name: {enabled: false, ascending: true, label: 'Name', type: "string"},
        acceptedCount: {enabled: false, ascending: true, label: 'Accepted Count', type: "number"},
        rejectedCount: {enabled: false, ascending: true, label: 'Rejected Count', type: "number"},
        notResolvedCount: {enabled: false, ascending: true, label: 'Not Resolved Count', type: "number"},
    });

    useEffect(() => {
        if (computedDataToCheck) {
            setComputedCourses(computedDataToCheck);
            setTimeout(() => setShowSkeleton(false), 500); // Add a delay before hiding skeletons
        }
    }, [computedDataToCheck]);

    const getRandomWidth = () => `${Math.floor(Math.random() * (75 - 50 + 1) + 50)}%`;

    const sortData = (data: FetchedComputedCourse[]) => {
        const sortedData = [...data];
        Object.entries(sortOptions).forEach(([key, value]) => {
            if (value?.enabled) {
                sortedData.sort((a, b) => {
                    const aValue = a[key as keyof FetchedComputedCourse];
                    const bValue = b[key as keyof FetchedComputedCourse];
                    if (aValue !== undefined && bValue !== undefined) {
                        if (aValue < bValue) return value!.ascending ? -1 : 1;
                        if (aValue > bValue) return value!.ascending ? 1 : -1;
                    }
                    return 0;
                });
            }
        });
        return sortedData;
    };

    return (
        <div className={`Sidebar ${isOpen ? 'w-[400px]' : 'w-[0px]'} transition-width duration-300 ease-in-out`}>
            <SidebarSearch onSortChange={setSortOptions}/>
            {isPending || showSkeleton ? (
                <div
                    style={{
                        height: '100vh',
                        width: 400,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        contain: 'strict',
                    }}
                >
                    {Array.from({length: 10}).map((_, index) => (
                        <>
                            <div key={index} className="bg-gray-100 px-4 py-4 w-[388px] h-[107.5px]">
                                <Skeleton className="h-6 mb-2 transition-[width]" style={{width: getRandomWidth()}}/>
                                {Math.random() > 0.5 && <Skeleton className="h-6 mb-2 transition-[width]"
                                                                  style={{width: getRandomWidth()}}/>}
                                <div className="flex gap-1">
                                    <Skeleton className="h-[22px] w-[29px]"/>
                                    <Skeleton className="h-[22px] w-[29px]"/>
                                    <Skeleton className="h-[22px] w-[29px]"/>
                                </div>
                            </div>
                            <Separator/>
                        </>
                    ))}
                </div>
            ) : (
                <VirtualList
                    height={'calc(100vh - 36px)'}
                    data={sortData(computedCourses)}
                    renderer={(row: FetchedComputedCourse) => (
                        <>
                            <ComputedCoursesListItem
                                data={row}
                                key={row.id}
                                selected={row.id === selectedItemId}
                                onClick={setSelectedItemId}
                            />
                            <Separator/>
                        </>
                    )}
                />
            )}
        </div>
    );
};

export default Sidebar;
