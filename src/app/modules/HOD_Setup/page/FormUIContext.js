import React, { createContext, useCallback, useContext, useState } from "react";
import { initialFilter } from "./FormUIHelper";
import { isEqual, isFunction } from "lodash";

const FormUIContext = createContext();
export const useFormUIContext = () => {
  return useContext(FormUIContext);
};
export function FormUIProvider({ FormUIEvents, children }) {
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

  const initVal = {
    departmentId: null,
    empId: null,
  };

  const value = {
    ...FormUIEvents,
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    initVal,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
