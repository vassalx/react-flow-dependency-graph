import { DiagramData } from "../../common/types";

const localStorageKey = "";

const useCachedDiagramData = () => {

  const setCachedDiagramData = (newData: DiagramData, id: string) => {
    localStorage.setItem(
      localStorageKey + id,
      JSON.stringify(newData)
    );
  };

  const getCachedDiagramData = (id: string) => {
    const storageData = localStorage.getItem(localStorageKey + id);
    return storageData ? JSON.parse(storageData) : null;
  };

  return {
    getCachedDiagramData,
    setCachedDiagramData,
  };
};

export default useCachedDiagramData;
