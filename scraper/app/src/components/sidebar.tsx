import VirtualList from "@/components/ui/virtual-list.tsx";
import useAppData from "@/hooks/useAppData.tsx";
import {useEffect, useState} from "react";
import {FetchedComputedCourse} from "@/types/fetchedData.ts";
import ComputedCoursesListItem from "@/components/computed-courses-list-item.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import SidebarSearch from "@/components/sidebar-search.tsx";

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar = ({isOpen}: SidebarProps) => {
    const {isPending, computedDataToCheck, selectedItemId, setSelectedItemId} = useAppData();
    const [computedCourses, setComputedCourses] = useState<FetchedComputedCourse[]>([]);
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        if (computedDataToCheck) {
            console.log(computedDataToCheck)
            setComputedCourses(computedDataToCheck);
            setTimeout(() => setShowSkeleton(false), 500); // Add a delay before hiding skeletons
        }
    }, [computedDataToCheck]);

    const getRandomWidth = () => `${Math.floor(Math.random() * (75 - 50 + 1) + 50)}%`;

    return (
        <div className={`Sidebar 
            ${isOpen ? 'w-[400px]' : 'w-[0px]'} 
            transition-width 
            duration-300 
            ease-in-out 
       
        `}>

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
                                <Skeleton className="h-6 mb-2 transition-[width] " style={{width: getRandomWidth()}}/>
                                {Math.random() > 0.5 && <Skeleton className="h-6 mb-2 transition-[width] "
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
            ) : (<>
                    <SidebarSearch/>
                    <VirtualList
                        height={'calc(100vh - 36px)'}
                        data={computedCourses}d
                        renderer={(row) => (
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
                </>
            )}
        </div>
    );
};

export default Sidebar;