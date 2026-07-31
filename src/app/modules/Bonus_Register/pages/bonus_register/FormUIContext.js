import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelper";

const BonusRegisterUIContext = createContext();

export function useBonusRegisterUIContext() {
  return useContext(BonusRegisterUIContext);
}

export function BonusRegisterUIProvider({ children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }
      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }
      return nextQueryParams;
    });
  }, []);

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
  };
  return (
    <BonusRegisterUIContext.Provider value={value}>
      {children}
    </BonusRegisterUIContext.Provider>
  );
}