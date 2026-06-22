import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./ReligionUIHelpers";

const DesignationUIContext = createContext();

export function useDesignationUIContext() {
  return useContext(DesignationUIContext);
}

export const ReceiptUIConsumer = DesignationUIContext.Consumer;
// const initialFilter = {
//   sortBy: "name",
//   limit: 10,
//   page: 1,
// }
export function DesignationUIProvider({ DesignationUIEvents, children }) {
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
    designationName: "",
    designationCode:"",
    // createdBy: "",
    // createdAt:"",
    
  };


  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    initUser,
    newDesignationButtonClick: DesignationUIEvents.newDesignationButtonClick,
    openEditDesignationDialog: DesignationUIEvents.openEditDesignationDialog,
    openDeleteDesignationDialog: DesignationUIEvents.openDeleteDesignationDialog,
    openActiveDesignationDialog: DesignationUIEvents.openActiveDesignationDialog,
    openReadDesignationDialog: DesignationUIEvents.openReadDesignationDialog,
  };
  return (
    <DesignationUIContext.Provider value={value}>{children}</DesignationUIContext.Provider>
  );
}
