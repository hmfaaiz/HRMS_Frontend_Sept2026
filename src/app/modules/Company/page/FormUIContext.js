import React, { createContext, useCallback, useContext, useState } from "react";
import { initialFilter } from "./FormUIHelper";
import { isEqual, isFunction } from "lodash";

const FormUIContext = createContext();
export const useFormUIContext = () => {
  return useContext(FormUIContext);
};
export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [id, setId] = useState(null);
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
    companyCode: "",
    name: "",
    companyLegalName: "",
    currencyId: null,
    countryId: null,
    cityId: null,
    address: "",
    firstFiscalMonth: "",
    phone: "",
    fax: "",
    email: "",
    web: "",
    EIN: "",
    TIN: "",
    Logo: "",
    employeeModule: false,
    leaveModule: false,
    attendanceModule: false,
    payrollModule: false,
  };

  const value = {
    ...FormUIEvents,
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    id,
    setId,
    initVal,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
