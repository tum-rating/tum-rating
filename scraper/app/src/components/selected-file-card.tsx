import { useContext, useEffect, useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AppDataContext } from "@/context/app-data-context.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";

const SelectedFileCard = () => {
  const {
    selectedFile,
    deleteFile,
    filesContent,
    finishKeySimilarityMerging,
    coursesNamesMergingAiForWholeFile,
      checkCorrectnessBatchedCourses,
    aiWorkers,
  } = useContext(AppDataContext)!;

  const [statusMessage, setStatusMessage] = useState("");
  const fileAiWorker = aiWorkers[selectedFile.name];
  useEffect(() => {
    if (fileAiWorker) {
      switch (fileAiWorker.status) {
        case "in-progress":
          setStatusMessage("Merging in progress");
          break;
        case "success":
          setStatusMessage("Merging finished");
          break;
        case "error":
          setStatusMessage("Merging failed");
          break;
        default:
          setStatusMessage("");
      }
    }
  }, [fileAiWorker]);

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

  const isMergingFile = selectedFile.name.includes("merge");
  const isMergedFileReady = isMergingFile
    ? !filesContent[selectedFile.name.replace(/\.json$/, "")]?.some(
        (x) => x.notResolvedCount != null && x.notResolvedCount > 0,
      )
    : false;



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
              <Button onClick={handlePreview} loading={fileAiWorker?.status === "in-progress"}>
                Preview
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                loading={fileAiWorker?.status === "in-progress"}
              >
                Delete File
              </Button>
              {isMergedFileReady && (
                <Button
                  onClick={() =>
                    finishKeySimilarityMerging([selectedFile.name], "merged")
                  }
                  loading={fileAiWorker?.status === "in-progress"}
                >
                  Finish merging
                </Button>
              )}
              {isMergingFile && (
                <Button
                  onClick={() => coursesNamesMergingAiForWholeFile()}
                  loading={fileAiWorker?.status === "in-progress"}
                >
                  Auto accept/decline merged sub-courses
                </Button>
              )}
              {isMergingFile && (
                  <Button
                      onClick={()=> checkCorrectnessBatchedCourses()}
                        loading={fileAiWorker?.status === "in-progress"}
                  >
                    Check
                  </Button>
              )}
            </div>
            {fileAiWorker && (
              <div className="mt-4">
                <p className="text-sm">{statusMessage}</p>
                {fileAiWorker.status === "in-progress" && (
                  <p className="text-sm">{fileAiWorker.progress.toFixed(2)}%)</p>
                )}
              </div>
            )}

          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SelectedFileCard;