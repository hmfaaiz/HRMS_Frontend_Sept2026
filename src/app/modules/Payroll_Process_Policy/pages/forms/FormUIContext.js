import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export const ReceiptUIConsumer = FormUIContext.Consumer;
// const initialFilter = {
//   sortBy: "name",
//   limit: 10,
//   page: 1,
// }
export function FormUIProvider({ FormUIEvents, children }) {
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
    subsidiaryId : "",
    companyId  : "",
    payroll_templateId : "",
    employer_uniqueId : "",
    payroll_approverId : "",
    payroll_groupId : "",

    //-- Email Sender ------------
    sender_emailId : "",
    employee_email_recipentId : "",

   // -- Accounting Impact ----
    basic_pay_accountId : "",
    payroll_payable_accountId : "",
    isGroupEarningOnAccount :"",
    isGroupDeduductionOnAccount :"",
    isAccrueGratuityOnPayroll :"",

    //-- Tax Integration
    payrollTax_DeductionTypeId :"",
    arrearTaxDeductionId :"",
    isTrackDeductionHistory :"",

   // -- Leave / AAtteandance Integraion
    isEnableAttandanceIntegration :"",
    isEnableLeaveManagemenent :"",
    isEnableOverTimeCalc :"",
    leaveDeductionId :"",
    lateCountPerDaySalaryDeduction :"",
    leaveEnchashment_EarningId :"",
    lateDeductionId :"",
    overTimeEarningId :"",
    isEnableSandwichLeavePolicy :"",

    //-- Loan Integration	
    isEnableLoan :"",
    loanDeductionId :"", 

   // --  EOBI Configuration
    isEnableEOBI :"",
    eobi_deductionId :"",
    eobi_earningId :"",
    isIncludeBasic :"",
    eobi_employeer_value_in_percent :"",
    eobi_employee_value_in_percent :"",

    //-- Other
    salaryApproverId:"",
    loanApproverId:"",
    payrollApproverId:""
    
  };

  
  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    initUser,
    newFormButtonClick: FormUIEvents.newFormButtonClick,
    openEditFormDialog: FormUIEvents.openEditFormDialog,
    openDeleteFormDialog: FormUIEvents.openDeleteFormDialog,
    openActiveFormDialog: FormUIEvents.openActiveFormDialog,
    openReadFormDialog: FormUIEvents.openReadFormDialog,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
