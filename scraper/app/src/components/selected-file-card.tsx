import { useContext, useEffect } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AppDataContext } from "@/context/app-data-context.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
// import { ProgressBar } from "@/components/ui/progress.tsx";

const SelectedFileCard = () => {
  const {
    selectedFile,
    deleteFile,
    filesContent,
    finishKeySimilarityMerging,
    coursesNamesMergingAiForWholeFile,
    isAiWorking,
    // Remove aiProgress since it's unused
    totalData,
    setTotalData,
    analyzedData,
  } = useContext(AppDataContext)!;

  useEffect(() => {
    if (selectedFile && isAiWorking) {
      // Update totalData and analyzedData based on the selected file
      const fileNameWithoutExtension = selectedFile.name.replace(/\.json$/, "");
      const total = filesContent[fileNameWithoutExtension]?.length || 0;
      setTotalData(total);
      // setAnalyzedData(0); // Reset analyzed data
    }
  }, [selectedFile, isAiWorking]);

  // Calculate progress percentage
  const progressPercentage =
    totalData > 0 ? (analyzedData / totalData) * 100 : 0;

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
              <Button onClick={handlePreview} loading={isAiWorking}>
                Preview
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                loading={isAiWorking}
              >
                Delete File
              </Button>
              {isMergedFileReady && (
                <Button
                  onClick={() =>
                    finishKeySimilarityMerging([selectedFile.name], "merged")
                  }
                  loading={isAiWorking}
                >
                  Finish merging
                </Button>
              )}
              {isMergingFile && (
                <Button
                  onClick={() => coursesNamesMergingAiForWholeFile()}
                  loading={isAiWorking}
                >
                  Auto accept/decline merged sub-courses
                </Button>
              )}
            </div>
            {isAiWorking && (
              <div className="mt-4">
                <p className="text-sm">
                  Analyzed: {analyzedData} / {totalData} (
                  {progressPercentage.toFixed(2)}%)
                </p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SelectedFileCard;
