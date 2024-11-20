import { useContext } from "react";
import { FileData } from "@/types/fetchedData.ts";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AppDataContext } from "@/context/app-data-context.tsx";

interface SelectedFileCardProps {
    file: FileData;
}

const SelectedFileCard = () => {
    const { selectedFile } = useContext(AppDataContext);

    console.log(selectedFile)
    if (!selectedFile) {
        return <div>No file selected</div>;
    }

    return (
        <div className="relative z-10 w-full h-full flex justify-center items-center gap-4">
            <ScrollArea className='w-full h-screen'>
                <div className='relative bg-gray-100/40 p-4 h-full flex flex-col gap-0'>
                    <h2 className="text-2xl font-bold mb-4">{selectedFile.name}</h2>
                    <div className="mb-4">
                        <strong>Size:</strong> {selectedFile.size} bytes
                    </div>
                    <div className="mb-4">
                        <strong>Last Modified:</strong> {selectedFile.lastModified.toLocaleString()}
                    </div>
                    <pre className="bg-gray-100 p-4 rounded">{selectedFile.content}</pre>
                </div>
            </ScrollArea>
        </div>
    );
};

export default SelectedFileCard;
