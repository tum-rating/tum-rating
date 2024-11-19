import { createContext, PropsWithChildren, useEffect, useState, useTransition } from 'react';
import { FetchedComputedCourse, FetchedData } from '@/types/fetchedData.ts';
import { TreeDataItem } from '@/components/tree-view';

interface AppDataContextType {
  appData: FetchedData;
  isPending: boolean;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  computedDataToCheck: FetchedComputedCourse[] | undefined;
  getSelectedItemById: (id: string | null) => FetchedComputedCourse | undefined;
  saveSelectedCourse: (course: FetchedComputedCourse) => void;
  fileSystem: TreeDataItem[];
  fetchFileSystem: () => void;
}

const AppDataContext = createContext<AppDataContextType>({
  appData: {
    computedCourses: [],
    allCoursesMap: {},
    allCourses: []
  },
  isPending: false,
  selectedItemId: null,
  setSelectedItemId: () => {},
  computedDataToCheck: undefined,
  getSelectedItemById: () => undefined,
  saveSelectedCourse: () => {},
  fileSystem: [],
  fetchFileSystem: () => {}
});

type AppDataContextProps = PropsWithChildren;

const AppDataProvider = ({ children }: AppDataContextProps) => {
  const [appData, setAppData] = useState<FetchedData>({ computedCourses: [], allCoursesMap: {}, allCourses: [] });
  const [computedDataToCheck, setComputedDataToCheck] = useState<FetchedComputedCourse[]>([]);
  const [computedCoursesMap, setComputedCoursesMap] = useState(new Map());
  const [isPending, startTransition] = useTransition();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [fileSystem, setFileSystem] = useState<TreeDataItem[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      ws.send(JSON.stringify({ action: 'list' }));
    };

    ws.onmessage = (event) => {
      const { action, files } = JSON.parse(event.data);

      if (action === 'list') {
        setFileSystem(files);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const fetchFileSystem = () => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      ws.send(JSON.stringify({ action: 'list' }));
    };
    ws.onmessage = (event) => {
      const { action, files } = JSON.parse(event.data);
      if (action === 'list') {
        setFileSystem(files);
      }
    };
  };

  const saveSelectedCourse = (updatedCourse: FetchedComputedCourse) => {
    if (!updatedCourse || !computedDataToCheck) return;

    setComputedDataToCheck((prev) => {
      if (!prev) return prev;
      return prev.map(course => course.id === updatedCourse.id ? updatedCourse : course);
    });
  };

  const getSelectedItemById = (selectedId: string | null): FetchedComputedCourse | undefined => {
    return selectedId ? computedCoursesMap.get(selectedId) : undefined;
  };

  return (
    <AppDataContext.Provider value={{
      appData,
      isPending,
      selectedItemId,
      setSelectedItemId,
      computedDataToCheck,
      getSelectedItemById,
      saveSelectedCourse,
      fileSystem,
      fetchFileSystem
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export {
  AppDataProvider,
  AppDataContext
};