import { useContext, useEffect , useState } from "react";
import VirtualList from "@/components/ui/virtual-list";
import { FetchedComputedCourse, FetchedCourse } from "@/types/fetchedData";
import ComputedCoursesListItem from "@/components/computed-courses-list-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import SidebarSearch from "@/components/sidebar-search";
import { DatasetOptions } from "@/types/dataset-options";
import { AppDataContext } from "@/context/app-data-context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import isCoursesFile from "@/lib/is-courses-file.ts";

const RightSidebar = () => {
    const {
        selectedFile,
        selectCourse,
        users,
        currentUserId,
        filesContent
    } = useContext(AppDataContext)!;
    const [computedCourses, setComputedCourses] = useState<FetchedComputedCourse[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<FetchedComputedCourse[]>([]);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [sortOptions, setSortOptions] = useState<DatasetOptions>({
        name: { enabled: false, ascending: true, label: 'Name', type: "string" },
        acceptedCount: { enabled: false, ascending: true, label: 'Accepted Count', type: "number" },
        rejectedCount: { enabled: false, ascending: true, label: 'Rejected Count', type: "number" },
        notResolvedCount: { enabled: false, ascending: true, label: 'Not Resolved Count', type: "number" },
    });
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        if (selectedFile) {
            const fileNameWithoutExtension = selectedFile.name.split('.').slice(0, -1).join('.');
            if (isCoursesFile(fileNameWithoutExtension)) {
                if (filesContent[fileNameWithoutExtension]) {
                    setComputedCourses([...filesContent[fileNameWithoutExtension]]);
                    setShowSkeleton(false);
                }
            }
        }
    }, [filesContent, selectedFile]);

    useEffect(() => {
        const filterAndSortData = () => {
            let data = [...computedCourses];

            // Apply search filter
            if (searchTerm) {
                const phrases = searchTerm.toLowerCase().split(',').map(phrase => phrase.trim());
                data = data.filter(course =>
                    phrases.every(phrase =>
                        course.name.toLowerCase().includes(phrase) ||
                        course.professor.toLowerCase().includes(phrase) ||
                        course.codes?.some(code => code.toLowerCase().includes(phrase)) ||
                        course.offeredInSemesters?.some(semester => semester.toLowerCase().includes(phrase))
                    )
                );
            }

            // Apply sorting
            Object.entries(sortOptions).forEach(([key, value]) => {
                if (value?.enabled) {
                    data.sort((a, b) => {
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

            setFilteredCourses(data);
        };

        filterAndSortData();
    }, [computedCourses, sortOptions, searchTerm]);

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    };

    const handleCourseSelect = (course: FetchedCourse | FetchedComputedCourse | null) => {
        if (!course) return;
        selectCourse(course);
    };

    const getRandomWidth = () => `${Math.floor(Math.random() * (75 - 50 + 1) + 50)}%`;

    console.log(filteredCourses)
    return (
        <>
            <SidebarSearch onSortChange={setSortOptions} onSearch={handleSearch} listLength={filteredCourses.length} sortOptions={sortOptions} />
            {showSkeleton ? (
                <div
                    style={{
                        height: '100vh',
                        width: 400,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        contain: 'strict',
                    }}
                >
                    {Array.from({ length: 10 }).map((_, index) => (
                        <>
                            <div key={index} className="bg-gray-100 px-4 py-4 w-[388px] h-[107.5px]">
                                <Skeleton className="h-6 mb-2 transition-[width]" style={{ width: getRandomWidth() }} />
                                {Math.random() > 0.5 && <Skeleton className="h-6 mb-2 transition-[width]" style={{ width: getRandomWidth() }} />}
                                <div className="flex gap-1">
                                    <Skeleton className="h-[22px] w-[29px]" />
                                    <Skeleton className="h-[22px] w-[29px]" />
                                    <Skeleton className="h-[22px] w-[29px]" />
                                </div>
                            </div>
                            <Separator />
                        </>
                    ))}
                </div>
            ) : (
                filteredCourses.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        No courses found
                    </div>
                ) : (
                    <VirtualList
                        height={'calc(100vh - 36px)'}
                        data={filteredCourses}
                        renderer={(row) => (
                            <div key={row.id} onClick={() => {
                                handleCourseSelect(row);
                            }}>
                                <ComputedCoursesListItem
                                    data={row}
                                    searchTerm={searchTerm}
                                    selected={false}
                                    usersRenderer={() => (
                                        <>
                                            {users.filter(user => user.selectedCourse === row.id).map(user => (
                                                <div key={user.id} className="active-user">
                                                    <Avatar
                                                        className={`h-6 w-6 ${user.id === currentUserId ? 'border-2 border-blue-500' : 'border-2 border-gray-900'}`}>
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                />
                            </div>
                        )}
                        searchTerm={searchTerm}
                    />
                )
            )}
        </>
    );
};

export default RightSidebar;