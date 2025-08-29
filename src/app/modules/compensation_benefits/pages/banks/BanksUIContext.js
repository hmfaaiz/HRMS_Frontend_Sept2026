import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./BanksUIHelpers";

const BanksUIContext = createContext();

export function useBanksUIContext() {
  return useContext(BanksUIContext);
}

export const ReceiptUIConsumer = BanksUIContext.Consumer;
// const initialFilter = {
//   sortBy: "name",
//   limit: 10,
//   page: 1,
// }
export function BanksUIProvider({ BanksUIEvents, children }) {
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

    subsidiaryId: "",
    gradeId: "",
    employeeTypeId: "",
   
    currencyId: "",
    salaryMethod: "",
    basicFactor: "",
    calculation_type: "",
    factor: "",
    partOfGrossSalary: "",
    earningId: "",
    deductionId: "",
    gratuity_member: "",
    overtime_allowance: "",
    shift_allowance: "",
    regularity_allowance: "",
    punctuality_allowance: "",
    pf_member: "",
    eobi_member: "",
    social_security_member: "",
    pension_member: "",
    factorVal: "",
    tillTransferDate: "",
    overtime_working_day: 1,
    overtime_off_day: 1,
    overtime_holiday: 1,

  };

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    initUser,
    newButtonEarningTran: BanksUIEvents.newButtonEarningTran,
    newButtonDeductionTran: BanksUIEvents.newButtonDeductionTran,
    
    newBankButtonClick: BanksUIEvents.newBankButtonClick,
    openEditBankDialog: BanksUIEvents.openEditBankDialog,
    openDeleteBankDialog: BanksUIEvents.openDeleteBankDialog,
    openActiveBankDialog: BanksUIEvents.openActiveBankDialog,
    openReadBankDialog: BanksUIEvents.openReadBankDialog,
  };
  return (
    <BanksUIContext.Provider value={value}>{children}</BanksUIContext.Provider>
  );
}
