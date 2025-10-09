import React, { createContext, useContext, ReactNode } from "react";

// 1️⃣ Define what a signal handler looks like
export type RollDownHandler = (nodeId: string) => void;

// 2️⃣ Create context with an optional function
const RollDownContext = createContext<RollDownHandler | undefined>(undefined);

// 3️⃣ Provider props
interface RollDownProviderProps {
  onRollDown: RollDownHandler;
  children: ReactNode;
}

// 4️⃣ Provider component
export const RollDownProvider: React.FC<RollDownProviderProps> = ({ onRollDown, children }) => {
  return (
    <RollDownContext.Provider value={onRollDown}>
      {children}
    </RollDownContext.Provider>
  );
};

// 5️⃣ Hook to use signal sender in any child
export const useRollDown = (): RollDownHandler => {
  const context = useContext(RollDownContext);
  if (!context) {
    throw new Error("useRollDown must be used within a RollDownProvider");
  }
  return context;
};
