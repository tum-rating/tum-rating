import {useContext, useEffect, useState} from "react";
import {FetchedComputedCourse, FetchedCourse} from "@/types/fetchedData.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Label} from "@radix-ui/react-label";
import {Input} from "./ui/input";
import {InputTags} from "./ui/input-tags";
import {Button} from "@/components/ui/button.tsx";
import {CheckIcon, PlusIcon} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import MergedSubCourseCard from "@/components/merged-sub-course-card.tsx";
import Masonry from "@/components/masonry.tsx";
import {Badge} from "./ui/badge";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandItem} from "@/components/ui/command";
import {Card} from "@/components/ui/card.tsx";
import {AppDataContext} from "@/context/app-data-context";
import isCoursesFile from "@/lib/is-courses-file";
import VirtualList from "@/components/ui/virtual-list";
import {Checkbox} from "@/components/ui/checkbox";

const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    const escapedSearchTerm = searchTerm
        .split(",")
        .map((term) => term.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
    const regex = new RegExp(`(${escapedSearchTerm})`, "gi");
    return text.split(regex).map((part, index) =>
        regex.test(part) ? <span key={index} className="bg-yellow-200">{part}</span> : part
    );
};

const MergedCourseCard = ({
                              course,
                          }: {
    course: FetchedComputedCourse | undefined;
}) => {
    const [internalCourse, setInternalCourse] = useState<FetchedComputedCourse | undefined>(undefined);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isComboBoxOpen, setIsComboBoxOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedAndFilteredCourses, setSortedAndFilteredCourses] = useState<FetchedCourse[]>([]);
    const [selectedItems, setSelectedItems] = useState<FetchedCourse[]>([]);

    const {filesContent, selectedFile, saveUserEditedCourse} = useContext(AppDataContext)!;
    const [filteredCourses, setFilteredCourses] = useState<FetchedCourse[]>([]);

    useEffect(() => {
        if (course) {
            setInternalCourse(course);
            setHasUnsavedChanges(false);
        }
    }, [course]);

    useEffect(() => {
        if (selectedFile) {
            const fileNameWithoutExtension = selectedFile.name.split(".").slice(0, -1).join(".");
            if (isCoursesFile(fileNameWithoutExtension)) {
                const fileContent = filesContent[fileNameWithoutExtension];
                if (fileContent) {
                    setFilteredCourses(fileContent);
                }
            }
        }
    }, [filesContent, selectedFile]);

    useEffect(() => {
        let data = [...filteredCourses];
        if (searchTerm) {
            const phrases = searchTerm.toLowerCase().split(",").map((phrase) => phrase.trim());
            data = data.filter((course) =>
                phrases.every((phrase) =>
                    course.name.toLowerCase().includes(phrase) ||
                    course.professor.toLowerCase().includes(phrase) ||
                    course.merged?.some((mergedItem) =>
                        mergedItem.name.toLowerCase().includes(phrase) ||
                        mergedItem.professor.toLowerCase().includes(phrase)
                    )
                )
            );
        }

        setSortedAndFilteredCourses((prev) => {
            const isSame = JSON.stringify(prev) === JSON.stringify(data);
            return isSame ? prev : data;
        });
    }, [filteredCourses, searchTerm]);

    const handleCheckboxChange = (course: FetchedCourse, isChecked: boolean) => {
        setSelectedItems((prev) => {
            if (isChecked) {
                return [...prev, course];
            } else {
                return prev.filter((item) => item.id !== course.id);
            }
        });
    };

    const handleAddClick = () => {
        if (!internalCourse) return;
        const newMergedCourses = selectedItems.map((item) => ({
            ...item,
            mergedWith: internalCourse.id,
            added: true,
        }));

        // Update the internalCourse's merged array
        const updatedMerged = [...(internalCourse.merged || []), ...newMergedCourses];
        updateInternalCourse("merged", updatedMerged);

        // Clear selected items
        setSelectedItems([]);
    };

    const updateInternalCourse = (key: string, value: unknown) => {
        if (!internalCourse) return;

        const updatedCourse = {...internalCourse, [key]: value};

        if (key === "merged" && Array.isArray(value)) {
            const acceptedCount =
                value?.filter((item: FetchedCourse) => item.accepted === true && !item.locked).length ?? 0;
            const rejectedCount =
                value?.filter((item: FetchedCourse) => item.accepted === false && !item.locked).length ?? 0;
            const notResolvedCount =
                (value?.filter((item: FetchedCourse) => !item.locked).length ?? 0) -
                acceptedCount -
                rejectedCount;

            updatedCourse.acceptedCount = acceptedCount;
            updatedCourse.rejectedCount = rejectedCount;
            updatedCourse.notResolvedCount = notResolvedCount;
        }

        setInternalCourse(updatedCourse);
        setHasUnsavedChanges(true);
    };

    const handleSave = () => {
        saveUserEditedCourse(internalCourse);
        setHasUnsavedChanges(false);
    };



    const markAsRemoved = (courseId: string) => {
        if (!internalCourse) return;

        const updatedMerged = internalCourse.merged.map((subCourse) =>
            subCourse.id === courseId ? {...subCourse, removed: true} : subCourse
        );
        if (!updatedMerged.removedCount) {
            updatedMerged.removedCount = 1;
        } else {
            updatedMerged.removedCount++;
        }
        updateInternalCourse("merged", updatedMerged);
    };

    const revertRemoval = (courseId: string) => {
        if (!internalCourse) return;

        const updatedMerged = internalCourse.merged.map((subCourse) =>
            subCourse.id === courseId ? {...subCourse, removed: false} : subCourse
        );

        updatedMerged.removedCount--
        if (updatedMerged.removedCount <= 0) {
            delete updatedMerged.removedCount
        }

        updateInternalCourse("merged", updatedMerged);
    };

    // const filteredCourses =

    if (!internalCourse) return <div>No course selected</div>;

    // const fileAiWorker = aiWorkers[selectedFile?.name];
    const nonLockedItemsCount =
        internalCourse.merged?.filter((item) => !item.locked).length ?? 0;
    const resolvedCount =
        (internalCourse.acceptedCount ?? 0) + (internalCourse.rejectedCount ?? 0);

    return (
        <div className="relative z-10 w-full h-full flex justify-center items-center gap-4">
            <ScrollArea className="w-full h-screen">
                <div className="relative bg-gray-100/40 px-4 py-2 h-full flex flex-col gap-0">
                    <div>
                        <a
                            className="text-primary underline-offset-4 hover:underline text-xs font-bold cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedItems([]);
                            }}
                        >
                            ← {selectedFile?.name || "Untitled"}
                        </a>
                    </div>

                    <Label className="text-md font-bold" htmlFor="course-name">
                        Merged Course Name
                    </Label>
                    <Textarea
                        className="font-extrabold shadow-xl text-[26px] mt-1"
                        value={internalCourse.name}
                        id="course-name"
                        onChange={(e) => updateInternalCourse("name", e.target.value)}
                    />
                    <div className="flex mt-[35px] gap-4">
                        <div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label className="text-sm font-bold" htmlFor="course-professor">
                                    Professor
                                </Label>
                                <Input
                                    id="course-professor"
                                    value={internalCourse.professor}
                                    onChange={(e) =>
                                        updateInternalCourse("professor", e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                                <Label className="text-sm font-bold" htmlFor="course-codes">
                                    Codes
                                </Label>
                                <InputTags
                                    id="course-codes"
                                    className="bg-transparent"
                                    value={internalCourse.codes || []}
                                    onChange={(codes) => updateInternalCourse("codes", codes)}
                                    placeholder="Enter values, comma separated..."
                                />
                            </div>
                            <div className="w-full max-w-sm gap-1.5 mt-3">
                                <Label className="text-sm font-bold" htmlFor="course-semesters">
                                    Offered in semesters
                                </Label>
                                <InputTags
                                    id="course-semesters"
                                    className="bg-transparent"
                                    value={internalCourse.offeredInSemesters || []}
                                    onChange={(semesters) =>
                                        updateInternalCourse("offeredInSemesters", semesters)
                                    }
                                    placeholder="Enter values, comma separated..."
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <Label className="text-sm font-bold" htmlFor="course-semesters">
                                Merged with
                            </Label>
                            <div className={`masonry`}>
                                <Masonry>
                                    {internalCourse.merged
                                        ? internalCourse.merged.map((x) => (
                                            <MergedSubCourseCard
                                                subCourse={x}
                                                key={x.id}
                                                markAsRemoved={markAsRemoved}
                                                revertRemoval={revertRemoval}
                                                setSubCourse={(updatedSubCourse) => {
                                                    if (!internalCourse.merged) return;
                                                    const updatedMerged = internalCourse.merged.map(
                                                        (sub) =>
                                                            sub.courseId === updatedSubCourse.courseId
                                                                ? updatedSubCourse
                                                                : sub
                                                    );
                                                    updateInternalCourse("merged", updatedMerged);
                                                }}
                                            />
                                        ))
                                        : null}

                                </Masonry>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="sticky right-[30px] bottom-[50px] controls">
                    <div className="flex flex-col mt-3 items-end justify-end px-2 mr-2">
                        <div>
                            <Badge
                                variant={
                                    resolvedCount === nonLockedItemsCount ? "blue" : "subtle"
                                }
                                className="mb-2"
                            >
                                Resolved {resolvedCount} / {nonLockedItemsCount}
                                {resolvedCount === nonLockedItemsCount && (
                                    <CheckIcon className="inline-block w-5 h-4 ml-[3px]"/>
                                )}
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <Popover open={isComboBoxOpen} onOpenChange={setIsComboBoxOpen} modal={true}>
                                <PopoverTrigger asChild>
                                    <Card
                                        className={`relative flex flex-col justify-center align-center items-center p-2 w-[45px]  bg-gray-50 hover:bg-gray-100 cursor-pointer`}
                                    >
                                        <PlusIcon className="w-6 h-6 text-gray-500"/>
                                    </Card>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] h-[400px] p-0" align={"end"}>
                                    <Command>
                                        <Input
                                            placeholder="Search courses..."
                                            value={searchTerm}
                                            onInput={(value) => setSearchTerm(value.target.value)}
                                        />
                                        {searchTerm.trim() === "" ? (
                                            <CommandEmpty>Type to search for courses...</CommandEmpty>
                                        ) : sortedAndFilteredCourses.length === 0 ? (
                                            <CommandEmpty>No courses found.</CommandEmpty>
                                        ) : (
                                            <div style={{height: "calc(100% - 40px)", overflow: "auto"}}>
                                                <VirtualList
                                                    height={355}
                                                    width={398}
                                                    data={sortedAndFilteredCourses}
                                                    renderer={(course) => (
                                                        <div key={course.id}>
                                                            {/* Render the main course */}
                                                            <div
                                                                onClick={() => {
                                                                    if (course.merged && course.merged.length) return;
                                                                    const isChecked = selectedItems.find(x => x.id === course.id);
                                                                    handleCheckboxChange(course, !isChecked);
                                                                }}
                                                            >
                                                                <CommandItem value={course.name}>
                                                                    <div
                                                                        className="flex items-center justify-between w-full">
                                                                        <div>
                                                                            <span
                                                                                className="font-bold">{highlightText(course.name, searchTerm)}</span>
                                                                            <div className="text-sm text-gray-500">
                                                                                {highlightText(course.professor, searchTerm)}
                                                                            </div>
                                                                        </div>
                                                                        <Checkbox
                                                                            checked={!!selectedItems.find(x => x.id === course.id)}
                                                                            onCheckedChange={(isChecked) =>
                                                                                handleCheckboxChange(course, isChecked as boolean)
                                                                            }
                                                                            disabled={course.merged && course.merged.length}
                                                                            onClick={(e) => e.stopPropagation()} // Prevents triggering the parent onClick
                                                                        />
                                                                    </div>
                                                                </CommandItem>
                                                            </div>

                                                            {/* Render merged courses if they match the search term */}
                                                            {course.merged?.map((mergedItem) => {
                                                                const matchesSearch =
                                                                    mergedItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                    mergedItem.professor.toLowerCase().includes(searchTerm.toLowerCase());

                                                                return (
                                                                    matchesSearch && (
                                                                        <div
                                                                            key={mergedItem.id}
                                                                            className="ml-4"
                                                                            onClick={() => {
                                                                                if(course.id === mergedItem.id) return;
                                                                                const isChecked = selectedItems.find(x => x.id === mergedItem.id);
                                                                                handleCheckboxChange(mergedItem, !isChecked);
                                                                            }}
                                                                        >
                                                                            <CommandItem value={mergedItem.name}>
                                                                                <div
                                                                                    className="flex items-center justify-between w-full">
                                                                                    <div>
                                                                            <span className="font-bold">
                                                                              {highlightText(mergedItem.name, searchTerm)}
                                                                            </span>
                                                                                        <div
                                                                                            className="text-sm text-gray-500">
                                                                                            {highlightText(mergedItem.professor, searchTerm)}
                                                                                        </div>
                                                                                    </div>
                                                                                    <Checkbox
                                                                                        disabled={course.id === mergedItem.id}
                                                                                        checked={!!selectedItems.find(x => x.id === mergedItem.id)}
                                                                                        onCheckedChange={(isChecked) =>
                                                                                            handleCheckboxChange(mergedItem, isChecked as boolean)
                                                                                        }
                                                                                        onClick={(e) => e.stopPropagation()} // Prevents triggering the parent onClick
                                                                                    />
                                                                                </div>
                                                                            </CommandItem>
                                                                        </div>
                                                                    )
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                    searchTerm={searchTerm}
                                                />

                                            </div>
                                        )}
                                    </Command>
                                    {selectedItems.length > 0 && (
                                        <div className="flex justify-end p-2">
                                            <Button onClick={handleAddClick}>Add</Button>
                                        </div>
                                    )}
                                </PopoverContent>
                            </Popover>
                            <Button onClick={handleSave}>Save</Button>
                        </div>
                        <div className="mt-2 text-sm">
                            <p
                                className={`text-${
                                    hasUnsavedChanges ? "red-500" : "gray-500"
                                } text-sm`}
                            >
                                {hasUnsavedChanges
                                    ? "You have unsaved changes"
                                    : "No changes to save"}
                            </p>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default MergedCourseCard;
