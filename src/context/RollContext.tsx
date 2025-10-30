import React, { createContext, useContext, ReactNode } from "react";

// 1️⃣ Define what each handler looks like
export type RollHandler = (nodeId: string) => void;

// 2️⃣ Define the context shape
interface RollContextType {
  onRollUp: RollHandler;
  onRollDown: RollHandler;
}

// 3️⃣ Create context with default undefined
const RollContext = createContext<RollContextType | undefined>(undefined);

// 4️⃣ Provider props
interface RollProviderProps {
  onRollUp: RollHandler;
  onRollDown: RollHandler;
  children: ReactNode;
}

// 5️⃣ Provider component
export const RollProvider: React.FC<RollProviderProps> = ({
  onRollUp,
  onRollDown,
  children,
}) => {
  return (
    <RollContext.Provider value={{ onRollUp, onRollDown }}>
      {children}
    </RollContext.Provider>
  );
};

// 6️⃣ Hook to use both roll functions
export const useRoll = (): RollContextType => {
  const context = useContext(RollContext);
  if (!context) {
    throw new Error("useRoll must be used within a RollProvider");
  }
  return context;
};