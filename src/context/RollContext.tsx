import React, { createContext, useContext, ReactNode } from "react";

// 1️⃣ Define what each handler looks like
export type RollHandler = (nodeId: string) => void;

// 2️⃣ Define the context shape
interface RollContextType {
  onRollUpChildren: RollHandler;
  onRollUpAncestors: RollHandler;
  onRollDownChildren: RollHandler;
  onRollDownAncestors: RollHandler;
}

// 3️⃣ Create context with default undefined
const RollContext = createContext<RollContextType | undefined>(undefined);

// 4️⃣ Provider props
interface RollProviderProps {
  onRollUpChildren: RollHandler;
  onRollUpAncestors: RollHandler;
  onRollDownChildren: RollHandler;
  onRollDownAncestors: RollHandler;
  children: ReactNode;
}

// 5️⃣ Provider component
export const RollProvider: React.FC<RollProviderProps> = ({
  onRollUpChildren,
  onRollUpAncestors,
  onRollDownChildren,
  onRollDownAncestors,
  children,
}) => {
  return (
    <RollContext.Provider value={{ onRollUpChildren, onRollUpAncestors, onRollDownChildren, onRollDownAncestors }}>
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