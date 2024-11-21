import { useContext } from "react";
import { FileData } from "@/types/fetchedData.ts";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AppDataContext } from "@/context/app-data-context.tsx";
import { Button } from "@/components/ui/button.tsx";

const SelectedFileCard = () => {
    const { selectedFile, deleteFile } = useContext(AppDataContext);

    const handleDelete = () => {
        if (selectedFile) {
            deleteFile(selectedFile.name);
        }
    };

    if (!selectedFile) {
        return <div>No file selected</div>;
    }

    return (
        <div className="relative z-10 w-full h-full flex justify-center items-center gap-4">
            <ScrollArea className='w-full h-screen'>
                <div className='relative bg-gray-100/40 p-4 h-full flex flex-col gap-0'>
                    <h2 className="text-2xl font-bold mb-4">{selectedFile.name}</h2>
                    <div className="mb-4">
                        <p className={'text-sm font-semibold'}>Size:</p> {selectedFile.size} bytes
                    </div>
                    <div className="mb-4">
                        <p className={'text-sm font-semibold'}>Last Modified:</p> {selectedFile.lastModified.toLocaleString()}
                    </div>
                    <div className="mb-4">
                       <p className={'text-sm font-semibold'}>Actions:</p>
                        <Button variant="destructive" onClick={handleDelete}>Delete File</Button>
                    </div>
                    <pre
                        className="bg-gray-100 text-xs p-4 rounded max-h-[500px] overflow-y-scroll">{selectedFile.content}</pre>
                </div>
            </ScrollArea>
        </div>
    );
};

export default SelectedFileCard;