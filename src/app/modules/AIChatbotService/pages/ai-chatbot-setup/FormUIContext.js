import React, { createContext, useContext } from "react";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export const ReceiptUIConsumer = FormUIContext.Consumer;

export function FormUIProvider({ FormUIEvents, children }) {
  const value = {
    newFormButtonClick: FormUIEvents.newFormButtonClick,
    existingButtonClick: FormUIEvents.existingButtonClick,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
