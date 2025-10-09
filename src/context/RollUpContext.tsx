import React, { createContext, useContext, ReactNode } from "react";

// 1️⃣ Define what a signal handler looks like
export type RollUpHandler = (nodeId: string) => void;

// 2️⃣ Create context with an optional function
const RollUpContext = createContext<RollUpHandler | undefined>(undefined);

// 3️⃣ Provider props
interface RollUpProviderProps {
  onRollUp: RollUpHandler;
  children: ReactNode;
}

// 4️⃣ Provider component
export const RollUpProvider: React.FC<RollUpProviderProps> = ({ onRollUp, children }) => {
  return (
    <RollUpContext.Provider value={onRollUp}>
      {children}
    </RollUpContext.Provider>
  );
};

// 5️⃣ Hook to use signal sender in any child
export const useRollUp = (): RollUpHandler => {
  const context = useContext(RollUpContext);
  if (!context) {
    throw new Error("useRollUp must be used within a RollUpProvider");
  }
  return context;
};
