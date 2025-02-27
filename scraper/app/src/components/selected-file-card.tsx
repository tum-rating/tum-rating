import { useContext } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AppDataContext } from "@/context/app-data-context.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";

const SelectedFileCard = () => {
  const { selectedFile, deleteFile, filesContent,finishKeySimilarityMerging,coursesNamesMergingAiForWholeFile } =
    useContext(AppDataContext)!;

  if (!selectedFile) {
    return <div>No file selected</div>;
  }

  const handleDelete = () => {
    if (selectedFile) {
      deleteFile(selectedFile.name);
    }
  };

  const handlePreview = () => {
    if (selectedFile) {
      window.open(
        import.meta.env.VITE_API_URL + "/files/" + selectedFile.name,
        "_blank",
      );
    }
  };


const isMergingFile = selectedFile.name.includes("merge")
  const isMergedFileReady = isMergingFile ? !filesContent[selectedFile.name.replace(/\.json$/, "")]?.some(x=> "notResolvedCount" in x && x.notResolvedCount > 0) : false;
  console.log(filesContent[selectedFile.name.replace(/\.json$/, "")])
  console.log(selectedFile.name.replace(/\.json$/, ""))
  console.log(isMergedFileReady)
  console.log(filesContent)
  console.log(selectedFile)

  return (
    <div className="relative z-10 w-full h-full flex justify-center items-center gap-4">
      <ScrollArea className="w-full h-screen">
        <div className="relative bg-gray-100/40 p-4 h-full flex flex-col gap-0">
          <div className="flex items-center mb-4 gap-2">
            <h2 className="text-2xl font-bold ">{selectedFile.name}</h2>
            <Badge>{selectedFile.id}</Badge>
          </div>
          <div className="mb-4">
            <p className="text-sm font-semibold">Size:</p> {selectedFile.size}{" "}
            bytes
          </div>
          <div className="mb-4">
            <p className="text-sm font-semibold">Last Modified:</p>{" "}
            {selectedFile.lastModified.toLocaleString()}
          </div>
          <div className="mb-4">
            <p className="text-sm font-semibold">Actions:</p>
            <div className="flex gap-1">
              <Button onClick={handlePreview}>Preview</Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete File
              </Button>
              {isMergedFileReady && <Button onClick={()=>{
                finishKeySimilarityMerging([selectedFile.name],"merged")
              }}>Finish merging</Button>}
              {isMergingFile && <Button  onClick={()=>{
                coursesNamesMergingAiForWholeFile()
              }}>Auto accept/decline merged sub-courses </Button>}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SelectedFileCard;
