import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/formActions";

import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Input, Pagination, Select } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { fetchAllAccountsByType, fetchAllActiveEmployees, fetchAllActiveEmployeesSalaryForDDL, fetchAllBankBranch, fetchAllBanks, fetchAllDeductionList, fetchAllEarningList, fetchAllFormsMenu, fetchAllLeaveTypeBySubsidiary, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as Yup from "yup";
import { accountType, VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { fetchRoles } from "../../../../UserMangement/_redux/usersActions";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { CirclePlus, Trash2, X } from "lucide-react";

export function FormTable(user) {
  //Users UI Context
  const formUIContext = useFormUIContext();
  const FormUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
      setIds: formUIContext.setIds,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditFormDialog: formUIContext.openEditFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      openActiveFormDialog: formUIContext.openActiveFormDialog,
      openReadFormDialog: formUIContext.openReadFormDialog,
      openDuplicateDialog: formUIContext.openDuplicateDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess, roles } = useSelector(
    (state) => {
      return {

        currentState: state.payroll_process_policy,
        userAccess: state?.auth?.userAccess["Payroll_Process_Policy"],
        roles: state.users?.roles?.allRoles || []
      }
    },
    shallowEqual
  );

  const { totalCount, entities, listLoading, actionsLoading } = currentState;

  const { dashboard } = useSelector((state) => state);
  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);
  const [defEmployee = null, setEmployeeDefault] = useState(null);
  //totalCount = 10
  const [defPayrollGroupId = null, setDefaultPayrollGroup] = useState(null);
  const [defBasicPayGeneralAccount = null, setDefaultBasicPayAccount] = useState(null);
  const [defPayrollPayableccount = null, setDefaultPaybleAccount] = useState(null);
  const [defMapDeductionList = null, setDefaultMapDeductionList] = useState(null);
  const [defMapEarningDeductionList = null, setDefaultMapEarningDeductionList] = useState([]);
  const [isCheckedAtt_Integration, setChkAtt_Integration] = useState(false);
  const [defBankInfoList = null, setDefaultBankInfoList] = useState([]);
  const [defEmailRecipents, setDefaultEmailRecipents] = useState([]); //  For Email Recipents
  const [defEOBIAllowances, setDefaultEOBIAllowances] = useState([]);
  const [defProvidentFundAllowances, setDefaultProvidentFundAllowances] = useState([]);
  const [defPensionAllowances, setDefaultPensionAllowances] = useState([]);
  const [defSESSIAllowances, setDefaultSESSIAllowances] = useState([]);
  const [defBank, setDefaultBanks] = useState({});
  const [otherErrors, setotherErrors] = useState({})
  const dispatch = useDispatch();
  const [selectedEmployees, setSelectedEmployees] = useState([]);


  useEffect(() => {
    FormUIProps.setIds([]);
    dispatch(actions.fetchUsers(FormUIProps.queryParams));
    dispatch(actions.fetchPayrollPolicySubsidiaryIds());
  }, [FormUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdatePayrollProcessPolicy"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeletePayrollProcessPolicy"
  );


  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadPayrollProcessPolicy"

  );  const isAccessForCopy = userAccess?.find(
    (item) => item.componentName === "CopyPayrollProcessPolicy"
  );

  const mutliSelectStyle = {
    backgroundColor: '#ffffff',
    padding: '10px',
    overflow: 'scroll',
    height: '170px',
  };


  useEffect(() => {
    if (user.formid) {
      dispatch(actions.fetchUser(user.formid));
      // setDefaultBankInfoList([...currentState.userForEdit?.tran_payroll_policy_bank_infos]);
    }
  }, [user.formid]);


  useEffect(() => {
    if (!user.formid) {
      dispatch(fetchAllBanks());
      dispatch(fetchAllBankBranch(true));
    }
  }, [user.journalBankAccountId, dispatch]);


  useEffect(() => {

    if (!user.formid) {
      dispatch(fetchAllSubsidiaryData("allSubidiaryList")) // For All Subsisidaries
      dispatch(fetchAllActiveEmployees()); // For Getting Salaried Employees
      dispatch(fetchAllFormsMenu(127, "allChildMenus")); // For Payroll Group
      dispatch(fetchAllAccountsByType(45, accountType.Assets, "allJournalBankAccounts")); // For Basic Pay Accounts
      dispatch(fetchAllAccountsByType(45, accountType.Liabilities, "allPayrollPayableAccounts")); // For Payable Accounts
      dispatch(fetchAllAccountsByType(45, accountType.Assets, "allDefaultLoanAccounts")); // For Payable Accounts
      dispatch(fetchRoles());
      dispatch(actions.fetchPayrollPolicySubsidiaryIds());
    }
  }, [dispatch]);



  useEffect(() => {

    const emailList = currentState.userForEdit?.tran_email_recipents_setups?.map((x) => {
      return x.employeeId
    }) || [];
    setDefaultEmailRecipents(
      [...emailList]
    );
  }, [currentState.userForEdit?.tran_email_recipents_setups]);

  useEffect(() => {

    const bankInfoList = currentState.userForEdit?.tran_payroll_policy_bank_infos?.map((x) => {
      return x
    }) || [];
    setDefaultBankInfoList(
      [...bankInfoList]
    );
  }, [currentState.userForEdit?.tran_payroll_policy_bank_infos]);


  useEffect(() => {
    const eobiAllowance = currentState.userForEdit?.tran_payroll_policy_eobiAllowances?.map((x) => {
      return x.earningId
    }) || [];
    setDefaultEOBIAllowances(
      [...eobiAllowance]
    );
  }, [currentState.userForEdit?.tran_payroll_policy_eobiAllowances]);




  useEffect(() => {
    const eobiAllowance = currentState.userForEdit?.tran_payroll_policy_eobiAllowances?.map((x) => {
      return x.earningId
    }) || [];


    (
      [...eobiAllowance]
    );
  }, [currentState.userForEdit?.tran_payroll_policy_eobiAllowances]);


  // FOR SESSI List Configuration
  useEffect(() => {
    const sessiAllowance = currentState.userForEdit?.tran_payroll_policy_sessiAllowances?.map((x) => {
      return x.earningId
    }) || [];
    setDefaultSESSIAllowances(
      [...sessiAllowance]
    );
  }, [currentState.userForEdit?.tran_payroll_policy_sessiAllowances]);



  useEffect(() => {
    const eobiAllowance = currentState.userForEdit?.tran_payroll_policy_providentFundAllowances?.map((x) => {
      return x.earningId
    }) || [];
  
    setDefaultProvidentFundAllowances(
      [...eobiAllowance]
    );
  }, [currentState.userForEdit?.tran_payroll_policy_providentFundAllowances]);


  useEffect(() => {
    const pensionAllowance = currentState.userForEdit?.tran_payroll_policy_pensionAllowances?.map((x) => {
      return x.earningId
    }) || [];
  
    setDefaultPensionAllowances(
      [...pensionAllowance]
    );
  }, [currentState.userForEdit?.tran_payroll_policy_pensionAllowances]);



  useEffect(() => {
    const eobiAllowance = currentState.userForEdit?.tran_payroll_policy_providentFundAllowances?.map((x) => {
      return x.earningId
    }) || [];


    (
      [...eobiAllowance]
    );
  }, [currentState.userForEdit?.tran_payroll_policy_providentFundAllowances]);



  const handleCheckboxChangeFor_EmailReciepents = (option) => {
    setDefaultEmailRecipents((prevState) =>
      prevState.includes(option)
        ? prevState.filter(item => item !== option)
        : [...prevState, option]
    );
  };

  const handleCheckboxChangeFor_EOBIAllowances = (option) => {
    setDefaultEOBIAllowances((prevState) =>
      prevState.includes(option)
        ? prevState.filter(item => item !== option)
        : [...prevState, option]
    );
  };

  const handleCheckboxChangeFor_SESSIAllowances = (option) => {
    setDefaultSESSIAllowances((prevState) =>
      prevState.includes(option)
        ? prevState.filter(item => item !== option)
        : [...prevState, option]
    );
  };


  const handleCheckboxChangeFor_providentFundAllowances = (option) => {

    setDefaultProvidentFundAllowances((prevState) =>
      prevState.includes(option)
        ? prevState.filter(item => item !== option)
        : [...prevState, option]
    );
  };


    const handleCheckboxChangeFor_pensionFundAllowances = (option) => {
   
    setDefaultPensionAllowances((prevState) =>
      prevState.includes(option)
        ? prevState.filter(item => item !== option)
        : [...prevState, option]
    );
  
  };

  const deleteRowBankInfo = (element) => {

    const data = defBankInfoList;
    data.splice(element.target.id, 1);
    setDefaultBankInfoList([...data])
  }


  const addRowBankInfo = (element) => {


    setDefaultBankInfoList([...defBankInfoList, { transactionType: element.target.id }])

    return false;
  }

  const handleCheckboxChangeForLoan = (event) => {
    setChkAtt_Integration(event.target.checked);
  };



  const handleFieldChanged = (el) => {
    // setotherErrors(validate());
    const index = el.target.id.split('-')[1];
    const key = el.target.id.split('-')[0];

    const updatedBankInfoList = defBankInfoList.map((val, ind) => {

      if (ind === parseInt(index, 10)) {
        return {
          ...val,
          [key]: key == "isDefault" ? el.target.checked : el.target.value
        };
      }
      return val;
    });

    setDefaultBankInfoList(updatedBankInfoList); // Update the state
  };



  // Table columns
  const columns = [
    {
      dataField: "t_subsidiary.name",
      text: "Subsidiary",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditFormDialog: FormUIProps.openEditFormDialog,
        openDeleteFormDialog: FormUIProps.openDeleteFormDialog,
        openActiveFormDialog: FormUIProps.openActiveFormDialog,
        openReadFormDialog: FormUIProps.openReadFormDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete ? isAccessForDelete.isAccess : false,
        isAccessForCopy: isAccessForCopy ? isAccessForCopy.isAccess : false,
        openDuplicateDialog:FormUIProps.openDuplicateDialog,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "170px",
      },
    },
  ];


  const formValidation = Yup.object().shape(
    {
      subsidiaryId: Yup.string()
        .required(VALIDATION_MESSAGES.required),
      // payroll_templateId: Yup.string(),
      employer_uniqueId: Yup.string()
        .notRequired()
        .nullable()
        .max(25, 'Max 25 Characters'),
      payroll_approverId: Yup.string()
        .notRequired(),
      basicSalaryId: Yup.string()
        .required(VALIDATION_MESSAGES.required),
      // basic_pay_accountId: Yup.number()
      //   .when('isEnableAccounting', {
      //     is: true, // if select value is 2
      //     then: Yup.number().min(1, VALIDATION_MESSAGES.required).required(VALIDATION_MESSAGES.required),
      //     otherwise: Yup.number().notRequired(),
      //   }),
      payroll_payable_accountId: Yup.number()
        .when('isEnableAccounting', {
          is: true, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.required).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      default_loan_accountId: Yup.number()
      .nullable()
        .when('isEnableAccounting', {
          is: true, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.required).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      payrollTax_DeductionTypeId: Yup.number()
        .when('isEnableTax', {
          is: true, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.required).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      // arrearTaxDeductionId: Yup.number()
      //   .when('isEnableTax', {
      //     is: true, // if select value is 2
      //     then: Yup.number().min(1, VALIDATION_MESSAGES.required).required(VALIDATION_MESSAGES.required),
      //     otherwise: Yup.number().notRequired(),
      //   }),

      // leaveDeductionId: Yup.number()
      //   .when('isEnableAttandanceIntegration', {
      //     is: true, // if select value is 2
      //     then: Yup.number().min(1, VALIDATION_MESSAGES.required).required(VALIDATION_MESSAGES.required),
      //     otherwise: Yup.number().notRequired(),
      //   }),


      leaveDeductionId: Yup.number()
        .nullable(), // Allow null (for 'N/A')


      lateCountPerDaySalaryDeduction: Yup.number()
        .when('isEnableAttandanceIntegration', {
          is: true, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.minOneValue).max(99, VALIDATION_MESSAGES.maxTwoDigits).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      leaveEnchashment_EarningId: Yup.number()
        .when('isEnableOverTimeCalc', {
          is: true, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.minOneValue).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      lateDeductionId: Yup.number()
        .when('isEnableAttandanceIntegration', {
          is: true, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.required).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      overTimeEarningId: Yup.number()
        .when('isEnableOverTimeCalc', {
          is: true, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.required).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      eobi_deductionId: Yup.number()
        .when('isEnableEOBI', {
          is: true, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.required).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      eobi_basis: Yup.number()
        .when('isEnableEOBI', {
          is: true, // if select value is 2
          then: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).required(VALIDATION_MESSAGES.required).max(999999999, 'Max 9 Characters'),
          otherwise: Yup.number().notRequired(),
        }),
      eobi_employeer_value_in_percent: Yup.number()
        .when('isEnableEOBI', {
          is: true, // if select value is 2
          then: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).max(100, VALIDATION_MESSAGES.maxHundredValue).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      eobi_employee_value_in_percent: Yup.number()
        .when('isEnableEOBI', {
          is: true, // if select value is 2
          then: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).max(100, VALIDATION_MESSAGES.maxHundredValue).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      sessi_deductionId: Yup.number()
        .when('isEnableSESSI', {
          is: true, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.required).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      sessi_basis: Yup.number()
        .when('isEnableSESSI', {
          is: true, // if select value is 2
          then: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).required(VALIDATION_MESSAGES.required).max(999999999, 'Max 9 Characters'),
          otherwise: Yup.number().notRequired(),
        }),
      sessi_employeer_value_in_percent: Yup.number()
        .when('isEnableSESSI', {
          is: true, // if select value is 2
          then: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).max(100, VALIDATION_MESSAGES.maxHundredValue).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      sessi_employee_value_in_percent: Yup.number()
        .when('isEnableSESSI', {
          is: true, // if select value is 2
          then: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).max(100, VALIDATION_MESSAGES.maxHundredValue).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      journalCashAccountId: Yup.string()
        .notRequired(),
      journalChequeAccountId: Yup.string()
        .notRequired(),


      // OvertimeBasis: Yup.number()
      //   .nullable()
      //   .required(VALIDATION_MESSAGES.required),

    OvertimeBasis: Yup.number()
    .nullable()
    .when('isEnableOverTimeCalc', {
      is: true,
      then: Yup.number()
        .nullable()
        .required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().nullable().notRequired(),
    }),

      SalaryPolicy: Yup.number()
        .nullable()
        .required(VALIDATION_MESSAGES.required),


      SalaryPolicy_Days: Yup.number()
      .nullable()
        .when('SalaryPolicy', {
          is: 1, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.minZeroValue).max(99, "Max 99 days").required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),

  //// new
  // Overtime Policy validations
  OvertimePolicy: Yup.number()
    .nullable()
    .when('isEnableOverTimeCalc', {
      is: true,
      then: Yup.number()
        .nullable()
        .required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().nullable().notRequired(),
    }),

  OvertimePolicy_Days: Yup.number()
    .nullable()
    .when(['isEnableOverTimeCalc', 'OvertimePolicy'], {
      is: (isEnable, OvertimePolicy) => isEnable == true && OvertimePolicy == 1,
      then: Yup.number()
        .min(1, VALIDATION_MESSAGES.minZeroValue)
        .max(99, "Max 99 days")
        .required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().nullable().notRequired(),
    }),

  hoursPolicy: Yup.number()
    .nullable()
    .when('isEnableOverTimeCalc', {
      is: true,
      then: Yup.number()
        .nullable()
        .required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().nullable().notRequired(),
    }),

  fixedHours: Yup.number()
    .nullable()
    .when(['isEnableOverTimeCalc', 'hoursPolicy'], {
      is: (isEnable, hoursPolicy) => isEnable == true && hoursPolicy == 1,
      then: Yup.number()
        .min(1, VALIDATION_MESSAGES.minZeroValue)
        .max(99, "Max 99 days")
        .required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().nullable().notRequired(),
    }),

  // Final Settlement validations
  finalSettlementPolicy: Yup.number()
    .nullable()
    .when('isEnableFinalSettlement', {
      is: true,
      then: Yup.number()
        .nullable()
        .required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().nullable().notRequired(),
    }),

  finalSettlement_Days: Yup.number()
    .nullable()
    .when(['isEnableFinalSettlement', 'finalSettlementPolicy'], {
      is: (isEnable, finalPolicy) => isEnable == true && finalPolicy == 1,
      then: Yup.number()
        .min(1, VALIDATION_MESSAGES.minZeroValue)
        .max(99, "Max 99 days")
        .required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().nullable().notRequired(),
    }),


      // Provident Fund 
          providentFundId: Yup.number()
          .nullable()
        .when('isProvidentFund', {
          is: true, // if select value is 2
          then: Yup.number().required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      // providentFundAllowancesId: Yup.number()
      // .nullable()
      //   .when('isProvidentFund', {
      //     is: true, // if select value is 2
      //     then: Yup.number().required(VALIDATION_MESSAGES.required),
      //     otherwise: Yup.number().notRequired(),
      //   }),
      pf_eligibility: Yup.number()
      .nullable()
        .when('isProvidentFund', {
          is: true, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.minOneValue).max(100, VALIDATION_MESSAGES.maxHundredValue).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
         pf_employer_percent: Yup.number()
      .nullable()
        .when('isProvidentFund', {
          is: true, // if select value is 2
          then: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).max(100, VALIDATION_MESSAGES.maxHundredValue).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      pf_employee_percent: Yup.number()
      .nullable()
        .when('isProvidentFund', {
          is: true, // if select value is 2

          then: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).max(100, VALIDATION_MESSAGES.maxHundredValue).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),



          // Provident Fund 
          pensionAllowanceId: Yup.number()
  .when("isPensionAllowance", {
    is: true,
    then: Yup.number()
      .typeError("Please select Pension Allowance")
      .required(VALIDATION_MESSAGES.required)
      .notOneOf([-1], "Please select Pension Allowance"),
    otherwise: Yup.number().notRequired(),
  }),
 

         pa_employer_percent: Yup.number()
      .nullable()
        .when('isPensionAllowance', {
          is: true, 
          then: Yup.number().required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      	pa_employee_percent: Yup.number()
      .nullable()
        .when('isPensionAllowance', {
          is: true, 

          then: Yup.number().required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),


      	pensionAllowanceId: Yup.number()
      .nullable()
        .when('isPensionAllowance', {
          is: true, 

          then: Yup.number().required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),



    },

  );



  const initialValues = {
    subsidiaryId: "",
    companyId: "",
    // payroll_templateId: "",
    employer_uniqueId: "",
    payroll_approverId: "",
    payroll_groupId: "",
    basicSalaryId: "",
    salaryRoundingId: "",

    //-- Email Sender ------------
    sender_emailId: "",
    employee_email_recipentId: "",

    // -- Accounting Impact ----
    isEnableAccounting: false,
    basic_pay_accountId: "",
    payroll_payable_accountId: "",
    default_loan_accountId: null,
    // isGroupEarningOnAccount: "",
    // isGroupDeduductionOnAccount: "",
    // isAccrueGratuityOnPayroll: "",

    //-- Tax Integration
    isEnableTax: false,
    payrollTax_DeductionTypeId: "",
    arrearTaxDeductionId: "",
    // isTrackDeductionHistory: "",

    // -- Leave / AAtteandance Integraion
    isEnableAttandanceIntegration: false,
    isEnableLeaveManagemenent: "",
    isEnableOverTimeCalc: "",
    leaveDeductionId: "",
    lateCountPerDaySalaryDeduction: "",
    leaveEnchashment_EarningId: "",
    lateDeductionId: "",
    overTimeEarningId: "",
    isEnableSandwichLeavePolicy: "",

    /// new 
    isEnableOverTimeCalc: "",
    OvertimePolicy : 0,
    OvertimePolicy_Days :"",
    hoursPolicy : 0,
    fixedHours : "",

    isEnableFinalSettlement : "",
    finalSettlementPolicy : 0,
    finalSettlement_Days :"",

    //-- Loan Integration	
    isEnableLoan: "",
    loanDeductionId: "",

    // --  EOBI Configuration
    isEnableEOBI: false,
    eobi_basis: "",
    eobi_deductionId: "",
    eobi_earningId: "",
    isIncludeBasic: "",
    eobi_employeer_value_in_percent: "",
    eobi_employee_value_in_percent: "",
    bankCode: "",

    isEnableSESSI: false,
    sessi_deductionId: "",
    sessi_basis: "",
    sessi_employeer_value_in_percent: "",
    sessi_employee_value_in_percent: "",

    journalChequeAccountId: "",
    journalCashAccountId: "",


    // --  Provident Fund Configuration
    isProvidentFund: false,
    providentFundId: null,
    providentFundAllowancesId:null,
    pf_employer_percent:null,
    pf_employee_percent:null,
    pf_eligibility:0,


   // --  Provident Fund Configuration
    isPensionAllowance: false,
    	pensionAllowanceId: null,
    pensionAllowancesId:null,
    	pa_employer_percent:null,
    pa_employee_percent:null,
  


    SalaryPolicy:0,

    OvertimeBasis:"",

    //-- Other
  };

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: FormUIProps.queryParams.pageSize,
    page: FormUIProps.queryParams.pageNumber,
  };

  const SavePayrollPolicy = async (user, emailRecipentList, eobiAllowances, bankInfoList, sessiAllowanceList, providentFundAllowances,pensionAllowances) => {
console.log("pensionAllowances11111",pensionAllowances)
    if (!user.Id) {

      await dispatch(actions.create_Payroll_Policy(user, emailRecipentList, eobiAllowances, bankInfoList, sessiAllowanceList, providentFundAllowances,pensionAllowances));
      //  const list = await dispatch(actions.fetchUsers(usersUIProps.queryParams));


    } else {



      const payrollUpdateObj = {
        Id: user.Id,
        //-- Payroll Configuration ----

        subsidiaryId: user.subsidiaryId,
        companyId: user.companyId,
        // payroll_templateId: user.payroll_templateId,
        employer_uniqueId: user.employer_uniqueId,
        payroll_approverId: user.payroll_approverId,
        payroll_groupId: user.payroll_groupId,
        basicSalaryId: user.basicSalaryId,
        salaryRoundingId: user?.salaryRoundingId,
        // -- Email Sender ------------
        sender_emailId: user.sender_emailId,
        employee_email_recipentId: user.employee_email_recipentId,

        // -- Accounting Impact ----
        isEnableAccounting: user.isEnableAccounting,
        basic_pay_accountId: user.basic_pay_accountId,
        payroll_payable_accountId: user.payroll_payable_accountId,
        default_loan_accountId: user.default_loan_accountId,
        // isGroupEarningOnAccount: user.isGroupEarningOnAccount,
        // isGroupDeduductionOnAccount: user.isGroupDeduductionOnAccount,
        // isAccrueGratuityOnPayroll: user.isAccrueGratuityOnPayroll,

        // -- Tax : user.companyIdegration
        isEnableTax: user.isEnableTax,
        payrollTax_DeductionTypeId: user.payrollTax_DeductionTypeId,
        arrearTaxDeductionId: user.arrearTaxDeductionId,
        // isTrackDeductionHistory: user.isTrackDeductionHistory,

        //-- Leave / AAtteandance : user.companyIdegraion
        isEnableAttandanceIntegration: user.isEnableAttandanceIntegration,
        isEnableLeaveManagemenent: user.isEnableLeaveManagemenent,
        isEnableOverTimeCalc: user.isEnableOverTimeCalc,
        leaveDeductionId: user.leaveDeductionId,
        lateCountPerDaySalaryDeduction: user.lateCountPerDaySalaryDeduction,
        leaveEnchashment_EarningId: user.leaveEnchashment_EarningId,
        lateDeductionId: user.lateDeductionId,
        overTimeEarningId: user.overTimeEarningId,
        isEnableSandwichLeavePolicy: user.isEnableSandwichLeavePolicy,

        //-- Loan : user.companyIdegration	
        isEnableLoan: user.isEnableLoan,
        loanDeductionId: user.loanDeductionId,

        //--  EOBI Configuration
        isEnableEOBI: user.isEnableEOBI,
        eobi_basis: user.eobi_basis,
        eobi_deductionId: user.eobi_deductionId,
        eobi_earningId: user.eobi_earningId,
        //isIncludeBasicisIncludeBasic, user.isIncludeBasicisIncludeBasic,
        eobi_employeer_value_in_percent: user.eobi_employeer_value_in_percent,
        eobi_employee_value_in_percent: user.eobi_employee_value_in_percent,

        // --  SESSI Configuration
        isEnableSESSI: user.isEnableSESSI,
        sessi_deductionId: user.sessi_deductionId,
        sessi_basis: user.sessi_basis,
        sessi_earningId: user.sessi_earningId,
        sessi_employeer_value_in_percent: user.sessi_employeer_value_in_percent,
        sessi_employee_value_in_percent: user.sessi_employee_value_in_percent,

        salaryApproverId: user.salaryApproverId,
        loanApproverId: user.loanApproverId,
        payrollApproverId: user.payrollApproverId,
        separationApproverId: user.separationApproverId,

        journalChequeAccountId: user?.journalChequeAccountId,
        journalCashAccountId: user?.journalCashAccountId,


        // Salary Policy
        SalaryPolicy: user.SalaryPolicy,
        SalaryPolicy_Days: user.SalaryPolicy_Days,
        OvertimeBasis: user.OvertimeBasis,



        //--  Provident Configuration
        isProvidentFund: user.isProvidentFund,
        providentFundId: user.providentFundId,
        providentFundAllowancesId: user.providentFundAllowancesId,

        pf_employer_percent: user.pf_employer_percent,
        pf_employee_percent: user.pf_employee_percent,
        pf_eligibility: user.pf_eligibility,


        isPensionAllowance: user.isPensionAllowance,
        pensionAllowanceId: user.pensionAllowanceId,
        pensionAllowancesId: user.pensionAllowancesId,

        pa_employer_percent: user.pa_employer_percent,
        pa_employee_percent: user.pa_employee_percent,

        // new 
        OvertimePolicy: user.OvertimePolicy,
        OvertimePolicy_Days: user.OvertimePolicy_Days,
        hoursPolicy: user.hoursPolicy,
        fixedHours: user.fixedHours,
        isEnableFinalSettlement: user.isEnableFinalSettlement,
        finalSettlementPolicy: user.finalSettlementPolicy,
        finalSettlement_Days: user.finalSettlement_Days,
       

      };
console.log("update_Payroll_Policy8888888888",pensionAllowances)

      await dispatch(actions.update_Payroll_Policy(payrollUpdateObj, emailRecipentList, eobiAllowances, bankInfoList, sessiAllowanceList,providentFundAllowances,pensionAllowances));
      // await dispatch(actions.fetchUsers(usersUIProps.queryParams));
    }
  };

  const allEarningsMap = useMemo(() => {
    return new Map(dashboard.allEarnings?.map(item => [item.value, item]));
  }, [dashboard.allEarnings]);

  useEffect(() => {
    dispatch(fetchAllLeaveTypeBySubsidiary("allLeaveTypes", currentState?.userForEdit?.subsidiaryId || ''));
    dispatch(fetchAllDeductionList(2, currentState?.userForEdit?.subsidiaryId || '', ''));
    dispatch(fetchAllEarningList(1, currentState?.userForEdit?.subsidiaryId || '', ''));
  }, [currentState?.userForEdit?.subsidiaryId])
  let defaultCount = 0;
  const validate = () => {
    const newErrors = {};

    defBankInfoList.forEach((objValidate, index) => {

      if (!objValidate.journalBankAccountId || objValidate.journalBankAccountId == "-1") {
        newErrors[`journalBankAccountId-${index}`] = VALIDATION_MESSAGES.required;
      }
      if (!objValidate.bankCode) {
        newErrors[`bankCode-${index}`] = VALIDATION_MESSAGES.required;
      }
      else if (objValidate.bankCode?.toString()?.trim()?.length > 25) {
  newErrors[`bankCode-${index}`] = `Max 25 Characters`;
}
      // Check if factorValue is required
      if (!objValidate.bankAccountNo) {
        newErrors[`bankAccountNo-${index}`] = VALIDATION_MESSAGES.required;
      }
      else if (objValidate.bankAccountNo?.toString()?.trim()?.length > 20) {
        newErrors[`bankAccountNo-${index}`] = `Max 20 Characters`
      }

      // Check if amount is required
      // if (!objValidate.bankName) {
      //   newErrors[`bankName-${index}`] = VALIDATION_MESSAGES.required;
      // }  
      if (!objValidate.bankId || objValidate.journalBankAccountId == "-1") {
        newErrors[`bankId-${index}`] = VALIDATION_MESSAGES.required;
      }
      if (!objValidate.branchId || objValidate.branchId == "-1") {
        newErrors[`branchId-${index}`] = VALIDATION_MESSAGES.required;
      }

      // Count how many are checked as default
      if (objValidate.isDefault) {
        defaultCount++;
      }
    });

    //  Check if exactly one default is selected
    if (defaultCount > 1) {
      newErrors["isDefault"] = "Only one row can be marked as default.";
    }

    return newErrors;
  };


  const handleCheckboxForRoleChange = (value) => {

    setSelectedEmployees((prev) => {
      if (prev.includes(value)) {
        // If the employee is already selected, remove it
        return prev.filter((id) => id !== value);
      } else {
        // If the employee is not selected, add it
        return [...prev, value];
      }
    });
  };


  const filteredBranches = (bankId) => {
    return dashboard?.allBankBranch?.filter((branch) => branch.bankId == bankId) || [];
  };

  // useEffect(() => {

  //     // dispatch(fetchAllBanks(1));
  //     dispatch(fetchAllBanks(null));
  //     dispatch(fetchAllBankBranch(null));


  // }, [dispatch]);

  const salaryPolicyOptions = [
    { value: 0, label: "Month Days" },
    { value: 1, label: "Fixed Days " },
  ];

  const overtimeHoursOptions = [
    { value: 0, label: "Employee Shift" },
    { value: 1, label: "Fixed Hours" },
  ];

  const overtimeBasisOptions = [
    { value: 0, label: "Basic Salary" },
    { value: 1, label: "Gross Salary" },
  ];

  return (
    <>
      <div className="w-full overflow-x-auto rounded-b-lg bg-white px-3 pb-2" >
        <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => {
            return (
              <Pagination
                isLoading={listLoading}
                paginationProps={paginationProps}
              >
                <BootstrapTable
                  wrapperClasses="table-responsive"
                  bordered={false}
                  classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                  bootstrap4
                  remote
                  keyField="Id"
                  data={entities === null ? [] : entities}
                  columns={columns}
                  defaultSorted={uiHelpers.defaultSorted}
                  onTableChange={getHandlerTableChange(
                    FormUIProps.setQueryParams
                  )}
                  // selectRow={getSelectRow({
                  //   entities,

                  // })}
                  {...paginationTableProps}
                >
                  <PleaseWaitMessage entities={entities} />
                  <NoRecordsFoundMessage entities={entities} />
                </BootstrapTable>
              </Pagination>
            );
          }}
        </PaginationProvider>
      </div>
      {user?.active && <div className="rounded-b-lg bg-white px-3 py-2 mt-2">
        <Formik
          enableReinitialize={true}
          initialValues={currentState.userForEdit || initialValues}
          validationSchema={formValidation}

          onSubmit={async (values) => {

            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
              setotherErrors(validationErrors);
            } else {
              defaultCount = 0
              setotherErrors(validate());
             
              SavePayrollPolicy(values, defEmailRecipents, defEOBIAllowances, defBankInfoList, defSESSIAllowances, defProvidentFundAllowances,defPensionAllowances);

              if (user.formid) {
                dispatch(actions.fetchUser(null));
              }
              else {
                dispatch(actions.fetchUser(''));
              }
              user.setid(0);
            }
          }}
        >
          {({
            handleSubmit,
            errors,
            touched,
            values,
            handleBlur,
            handleChange,
            setFieldValue,
            setFieldTouched,
            formik,
          }) => (
            <>  <Form className="form form-label-right">
              {console.log("errors11111",errors)}
              <fieldset disabled={user?.readOnly || false} >

                <div className="flex justify-between">
                  <h6 className="font-bold mb-0 text-primary ">
                    Payroll Configuration
                  </h6>
                  <X title="Close" onClick={() =>
                    user.setActive(false)} className="w-4 h-4 text-black cursor-pointer" />
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-6 gap-x-3 ">
                  <div className="">
                    <SearchSelect
                      name="subsidiaryId"
                      isDisabled={Boolean(user?.readOnly)}
                      label={<span>Subsidiary<span style={{ color: 'red' }}>*</span></span>}
                      onBlur={() => {
                        // handleBlur({ target: { name: "countryId" } });
                      }}
                      onChange={(e) => {
                        setFieldValue("subsidiaryId", e.value || null);
                        setDefualtSubsidiaryList(e);
                        dispatch(fetchAllLeaveTypeBySubsidiary("allLeaveTypes", e.value));
                        dispatch(fetchAllDeductionList(2, e.value, ''));
                        dispatch(fetchAllEarningList(1, e.value, ''));
                        //handlePaymenModeChanged(e)
                      }}

                      value={
                        dashboard.allSubidiaryList.find(
                          (option) => option.value === values.subsidiaryId
                        ) || null
                      }
                      error={errors.subsidiaryId}
                      touched={touched.subsidiaryId}
                      options={dashboard.allSubidiaryList}
                    />

                  </div>



                  <div className="">
                    <SearchSelect
                      name="basicSalaryId"
                      label={<span>Basic Salary<span style={{ color: 'red' }}>*</span></span>}
                      onChange={(e) => {
                        setFieldValue("basicSalaryId", e.value || null);
                      }}
                      value={allEarningsMap?.get(values?.basicSalaryId || '') || ''}
                      error={errors.basicSalaryId}
                      touched={touched.basicSalaryId}
                      options={dashboard?.allEarnings?.filter((el) => el?.mappedAllowance === "1")}
                      isDisabled={Boolean(user?.readOnly)}
                    />
                  </div>

                  <div className="">
                    <SearchSelect
                      name="SalaryPolicy"
                      label={<span>Policy for per Day Calculation<span style={{ color: 'red' }}>*</span></span>}
                      onChange={(e) => {
                        setFieldValue("SalaryPolicy", Number(e?.value));
                        setFieldValue("SalaryPolicy_Days", 0);
                      }}

                      value={
                        salaryPolicyOptions.find(
                          (option) => option.value === Number(values?.SalaryPolicy)
                        ) || null
                      }

                      error={errors.SalaryPolicy}
                      touched={touched.SalaryPolicy}
                      options={salaryPolicyOptions}
                      isDisabled={Boolean(user?.readOnly)}
                    />
                  </div>

                  <div className="">
                    <Field
                      disabled={!Boolean(values.SalaryPolicy)}
                      name="SalaryPolicy_Days"
                       component={Input}
                      type="number"
                      placeholder="Fixed Days"

                       label={<span>Fixed Days{Boolean(values.SalaryPolicy) && <span style={{ color: 'red' }}>*</span>}</span>}
                      
                      autoComplete="off"
                    />
                  </div>




                  <div className="col-span-1">
                    <SearchSelect
                      name="salaryRoundingId"
                      label={<span>Salary Rounding </span>}
                      onChange={(e) => {
                        setFieldValue("salaryRoundingId", e.value || null);
                      }}
                      value={allEarningsMap?.get(values?.salaryRoundingId || '') || ''}
                      error={errors.salaryRoundingId}
                      touched={touched.salaryRoundingId}
                      options={dashboard?.allEarnings?.filter((el) => el?.mappedAllowance === "1")}
                      isDisabled={Boolean(user?.readOnly)}
                    />
                  </div>
                </div>
                {/* </div> */}
                <hr></hr>



                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3 ">



                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-x-2">
                    <div>
                      <h6 className="font-bold text-primary m-0 h-5">
                        Approval Authorities
                      </h6>

                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-2 justify-start">
                        <div className="">
                          <label>
                            Salary Setup Approver
                          </label>





                          <div className="overflow-auto max-h-16 border-none scrollbar-fancy">
                            {roles?.map((option) => (
                              <div key={option.Id} className="flex justify-start items-center">
                                <input className="mr-1"
                                  name="salaryApproverId"
                                  type="checkbox"
                                  value={option.value}
                                  checked={Boolean(values?.salaryApproverId?.includes(option?.value?.toString()))}
                                  onChange={handleChange}
                                />
                                <label>{option.label}
                                </label>
                              </div>
                            ))}

                          </div>


                        </div>






                        <div className="">
                          <label>
                            Loan Approver
                          </label>





                          <div className="overflow-auto max-h-16 border-none scrollbar-fancy">
                            {roles?.map((option) => (
                              <div key={option.Id} className="flex justify-start items-center">
                                <input className="mr-1"
                                  name="loanApproverId"
                                  type="checkbox"
                                  value={option.value}
                                  checked={Boolean(values?.loanApproverId?.includes(option?.value?.toString()))}
                                  onChange={handleChange}
                                />
                                <label>{option.label}
                                </label>
                              </div>
                            ))}

                          </div>


                        </div>




                        <div className="">
                          <label>
                            Payroll Approver
                          </label>





                          <div className="overflow-auto max-h-16 border-none scrollbar-fancy">
                            {roles?.map((option) => (
                              <div key={option.Id} className="flex justify-start items-center">
                                <input className="mr-1"
                                  name="payrollApproverId"
                                  type="checkbox"
                                  value={option.value}
                                  checked={Boolean(values?.payrollApproverId?.includes(option?.value?.toString()))}
                                  onChange={handleChange}
                                />
                                <label>{option.label}
                                </label>
                              </div>
                            ))}

                          </div>


                        </div>


                           <div className="">
                          <label>
                            Separation Approver
                          </label>





                          <div className="overflow-auto max-h-16 border-none scrollbar-fancy">
                            {roles?.map((option) => (
                              <div key={option.Id} className="flex justify-start items-center">
                                <input className="mr-1"
                                  name="separationApproverId"
                                  type="checkbox"
                                  value={option.value}
                                  checked={Boolean(values?.separationApproverId?.includes(option?.value?.toString()))}
                                  onChange={handleChange}
                                />
                                <label>{option.label}
                                </label>
                              </div>
                            ))}

                          </div>


                        </div>

                      </div>

                    </div>
                  </div>
                  {/* <h6 className="font-bold mb-0 text-primary ">
                  Email Preferences
                </h6> */}
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-x-2">

                    <h6 className="font-bold mb-0 text-primary mt-0">
                      Email Preferences
                    </h6>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {/* <div className="">
                      <SearchSelect
                        name="sender_emailId"
                        label={<span>Email Sender</span>}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("sender_emailId", e.value || null);
                        }}
                        isDisabled={Boolean(user?.readOnly)}
                        value={(dashboard.allEmployees.find(
                          (option) => option.value === values.sender_emailId
                        ) || null)}
                        error={errors.sender_emailId}
                        touched={touched.sender_emailId}
                        options={dashboard.allEmployees}
                      />
                    </div> */}
                      <div className="">
                        <label>Email Recipients</label>




                        <div className="overflow-auto max-h-16 border-none scrollbar-fancy">
                          {dashboard.allEmployees.map((option) => (
                            <div key={option.value} className="flex justify-start items-center border-none">
                              <input className="mr-1"
                                name="employee_email_recipentId"
                                type="checkbox"
                                checked={defEmailRecipents?.includes(option.value)}
                                onChange={() => handleCheckboxChangeFor_EmailReciepents(option.value)}
                              />
                              <label>{option.label}
                              </label>
                            </div>
                          ))}
                        </div>


                      </div>

                    </div>
                  </div>

                </div>

                {/* <br></br> */}


                <hr></hr>

                <h6 className="font-bold mb-0 text-primary my-2">
                  Accounting Impact
                </h6>
                  <div className="col-span-1">
                    <label className="flex items-center mt-1">
                      <input
                        className="mr-1"
                        name="isEnableAccounting"
                        type="checkbox"
                        onChange={(e) => {
                          setFieldValue('isEnableAccounting', e.target.checked);
                        }}
                        checked={values.isEnableAccounting}
                      />
                      <span>Enable Accounting Impact</span>
                    </label>
                  </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-3 ">
                  {/* <div className="flex justify-start items-center">
                  <input className="mr-1"
                    name="isEnableAccounting"
                    type="checkbox"
                    onChange={(e) => {
                      setFieldValue('isEnableAccounting', e.target.checked)
                    }}
                    checked={values.isEnableAccounting}

                  />
                  <label> Enable Accounting Impact</label>

                </div> */}


                  <div className="">
                    <SearchSelect
                      name="payroll_payable_accountId"
                      label={<span>Payroll Payable Account{Boolean(values.isEnableAccounting) && <span style={{ color: 'red' }}>*</span>}</span>}
                      isDisabled={!Boolean(values.isEnableAccounting) || Boolean(user?.readOnly)}
                      onChange={(e) => {
                        setFieldValue("payroll_payable_accountId", e.value || null);
                        setDefaultPaybleAccount(e);
                      }}
                      value={
                        dashboard.allPayrollPayableAccounts.find(
                          (option) => option.value === values.payroll_payable_accountId
                        ) || null
                      }
                      error={errors.payroll_payable_accountId}
                      touched={touched.payroll_payable_accountId}
                      options={dashboard.allPayrollPayableAccounts}
                    />
                  </div>
                  <div className="">
                    <SearchSelect
                      name="default_loan_accountId"
                      label={<span>Default Loan Account{Boolean(values.isEnableAccounting) && <span style={{ color: 'red' }}>*</span>}</span>}
                      isDisabled={!Boolean(values.isEnableAccounting) || Boolean(user?.readOnly)}
                      onChange={(e) => {
                        setFieldValue("default_loan_accountId", e.value || null);
                        setDefaultPaybleAccount(e);
                      }}
                      value={
                        dashboard.allDefaultLoanAccounts.find(
                          (option) => option.value === values.default_loan_accountId
                        ) || null
                      }
                      error={errors.default_loan_accountId}
                      touched={touched.default_loan_accountId}
                      options={dashboard.allDefaultLoanAccounts}
                    />
                  </div>
                </div>



                {dashboard.allSubidiaryList?.find(
                  (option) => option.value === values.subsidiaryId
                )?.localizationId == 1 && (<>
                  <hr></hr>
                <h6 className="font-bold mb-0 text-primary my-2">
                    Tax Integration
                  </h6>
                    <div className="flex items-start">
                      <label className="flex items-center mt-1">
                        <input className="mr-1"
                          name="isEnableTax"
                          type="checkbox"
                          onChange={(e) => {
                            setFieldValue('isEnableTax', e.target.checked)
                          }}
                          checked={values.isEnableTax}

                        />
                        <span>
                          Enable Tax Integration
                        </span>
                      </label>

                    </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-3  ">
                    {/* <div className="flex justify-start items-center">
                  <input className="mr-1"
                    name="isEnableTax"
                    type="checkbox"
                    onChange={(e) => {
                      setFieldValue('isEnableTax', e.target.checked)
                    }}
                    checked={values.isEnableTax}

                  />
                  <label>
                    Enable Tax Integration
                  </label>

                  <br></br>
                </div> */}




                    <div className="col-apnan2">
                      {<span><label>Payroll Tax Deduction Type</label>{Boolean(values.isEnableTax) && <span style={{ color: 'red' }}>*</span>}</span>}
                      <select className="form-control"
                        disabled={!Boolean(values.isEnableTax)}
                        onChange={(e) => {
                          setFieldValue('payrollTax_DeductionTypeId', e.target.value)
                        }}
                        value={values.payrollTax_DeductionTypeId}
                        name="payrollTax_DeductionTypeId">
                        <option value="-1"> Select</option>
                        {
                          dashboard?.allDeductions?.filter((el) => el?.mappedDeduction === "1")?.map((x) => {
                            return <option disabled={defMapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                          })}
                      </select>
                      {errors.payrollTax_DeductionTypeId && touched.payrollTax_DeductionTypeId && <ErrorMessage className="invalid-feedback" name="payrollTax_DeductionTypeId" component="div" />}
                    </div>
                    <div className="col-apnan2">
                      {<span><label>Arrears Tax Deduction</label>{Boolean(values.isEnableTax) && <span style={{ color: 'red' }}></span>}</span>}
                      <select className="form-control"
                        disabled={!Boolean(values.isEnableTax)}
                        onChange={(e) => {
                          setFieldValue('arrearTaxDeductionId', e.target.value)
                        }}
                        value={values.arrearTaxDeductionId}
                        name="arrearTaxDeductionId">
                        <option value="-1"> Select</option>
                        {
                          dashboard?.allDeductions?.filter((el) => el?.mappedDeduction === "1")?.map((x) => {
                            return <option disabled={defMapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                          })}
                      </select>
                      {errors.arrearTaxDeductionId && touched.arrearTaxDeductionId && <ErrorMessage className="invalid-feedback" name="arrearTaxDeductionId" component="div" />}
                    </div>

                  </div>
                </>)}
                <hr></hr>

                <h6 className="font-bold mb-0 text-primary my-2">
                  Leave/Attendance Integration
                </h6>



                <div className="flex  items-start">
                  <label className="flex items-center mt-1">
                    <input className="mr-1"
                      name="isEnableAttandanceIntegration"
                      type="checkbox"
                      onChange={(e) => {
                        setFieldValue('isEnableAttandanceIntegration', e.target.checked)
                      }}
                      checked={values.isEnableAttandanceIntegration}

                    />
                    <span>
                      Enable Attendance Integration
                    </span>
                  </label>
                </div>




                <div>

                  <h6 className="font-semibold mb-0 text-primary mt-2 text-sm">
                    Late Deduction
                  </h6>
                  <div className="grid lg:grid-cols-5 gap-x-3">

                    <div className="">
                      <Field
                        name="lateCountPerDaySalaryDeduction"
                        onChange={(e) => {
                          //setGrossSalaryDB(e.target.value);
                          setFieldValue("lateCountPerDaySalaryDeduction", e.target.value);
                        }}
                        disabled={!Boolean(values.isEnableAttandanceIntegration)}
                        value={values.lateCountPerDaySalaryDeduction}
                        component={Input}
                        placeholder="Enter value"
                        label={<span>Late Count Per Day Salary Deduction{Boolean(values.isEnableAttandanceIntegration) && <span style={{ color: 'red' }}>*</span>}</span>}
                        autoComplete="off"
                      />
                    </div>



                    <div className="">
                      <label>
                        Leave Deduction
                        {Boolean(values.isEnableAttandanceIntegration) && <span style={{ color: 'red' }}>*</span>}
                      </label>
                      <select
                        className="form-control"
                        disabled={!Boolean(values.isEnableAttandanceIntegration)}
                        onChange={(e) => {
                          // If 'N/A' is selected, set the value to null, else convert the selected value to a number
                          const value = e.target.value === 'N/A' ? null : Number(e.target.value);
                          setFieldValue('leaveDeductionId', value); // Update form value with the selected option
                        }}
                        value={values.leaveDeductionId || 'N/A'} // Default to 'N/A' if no value is selected
                        name="leaveDeductionId"
                      >
                        {/* Add 'N/A' option */}
                        <option value="N/A">N/A</option>

                        {/* Filter out 'Select' and render other options for leave types */}
                        {dashboard.allLeaveTypes?.filter(x => x.value !== null).map((x) => (
                          <option key={x.value} value={x.value}>
                            {x.label}
                          </option>
                        ))}
                      </select>

                      {errors.leaveDeductionId && touched.leaveDeductionId && (
                        <ErrorMessage className="invalid-feedback" name="leaveDeductionId" component="div" />
                      )}
                    </div>






                    <div className="">
                      {<label>Late Deduction{Boolean(values.isEnableAttandanceIntegration) && <span style={{ color: 'red' }}>*</span>}</label>}
                      <select className="form-control"
                        onChange={(e) => {
                          setFieldValue('lateDeductionId', e.target.value)
                        }}
                        disabled={!Boolean(values.isEnableAttandanceIntegration)}
                        value={values.lateDeductionId}
                        name="lateDeductionId">
                        <option value="-1"> Select</option>
                        {
                          dashboard?.allDeductions?.filter((el) => el?.mappedDeduction === "1")?.map((x) => {
                            return <option value={x.value}> {x.label} </option>
                          })}
                      </select>
                      {errors.lateDeductionId && touched.lateDeductionId && <ErrorMessage className="invalid-feedback" name="lateDeductionId" component="div" />}
                    </div>

                  </div>
                </div>



                <div >

                <hr></hr>

                <h6 className="font-bold mb-0 text-primary my-2">
                    Overtime / Leave Encashment
                  </h6>
                    <div className="flex items-start">
                      <label className="flex items-center space-x-1">
                        <input className="mr-1"
                          // disabled={!Boolean(values.isEnableAttandanceIntegration)}
                          type="checkbox"
                          name="isEnableOverTimeCalc"
                          onChange={(e) => {
                            setFieldValue('isEnableOverTimeCalc', e.target.checked)
                          }}
                          checked={values.isEnableOverTimeCalc}
                        />
                        Enable Overtime / Leave Encashment
                      </label>
                    </div>
                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-3">
                    <div className="">
                      {<label>Overtime Allowance{Boolean(values.isEnableOverTimeCalc) && <span style={{ color: 'red' }}>*</span>}</label>}
                      <select className="form-control"
                        onChange={(e) => {
                          setFieldValue('overTimeEarningId', e.target.value)
                        }}
                        value={values.overTimeEarningId}
                        disabled={!Boolean(values.isEnableOverTimeCalc)}
                        name="overTimeEarningId">
                        <option value="-1"> Select</option>
                        {
                          dashboard?.allEarnings?.filter((el) => el?.mappedAllowance === "1")?.map((x) => {
                            return <option value={x.value}> {x.label} </option>
                          })}
                      </select>
                      {errors.overTimeEarningId && touched.overTimeEarningId && <ErrorMessage className="invalid-feedback" name="overTimeEarningId" component="div" />}
                    </div>


                    <div className="">
                      <SearchSelect
                        name="OvertimeBasis"
                        label={<span>Overtime Basis{Boolean(values.isEnableOverTimeCalc) && <span style={{ color: 'red' }}>*</span>}</span>}
                        onChange={(e) => {
                          setFieldValue("OvertimeBasis", Number(e?.value));

                        }}

                        value={
                          overtimeBasisOptions.find(
                            (option) => option.value == Number(values?.OvertimeBasis)
                          ) || null
                        }

                        error={errors.OvertimeBasis}
                        touched={touched.OvertimeBasis}
                        options={overtimeBasisOptions}
                        isDisabled={Boolean(user?.readOnly) || !Boolean(values.isEnableOverTimeCalc)}
                      />
                      
                    </div>

                  {/* new  */}
               
                  <div className="">
                    <SearchSelect
                      name="OvertimePolicy"
                      label={<span>Policy for per Day Calculation<span style={{ color: 'red' }}>*</span></span>}
                      onChange={(e) => {
                        setFieldValue("OvertimePolicy", Number(e?.value));
                        setFieldValue("OvertimePolicy_Days", 0);
                      }}

                      value={
                        salaryPolicyOptions.find(
                          (option) => option.value == Number(values?.OvertimePolicy)
                        ) || null
                      }

                      error={errors.OvertimePolicy}
                      touched={touched.OvertimePolicy}
                      options={salaryPolicyOptions}
                      isDisabled={!Boolean(values.isEnableOverTimeCalc)}
                    />
                  </div>

                  <div className="">
                    <Field
                      disabled={!Boolean(values.OvertimePolicy) || !Boolean(values.isEnableOverTimeCalc)}
                      name="OvertimePolicy_Days"
                       component={Input}
                      type="number"
                      placeholder="Fixed Days"

                       label={<span>Fixed Days{Boolean(values.OvertimePolicy) && <span style={{ color: 'red' }}>*</span>}</span>}
                      
                      autoComplete="off"
                    />
                  </div>

                  <div className="">
                    <SearchSelect
                      name="hoursPolicy"
                      label={<span>Policy for per Hour Calculation<span style={{ color: 'red' }}>*</span></span>}
                      onChange={(e) => {
                        setFieldValue("hoursPolicy", Number(e?.value));
                        setFieldValue("fixedHours", 0);
                      }}

                      value={
                        overtimeHoursOptions.find(
                          (option) => option.value == Number(values?.hoursPolicy)
                        ) || null
                      }

                      error={errors.hoursPolicy}
                      touched={touched.hoursPolicy}
                      options={overtimeHoursOptions}
                      isDisabled={!Boolean(values.isEnableOverTimeCalc)}
                    />
                  </div>

                  <div className="">
                    <Field
                      disabled={!Boolean(values.hoursPolicy) || !Boolean(values.isEnableOverTimeCalc)}
                      name="fixedHours"
                       component={Input}
                      type="number"
                      placeholder="Fixed Hours"

                       label={<span>Fixed Hours{Boolean(values.hoursPolicy) && <span style={{ color: 'red' }}>*</span>}</span>}
                      
                      autoComplete="off"
                    />
                  </div>

                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-3">
                                      <div className="">
                      {<label>Encashment Allowance{Boolean(values.isEnableOverTimeCalc) && <span style={{ color: 'red' }}>*</span>}</label>}
                      <select className="form-control"
                        onChange={(e) => {
                          setFieldValue('leaveEnchashment_EarningId', e.target.value)
                        }}
                        disabled={!Boolean(values.isEnableOverTimeCalc)}
                        value={values.leaveEnchashment_EarningId}
                        name="leaveEnchashment_EarningId">
                        <option value="-1"> Select</option>
                        {
                          dashboard?.allEarnings?.filter((el) => el?.mappedAllowance === "1")?.map((x) => {
                            return <option value={x.value}> {x.label} </option>
                          })}
                      </select>
                      {errors.leaveEnchashment_EarningId && touched.leaveEnchashment_EarningId && <ErrorMessage className="invalid-feedback" name="leaveEnchashment_EarningId" component="div" />}
                    </div>
                    </div>
                </div>



                <div >


                <hr></hr>

                <h6 className="font-bold mb-0 text-primary my-2">
                    Leave Management
                  </h6>
                    <div className="flex items-start">
                      <label className="flex items-center space-x-1">
                        <input className="mr-1"
                          type="checkbox"
                          name="isEnableLeaveManagemenent"
                          onChange={(e) => {
                            setFieldValue('isEnableLeaveManagemenent', e.target.checked)
                          }}
                          checked={values.isEnableLeaveManagemenent}
                          // disabled={!Boolean(values.isEnableAttandanceIntegration)}
                        />
                        Enable Leave Management
                      </label>
                    </div>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-3">


                    <div className="">
                      <Select
                        className="form-control"
                        name="isEnableSandwichLeavePolicy"
                        value={values.isEnableSandwichLeavePolicy}
                        label={<span>Enable Sandwich Policy For Leave</span>}
                        onChange={(e) => {
                          setFieldValue("isEnableSandwichLeavePolicy", e.target.value);

                        }}
                        disabled={!Boolean(values.isEnableLeaveManagemenent)}
                        onBlur={handleBlur}
                      >
                        <option value="-1">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>

                      </Select>

                    </div>

                  </div>
                </div>


                {/* final settlement  */}
                
                <div >


                <hr></hr>

                <h6 className="font-bold mb-0 text-primary my-2">
                    Final Settlement Policy
                  </h6>
                    <div className="flex items-start">
                      <label className="flex items-center space-x-1">
                        <input className="mr-1"
                          type="checkbox"
                          name="isEnableFinalSettlement"
                          onChange={(e) => {
                            setFieldValue('isEnableFinalSettlement', e.target.checked)
                          }}
                          checked={values.isEnableFinalSettlement}
                          // disabled={!Boolean(values.isEnableAttandanceIntegration)}
                        />
                        Enable Final Settlement
                      </label>
                    </div>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-3">

                  <div className="">
                    <SearchSelect
                      name="finalSettlementPolicy"
                      label={<span>Policy for per Day Calculation<span style={{ color: 'red' }}>*</span></span>}
                      onChange={(e) => {
                        setFieldValue("finalSettlementPolicy", Number(e?.value));
                        setFieldValue("finalSettlement_Days", 0);
                      }}

                      value={
                        salaryPolicyOptions.find(
                          (option) => option.value == Number(values?.finalSettlementPolicy)
                        ) || null
                      }

                      error={errors.finalSettlementPolicy}
                      touched={touched.finalSettlementPolicy}
                      options={salaryPolicyOptions}
                      isDisabled={!Boolean(values.isEnableFinalSettlement)}
                    />
                  </div>

                  <div className="">
                    <Field
                      disabled={!Boolean(values.finalSettlementPolicy) || !Boolean(values.isEnableFinalSettlement)}
                      name="finalSettlement_Days"
                       component={Input}
                      type="number"
                      placeholder="Fixed Days"

                       label={<span>Fixed Days{Boolean(values.finalSettlementPolicy) && <span style={{ color: 'red' }}>*</span>}</span>}
                      
                      autoComplete="off"
                    />
                  </div>


                  </div>
                </div>

                <hr></hr>

     <div>
                <hr></hr>

                <h6 className="font-bold mb-0 text-primary my-2">
                    Provident Fund Policy
                  </h6>

                    <div className="flex  items-start">
                      <label className="flex items-center space-x-1">

                        <input className="mr-1"

                          name="isProvidentFund"
                          type="checkbox"
                          onChange={(e) => {
                            setFieldValue('isProvidentFund', e.target.checked)
                          }}
                          checked={values.isProvidentFund}
                        />
                        Enable Provident Fund
                      </label>
                    </div>
                  <div className="grid lg:grid-cols-5 gap-x-3 gap-y-1">


                    <div className="">
                      {<label>Provident Fund{Boolean(values.isProvidentFund) && <span style={{ color: 'red' }}>*</span>}</label>}
                      <select className="form-control"
                        disabled={!Boolean(values.isProvidentFund)}
                        onChange={(e) => {
                          setFieldValue('providentFundId', e.target.value)
                        }}
                        value={values.providentFundId}
                        name="providentFundId">
                        <option value="-1"> Select</option>
                        {
                          dashboard?.allDeductions?.filter((el) => el?.mappedDeduction === "1")?.map((x) => {
                            return <option value={x.value}> {x.label} </option>
                          })}
                      </select>
                      {errors.providentFundId && touched.providentFundId && <ErrorMessage className="invalid-feedback" name="providentFundId" component="div" />}
                    </div>

                     <div className="">
                      <Field
                        disabled={!Boolean(values.isProvidentFund)}
                        name="pf_eligibility"
                        component={Input}
                        type="number"
                        placeholder="PF Eligibility"
                        value={values.pf_eligibility}
                        label={<span>PF Eligibility {Boolean(values.isProvidentFund) && <span style={{ color: 'red' }}>*</span>}</span>}
                        autoComplete="off"
                      />
                    </div>


                    <div className="">
                      <Field
                        disabled={!Boolean(values.isProvidentFund)}
                        name="pf_employer_percent"
                        component={Input}
                        type="number"
                        placeholder="Employeer value"
                        value={values.pf_employer_percent}
                        label={<span>Employer(%){Boolean(values.isProvidentFund) && <span style={{ color: 'red' }}>*</span>}</span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="">
                      <Field
                        disabled={!Boolean(values.isProvidentFund)}
                        name="pf_employee_percent"
                        component={Input}
                        type="number"
                        placeholder="Employee value"
                        label={<span>Employee(%){Boolean(values.isProvidentFund) && <span style={{ color: 'red' }}>*</span>}</span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="">
                      <label>  Providen Fund Allowances </label>




                      <div className="overflow-auto max-h-16 border-none scrollbar-fancy">

                        {dashboard.allEarnings.map((option) => (
                          <div key={option.value} className="flex justify-start items-center border-none">

                            <input className="mr-1"
                              disabled={!Boolean(values.isProvidentFund)}
                              name="providentFundAllowancesId"
                              type="checkbox"
                              checked={defProvidentFundAllowances?.includes(option.value)}
                              onChange={() => handleCheckboxChangeFor_providentFundAllowances(option.value)}
                            />
                            <label> {option.label} </label>
                          </div>
                        ))}
                      </div>








                    </div>
                  </div>

                  <hr></hr>

                </div>

                     <div>
                <hr></hr>

                <h6 className="font-bold mb-0 text-primary my-2">
                 Pension Allowance
                  </h6>

                    <div className="flex  items-start">
                      <label className="flex items-center space-x-1">

                        <input className="mr-1"

                          name="isPensionAllowance"
                          type="checkbox"
                          onChange={(e) => {
                            setFieldValue('isPensionAllowance', e.target.checked)
                          }}
                          checked={values.isPensionAllowance}
                        />
                        Enable Pension Allowance
                      </label>
                    </div>
                  <div className="grid lg:grid-cols-5 gap-x-3 gap-y-1">


                    <div className="">
                      {<label>Pension Allowance{Boolean(values.isPensionAllowance) && <span style={{ color: 'red' }}>*</span>}</label>}
                      <select className="form-control"
                        disabled={!Boolean(values.isPensionAllowance)}
                        onChange={(e) => {
                          setFieldValue('pensionAllowanceId', e.target.value)
                        }}
                        value={values.pensionAllowanceId}
                        name="pensionAllowanceId">
                        <option value=""> Select</option>
                        {
                          dashboard?.allDeductions?.filter((el) => el?.mappedDeduction === "1")?.map((x) => {
                            return <option value={x.value}> {x.label} </option>
                          })}
                      </select>
                      {errors.pensionAllowanceId && touched.pensionAllowanceId && <ErrorMessage className="invalid-feedback" name="pensionAllowanceId" component="div" />}
                    </div>

                    


                    <div className="">
                      <Field
                        disabled={!Boolean(values.isPensionAllowance)}
                        name="pa_employer_percent"
                        component={Input}
                        type="number"
                        placeholder="Employeer value"
                        value={values?.pa_employer_percent || 0.00}
                        label={<span>Employer(%){Boolean(values.isPensionAllowance) && <span style={{ color: 'red' }}>*</span>}</span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="">
                      <Field
                        disabled={!Boolean(values.isPensionAllowance)}
                        name="pa_employee_percent"
                        component={Input}
                        type="number"
                        placeholder="Employee value"
                         value={values?.pa_employee_percent || 0.00}
                        label={<span>Employee(%){Boolean(values.isPensionAllowance) && <span style={{ color: 'red' }}>*</span>}</span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="">
                      <label>  Pension Fund Allowances </label>




                      <div className="overflow-auto max-h-16 border-none scrollbar-fancy">

                        {dashboard.allEarnings.map((option) => (
                          <div key={option.value} className="flex justify-start items-center border-none">

                            <input className="mr-1"
                              disabled={!Boolean(values.isPensionAllowance)}
                              name="pensionAllowancesId"
                              type="checkbox"
                              checked={defPensionAllowances?.includes(option.value)}
                              onChange={() => handleCheckboxChangeFor_pensionFundAllowances(option.value)}
                            />
                            <label> {option.label} </label>
                          </div>
                        ))}
                      </div>








                    </div>
                  </div>

                  <hr></hr>

                </div>





                {dashboard.allSubidiaryList?.find(
                  (option) => option.value === values.subsidiaryId
                )?.localizationId == 1 && (<>
                  <h6 className="font-bold mb-0 text-primary my-2">
                    EOBI Configuration
                  </h6>

                    <div className="flex  items-start">
                      <label className="flex items-center space-x-1">

                        <input className="mr-1"

                          name="isEnableEOBI"
                          type="checkbox"
                          onChange={(e) => {
                            setFieldValue('isEnableEOBI', e.target.checked)
                          }}
                          checked={values.isEnableEOBI}
                        />
                        Enable EOBI
                      </label>
                    </div>
                  <div className="grid lg:grid-cols-5 gap-x-3 gap-y-1">


                    <div className="">
                      {<label>EOBI Deduction{Boolean(values.isEnableEOBI) && <span style={{ color: 'red' }}>*</span>}</label>}
                      <select className="form-control"
                        disabled={!Boolean(values.isEnableEOBI)}
                        onChange={(e) => {
                          setFieldValue('eobi_deductionId', e.target.value)
                        }}
                        value={values.eobi_deductionId}
                        name="eobi_deductionId">
                        <option value="-1"> Select</option>
                        {
                          dashboard?.allDeductions?.filter((el) => el?.mappedDeduction === "1")?.map((x) => {
                            return <option value={x.value}> {x.label} </option>
                          })}
                      </select>
                      {errors.eobi_deductionId && touched.eobi_deductionId && <ErrorMessage className="invalid-feedback" name="eobi_deductionId" component="div" />}
                    </div>

                    <div className="">
                      <AmountInput
                        field={{
                          name: `eobi_basis`,
                          value: values?.eobi_basis,
                        }}
                        form={{
                          touched,
                          errors,
                          setFieldValue,
                          setFieldTouched,
                        }}
                        placeholder="Minimum Wage"
                        label={<span>Minimum Wage{Boolean(values.isEnableEOBI) && <span style={{ color: 'red' }}>*</span>}</span>}
                        disabled={!Boolean(values.isEnableEOBI)}
                      />
                    </div>

                    <div className="">
                      <Field
                        disabled={!Boolean(values.isEnableEOBI)}
                        name="eobi_employeer_value_in_percent"
                        component={Input}
                        type="number"
                        placeholder="Employeer value"
                        value={values.eobi_employeer_value_in_percent}
                        label={<span>Employer(%){Boolean(values.isEnableEOBI) && <span style={{ color: 'red' }}>*</span>}</span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="">
                      <Field
                        disabled={!Boolean(values.isEnableEOBI)}
                        name="eobi_employee_value_in_percent"
                        component={Input}
                        type="number"
                        placeholder="Employee value"
                        label={<span>Employee(%){Boolean(values.isEnableEOBI) && <span style={{ color: 'red' }}>*</span>}</span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="">
                      <label>  EOBI Allowances </label>




                      <div className="overflow-auto max-h-16 border-none scrollbar-fancy">

                        {dashboard.allEarnings.map((option) => (
                          <div key={option.value} className="flex justify-start items-center border-none">

                            <input className="mr-1"
                              disabled={!Boolean(values.isEnableEOBI)}
                              name="eobi_earningId"
                              type="checkbox"
                              checked={defEOBIAllowances?.includes(option.value)}
                              onChange={() => handleCheckboxChangeFor_EOBIAllowances(option.value)}
                            />
                            <label> {option.label} </label>
                          </div>
                        ))}
                      </div>








                    </div>
                  </div>

                  <hr></hr>

                </>)}




           




                {dashboard.allSubidiaryList?.find(
                  (option) => option.value === values.subsidiaryId
                )?.localizationId == 1 && (<>
                  <h6 className="font-bold mb-0 text-primary my-2">
                    Social Security Configuration
                  </h6>


                    <div className="flex items-start">
                      <label className="flex items-center space-x-1">

                        <input className="mr-1"
                          name="isEnableSESSI"
                          type="checkbox"
                          onChange={(e) => {
                            setFieldValue('isEnableSESSI', e.target.checked)
                          }}
                          checked={values.isEnableSESSI}
                        />
                        Enable Social Security
                      </label>
                    </div>
                  <div className="grid lg:grid-cols-5 gap-x-3 gap-y-1">



                    <div className="">
                      {<label>Social Security Deduction{Boolean(values.isEnableSESSI) && <span style={{ color: 'red' }}>*</span>}</label>}
                      <select className="form-control"

                        onChange={(e) => {
                          setFieldValue('sessi_deductionId', e.target.value)
                        }}
                        value={values.sessi_deductionId}
                        disabled={!Boolean(values.isEnableSESSI)}
                        name="sessi_deductionId">
                        <option value="-1"> Select</option>
                        {
                          dashboard?.allDeductions?.filter((el) => el?.mappedDeduction === "1")?.map((x) => {
                            return <option value={x.value}> {x.label} </option>
                          })}
                      </select>
                      {errors.sessi_deductionId && touched.sessi_deductionId && <ErrorMessage className="invalid-feedback" name="sessi_deductionId" component="div" />}
                    </div>

                    <div className="">
                      <AmountInput
                        field={{
                          name: `sessi_basis`,
                          value: values?.sessi_basis,
                        }}
                        form={{
                          touched,
                          errors,
                          setFieldValue,
                          setFieldTouched,
                        }}
                        disabled={!Boolean(values.isEnableSESSI)}
                        placeholder="Minimum Wage"
                        label={<span>Minimum Wage{Boolean(values.isEnableSESSI) && <span style={{ color: 'red' }}>*</span>}</span>}
                      />
                    </div>

                    <div className="">
                      <Field
                        name="sessi_employeer_value_in_percent"
                        component={Input}
                        type="number"
                        disabled={!Boolean(values.isEnableSESSI)}
                        placeholder="Employeer value"
                        value={values.sessi_employeer_value_in_percent}
                        label={<label>Employer(%){Boolean(values.isEnableSESSI) && <span style={{ color: 'red' }}>*</span>}</label>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="">
                      <Field
                        name="sessi_employee_value_in_percent"
                        component={Input}
                        type="number"
                        disabled={!Boolean(values.isEnableSESSI)}
                        placeholder="Employee value"
                        value={values.sessi_employee_value_in_percent}
                        label={<label>Employee(%){Boolean(values.isEnableSESSI) && <span style={{ color: 'red' }}>*</span>}</label>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="">
                      <label> Social Security Allowances </label>




                      <div className="overflow-auto max-h-16 border-none scrollbar-fancy">
                        {dashboard.allEarnings.map((option) => (
                          <div key={option.value} className="flex justify-start items-center border-none">

                            <input
                              name="sessi_earningId"
                              type="checkbox"
                              disabled={!Boolean(values.isEnableSESSI)}
                              checked={defSESSIAllowances?.includes(option.value)}
                              onChange={() => handleCheckboxChangeFor_SESSIAllowances(option.value)}
                            />
                            <label> {option.label} </label>
                          </div>
                        ))}
                      </div>



                    </div>
                  </div>

                  <hr></hr>
                </>)}
                <div>
                  <div className="my-1">
                    <h6 className="font-bold mb-0 text-primary">
                      Journal Cash & Cheque Information{"  "}
                    </h6>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-x-3">
                      <div>
                        <label> Cash Account </label>
                        <select className="form-control"

                          onChange={(e) => {
                            setFieldValue('journalCashAccountId', e.target.value)
                          }}
                          value={values.journalCashAccountId}
                          name="journalCashAccountId">
                          <option value="-1"> Select</option>
                          {
                            dashboard?.allJournalBankAccounts?.map((x) => {
                              return <option value={x.value}> {x.label} </option>
                            })}
                        </select>
                        {errors.journalCashAccountId && touched.journalCashAccountId && <ErrorMessage className="invalid-feedback" name="journalCashAccountId" component="div" />}
                      </div>
                      <div>
                        <label> Cheque Account </label>
                        <select className="form-control"

                          onChange={(e) => {
                            setFieldValue('journalChequeAccountId', e.target.value)
                          }}
                          value={values.journalChequeAccountId}
                          name="journalChequeAccountId">
                          <option value="-1"> Select</option>
                          {
                            dashboard?.allJournalBankAccounts?.map((x) => {
                              return <option value={x.value}> {x.label} </option>
                            })}
                        </select>
                        {errors.journalChequeAccountId && touched.journalChequeAccountId && <ErrorMessage className="invalid-feedback" name="journalChequeAccountId" component="div" />}
                      </div>

                       <div className="">
                      <Field
                        name="employer_uniqueId"
                        component={Input}
                        type="text"
                       
                        placeholder="Employeer value"
                        value={values.employer_uniqueId}
                        label={<label>Employer Unique Id</label>}
                        autoComplete="off"
                      />
                    </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <h6 className="font-bold mb-0 text-primary">
                      Journal Accounts & Bank Information{"  "}
                    </h6>
                    <button
                      type="button"
                      className="btn btn-primary"
                      id="Other"
                      onClick={addRowBankInfo}
                    >
                      <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                      Add
                    </button>
                  </div>
                  <div className="w-full overflow-x-auto">
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr className="custom-table-header">
                          {/* <td>Employee</td> */}

                          <td className="col-32">Journal Bank Account</td>
                          <td className="col-32">Bank Code Employer</td>
                          <td className="col-32">Bank Account No</td>
                          <td className="col-31">Default</td>
                          <td className="col-32">Bank Name</td>
                          <td className="col-32">Branch Name</td>
                          <td>Action</td>
                        </tr>
                        {defBankInfoList?.map((obj, rightindex) => (

                          <><tr>

                            <td>

                              <select value={obj.journalBankAccountId} className="form-control" onChange={(e) => {
                                handleFieldChanged(e);
                                // setotherErrors(validate());
                              }}
                                id={"journalBankAccountId-" + rightindex}>
                                <option value="-1">Select</option>

                                {
                                  dashboard.allJournalBankAccounts?.map((x) => {
                                    return <option value={x.value}> {x.label} </option>
                                  })}
                              </select>

                              {otherErrors[`journalBankAccountId-${rightindex}`] && <div className="invalid-feedback">{otherErrors[`journalBankAccountId-${rightindex}`]}</div>}





                            </td>

                            <td>

                              <input className="form-control" onChange={(e) => {
                                handleFieldChanged(e);
                                // setotherErrors(validate());
                              }}
                                placeholder="Enter Bank Code" value={obj.bankCode} type="number" id={"bankCode-" + rightindex}></input>

                              {otherErrors[`bankCode-${rightindex}`] && <div className="invalid-feedback">{otherErrors[`bankCode-${rightindex}`]}</div>}
                            </td>

                            <td>
                              <input type="number" className="form-control" placeholder="Enter Bank Account No" value={obj.bankAccountNo} onChange={(e) => {
                                handleFieldChanged(e);
                                // setotherErrors(validate());
                              }}
                                id={"bankAccountNo-" + rightindex}></input>

                              {otherErrors[`bankAccountNo-${rightindex}`] && <div className="invalid-feedback">{otherErrors[`bankAccountNo-${rightindex}`]}</div>}
                            </td>
                            <td>  <input style={{ backgroundColor: "#ffffff", padding: "10px", width: "40px", height: "20px" }}

                              type="checkbox"
                              id={"isDefault-" + rightindex}
                              onChange={(e) => {
                                handleFieldChanged(e);
                                // setotherErrors(validate());

                              }}

                              checked={obj.isDefault}

                            />


                            </td>

                            {/* <td>
                          <input type="text" className="form-control" placeholder="Enter Bank Name" onChange={handleFieldChanged} value={obj.bankName} id={'bankName-' + rightindex}></input>

                          {otherErrors[`bankName-${rightindex}`] && <div className="invalid-feedback">{otherErrors[`bankName-${rightindex}`]}</div>}
                        </td> */}


                            <td>

                              <select value={obj.bankId} className="form-control"

                                onChange={(e) => {
                                  const bankId = e.target.value;

                                  // Update the field
                                  handleFieldChanged(e);



                                  // Fetch branches for selected bank
                                  if (bankId && bankId !== "-1") {
                                    filteredBranches(bankId);


                                  }

                                  // setotherErrors(validate());

                                }}


                                id={"bankId-" + rightindex}>
                                <option value="">Select</option>

                                {
                                  dashboard.allBanks?.map((x) => {
                                    return <option value={x.value}> {x.label} </option>
                                  })}
                              </select>

                              {otherErrors[`bankId-${rightindex}`] && <div className="invalid-feedback">{otherErrors[`bankId-${rightindex}`]}</div>}

                            </td>
                            <td>
                              <select
                                value={obj.branchId}
                                className="form-control"
                                onChange={(e) => {
                                  handleFieldChanged(e);
                                  // setotherErrors(validate());
                                }}

                                id={"branchId-" + rightindex}
                              >
                                <option value="">Select</option>

                                {filteredBranches(obj.bankId)?.map((x) => (
                                  <option key={x.value} value={x.value}>
                                    {x.label}
                                  </option>
                                ))}
                              </select>

                              {otherErrors[`branchId-${rightindex}`] && (
                                <div className="invalid-feedback">{otherErrors[`branchId-${rightindex}`]}</div>
                              )}
                            </td>

                            <td id={rightindex} className="text-right">
                              <button id={rightindex} className="bg-transparent border-none" disabled={rightindex !== defBankInfoList.length - 1} onClick={deleteRowBankInfo}>    <Trash2 className="w-4 h-4 text-black cursor-pointer" /></button></td>


                          </tr>
                          </>
                        ))}

                      </table>

                      {/* <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <input type='button' className="btn btn-primary" id="bank_info" onClick={addRowBankInfo} value='+Add'></input>
                      </div>

                    </div> */}
                    </div>

                    {otherErrors["isDefault"] && (
                      <tr>
                        <td colSpan={6}>
                          <div className="invalid-feedback text-danger">{otherErrors["isDefault"]}</div>
                        </td>
                      </tr>
                    )}







                  </div>
                </div>


              </fieldset>


            </Form>

              {/* <div className="from-group row text-right bg-slate-500">
              <div className="col-12 col-md-4 mt-3 justify-content-end ">
                {isAccessForRead && !user.readOnly && (
                  <button
                    type="submit"
                    onClick={() => {
                      handleSubmit()}}
                    disabled={Boolean(actionsLoading)}
                    className="btn btn-primary btn-elevate"
                  >
                    Save
                    {actionsLoading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                )}
              </div>
            </div> */}

              <div className=" flex justify-end p-3">
                {isAccessForRead && !user.readOnly && (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={Boolean(actionsLoading)}
                    className="btn btn-primary btn-elevate"
                  >
                    Save
                    {actionsLoading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                )}
              </div>

            </>

          )}


        </Formik >
      </div>}
    </>
  );
}