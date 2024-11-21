// scraper/app/src/components/fetch-dialog.tsx
import { PropsWithChildren, useContext, useState } from "react";
import { AppDataContext } from "@/context/app-data-context.tsx";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import { Dialog } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { serverFilesystemConfig } from "../../server-filesystem-config.ts";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@radix-ui/react-label";
import { Minus, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress.tsx";

interface FetchingConfiguration {
    typeOfData: string;
    customSuffix: string;
}

interface FetchingConfigurationFormProps {
    config: FetchingConfiguration;
    onChange: (config: FetchingConfiguration) => void;
}

const FetchingConfigurationForm = ({ config, onChange }: FetchingConfigurationFormProps) => {
    return (
        <div className={'flex gap-3'}>
            <div className="grid w-auto max-w-sm items-center gap-1.5">
                <Label className='text-xs' htmlFor="type-of-data">Type of data</Label>
                <Select value={config.typeOfData} onValueChange={(value) => onChange({ ...config, typeOfData: value })}>
                    <SelectTrigger id={'type-of-data'} className="w-[180px]">
                        <SelectValue placeholder="Select file" />
                    </SelectTrigger>
                    <SelectContent>
                        {serverFilesystemConfig.files.map(file => (
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
                    onChange={(e) => onChange({ ...config, customSuffix: e.target.value })}
                    id={'data-custom-suffix'}
                />
            </div>
        </div>
    );
};

const FetchDialog = (props: PropsWithChildren) => {
    const { startFetchingProductionCourses, startFetchingTUMSemesters, fetchProgress } = useContext(AppDataContext);
    const [configurations, setConfigurations] = useState<FetchingConfiguration[]>([{ typeOfData: "", customSuffix: "" }]);
    const [errors, setErrors] = useState<string[]>([]);

    const addConfiguration = () => {
        setConfigurations([...configurations, { typeOfData: "", customSuffix: "" }]);
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
                }
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {props.children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Fetching interface</DialogTitle>
                    <DialogDescription>
                        Add fetching configuration for data that you want to fetch.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    {configurations.map((config, index) => (
                        <div className={'bg-gray-100/60 px-3 py-2 rounded-md flex items-center gap-4'} key={index}>
                            <FetchingConfigurationForm
                                config={config}
                                onChange={(updatedConfig) => updateConfiguration(index, updatedConfig)}
                            />
                            <div className={'flex gap-1'}>
                                {
                                    index === configurations.length - 1 && (
                                        <Button size={'icon'} onClick={addConfiguration}>
                                            <Plus className={'w-6 h-6'} />
                                        </Button>
                                    )
                                }
                                {
                                    index >= 0 && configurations.length > 0 && (
                                        <Button size={'icon'} onClick={removeConfiguration}>
                                            <Minus className={'w-6 h-6'} />
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
                        {Object.keys(fetchProgress).map(type => (
                            <div key={type}>
                                <div>{type} Progress: {fetchProgress[type]}</div>
                                <Progress value={fetchProgress[type]} />
                            </div>
                        ))}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FetchDialog;