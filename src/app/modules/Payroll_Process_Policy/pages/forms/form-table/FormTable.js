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
import { fetchAllActiveEmployees, fetchAllActiveEmployeesSalaryForDDL, fetchAllBankBranch, fetchAllBanks, fetchAllDeductionList, fetchAllEarningList, fetchAllFormsMenu, fetchAllLeaveTypeBySubsidiary, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { fetchRoles } from "../../../../UserMangement/_redux/usersActions";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";

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
  const [defSESSIAllowances, setDefaultSESSIAllowances] = useState([]);
  const [defBank, setDefaultBanks] = useState({});
  const [otherErrors, setotherErrors] = useState({})
  const dispatch = useDispatch();
  const [selectedEmployees, setSelectedEmployees] = useState([]);


  useEffect(() => {
    FormUIProps.setIds([]);
    dispatch(actions.fetchUsers(FormUIProps.queryParams));
  }, [FormUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdatePayrollProcessPolicy"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeletePayrollProcessPolicy"
  );


  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadPayrollProcessPolicy"
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
      dispatch(fetchAllFormsMenu(45, "allPayrollAccounts")); // For Basic Pay Accounts
      dispatch(fetchAllFormsMenu(45, "allPayrollPayableAccounts")); // For Payable Accounts
      dispatch(fetchRoles());
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

  // FOR SESSI List Configuration
  useEffect(() => {
    const sessiAllowance = currentState.userForEdit?.tran_payroll_policy_sessiAllowances?.map((x) => {
      return x.earningId
    }) || [];
    setDefaultSESSIAllowances(
      [...sessiAllowance]
    );
  }, [currentState.userForEdit?.tran_payroll_policy_sessiAllowances]);



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
      // employer_uniqueId: Yup.string()
      //   .notRequired()
      //   .max(20, 'Max 20 Characters'),
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
      arrearTaxDeductionId: Yup.number()
        .when('isEnableTax', {
          is: true, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.required).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      // leaveDeductionId: Yup.number()
      //   .when('isEnableAttandanceIntegration', {
      //     is: true, // if select value is 2
      //     then: Yup.number().min(1, VALIDATION_MESSAGES.required).required(VALIDATION_MESSAGES.required),
      //     otherwise: Yup.number().notRequired(),
      //   }),


      leaveDeductionId: Yup.number()
  .nullable() , // Allow null (for 'N/A')
 

      lateCountPerDaySalaryDeduction: Yup.number()
        .when('isEnableAttandanceIntegration', {
          is: true, // if select value is 2
          then: Yup.number().min(1, VALIDATION_MESSAGES.minOneValue).max(99, VALIDATION_MESSAGES.maxTwoDigits).required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().notRequired(),
        }),
      leaveEnchashment_EarningId: Yup.number()
        .when('isEnableAttandanceIntegration', {
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
        .when('isEnableAttandanceIntegration', {
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
    },

  );



  const initialValues = {
    subsidiaryId: "",
    companyId: "",
    // payroll_templateId: "",
    // employer_uniqueId: "",
    payroll_approverId: "",
    payroll_groupId: "",
    basicSalaryId: "",
    salaryRoundingId:"",
    
    //-- Email Sender ------------
    sender_emailId: "",
    employee_email_recipentId: "",

    // -- Accounting Impact ----
    isEnableAccounting: false,
    basic_pay_accountId: "",
    payroll_payable_accountId: "",
    default_loan_accountId: "",
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

  const SavePayrollPolicy = async (user, emailRecipentList, eobiAllowances, bankInfoList, sessiAllowanceList) => {

    if (!user.Id) {

      await dispatch(actions.create_Payroll_Policy(user, emailRecipentList, eobiAllowances, bankInfoList, sessiAllowanceList));
      //  const list = await dispatch(actions.fetchUsers(usersUIProps.queryParams));


    } else {



      const payrollUpdateObj = {
        Id: user.Id,
        //-- Payroll Configuration ----

        subsidiaryId: user.subsidiaryId,
        companyId: user.companyId,
        // payroll_templateId: user.payroll_templateId,
        // employer_uniqueId: user.employer_uniqueId,
        payroll_approverId: user.payroll_approverId,
        payroll_groupId: user.payroll_groupId,
        basicSalaryId: user.basicSalaryId,
        salaryRoundingId:user?.salaryRoundingId,
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

        salaryApproverId:user.salaryApproverId,
    loanApproverId:user.loanApproverId,
    payrollApproverId:user.payrollApproverId

      };
     

      await dispatch(actions.update_Payroll_Policy(payrollUpdateObj, emailRecipentList, eobiAllowances, bankInfoList, sessiAllowanceList));
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
         if (!objValidate.branchId ||  objValidate.branchId == "-1")  {
        newErrors[`branchId-${index}`] = VALIDATION_MESSAGES.required;
      }

       // Count how many are checked as default
  if (objValidate.isDefault) {
    defaultCount++;
  }
    });

    // ✅ Check if exactly one default is selected
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
  return (
    <>
    <div className="w-full overflow-x-auto" >
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
      <Formik
        enableReinitialize={true}
        initialValues={currentState.userForEdit || initialValues}
        validationSchema={formValidation}

        onSubmit={async (values) => {

          const validationErrors = validate();
          if (Object.keys(validationErrors).length > 0) {
            setotherErrors(validationErrors);
          } else {
            defaultCount=0
            setotherErrors(validate());
            SavePayrollPolicy(values, defEmailRecipents, defEOBIAllowances, defBankInfoList, defSESSIAllowances);

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
            <fieldset disabled={user?.readOnly || false} >
              <h6>Payroll Configuration</h6>
              {/* <div style={{ height: "250px", zIndex: "1", width: "100%", backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}> */}

                <div className="from-group row">
                  <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      name="subsidiaryId"
                      isDisabled={Boolean(user?.readOnly)}
                      label={<span>Subsidiary <span style={{ color: 'red' }}>*</span></span>}
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

                  {/*<div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      name="payroll_groupId"
                      label={<span>Payroll Group<span style={{ color: 'red' }}>*</span></span>}
                      // isDisabled={isUserForRead}
                      onBlur={() => {
                        // handleBlur({ target: { name: "countryId" } });
                      }}
                      onChange={(e) => {
                        setFieldValue("payroll_groupId", e.value || null);
                        setDefaultPayrollGroup(e);
                        // dispatch(fetchAllFormsMenu(e.value));
                      }}
                      value={(dashboard.allChildMenus.find(
                        (option) => option.value === values.payroll_groupId
                      ) || null)}
                      error={errors.payroll_groupId}
                      touched={touched.payroll_groupId}
                      options={dashboard.allChildMenus}
                    />
                  </div>*/}

                  {/* <div className="col-12 col-md-4 mt-3">

                    <Select
                      className="form-control"
                      name="payroll_templateId"
                      placeholder="Filter by Status"
                      label={<span>Payroll Template</span>}
                      onChange={(e) => {
                        setFieldValue("payroll_templateId", e.target.value);

                      }}
                      onBlur={handleBlur}
                    >
                      <option value="-1">--Select--</option>
                      <option value="1">Payroll Type-Period Name-Subsidiary</option>
                      <option value="2">Payroll Type-Subsidiary-Period-Period Name</option>
                      <option value="3">Subsidiary-Period Name-Payroll Type</option>
                      <option value="4">Subsidiary-Payroll Type-Period Name</option>
                      <option value="5">Period Name-Subsidiary-Payroll Type</option>
                      <option value="6">Period Name-Payroll Type-Subsidiary</option>
                    </Select>

                  </div> */}

                  {/* <div className="col-12 col-md-4 mt-3">
                    <Field
                      name="employer_uniqueId"
                      component={Input}
                      type="number"
                      placeholder="Employer Unique ID"
                      label={<span>Employer Unique ID</span>}
                      autoComplete="off"
                    />
                  </div> */}

                  {/* <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      name="payroll_approverId"
                      label={<span>Payroll Approver</span>}
                      onBlur={() => {
                        // handleBlur({ target: { name: "countryId" } });
                      }}
                      onChange={(e) => {
                        setFieldValue("payroll_approverId", e.value || null);
                        setEmployeeDefault(e);
                        //handlePaymenModeChanged(e)
                      }}
                      isDisabled={Boolean(user?.readOnly)}
                      value={(roles?.find(
                        (option) => option.value === values.payroll_approverId
                      ) || null)}
                      error={errors.payroll_approverId}
                      touched={touched.payroll_approverId}
                      options={roles}
                    />

                  </div> */}

                  <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      name="basicSalaryId"
                      label={<span>Basic Salary <span style={{ color: 'red' }}>*</span></span>}
                      onChange={(e) => {
                        setFieldValue("basicSalaryId", e.value || null);
                      }}
                      value={allEarningsMap?.get(values?.basicSalaryId || '') || ''}
                      error={errors.basicSalaryId}
                      touched={touched.basicSalaryId}
                      options={dashboard.allEarnings}
                      isDisabled={Boolean(user?.readOnly)}
                    />
                  </div>



                  <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      name="salaryRoundingId"
                      label={<span>Salary Rounding </span>}
                      onChange={(e) => {
                        setFieldValue("salaryRoundingId", e.value || null);
                      }}
                      value={allEarningsMap?.get(values?.salaryRoundingId || '') || ''}
                      error={errors.salaryRoundingId}
                      touched={touched.salaryRoundingId}
                      options={dashboard.allEarnings}
                      isDisabled={Boolean(user?.readOnly)}
                    />
                  </div>
                </div>
              {/* </div> */}
              <br></br>

              <h6>Approval Authorities</h6>
              

                <div className="from-group row">
              
<div className="col-12 col-md-4 mt-3">
Salary Setup Approver
 

    <div className="multi-select">
      <div className="dropdown-label"></div>
      <div className="dropdown-options" style={{ fontSize: "12px", fontWeight: "bold", padding: "5px" }}>
        {roles?.map((option) => (
          <div key={option.Id} className="dropdown-option">
            <input style={{ width: "25px" }}
                                  name="salaryApproverId"
                                  type="checkbox"
                                  value={option.value}
                                  checked={Boolean(values?.salaryApproverId?.includes(option?.value?.toString()))}
                                  onChange={handleChange}
                                />
            {option.label}
          </div>
        ))}
        {/* {errors.employeeId && touched.employeeId && (
        <div className="invalid-text">{errors.employeeId}</div>
      )} */}
      </div>
    </div>

</div>

               


<div className="col-12 col-md-4 mt-3">
Loan Approver
  <div style={{ backgroundColor: "#ffffff", height: "20vh", padding: "10px", overflow: "scroll" }}>

    <div className="multi-select">
      <div className="dropdown-label"></div>
      <div className="dropdown-options" style={{ fontSize: "12px", fontWeight: "bold", padding: "5px" }}>
        {roles?.map((option) => (
          <div key={option.Id} className="dropdown-option">
                   <input style={{ width: "25px" }}
                                  name="loanApproverId"
                                  type="checkbox"
                                  value={option.value}
                                  checked={Boolean(values?.loanApproverId?.includes(option?.value?.toString()))}
                                  onChange={handleChange}
                                />
            {option.label}
          </div>
        ))}
        {/* {errors.employeeId && touched.employeeId && (
        <div className="invalid-text">{errors.employeeId}</div>
      )} */}
      </div>
    </div>
  </div>
</div>



<div className="col-12 col-md-4 mt-3">
Payroll Approver
  <div style={{ backgroundColor: "#ffffff", height: "20vh", padding: "10px", overflow: "scroll" }}>

    <div className="multi-select">
      <div className="dropdown-label"></div>
      <div className="dropdown-options" style={{ fontSize: "12px", fontWeight: "bold", padding: "5px" }}>
        {roles?.map((option) => (
          <div key={option.Id} className="dropdown-option">
            <input style={{ width: "25px" }}
                                  name="payrollApproverId"
                                  type="checkbox"
                                  value={option.value}
                                  checked={Boolean(values?.payrollApproverId?.includes(option?.value?.toString()))}
                                  onChange={handleChange}
                                />
                    
            {option.label}
          </div>
        ))}
        {/* {errors.employeeId && touched.employeeId && (
        <div className="invalid-text">{errors.employeeId}</div>
      )} */}
      </div>
    </div>
  </div>
</div>

                </div>
            
              <br></br>
              <h6>Email Preferences</h6>
             


                <div className="from-group row">
                  <div className="col-12 col-md-4 mt-3">
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
                  </div>
                  <div className="col-12 col-md-4 mt-3">
                    Email Recipents
                    <div style={{ backgroundColor: "#ffffff", height: "170px", padding: "10px", overflow: "scroll" }}>

                      <div className="multi-select">

                        <div className="dropdown-label"></div>
                        <div className="dropdown-options" style={{ fontSize: "12px", fontWeight: "bold", padding: "5px" }}>
                          {dashboard.allEmployees.map((option) => (
                            <div key={option.value} className="dropdown-option">
                              <input style={{ width: "25px" }}
                                name="employee_email_recipentId"
                                type="checkbox"
                                checked={defEmailRecipents?.includes(option.value)}
                                onChange={() => handleCheckboxChangeFor_EmailReciepents(option.value)}
                              />
                              {option.label}
                            </div>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
           

              <br></br>
              <h6>Accounting Impact</h6>
            

                <div className="from-group row">
                  <div className="col-12 col-md-4 mt-3">
                    <input style={{ backgroundColor: "#ffffff", padding: "10px", width: "20px" }}
                      name="isEnableAccounting"
                      type="checkbox"
                      onChange={(e) => {
                        setFieldValue('isEnableAccounting', e.target.checked)
                      }}
                      checked={values.isEnableAccounting}

                    />
                    Enable Accounting Impact
                    <br></br>
                  </div>
                </div>

                <div className="from-group row">
                  {/* <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      name="basic_pay_accountId"
                      label={<span>Basic Pay Journal Account{Boolean(values.isEnableAccounting) && <span style={{ color: 'red' }}>*</span>}</span>}
                      isDisabled={!Boolean(values.isEnableAccounting) || Boolean(user?.readOnly)}
                      onChange={(e) => {
                        setFieldValue("basic_pay_accountId", e.value || null);
                        setDefaultBasicPayAccount(e);
                      }}
                      value={
                        dashboard.allPayrollAccounts.find(
                          (option) => option.value === values.basic_pay_accountId
                        ) || null
                      }
                      error={errors.basic_pay_accountId}
                      touched={touched.basic_pay_accountId}
                      options={dashboard.allPayrollAccounts}
                    />
                  </div> */}
                  <div className="col-12 col-md-4 mt-3">
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
                                    <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      name="default_loan_accountId"
                      label={<span>Default Loan Account{Boolean(values.isEnableAccounting) && <span style={{ color: 'red' }}>*</span>}</span>}
                      isDisabled={!Boolean(values.isEnableAccounting) || Boolean(user?.readOnly)}
                      onChange={(e) => {
                        setFieldValue("default_loan_accountId", e.value || null);
                        setDefaultPaybleAccount(e);
                      }}
                      value={
                        dashboard.allPayrollPayableAccounts.find(
                          (option) => option.value === values.default_loan_accountId
                        ) || null
                      }
                      error={errors.default_loan_accountId}
                      touched={touched.default_loan_accountId}
                      options={dashboard.allPayrollPayableAccounts}
                    />
                  </div>
                  {/* <div className="col-12 col-md-4 mt-3">
                    <Select
                      className="form-control"
                      name="isGroupEarningOnAccount"
                      disabled={!Boolean(values.isEnableAccounting)}
                      label={<span>Group Earning Account</span>}
                      onChange={(e) => {
                        setFieldValue("isGroupEarningOnAccount", e.target.value);

                      }}
                      onBlur={handleBlur}
                    >
                      <option value="-1">--Select--</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>

                    </Select>
                  </div> */}

                  {/* <div className="col-12 col-md-4 mt-3">

                    <Select
                      className="form-control"
                      name="isGroupDeduductionOnAccount"
                      disabled={!Boolean(values.isEnableAccounting)}
                      label={<span>Group Deduction Account</span>}
                      onChange={(e) => {
                        setFieldValue("isGroupDeduductionOnAccount", e.target.value);

                      }}
                      onBlur={handleBlur}
                    >
                      <option value="-1">--Select--</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>

                    </Select>
                  </div> */}
                  {/* <div className="col-12 col-md-4 mt-3">
                    <Select
                      className="form-control"
                      name="isAccrueGratuityOnPayroll"
                      disabled={!Boolean(values.isEnableAccounting)}
                      label={<span>Accrue Gratuity On Payroll</span>}
                      onChange={(e) => {
                        setFieldValue("isAccrueGratuityOnPayroll", e.target.value);

                      }}
                      onBlur={handleBlur}
                    >
                      <option value="-1">--Select--</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>

                    </Select>
                  </div> */}
                </div>
       
              <br></br>
              <h6>Tax Integration</h6>
            

                <div className="from-group row">
                  <div className="col-12 col-md-4 mt-3">
                    <input style={{ backgroundColor: "#ffffff", padding: "10px", width: "20px" }}
                      name="isEnableTax"
                      type="checkbox"
                      onChange={(e) => {
                        setFieldValue('isEnableTax', e.target.checked)
                      }}
                      checked={values.isEnableTax}

                    />
                    Enable Tax Integration
                    <br></br>
                  </div>
                </div>

                <div className="from-group row">
                  <div className="col-12 col-md-4 mt-3">
                    {<span>Payroll Tax Deduction Type{Boolean(values.isEnableTax) && <span style={{ color: 'red' }}>*</span>}</span>}
                    <select className="form-control"
                      disabled={!Boolean(values.isEnableTax)}
                      onChange={(e) => {
                        setFieldValue('payrollTax_DeductionTypeId', e.target.value)
                      }}
                      value={values.payrollTax_DeductionTypeId}
                      name="payrollTax_DeductionTypeId">
                      <option value="-1"> --Select--</option>
                      {
                        dashboard.allDeductions?.map((x) => {
                          return <option disabled={defMapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                        })}
                    </select>
                    {errors.payrollTax_DeductionTypeId && touched.payrollTax_DeductionTypeId && <ErrorMessage className="form-feedBack" name="payrollTax_DeductionTypeId" component="div" />}
                  </div>
                  <div className="col-12 col-md-4 mt-3">
                    {<span>Arrears Tax Deduction{Boolean(values.isEnableTax) && <span style={{ color: 'red' }}>*</span>}</span>}
                    <select className="form-control"
                      disabled={!Boolean(values.isEnableTax)}
                      onChange={(e) => {
                        setFieldValue('arrearTaxDeductionId', e.target.value)
                      }}
                      value={values.arrearTaxDeductionId}
                      name="arrearTaxDeductionId">
                      <option value="-1"> --Select--</option>
                      {
                        dashboard.allDeductions?.map((x) => {
                          return <option disabled={defMapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                        })}
                    </select>
                    {errors.arrearTaxDeductionId && touched.arrearTaxDeductionId && <ErrorMessage className="form-feedBack" name="arrearTaxDeductionId" component="div" />}
                  </div>
                  {/* <div className="col-12 col-md-4 mt-2">

                    <Select
                      className="form-control"
                      name="isTrackDeductionHistory"
                      value={values.isTrackDeductionHistory}
                      disabled={!Boolean(values.isEnableTax)}
                      label={<span>Track Tax Deduction History</span>}
                      onChange={(e) => {
                        setFieldValue("isTrackDeductionHistory", e.target.value);

                      }}
                      onBlur={handleBlur}
                    >
                      <option value="-1">--Select--</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>

                    </Select>

                  </div> */}
                </div>
           
              <br></br>
              <h6>Leave/Attendance Integration </h6>
        
                <div className="col-12 col-md-12 mt-3">
                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <input style={{ backgroundColor: "#ffffff", padding: "10px", width: "20px" }}
                        name="isEnableAttandanceIntegration"
                        type="checkbox"
                        onChange={(e) => {
                          setFieldValue('isEnableAttandanceIntegration', e.target.checked)
                        }}
                        checked={values.isEnableAttandanceIntegration}

                      />
                      Enable Attendance Integration
                    </div>
                  </div>

                  <br></br>

                  <div>
                    <h6>Late Deduction</h6>
                    <div className="from-group row">

                      <div className="col-12 col-md-4 mt-1">
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

                      {/* <div className="col-12 col-md-4 mt-3">
                        {<span>Leave Deduction{Boolean(values.isEnableAttandanceIntegration) && <span style={{ color: 'red' }}>*</span>}</span>}
                        <select className="form-control"
                          disabled={!Boolean(values.isEnableAttandanceIntegration)}
                          onChange={(e) => {
                            const value = e.target.value == '--Select--' ? '' : Number(e.target.value);
                            setFieldValue('leaveDeductionId', value)
                          }}
                          value={values.leaveDeductionId}
                          name="leaveDeductionId">
                          {
                            dashboard.allLeaveTypes?.map((x) => {
                              return <option value={x.value}> {x.label} </option>
                            })}
                        </select>
                        {errors.leaveDeductionId && touched.leaveDeductionId && <ErrorMessage className="form-feedBack" name="leaveDeductionId" component="div" />}
                      </div> */}

<div className="col-12 col-md-4 mt-3">
  <span>
    Leave Deduction
    {Boolean(values.isEnableAttandanceIntegration) && <span style={{ color: 'red' }}>*</span>}
  </span>
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

    {/* Filter out '--Select--' and render other options for leave types */}
    {dashboard.allLeaveTypes?.filter(x => x.value !== null).map((x) => (
      <option key={x.value} value={x.value}>
        {x.label}
      </option>
    ))}
  </select>

  {errors.leaveDeductionId && touched.leaveDeductionId && (
    <ErrorMessage className="form-feedBack" name="leaveDeductionId" component="div" />
  )}
</div>






                      <div className="col-12 col-md-4 mt-3">
                        {<span>Late Deduction{Boolean(values.isEnableAttandanceIntegration) && <span style={{ color: 'red' }}>*</span>}</span>}
                        <select className="form-control"
                          onChange={(e) => {
                            setFieldValue('lateDeductionId', e.target.value)
                          }}
                          disabled={!Boolean(values.isEnableAttandanceIntegration)}
                          value={values.lateDeductionId}
                          name="lateDeductionId">
                          <option value="-1"> --Select--</option>
                          {
                            dashboard.allDeductions?.map((x) => {
                              return <option value={x.value}> {x.label} </option>
                            })}
                        </select>
                        {errors.lateDeductionId && touched.lateDeductionId && <ErrorMessage className="form-feedBack" name="lateDeductionId" component="div" />}
                      </div>

                    </div>
                  </div>

                  <br></br>

                  <div >
                    <h6>Overtime / Leave Encashment</h6>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <input style={{ backgroundColor: "#ffffff", padding: "10px", width: "20px" }}
                          disabled={!Boolean(values.isEnableAttandanceIntegration)}
                          type="checkbox"
                          name="isEnableOverTimeCalc"
                          onChange={(e) => {
                            setFieldValue('isEnableOverTimeCalc', e.target.checked)
                          }}
                          checked={values.isEnableOverTimeCalc}
                        />
                        Enable Overtime Calculation
                      </div>
                      <div className="col-12 col-md-4 mt-5">
                        {<span>Overtime Allowance{Boolean(values.isEnableAttandanceIntegration) && <span style={{ color: 'red' }}>*</span>}</span>}
                        <select className="form-control"
                          onChange={(e) => {
                            setFieldValue('overTimeEarningId', e.target.value)
                          }}
                          value={values.overTimeEarningId}
                          disabled={!Boolean(values.isEnableAttandanceIntegration)}
                          name="overTimeEarningId">
                          <option value="-1"> --Select--</option>
                          {
                            dashboard.allEarnings?.map((x) => {
                              return <option value={x.value}> {x.label} </option>
                            })}
                        </select>
                        {errors.overTimeEarningId && touched.overTimeEarningId && <ErrorMessage className="form-feedBack" name="overTimeEarningId" component="div" />}
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        {<span>Encashment Allowance{Boolean(values.isEnableAttandanceIntegration) && <span style={{ color: 'red' }}>*</span>}</span>}
                        <select className="form-control"
                          onChange={(e) => {
                            setFieldValue('leaveEnchashment_EarningId', e.target.value)
                          }}
                          disabled={!Boolean(values.isEnableAttandanceIntegration)}
                          value={values.leaveEnchashment_EarningId}
                          name="leaveEnchashment_EarningId">
                          <option value="-1"> --Select--</option>
                          {
                            dashboard.allEarnings?.map((x) => {
                              return <option value={x.value}> {x.label} </option>
                            })}
                        </select>
                        {errors.leaveEnchashment_EarningId && touched.leaveEnchashment_EarningId && <ErrorMessage className="form-feedBack" name="leaveEnchashment_EarningId" component="div" />}
                      </div>

                    </div>
                  </div>

                  <br></br>

                  <div >
                    <h6>Leave Management</h6>
                    <div className="from-group row">


                      <div className="col-12 col-md-4 mt-3">
                        <input style={{ backgroundColor: "#ffffff", padding: "10px", width: "20px" }}
                          type="checkbox"
                          name="isEnableLeaveManagemenent"
                          onChange={(e) => {
                            setFieldValue('isEnableLeaveManagemenent', e.target.checked)
                          }}
                          checked={values.isEnableLeaveManagemenent}
                          disabled={!Boolean(values.isEnableAttandanceIntegration)}
                        />
                        Enable Leave Management
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        <Select
                          className="form-control"
                          name="isEnableSandwichLeavePolicy"
                          value={values.isEnableSandwichLeavePolicy}
                          label={<span>Enable Sandwich Policy For Leave</span>}
                          onChange={(e) => {
                            setFieldValue("isEnableSandwichLeavePolicy", e.target.value);

                          }}
                          disabled={!Boolean(values.isEnableAttandanceIntegration)}
                          onBlur={handleBlur}
                        >
                          <option value="-1">--Select--</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>

                        </Select>

                      </div>

                    </div>
                  </div>

                </div>
          
              <br>
              </br>

           

              <h6>EOBI Configuration </h6>
        

                <div className="from-group row">
                  <div className="col-12 col-md-4 mt-3">
                    <input style={{ backgroundColor: "#ffffff", padding: "10px", width: "30px" }}
                      name="isEnableEOBI"
                      type="checkbox"
                      onChange={(e) => {
                        setFieldValue('isEnableEOBI', e.target.checked)
                      }}
                      checked={values.isEnableEOBI}
                    />
                    Enable EOBI
                  </div>

                  {/* <div className="col-12 col-md-4 mt-3">
                    <input style={{ backgroundColor: "#ffffff", padding: "10px", width: "30px" }}
                      name="isIncludeBasic"
                      type="checkbox"
                      onChange={(e) => {
                        setFieldValue('isIncludeBasic', e.target.checked)
                      }}
                      checked={values.isIncludeBasic}
                    />kra
                    Include Basic
                  </div> */}
                  <div className="col-12 col-md-4 mt-3">
                    {<span>EOBI Deduction{Boolean(values.isEnableEOBI) && <span style={{ color: 'red' }}>*</span>}</span>}
                    <select className="form-control"
                      disabled={!Boolean(values.isEnableEOBI)}
                      onChange={(e) => {
                        setFieldValue('eobi_deductionId', e.target.value)
                      }}
                      value={values.eobi_deductionId}
                      name="eobi_deductionId">
                      <option value="-1"> --Select--</option>
                      {
                        dashboard.allDeductions?.map((x) => {
                          return <option value={x.value}> {x.label} </option>
                        })}
                    </select>
                    {errors.eobi_deductionId && touched.eobi_deductionId && <ErrorMessage className="form-feedBack" name="eobi_deductionId" component="div" />}
                  </div>

                  <div className="col-12 col-md-4 mt-3">
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

                  <div className="col-12 col-md-4 mt-3">
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
                  <div className="col-12 col-md-4 mt-3">
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
                  <div className="col-12 col-md-4 mt-3">
                    EOBI Allowances
                    <div style={{ backgroundColor: "#ffffff", height: "170px", padding: "10px", overflow: "scroll" }}>

                      <div className="multi-select">

                        <div className="dropdown-label"></div>
                        <div className="dropdown-options" style={{ fontSize: "12px", fontWeight: "bold", padding: "5px" }}>
                          {dashboard.allEarnings.map((option) => (
                            <div key={option.value} className="dropdown-option">
                              <input style={{ width: "25px" }}
                                disabled={!Boolean(values.isEnableEOBI)}
                                name="eobi_earningId"
                                type="checkbox"
                                checked={defEOBIAllowances?.includes(option.value)}
                                onChange={() => handleCheckboxChangeFor_EOBIAllowances(option.value)}
                              />
                              {option.label}
                            </div>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
            
              <br></br>
              <h6>Social Security Configuration </h6>

              

                <div className="from-group row">
                  <div className="col-12 col-md-4 mt-3">
                    <input style={{ backgroundColor: "#ffffff", padding: "10px", width: "30px" }}
                      name="isEnableSESSI"
                      type="checkbox"
                      onChange={(e) => {
                        setFieldValue('isEnableSESSI', e.target.checked)
                      }}
                      checked={values.isEnableSESSI}
                    />
                    Enable Social Security
                  </div>

                  {/* <div className="col-12 col-md-4 mt-3">
                    <input style={{ backgroundColor: "#ffffff", padding: "10px", width: "30px" }}
                      name="isIncludeBasic"
                      type="checkbox"
                      onChange={(e) => {
                        setFieldValue('isIncludeBasic', e.target.checked)
                      }}
                      checked={values.isIncludeBasic}
                    />
                    Include Basic
                  </div> */}

                  <div className="col-12 col-md-4 mt-3">
                    {<span>Social Security Deduction{Boolean(values.isEnableSESSI) && <span style={{ color: 'red' }}>*</span>}</span>}
                    <select className="form-control"

                      onChange={(e) => {
                        setFieldValue('sessi_deductionId', e.target.value)
                      }}
                      value={values.sessi_deductionId}
                      disabled={!Boolean(values.isEnableSESSI)}
                      name="sessi_deductionId">
                      <option value="-1"> --Select--</option>
                      {
                        dashboard.allDeductions?.map((x) => {
                          return <option value={x.value}> {x.label} </option>
                        })}
                    </select>
                    {errors.sessi_deductionId && touched.sessi_deductionId && <ErrorMessage className="form-feedBack" name="sessi_deductionId" component="div" />}
                  </div>

                  <div className="col-12 col-md-4 mt-3">
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

                  <div className="col-12 col-md-4 mt-3">
                    <Field
                      name="sessi_employeer_value_in_percent"
                      component={Input}
                      type="number"
                      disabled={!Boolean(values.isEnableSESSI)}
                      placeholder="Employeer value"
                      value={values.sessi_employeer_value_in_percent}
                      label={<span>Employeer(%){Boolean(values.isEnableSESSI) && <span style={{ color: 'red' }}>*</span>}</span>}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-12 col-md-4 mt-3">
                    <Field
                      name="sessi_employee_value_in_percent"
                      component={Input}
                      type="number"
                      disabled={!Boolean(values.isEnableSESSI)}
                      placeholder="Employee value"
                      value={values.sessi_employee_value_in_percent}
                      label={<span>Employee(%){Boolean(values.isEnableSESSI) && <span style={{ color: 'red' }}>*</span>}</span>}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-12 col-md-4 mt-3">
                    Social Security Allowances
                    <div style={{ backgroundColor: "#ffffff", height: "170px", padding: "10px", overflow: "scroll" }}>

                      <div className="multi-select">

                        <div className="dropdown-label"></div>
                        <div className="dropdown-options" style={{ fontSize: "12px", fontWeight: "bold", padding: "5px" }}>
                          {dashboard.allEarnings.map((option) => (
                            <div key={option.value} className="dropdown-option">
                              <input style={{ width: "25px" }}
                                name="sessi_earningId"
                                type="checkbox"
                                disabled={!Boolean(values.isEnableSESSI)}
                                checked={defSESSIAllowances?.includes(option.value)}
                                onChange={() => handleCheckboxChangeFor_SESSIAllowances(option.value)}
                              />
                              {option.label}
                            </div>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
            
              <br></br>
              <br></br> <h6> Journal Accounts & Bank Information</h6>
            

                <div className="from-group row">
                  <table class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                    {/* <h7 ><b>Journal Accounts & Bank Info</b>
                    </h7> */}
                    <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                      {/* <td>Employee</td> */}
                      <td>Action</td>
                      <td className="col-2">Journal Bank Acc#</td>
                      <td className="col-2">Bank Code Employer</td>
                      <td className="col-2">Bank Account No</td>
                      <td className="col-1">Default</td>
                      <td className="col-2">Bank Name</td>
                      <td className="col-2">Branch Name</td>
                    </tr>
                    {defBankInfoList?.map((obj, rightindex) => (

                      <><tr>
                        <td id={rightindex} >
                          <button id={rightindex} className="btn btn-danger btn-sm"  disabled={rightindex !== defBankInfoList.length - 1} onClick={deleteRowBankInfo}>Delete</button></td>
                        <td>

                          <select value={obj.journalBankAccountId} className="form-control" onChange={(e) => {
  handleFieldChanged(e);
  // setotherErrors(validate());
}}
 id={"journalBankAccountId-" + rightindex}>
                            <option value="-1">--SELECT--</option>
                 
                            {
                              dashboard.allPayrollAccounts?.map((x) => {
                                return <option value={x.value}> {x.label} </option>
                              })}
                          </select>

                          {otherErrors[`journalBankAccountId-${rightindex}`] && <div className="form-feedBack">{otherErrors[`journalBankAccountId-${rightindex}`]}</div>}

                        



                        </td>

                        <td>
             
                          <input className="form-control" onChange={(e) => {
  handleFieldChanged(e);
  // setotherErrors(validate());
}}
 placeholder="Enter Bank Code" value={obj.bankCode} type="number" id={"bankCode-" + rightindex}></input>

                          {otherErrors[`bankCode-${rightindex}`] && <div className="form-feedBack">{otherErrors[`bankCode-${rightindex}`]}</div>}
                        </td>

                        <td>
                          <input type="number" className="form-control" placeholder="Enter Bank Account No" value={obj.bankAccountNo} onChange={(e) => {
  handleFieldChanged(e);
  // setotherErrors(validate());
}}
 id={"bankAccountNo-" + rightindex}></input>

                          {otherErrors[`bankAccountNo-${rightindex}`] && <div className="form-feedBack">{otherErrors[`bankAccountNo-${rightindex}`]}</div>}
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

                          {otherErrors[`bankName-${rightindex}`] && <div className="form-feedBack">{otherErrors[`bankName-${rightindex}`]}</div>}
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
                            <option value="">--SELECT--</option>
                
                            {
                              dashboard.allBanks?.map((x) => {
                                return <option value={x.value}> {x.label} </option>
                              })}
                          </select>

                          {otherErrors[`bankId-${rightindex}`] && <div className="form-feedBack">{otherErrors[`bankId-${rightindex}`]}</div>}

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
    <option value="">--SELECT--</option>

    {filteredBranches(obj.bankId)?.map((x) => (
    <option key={x.value} value={x.value}>
      {x.label}
    </option>
  ))}
  </select>

  {otherErrors[`branchId-${rightindex}`] && (
    <div className="form-feedBack">{otherErrors[`branchId-${rightindex}`]}</div>
  )}
</td>




                      </tr>
                      </>
                    ))}

                  </table>

                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <input type='button' className="btn btn-primary" id="bank_info" onClick={addRowBankInfo} value='+Add'></input>
                    </div>

                  </div>
                </div>
           
  {otherErrors["isDefault"] && (
  <tr>
    <td colSpan={6}>
      <div className="form-feedBack text-danger">{otherErrors["isDefault"]}</div>
    </td>
  </tr>
)}

            </fieldset>


          </Form>

            <div className="from-group row">
              <div className="col-12 col-md-4 mt-3">
                {isAccessForRead && !user.readOnly && (
                  <button
                    type="submit"
                    onClick={() => handleSubmit()}
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
            </div>
          </>

        )}


      </Formik >
    </>
  );
}
