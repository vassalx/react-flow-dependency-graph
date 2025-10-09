import { useEffect, useState } from "react";
import { DiagramData } from "../../common/types";

const localStorageKey = "";

type UseCachedDiagramData = {
  id: string;
};

const useCachedDiagramData = ({ id }: UseCachedDiagramData) => {
  const [cachedDiagramData, setCachedDiagramData] =
    useState<DiagramData | null>(null);

  useEffect(() => {
    const storageData = localStorage.getItem(localStorageKey + id);
    setCachedDiagramData(storageData && JSON.parse(storageData));
  }, [id]);

  const handleChangeDiagramData = (newData: DiagramData) => {
    localStorage.setItem(
      localStorageKey + newData.id || id,
      JSON.stringify(newData)
    );
    setCachedDiagramData(newData);
  };

  return { cachedDiagramData, setCachedDiagramData: handleChangeDiagramData };
};

export default useCachedDiagramData;
