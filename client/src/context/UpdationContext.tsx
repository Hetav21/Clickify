import { UpdateContext } from "@/hooks/useUpdateContext";
import { ReactNode, useState } from "react";

export const UpdateProvider = ({ children }: { children: ReactNode }) => {
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  return (
    <UpdateContext.Provider value={{ shouldUpdate, setShouldUpdate }}>
      {children}
    </UpdateContext.Provider>
  );
};
