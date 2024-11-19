import { TreeDataItem, TreeView } from "@/components/tree-view.tsx";
import useAppData from "@/hooks/useAppData";
import {useEffect} from "react";

interface LeftSidebarProps {
  isOpen: boolean;
}

const LeftSidebar = ({ isOpen }: LeftSidebarProps) => {
  const { fileSystem, fetchFileSystem } = useAppData();

  useEffect(() => {
    fetchFileSystem();
  }, [fetchFileSystem]);

  return (
    <div className={`Sidebar ${isOpen ? 'w-[243px]' : 'w-[0px]'} transition-width duration-300 ease-in-out`}>
      <TreeView data={fileSystem} />
    </div>
  );
};

export default LeftSidebar;