import { useState } from "react";

const localStorageDraggableKey = "draggable";

const useDraggable = () => {
  const [draggable, setDraggable] = useState<boolean>(
    !(localStorage.getItem(localStorageDraggableKey) === "false")
  );

  const handleSetDraggable = (status: boolean) => {
    localStorage.setItem(localStorageDraggableKey, String(status));
    setDraggable(status);
  };

  return { draggable, setDraggable: handleSetDraggable };
};

export default useDraggable;
