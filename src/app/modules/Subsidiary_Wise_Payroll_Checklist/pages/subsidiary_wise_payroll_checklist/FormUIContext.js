import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const SubsidiaryPayrollUIContext = createContext();

export function useSubsidiaryPayrollUIContext() {
  return useContext(SubsidiaryPayrollUIContext);
}

export function SubsidiaryPayrollUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);

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

  const initChecklistItem = useMemo(
    () => ({
      companyId: null,
      subsidiaryId: null,
      categoryId: null,
      taskName: "",
      taskDescription: "",
      attachmentPath: "",
      list: [],
    }),
    []
  );

  const value = useMemo(
    () => ({
      queryParams,
      setQueryParams,
      ids,
      setIds,
      initChecklistItem,
      ...FormUIEvents,
    }),
    [queryParams, ids, initChecklistItem, FormUIEvents]
  );

  return (
    <SubsidiaryPayrollUIContext.Provider value={value}>
      {children}
    </SubsidiaryPayrollUIContext.Provider>
  );
}
