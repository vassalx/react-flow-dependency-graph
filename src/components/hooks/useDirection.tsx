import { useEffect, useRef, useState } from "react";
import { ElkDirectionType } from "../../common/getElkLayout";

const localStorageDirKey = "dir_";

type UseDirectionProps = {
  id: string;
};

const useDirection = ({ id }: UseDirectionProps) => {
  const [direction, setDirection] = useState<ElkDirectionType>("LEFT");

  const currentIdRef = useRef(id); 

  const handleChangeDirection = (newDirection: ElkDirectionType) => {
    setDirection(newDirection);
    localStorage.setItem(localStorageDirKey + currentIdRef.current, newDirection);
  };

  useEffect(() => {
    currentIdRef.current = id;
    if (id) {
      const newDirection = localStorage.getItem(localStorageDirKey + id);
      if (newDirection) {
        setDirection(newDirection as ElkDirectionType);
      }
    }
  }, [id]);

  return { direction, setDirection: handleChangeDirection };
};

export default useDirection;
