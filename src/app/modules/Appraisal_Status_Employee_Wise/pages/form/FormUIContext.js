import React, { createContext, useContext, useState } from "react";

const FormUIContext = createContext();

export function useFromUIContext() {
  return useContext(FormUIContext);
}

export const ReceiptUIConsumer = FormUIContext.Consumer;
export function FormUIProvider({ children }) {
  const [filter, setFilter] = useState({
    subsidiaryId: "",
    appraisalPeriodId: "",
    appraisalCategoryId: "",
    employeeId: "",
  });

  const value = {
    filter,
    setFilter,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
