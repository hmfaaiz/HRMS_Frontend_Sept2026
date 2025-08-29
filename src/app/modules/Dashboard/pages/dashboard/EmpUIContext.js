import React, { createContext, useContext, useState } from "react";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ children }) {
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [logedInEmp, setLogedInEmp] = useState(null);

  const value = {
    selectedEmp,
    setSelectedEmp,
    currentLevel,
    setCurrentLevel,
    logedInEmp,
    setLogedInEmp,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
