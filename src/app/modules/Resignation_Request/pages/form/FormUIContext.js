import React, { createContext, useContext } from "react";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export const ReceiptUIConsumer = FormUIContext.Consumer;

export function FormUIProvider({ children }) {
  const initUser = {
    Id: null,
    exitTypeId: "",
    exitReasonId: "",
    exitRemark: "",
    resignationDate: new Date(), // DATE
    lastWorkingDate: "", // DATE
    noticePeriodDays: "",
  };

  const value = {
    initUser,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
