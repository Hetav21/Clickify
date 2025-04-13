import { createContext, useContext } from "react";

type UpdateContextType = {
  shouldUpdate: boolean;
  setShouldUpdate: (value: boolean) => void;
};

export const UpdateContext = createContext<UpdateContextType | undefined>(
  undefined,
);

export const useUpdateContext = () => {
  const context = useContext(UpdateContext);
  if (!context) {
    throw new Error("useUpdate must be used within an UpdateProvider");
  }
  return context;
};
