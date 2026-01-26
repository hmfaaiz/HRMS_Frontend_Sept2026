import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const CustomerUIContext = createContext();

export function useCustomerUIContext() {
  return useContext(CustomerUIContext);
}

export function CustomerUIProvider({ CustomerUIEvents, children }) {
  // table state
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

  const initCustomer = {
    customerCode: "",
    customerName: "",
    countryId: "",
    cityId: "",
    address: "",
    contactPerson: "",
    emailAddress: "",
    phone: "",
    cellNo: "",
  };

  const value = {
  queryParams,
  setQueryParams,
  ids,
  setIds,
  initCustomer,

  // ROUTE-BASED actions
  newCustomerButtonClick: CustomerUIEvents.newCustomerButtonClick,
  openEditCustomerDialog: CustomerUIEvents.openEditCustomerDialog,
  openReadCustomerDialog: CustomerUIEvents.openReadCustomerDialog,
  openDeleteCustomerDialog: CustomerUIEvents.openDeleteCustomerDialog,
};


  return (
    <CustomerUIContext.Provider value={value}>
      {children}
    </CustomerUIContext.Provider>
  );
}