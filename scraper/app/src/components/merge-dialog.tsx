import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { AppDataContext } from "@/context/app-data-context.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";

const METHODS_SOURCE_MAP = [
  {
    type: "key-similarity",
    label: "Key similarity",
    fileType: ["courses-production", "courses-tum-campus", "merged"],
  }
  // {
  //   type: "key-similarity-ai",
  //   label: "Key similarity using ai",
  //   fileType: ["courses-production", "courses-tum-campus", "merged"],
  // },
];

const MergeDialog = (props: PropsWithChildren) => {
  const { files, keySimilarityMerging, keySimilarityMergingAi } =
    useContext(AppDataContext)!;
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<string | undefined>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customSuffix, setCustomSuffix] = useState<string>("");

  useEffect(() => {
    setMethod("");
    setSelectedItems([]);
    setCustomSuffix("");
  }, []);

  const toggleSelectItem = (itemName: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemName)
        ? prevSelectedItems.filter((item) => item !== itemName)
        : [...prevSelectedItems, itemName],
    );
  };

  const startMerging = async () => {
    if (!method) return;
    if (!customSuffix) return;

    if (method === "key-similarity") {
      keySimilarityMerging(selectedItems, customSuffix);
    } else if (method === "key-similarity-ai") {
      keySimilarityMergingAi(selectedItems, customSuffix);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className={"max-w-[700px]"}>
        <DialogHeader>
          <DialogTitle>Merging interface</DialogTitle>
          <DialogDescription>
            Here you can merge courses from different sources with selected
            method
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="grid w-full items-center gap-1.5">
            <Label className="text-xs" htmlFor="type-of-data">
              Dependent file
            </Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger id={"type-of-data"} className="w-[180px]">
                <SelectValue placeholder="Select merge method" />
              </SelectTrigger>
              <SelectContent>
                {METHODS_SOURCE_MAP.map((method) => (
                  <SelectItem key={method.type} value={method.type}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {method && (
              <>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label className="text-xs" htmlFor="data-custom-suffix">
                    Custom suffix
                  </Label>
                  <Input
                    placeholder={"Your custom suffix"}
                    value={customSuffix}
                    onChange={(e) => setCustomSuffix(e.target.value)}
                    id={"data-custom-suffix"}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {files.map((file) => {
                    const isDisabled = !METHODS_SOURCE_MAP.find(
                      (m) => m.type === method,
                    )?.fileType.some((ft) => file.name.includes(ft));
                    return (
                      <div
                        key={file.name}
                        className={`text-xs px-3 py-2 font-bold border-2 rounded-sm cursor-pointer ${
                          selectedItems.includes(file.name)
                            ? "bg-blue-500 text-white border-blue-700"
                            : "bg-gray-100 border-gray-200"
                        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() =>
                          !isDisabled && toggleSelectItem(file.name)
                        }
                      >
                        {file.name}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        <DialogFooter>
          <div className="flex flex-col gap-2">
            <Button onClick={startMerging}>Start merging</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MergeDialog;
