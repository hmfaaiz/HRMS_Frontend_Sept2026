import React, { createContext, useContext, useState } from "react";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ FormUIEvents, children }) {
  const [subsidiaryId, setSubsidiaryId] = useState(null);
  const [updatedRow, setUpdatedRow] = useState(null);

  const value = {
    subsidiaryId,
    setSubsidiaryId,
    updatedRow,
    setUpdatedRow,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
