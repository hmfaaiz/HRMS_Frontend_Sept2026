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
    earning_deduction_id: "",
    amount: "",
    transactionType: "",
    calculation_type: "",
    factorValue: "",

  };

  console.log("acadenuc ui events", BanksUIEvents);

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
