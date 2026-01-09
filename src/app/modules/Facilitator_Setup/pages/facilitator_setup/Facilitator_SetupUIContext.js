import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FacilitatorUIHelpers";

const FacilitatorUIContext = createContext();

export function useFacilitatorUIContext() {
  return useContext(FacilitatorUIContext);
}

export const FacilitatorUIConsumer = FacilitatorUIContext.Consumer;

export function FacilitatorUIProvider({ FacilitatorUIEvents, children }) {
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

  const initFacilitator = {
    companyId: "",
    subsidiaryId: "",
    employeeId: "",
    departmentId: "",
    locationId: "",
    ticketTypeId: "",
    isActive: true,
    departmentLocations: [{ departmentId: null, locationId: null }],
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    initFacilitator,
    newFacilitatorButtonClick: FacilitatorUIEvents?.newFacilitatorButtonClick,
    openEditFacilitatorDialog: FacilitatorUIEvents?.openEditFacilitatorDialog,
    openDeleteFacilitatorDialog: FacilitatorUIEvents?.openDeleteFacilitatorDialog,
    openActiveFacilitatorDialog: FacilitatorUIEvents?.openActiveFacilitatorDialog,
    openReadFacilitatorDialog: FacilitatorUIEvents?.openReadFacilitatorDialog,
  };

  return (
    <FacilitatorUIContext.Provider value={value}>
      {children}
    </FacilitatorUIContext.Provider>
  );
}