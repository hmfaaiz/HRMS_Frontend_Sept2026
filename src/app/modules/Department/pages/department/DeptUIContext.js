import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./DeptUIHelpers";

const DeptUIContext = createContext();

export function useDeptUIContext() {
  return useContext(DeptUIContext);
}

export const ReceiptUIConsumer = DeptUIContext.Consumer;
// const initialFilter = {
//   sortBy: "name",
//   limit: 10,
//   page: 1,
// }
export function DeptUIProvider({ DeptUIEvents, children }) {
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
  const initUser = {
    deptName: "",
    deptCode:"",
    budgetStrength: "",
    subsidiaryId: "",
    parentDept: "",
    subsidiaryId: ""

  };



  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    initUser,
    newDeptButtonClick: DeptUIEvents.newDeptButtonClick,
    openEditDeptDialog: DeptUIEvents.openEditDeptDialog,
    openDeleteDeptDialog: DeptUIEvents.openDeleteDeptDialog,
    openActiveDeptDialog: DeptUIEvents.openActiveDeptDialog,
    openReadDeptDialog: DeptUIEvents.openReadDeptDialog,
  };
  return (
    <DeptUIContext.Provider value={value}>{children}</DeptUIContext.Provider>
  );
}
