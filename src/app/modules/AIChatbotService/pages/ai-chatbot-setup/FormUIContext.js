import React, { createContext, useContext, useState } from "react";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export const ReceiptUIConsumer = FormUIContext.Consumer;

export function FormUIProvider({ FormUIEvents, children }) {
  const [deleteId , setDeleteId] = useState(null)
  const value = {
    deleteId,
    setDeleteId,
    newFormButtonClick: FormUIEvents.newFormButtonClick,
    existingButtonClick: FormUIEvents.existingButtonClick,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
