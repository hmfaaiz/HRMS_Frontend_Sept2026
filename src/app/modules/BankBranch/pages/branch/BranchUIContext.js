import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./BranchUIHelpers";

const BranchUIContext = createContext();

export function useBranchUIContext() {
  return useContext(BranchUIContext);
}

export const ReceiptUIConsumer = BranchUIContext.Consumer;
// const initialFilter = {
//   sortBy: "name",
//   limit: 10,
//   page: 1,
// }
export function BranchUIProvider({ BranchUIEvents, children }) {
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
    Name: "",
    countryId: "",
    cityId:"",
    branchCode: "",
    BankId: "",
    phone:"",
    fax: "",
    email: "",
    contactPerson: "",
    address:"",
    accOpeningDate:"",
    accNoForSalary: "",
    accNoForGrad:"",
    accNoForPF: "",
  
  };



  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    initUser,
    newBranchButtonClick: BranchUIEvents.newBranchButtonClick,
    openEditBranchDialog: BranchUIEvents.openEditBranchDialog,
    openDeleteBranchDialog: BranchUIEvents.openDeleteBranchDialog,
    openActiveDialog: BranchUIEvents.openActiveBranchDialog,
    openReadBranchDialog: BranchUIEvents.openReadBranchDialog,
  };
  return (
    <BranchUIContext.Provider value={value}>{children}</BranchUIContext.Provider>
  );
}
