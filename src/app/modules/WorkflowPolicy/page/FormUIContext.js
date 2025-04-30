import React, { createContext, useCallback, useContext, useState } from "react";
import { initialFilter, initialFilterDesig } from "./FormUIHelper";
import { isEqual, isFunction } from "lodash";

const FormUIContext = createContext();
export const useFormUIContext = () => {
  return useContext(FormUIContext);
};
export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [queryParamsDesig, setQueryParamsBaseDesig] = useState(
    initialFilterDesig
  );
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

  const setQueryParamsDesig = useCallback((nextQueryParams) => {
    setQueryParamsBaseDesig((prevQueryParams) => {
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
    subsidiaryId: null,
    workflowTypeId: null,
    defaultApproverId: null,
    autoSkipping: false,
    autoSkippingHours: "",
    enableHrRequestWorkflow: false,
    emailCreationEmpId: null,
    emailApprovedEmpId: null,
    emailRejectedEmpId: null,
    emailPendingToApprovers: false,
    isMonday: false,
    isTuesday: false,
    isWednesday: false,
    isThursday: false,
    isFriday: false,
    isSaturday: false,
    isSunday: false,
    emailTime: "",
  };

  const initValDesig = {
    workflowTypeId: null,
    designationId: null,
    reportToLevel: null,
    isHODFinalAuthority: false,
    isEmpFinalAuthority: false,
    empFinalAuthorityId: null,
    isCustomApprover: false,
    customApprovalList : [],
  };

  const value = {
    ...FormUIEvents,
    queryParams,
    queryParamsDesig,
    setQueryParamsBase,
    setQueryParamsBaseDesig,
    setQueryParams,
    setQueryParamsDesig,
    initVal,
    initValDesig,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
