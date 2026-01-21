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
    name: "",
    subsidiaryCode: "",
    companyId : null,
    currencyId: null,
    address: null,
    countryId: null,
    cityId: null,
    phone: null,
    fax: null,
    email: null,
    web: null,
    EIN: null,
    TIN: null,
    Logo: "",
    localizationId: null,
    isAttendanceLocation : false,
    incomeTaxTypeId :null,
    isSubordinateRequest :false,
    users : [],
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
