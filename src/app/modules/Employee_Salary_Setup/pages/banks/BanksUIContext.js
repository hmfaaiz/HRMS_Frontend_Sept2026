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

    employeeId: "",
    currencyId : "",
    grossSalary : "",
    basicSalary : "",
    gratuity_member : "",
    gratuity_startDate : "",
    overtime_allowance : "",
    shift_allowance : "",
    regularity_allowance : "",
    punctuality_allowance : "",
    pf_member : "",
    pf_reg_date : "",
    pf_accNo : "",
    eobi_member : "",
    eobi_reg_date : "",
    eobi_accNo : "",
    social_security_member : "",
    social_security_reg_date : "",
    social_security_accNo: "",
    pension_member : "",
    pension_reg_date : "",
    pension_accNo : "",
    profit_member : "",
    emp_bankId : "",
    emp_bank_branchId : "",
    emp_bank_accountTitle : "",
    emp_bank_accNo : "",
    payment_mode_Id : "",
    company_bankId : "",
    company_branchId : "",
    company_from_accNo : "",
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
