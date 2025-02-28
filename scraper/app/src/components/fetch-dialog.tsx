import {PropsWithChildren, useContext, useEffect, useState} from "react";
import {AppDataContext} from "@/context/app-data-context.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@radix-ui/react-label";
import {Minus, Plus} from "lucide-react";
import {MultiSelect} from "@/components/ui/multi-select.tsx";

interface FetchingConfiguration {
    typeOfData: string;
    customSuffix: string;
    dependentFile?: string;
    dependentFileData?: any;
}

interface FetchingConfigurationFormProps {
    config: FetchingConfiguration;
    onChange: (config: FetchingConfiguration) => void;
}

const FetchingConfigurationForm = ({config, onChange}: FetchingConfigurationFormProps) => {
    const {serverFilesystemConfig, files, filesContent, getAndUseFileContent} = useContext(AppDataContext)!;
    const [fileSelection, setFileSelection] = useState<string | null>(null);
    const [internalFilesContent, setInternalFilesContent] = useState<any>({});
    const renderDependentFileSelection = () => {
        const selectedFileDependency = serverFilesystemConfig?.files.find(
          (x: { id: string | null }) => x.id === fileSelection,
        )?.dependencies;
        if (fileSelection && selectedFileDependency && selectedFileDependency.length > 0) {
            console.log(selectedFileDependency)
            console.log(fileSelection)
            console.log(files)
            const matchingExistingFiles = files.filter(x => x.id.includes(selectedFileDependency[0])) || []
            console.log(matchingExistingFiles)
            return (
                <>
                    <div className="grid w-full items-center gap-1.5">
                        <Label className='text-xs' htmlFor="type-of-data">Dependent file</Label>
                        <Select disabled={!matchingExistingFiles} value={config.dependentFile}
                                onValueChange={async (value) => {
                                    const data = await getAndUseFileContent({
                                        name: value,
                                        id: selectedFileDependency[0],
                                        size: 0,
                                        lastModified: new Date(),
                                    })

                                    setInternalFilesContent(data)
                                    onChange({...config, dependentFile: value})
                                }}>
                            <SelectTrigger id={'type-of-data'} className="w-[180px]">
                                <SelectValue placeholder="Select dependent file"/>
                            </SelectTrigger>
                            <SelectContent>
                                {matchingExistingFiles.map((file: any) => (
                                    <SelectItem key={file.name} value={file.name}>{file.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {
                            matchingExistingFiles.length === 0 && <span className='text-red-500 text-xs'>
                        no {selectedFileDependency[0]} files found
                        </span>
                        }
                    </div>
                    {
                        config.dependentFile?.includes("tum-semesters") ? (
                            <div className="grid w-auto max-w-sm items-center gap-1.5">
                                <Label className='text-xs' htmlFor="type-of-semesters">Semesters</Label>
                                <MultiSelect
                                    options={Object.entries(internalFilesContent).map(([key, value],) => {
                                        return {
                                            value: key as string,
                                            label: value as string,
                                        }
                                    }).reverse()}
                                    onValueChange={(value) => {
                                        config.dependentFileData = value
                                    }}
                                    defaultValue={[]}
                                    placeholder="Select semesters"
                                    variant="inverted"
                                    maxCount={4}
                                />
                            </div>
                        ) : null
                    }
                </>
            )
        }
        return null
    }
    return (
        <div className='flex flex-col gap-2'>
            <div className={'flex gap-3'}>
                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label className='text-xs' htmlFor="type-of-data">Type of data</Label>
                    <Select value={config.typeOfData} onValueChange={(value) => {
                        onChange({...config, typeOfData: value})
                        setFileSelection(value)
                    }}>
                        <SelectTrigger id={'type-of-data'} className="w-[180px]">
                            <SelectValue placeholder="Select file"/>
                        </SelectTrigger>
                        <SelectContent>
                            {serverFilesystemConfig?.files.map((file: any) => (
                                <SelectItem key={file.id} value={file.id}>{file.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className='text-xs' htmlFor="data-custom-suffix">Custom suffix</Label>
                    <Input
                        placeholder={'Your custom suffix'}
                        value={config.customSuffix}
                        onChange={(e) => onChange({...config, customSuffix: e.target.value})}
                        id={'data-custom-suffix'}
                    />
                </div>
            </div>
            {
                renderDependentFileSelection()
            }
        </div>
    );
};

const FetchDialog = (props: PropsWithChildren) => {
    const {
        startFetchingProductionCourses,
        startFetchingTUMSemesters,
        startFetchingTUMCourses,
        startFetchingMrozonRatingData
    } = useContext(AppDataContext)!;
    const [configurations, setConfigurations] = useState<FetchingConfiguration[]>([{typeOfData: "", customSuffix: ""}]);
    const [errors, setErrors] = useState<string[]>([]);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        if (open) {
            setConfigurations([{typeOfData: "", customSuffix: ""}]);
            setErrors([""]);
        }
    }, []);

    const addConfiguration = () => {
        setConfigurations([...configurations, {typeOfData: "", customSuffix: ""}]);
        setErrors([...errors, ""]);
    };

    const removeConfiguration = () => {
        if (configurations.length > 1) {
            const newConfigurations = configurations.slice(0, configurations.length - 1);
            setConfigurations(newConfigurations);
            setErrors(errors.slice(0, errors.length - 1));
        }
    };

    const updateConfiguration = (index: number, updatedConfig: FetchingConfiguration) => {
        const newConfigurations = configurations.map((config, i) => i === index ? updatedConfig : config);
        setConfigurations(newConfigurations);
    };

    const validateConfigurations = () => {
        const newErrors = configurations.map(config => {
            if (!config.customSuffix || config.customSuffix.length < 1) {
                return "Each configuration must have a suffix with at least one character.";
            }
            return "";
        });

        setErrors(newErrors);

        if (newErrors.some(error => error !== "")) {
            return false;
        }

        if (configurations.length === 0) {
            alert("You must add at least one configuration.");
            return false;
        }

        return true;
    };

    const startFetching = () => {
        if (validateConfigurations()) {
            configurations.forEach(config => {
                if (config.typeOfData === "courses-production") {
                    startFetchingProductionCourses(config.customSuffix);
                } else if (config.typeOfData === "tum-semesters") {
                    startFetchingTUMSemesters(config.customSuffix);
                } else if (config.typeOfData === "courses-tum-campus") {
                    startFetchingTUMCourses(config.customSuffix, config.dependentFileData);
                } else {

                    startFetchingMrozonRatingData(config.customSuffix);
                }
            });
            setOpen(false); // Close the dialog after starting the fetching process
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {props.children}
            </DialogTrigger>
            <DialogContent className={'max-w-[700px]'}>
                <DialogHeader>
                    <DialogTitle>Fetching interface</DialogTitle>
                    <DialogDescription>
                        Add fetching configuration for data that you want to fetch.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    {configurations.map((config, index) => (
                        <div className={'bg-gray-100/60 px-3 py-2 rounded-md flex justify-between items-center gap-4'}
                             key={index}>
                            <FetchingConfigurationForm
                                config={config}
                                onChange={(updatedConfig) => updateConfiguration(index, updatedConfig)}
                            />
                            <div className={'flex gap-1 w-[70px]'}>
                                {
                                    index === configurations.length - 1 && (
                                        <Button size={'icon'} onClick={addConfiguration}>
                                            <Plus className={'w-6 h-6'}/>
                                        </Button>
                                    )
                                }
                                {
                                    index >= 0 && configurations.length > 0 && (
                                        <Button size={'icon'} onClick={removeConfiguration}>
                                            <Minus className={'w-6 h-6'}/>
                                        </Button>
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <div className="flex flex-col gap-2">
                        <Button onClick={startFetching}>Start fetching</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FetchDialog;