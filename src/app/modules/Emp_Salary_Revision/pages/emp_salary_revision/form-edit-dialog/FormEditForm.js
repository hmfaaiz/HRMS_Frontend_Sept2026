// IT IS A COPY FORM OF EMPLOYEE SALARY (developed by previous developer)
import React, { useEffect, useMemo, useState } from "react";
import { Accordion, Button, Card, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

import {
  fetchAllFormsMenu,
  fetchAllActiveEmployees,
  fetchAllActiveEmployeesSalaryForDDL,
  fetchAllEarningList,
  fetchAllDeductionList,
  fetchAllEmpCompensationBenefitsForDDL,
  fetchAllBanks,
  fetchAllCompanyBanks,
  fetchAllBankBranch,
  fetchPayrollConfigApproverPermission,
  fetchAllDesignationByGradeId,
} from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import axios from "axios";
import {
  amountLimit,
  amountLimitDynamic,
  formatDates,
} from "../../../../../utils/common";
import {
  DEFAULT_CALCULATION_TYPE_DROPDOWN,
  DROPDOWN,
  VALIDATION_MESSAGES,
} from "../../../../../utils/constants";
import { KeyboardArrowDown, Tune } from "@material-ui/icons";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { toast } from "react-toastify";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import {
  clearPreviousSalaryRevisionFetched,
  fetchCurrentEmpSalary,
  fetchPreviousEmpSalaryComp,
} from "../../../_redux/redux-Actions";
import { CirclePlus, Eye, Trash2 } from "lucide-react";
import {CustomModal} from "../../../../../utils/common-modules/CustomModal";
export const USERS_URL = process.env.REACT_APP_API_URL;

const formValidation = Yup.object().shape({
  employeeId: Yup.string().required(VALIDATION_MESSAGES.required),
  // currencyId: Yup.string()
  //   .required(VALIDATION_MESSAGES.required),
  revisedDate: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  Employee: Yup.object().shape({
    gradeId: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
    designationId: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
    employeeTypeId: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
    employeeStatusId: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
  }),

  grossSalary: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "Must be a valid number (up to 2 decimal places)"
    ), // Only digits validation

  basicSalary: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "Must be a valid number (up to 2 decimal places)"
    ), // Only digits validation

  eobi_accNo: Yup.string()
    .matches(/^\d+$/, "Must contain only digits") // Only digits validation
    .when("eobi_member", {
      is: true, // Condition to check if eobi_member is true
      then: Yup.string().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.string().nullable(), // Optional if eobi_member is false
    }),

  pf_accNo: Yup.string()
    .matches(/^\d+$/, "Must contain only digits") // Only digits validation
    .when("pf_member", {
      is: true, // Condition to check if pf_member is true
      then: Yup.string().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.string().nullable(), // Optional if pf_member is false
    }),

  social_security_accNo: Yup.string()
    .matches(/^\d+$/, "Must contain only digits") // Only digits validation
    .when("social_security_member", {
      is: true, // Condition to check if social_security_member is true
      then: Yup.string().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.string().nullable(), // Optional if social_security_member is false
    }),

  pension_accNo: Yup.string()
    .matches(/^\d+$/, "Must contain only digits") // Only digits validation
    .when("pension_member", {
      is: true, // Condition to check if pension_member is true
      then: Yup.string().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.string().nullable(), // Optional if pension_member is false
    }),

  // company_from_accNo: Yup.string()
  //   .matches(/^\d+$/, "Must contain only digits"), // Only digits validation

  emp_bank_accNo: Yup.string().matches(/^\d+$/, "Must contain only digits"), // Only digits validation

  gratuity_startDate: Yup.date()
    .nullable()
    .max(new Date(), "Date cannot be in the future")
    .when("gratuity_member", {
      is: true, // Condition to check if gratuity_member is true
      then: Yup.date().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.date().nullable(), // Optional if gratuity_member is false
    }),

  eobi_reg_date: Yup.date()
    .nullable()
    .max(new Date(), "Date cannot be in the future")
    .when("eobi_member", {
      is: true, // Condition to check if eobi_member is true
      then: Yup.date().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.date().nullable(), // Optional if eobi_member is false
    }),

  pf_reg_date: Yup.date()
    .nullable()
    .max(new Date(), "Date cannot be in the future")
    .when("pf_member", {
      is: true, // Condition to check if pf_member is true
      then: Yup.date().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.date().nullable(), // Optional if pf_member is false
    }),

  social_security_reg_date: Yup.date()
    .nullable()
    .max(new Date(), "Date cannot be in the future")
    .when("social_security_member", {
      is: true, // Condition to check if social_security_member is true
      then: Yup.date().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.date().nullable(), // Optional if social_security_member is false
    }),

  pension_reg_date: Yup.date()
    .nullable()
    .max(new Date(), "Date cannot be in the future")
    .when("pension_member", {
      is: true, // Condition to check if pension_member is true
      then: Yup.date().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.date().nullable(), // Optional if pension_member is false
    }),
  overtime_working_day: Yup.number()
    .max(100, "Value cannot be greater than 100")
    .min(0, "Value cannot be less than 0")
    .when("overtime_allowance", {
      is: (value) => value === true || value === 1, // if select value is 2
      then: Yup.number().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().notRequired(),
    }),
  overtime_off_day: Yup.number()
    .max(100, "Value cannot be greater than 100")
    .min(0, "Value cannot be less than 0")
    .when("overtime_allowance", {
      is: (value) => value === true || value === 1, // if select value is 2
      then: Yup.number().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().notRequired(),
    }),
  overtime_holiday: Yup.number()
    .max(100, "Value cannot be greater than 100")
    .min(0, "Value cannot be less than 0")
    .when("overtime_allowance", {
      is: (value) => value === true || value === 1, // if select value is 2
      then: Yup.number().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().notRequired(),
    }),

  payment_mode_Id: Yup.number()
    .required(VALIDATION_MESSAGES.required)
    .min(1, VALIDATION_MESSAGES.required),

  emp_bankId: Yup.number()
  .nullable()
  .when("payment_mode_Id", {
    is: 153, // if select value is 153
    then: Yup.number().required(VALIDATION_MESSAGES.required),
    otherwise: Yup.number().notRequired(),
  }),

  emp_bank_branchId: Yup.number()
  .nullable()
  .when("payment_mode_Id", {
    is: 153, // if select value is 153
    then: Yup.number().required(VALIDATION_MESSAGES.required),
    otherwise: Yup.number().notRequired(),
  }),

  emp_bank_accountTitle: Yup.string().when("payment_mode_Id", {
    is: (value) => value === 152, // if select value is 151
    then: Yup.string().required(VALIDATION_MESSAGES.required),
    otherwise: Yup.string().notRequired(),
  }),

  // company_from_accNo: Yup.number()
  //   .when('payment_mode_Id', {
  //     is: 153, // if select value is 153
  //     then: Yup.number().notRequired(),
  //     otherwise: Yup.number().notRequired(),
  //   }),

  emp_bank_accNo: Yup.number().when("payment_mode_Id", {
    is: 153, // if select value is 153
    then: Yup.number().required(VALIDATION_MESSAGES.required),
    otherwise: Yup.number().notRequired(),
  }),
});
export function FormEditForm({
  saveForm,
  data,
  onHide,
  dataForRead,
  loading,
  setIds,
  setemployeeId,
  revisedDate,
  isAccessForCreate,
  setRevisedDate,dataForEdit
}) {
  const { dashboard } = useSelector((state) => state);
  // Get User Details
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [defEarningList = null, setDefaultEarningList] = useState(null);
  const [defGrauityDate, setGrauityDate] = useState(null);
  const [defEOBIDate, setEOBIDate] = useState(null);
  const [defSocialSecurity, setSocialSecurityDate] = useState(null);
  const [defPension, setPensionDate] = useState(null);
  const [defProvidenFund, setProvidentFundDate] = useState(null);

  const [defPaymentModeList = null, setDefualtPaymentModeCodeList] = useState(
    null
  );
  const [defEmployee = null, setEmployeeDefault] = useState(null);
  const [defBank, setDefaultBanks] = useState({});
  const [defCompanyBank, setDefaultCompanyBanks] = useState({});
  const [defEmpBankBranch, setDefaultEmpBankBranch] = useState({});
  const [defCompanyBankBranch, setDefaultCompanyBankBranch] = useState({});
  const [
    defMapEarningDeductionList = null,
    setDefaultMapEarningDeductionList,
  ] = useState([]);

  const [clearBankAccTitleField, setBankAccTitleClearField] = useState("");

  const [defBasicSalaryFactor, setBasicSalaryFactor] = useState(0);
  const [defGrossSalary, setGrossSalary] = useState(0);
  const [defBasicSalary, setBasicSalary] = useState(0);
  const [defGrossSalaryDB, setGrossSalaryDB] = useState(0);
  const [defBasicSalaryDB, setBasicSalaryDB] = useState(0);
  const [deferrors, setErrors] = useState({});
  const [user, setUser] = useState({});
   const [dateOfJoining, setDateOfJoining] = useState();
    const [localizationId, setLocalizationId] = useState();
    const [dateOfBirth, setDateOfBirth] = useState();
  // const [revisedDate, setRevisedDate] = useState(null);

  useEffect(() => {
    if (data) {

      setUser(data);
      // setRevisedDate()
    }
  }, [data]);

  const [dropdownData, setdropdownData] = useState(
    DEFAULT_CALCULATION_TYPE_DROPDOWN
  );
  const [currentSalaryMethod, setcurrentSalaryMethod] = useState("");
  const [comparisonModal, setComparisonModal] = useState("");
  const [salaryApproverPermission, setSalaryApproverPermission] = useState(
    false
  );
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [dataSaveonfirmationModal, setDataSaveConfirmationModal] = useState(false);

  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
    };
  }, [formUIContext]);
  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllActiveEmployees());

      dispatch(fetchAllActiveEmployeesSalaryForDDL(null));

      //dispatch(fetchAllFormsMenu(158, "allDesignations")); // For All Designations
      dispatch(fetchAllEmpCompensationBenefitsForDDL(2));
      dispatch(fetchAllFormsMenu(150, "allPaymentModeList")); // For All Payment Codes

      dispatch(
        fetchPayrollConfigApproverPermission(
          "allPayrollConfigApproverPermissionList"
        )
      );
    }
  }, [dispatch]);

  //===== Date Of End Date
  useEffect(() => {
    if (user.gratuity_startDate) {
      setGrauityDate(new Date(user.gratuity_startDate));
    }
  }, [user.gratuity_startDate]);
  useEffect(() => {
    const emp_bankId = defBank?.value ? defBank.value : user.emp_bankId;
    setDefaultBanks(
      dashboard.allBanks &&
        dashboard.allBanks.filter((item) => {
          return item.value === emp_bankId;
        })
    );
  }, [user?.emp_bankId, dashboard.emp_bankId]);



  useEffect(() => {
    const company_bankId = defCompanyBank?.value
      ? defCompanyBank.value
      : user.company_bankId;
    setDefaultCompanyBanks(
      dashboard.allCompanyBanks &&
        dashboard.allCompanyBanks.filter((item) => {
          return item.value === company_bankId;
        })
    );
  }, [user?.company_bankId, dashboard.allCompanyBanks]);

  useEffect(() => {
    const company_branchId = defCompanyBankBranch?.value
      ? defCompanyBankBranch.value
      : user.company_branchId;
    setDefaultCompanyBankBranch(
      dashboard.allBankBranch &&
        dashboard.allBankBranch.filter((item) => {
          return item.value === company_branchId;
        })
    );
  }, [user?.company_branchId, dashboard.company_branchId]);

  useEffect(() => {
    if (user.pf_reg_date) {
      setProvidentFundDate(new Date(user.pf_reg_date));
    }
  }, [user.pf_reg_date]);

  useEffect(() => {
    if (user.eobi_reg_date) {
      setEOBIDate(new Date(user.eobi_reg_date));
    }
  }, [user.eobi_reg_date]);

  useEffect(() => {
    if (user.social_security_reg_date) {
      setSocialSecurityDate(new Date(user.social_security_reg_date));
    }
  }, [user.social_security_reg_date]);

  useEffect(() => {
    if (user.pension_reg_date) {
      setPensionDate(new Date(user.pension_reg_date));
    }
  }, [user.pension_reg_date]);

  useEffect(() => {
    const employeeId = user.employeeId; // defEmployee?.value ? defEmployee.value : user.employeeId;
    dispatch(fetchAllEarningList(1, "", employeeId, true));
    dispatch(fetchAllDeductionList(2, "", employeeId));
    dispatch(fetchAllActiveEmployeesSalaryForDDL(employeeId));
    setEmployeeDefault(
      dashboard.allEmployeesSalaryDDL &&
        dashboard.allEmployeesSalaryDDL.filter((item) => {
          return item.value === employeeId;
        })
    );

    fetchEmployeeSalaryEarningList(
      employeeId,
      0,
      null,
      null,
      null,
      formUIProps.ids
    );
  }, [user?.employeeId, dashboard.employeeId, formUIProps, formUIProps.ids,dataForEdit,dataForRead,data]);

  useEffect(() => {
    const payment_mode_Id = defPaymentModeList?.value
      ? defPaymentModeList.value
      : user.payment_mode_Id;
    setDefualtPaymentModeCodeList(
      dashboard.allPaymentModeList &&
        dashboard.allPaymentModeList.filter((item) => {
          return item.value === payment_mode_Id;
        })
    );
  }, [user?.payment_mode_Id,]);

  //======================= compensation

  useEffect(() => {
    const earning_deduction_id = defEarningList?.value
      ? defEarningList.value
      : user.earning_deduction_id;
    setDefaultEarningList(
      dashboard.allEarnings &&
        dashboard.allEarnings.filter((item) => {
          return item.value === earning_deduction_id;
        })
    );
  }, [user?.earning_deduction_id, dashboard.earning_deduction_id]);

  const handleChanged = (e, setFieldValue) => {
    const newValue = e.value;
    fetchEmployeeSalaryEarningList(e.value, 0, setFieldValue);
  };



  const checkReadOnlyStatus = (values, readOnlyValues = []) => {
    if (
      !values.payment_mode_Id ||
      readOnlyValues.includes(Number(values.payment_mode_Id))
    ) {
      return true;
    }
    return false;
  };

    useEffect(() => {
      if (!user.Id) {
      
        dispatch(fetchAllBanks());
       
      }
    }, [dispatch]);

 

  const fetchEmployeeSalaryEarningList = async (
    employeeId,
    basicSalary,
    setFieldValue,
    gradeId,
    employeeTypeId,
    Id
  ) => {
    try {
      const response = await axios.post(
        `${USERS_URL}/emp_salary_revision/read-salary-policy-byfilters`,
        {
          employeeId,
          basicSalary: basicSalary || 0,
          gradeId,
          employeeTypeId,
          Id,
        }
      );

      if (!response?.data?.data?.[0]?.transactionType) {
        setDefaultMapEarningDeductionList([]);
      } else {
        setDefaultMapEarningDeductionList(response?.data?.data);
      }
      setBasicSalaryFactor(response?.data?.data[0]?.basicFactor || "");
      setGrossSalaryDB(response?.data?.data[0]?.grossSalary || "");
      setBasicSalaryDB(response?.data?.data[0]?.basicSalary || "");
      setBasicSalary(response?.data?.data[0]?.basicSalary || "");
      setDateOfJoining(response?.data?.data[0]?.dateOfJoining || "");
      setDateOfBirth(response?.data?.data[0]?.dateOfBirth || "");
 setLocalizationId(response?.data?.data[0]?.localizationId || "");
      if (response.data?.data?.[0]?.salaryMethod) {
        setcurrentSalaryMethod(response.data?.data?.[0]?.salaryMethod || "");
        setdropdownData(
          DROPDOWN[response.data?.data?.[0]?.salaryMethod] ||
            DEFAULT_CALCULATION_TYPE_DROPDOWN
        );
      } else {
        const value = response?.data?.data?.find(
          (el) =>
            el.calculation_type == "% Of Basic" ||
            el.calculation_type == "% Of Gross"
        )?.calculation_type;
        if (value == "% Of Basic") {
          setcurrentSalaryMethod("Basic to Gross");
          setdropdownData(
            DROPDOWN["Basic to Gross"] || DEFAULT_CALCULATION_TYPE_DROPDOWN
          );
        } else if (value == "% Of Gross") {
          setcurrentSalaryMethod("Gross to Basic");
          setdropdownData(DROPDOWN["Gross to Basic"]);
        } else {
          setcurrentSalaryMethod("");
          setdropdownData(DEFAULT_CALCULATION_TYPE_DROPDOWN);
        }
      }
      const currencyId = response?.data?.data[0]?.currencyId;

      if (setFieldValue) {
        setFieldValue("grossSalary", response?.data?.data[0]?.grossSalary);
        setFieldValue("basicSalary", response?.data?.data[0]?.basicSalary);
        setFieldValue(
          "overtime_working_day",
          response?.data?.data[0]?.overtime_working_day || 1
        );
        setFieldValue(
          "overtime_off_day",
          response?.data?.data[0]?.overtime_off_day || 1
        );
        setFieldValue(
          "overtime_holiday",
          response?.data?.data[0]?.overtime_holiday || 1
        );
        setFieldValue(
          "overtime_allowance",
          Boolean(response?.data?.data[0]?.overtime_allowance)
        );
        setFieldValue(
          "gratuity_member",
          Boolean(response?.data?.data[0]?.gratuity_member)
        );
        setFieldValue(
          "eobi_member",
          Boolean(response?.data?.data[0]?.eobi_member)
        );
        setFieldValue(
          "social_security_member",
          Boolean(response?.data?.data[0]?.social_security_member)
        );
        setFieldValue("currencyId", currencyId || "");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleFieldChanged = (el) => {
  //   const index = el.target.id.split('-')[1]
  //   const key = el.target.id.split('-')[0]
  //   setDefaultMapEarningDeductionList([...defMapEarningDeductionList.map((val, ind) => {
  //     if (ind == index) {
  //       if (!(key == "factorValue" && Number(el.target.value) > 100)) {
  //         val[key] = key == 'calculation_type' ? (el.target.value) : Number(el.target.value)
  //       }
  //     }
  //     return val
  //   })])
  // }

  const handleFieldChanged = (el) => {
    const [key, index] = el.target.id.split("-");

    setDefaultMapEarningDeductionList((prev) =>
      prev.map((val, ind) => {
        if (ind == index) {
          const newVal = el.target.value;
          if (!(key === "factorValue" && Number(newVal) > 100)) {
            val[key] =
              key === "calculation_type" || key === "earning_deduction_id"
                ? newVal
                : Number(newVal);
          }
        }
        return val;
      })
    );
  };

  // const addRow = (element) => {
  //   if (element.target.id == "Other") {
  //     setDefaultMapEarningDeductionList([...defMapEarningDeductionList, { transactionType: "Earning", isPartOfGrossSalary: 0 }])
  //   }
  //   else {
  //     setDefaultMapEarningDeductionList([...defMapEarningDeductionList, { transactionType: element.target.id, isPartOfGrossSalary: 1 }])
  //   }

  // }

  // const addRow = (element) => {
  //   const baseObj = {
  //     earning_deduction_id: "",
  //     calculation_type: "",
  //     factorValue: 0,
  //     amount: 0,
  //     updatedAmount: 0,
  //     transactionType:
  //       element?.target?.id === "Other" ? "Earning" : element.target.id,
  //     isPartOfGrossSalary: element?.target?.id === "Other" ? 0 : 1,
  //   };

  //   setDefaultMapEarningDeductionList([...defMapEarningDeductionList, baseObj]);
  // };


// const addRow = (element) => {
//   const { id } = element.target;

//   let baseObj = {
//     Id: null, // mark as new record
//     employeeId: user?.employeeId, 
//     employee: null, 
//     currency: "PKR", 
//     earning_deduction_id: null,
//     calculation_type: "",
//     factorValue: 0,
//     amount: 0,
//     updatedAmount: 0,
//     transactionType: "Earning", 
//     isPartOfGrossSalary: 1,
//   };

//   if (id === "Earning") {
//     baseObj.transactionType = "Earning";
//     baseObj.isPartOfGrossSalary = 1;
//   } else if (id === "OtherEarning") {
//     baseObj.transactionType = "Earning";
//     baseObj.isPartOfGrossSalary = 0;
//   } else if (id === "Deduction") {
//     baseObj.transactionType = "Deduction";
//     baseObj.isPartOfGrossSalary = 0;
//   }

//   setDefaultMapEarningDeductionList((prev) => [...prev, baseObj]);
// };


  const addRow = (element) => {


  if (element.target.id === "Other") {
    setDefaultMapEarningDeductionList([
      ...defMapEarningDeductionList,
      { employeeId: user?.employeeId, transactionType: "Earning", isPartOfGrossSalary: 0 },
    ]);
  } else if (element.target.id === "Gross") {
    setDefaultMapEarningDeductionList([
      ...defMapEarningDeductionList,
      { transactionType: "Earning", isPartOfGrossSalary: 1 },
    ]);
  } else if (element.target.id === "Deduction") {
    setDefaultMapEarningDeductionList([
      ...defMapEarningDeductionList,
      { transactionType: "Deduction", isPartOfGrossSalary: 0 },
    ]);
  }
};


  // const deleteRow = (element) => {
  //   const data = defMapEarningDeductionList;
  //   data.splice(element.target.id, 1);

  //   setDefaultMapEarningDeductionList([...data]);
  // };


    const deleteRow = (index, type) => {
 
  setDefaultMapEarningDeductionList((list) =>
    list.filter((item, idx) => {
      if (type === "Gross") {
        return !(idx === index && item.transactionType === "Earning" && item.isPartOfGrossSalary);
      }
      if (type === "Other") {
        return !(idx === index && item.transactionType === "Earning" && !item.isPartOfGrossSalary);
      }
      if (type === "Deduction") {
        return !(idx === index && item.transactionType === "Deduction");
      }
      return true;
    })
  );
};
  const calculateEmployeeSalaryPolicy = async (el, setFieldValue, values) => {
   
    const basicSalaryInputFactor =
      el.target.form.elements["basicSalaryFactor"].value;
    let grossSalaryInput = values.grossSalary;
    let basicSalaryInput = values.basicSalary;

    if (currentSalaryMethod == "Gross to Basic") {
      setGrossSalary(grossSalaryInput);

      const result = await Promise.all(
        defMapEarningDeductionList.map(async (x) => {
          if (
            x.calculation_type === "Fixed Amount" &&
            x.isPartOfGrossSalary &&
            x.transactionType == "Earning"
          ) {
            grossSalaryInput = grossSalaryInput - x.amount;
          }
          return grossSalaryInput; // Return the updated grossSalaryInput
        })
      );
      const totalBasicWithFactorVal =
        (Number(grossSalaryInput) * Number(basicSalaryInputFactor)) / 100;

      setFieldValue("basicSalary", totalBasicWithFactorVal);
      setBasicSalary(totalBasicWithFactorVal);

      // fetchEmployeeSalaryEarningList(employeeId,basicSalary)
      if (Number(basicSalaryInputFactor)) {
        setDefaultMapEarningDeductionList([
          ...defMapEarningDeductionList.map((x) => {
            if (x.calculation_type == "% Of Gross") {
              x.updatedAmount = (grossSalaryInput * x.factorValue) / 100;
             
            }
            return x;
          }),
        ]);
      }
    } else if (currentSalaryMethod == "Basic to Gross") {
      let basicSalaryNumber = Number(basicSalaryInput);

      setDefaultMapEarningDeductionList([
        ...defMapEarningDeductionList.map((x) => {
          if (x.calculation_type == "% Of Basic") {
            x.updatedAmount = (basicSalaryNumber * x.factorValue) / 100;
           
            if (x.isPartOfGrossSalary) {
              basicSalaryNumber += x.updatedAmount;
            }
          }
          return x;
        }),
      ]);

      const result = await Promise.all(
        defMapEarningDeductionList.map(async (x) => {
          if (
            x.calculation_type === "Fixed Amount" &&
            x.isPartOfGrossSalary &&
            x.transactionType == "Earning"
          ) {
            basicSalaryNumber = Number(basicSalaryNumber) + x.updatedAmount;
          }
          return basicSalaryNumber; // Return the updated grossSalaryInput
        })
      );

      setFieldValue("grossSalary", basicSalaryNumber);
      setGrossSalary(basicSalaryNumber);
      setGrossSalaryDB(basicSalaryNumber);
    } else {
      let basicSalaryNumber = Number(basicSalaryInput);
      let gross = 0;
      const result = await Promise.all(
        defMapEarningDeductionList.map(async (x) => {
          if (
            x.calculation_type === "Fixed Amount" &&
            x.isPartOfGrossSalary &&
            x.transactionType == "Earning"
          ) {
            gross = Number(gross) + x.updatedAmount;
          }
          return gross; // Return the updated grossSalaryInput
        })
      );

      setFieldValue("grossSalary", gross + basicSalaryNumber);
      setGrossSalary(gross + basicSalaryNumber);
      setGrossSalaryDB(gross + basicSalaryNumber);
    }
  };

  const totalAllowance = defMapEarningDeductionList?.reduce((sum, item) => {
    return item.transactionType === "Earning" ? sum + Number(item.amount) : sum;
  }, 0);

  const totalGross =
    defMapEarningDeductionList?.reduce((prev, curr) => {
      return curr.transactionType == "Earning" &&
        curr.isPartOfGrossSalary == false
        ? prev + Number(curr.amount)
        : prev;
    }, 0) || 0;

  const totalDeduction =
    defMapEarningDeductionList?.reduce((prev, curr) => {
      return curr.transactionType == "Deduction"
        ? prev + Number(curr.amount)
        : prev;
    }, 0) || 0;

  const validate = () => {
    const newErrors = {};
    defMapEarningDeductionList.forEach((objValidate, index) => {
      if (!objValidate.earning_deduction_id) {
        newErrors[`earning_deduction_id-${index}`] =
          VALIDATION_MESSAGES.required;
      }
      if (
        !objValidate.calculation_type ||
        objValidate.calculation_type == "-1"
      ) {
        newErrors[`calculation_type-${index}`] = VALIDATION_MESSAGES.required;
      }
      // Check if factorValue is required
      if (
        !objValidate.factorValue &&
        (objValidate.calculation_type == "% Of Gross" ||
          objValidate.calculation_type == "% Of Basic")
      ) {
        newErrors[`factorValue-${index}`] = VALIDATION_MESSAGES.required;
      }

      // Check if amount is required
      if (
        !objValidate.amount && !objValidate.updatedAmount &&
        objValidate.calculation_type == "Fixed Amount"
      ) {
        newErrors[`updatedAmount-${index}`] = VALIDATION_MESSAGES.required;
      }
    });

    return newErrors;
  };

  const createDropdown = (data) => {
    return (data || []).map((el) => {
      return (
        <>
          <option value={el.value}>{el.label}</option>
        </>
      );
    });
  };

useEffect(()=>{
  if (user?.emp_bankId) {

    dispatch(fetchAllBankBranch(user.emp_bankId));
  };
  
},[user.emp_bankId])  

  // useEffect(() => {

  //   const emp_bank_branchId = defEmpBankBranch?.value
  //     ? defEmpBankBranch.value
  //     : user.emp_bank_branchId;
  //   setDefaultEmpBankBranch(
  //     dashboard.allBankBranch &&
  //       dashboard.allBankBranch.filter((item) => {
  //         return item.value === emp_bank_branchId;
  //       })
  //   );

  // }, [user?.emp_bankId,dashboard.allBankBranch,user?.emp_bank_branchId]);
  useEffect(() => {
    const filteredPermission = dashboard?.allPayrollConfigApproverPermissionList?.entities.filter(
      (entity) => entity.subsidiaryId === Number(user.subsidiaryId)
    );

    if (filteredPermission?.length > 0) {
      const permission = filteredPermission[0];
      const roleId = String(auth?.user?.roleId).trim();
      const salaryApproverIds = permission?.salaryApproverId?.map((id) =>
        String(id).trim()
      );

      const isRoleSalaryApprover = salaryApproverIds?.includes(roleId);
      setSalaryApproverPermission(isRoleSalaryApprover);
    }
  }, [user.subsidiaryId]);

  // Faaiz 24-7-2025

  useEffect(() => {
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
    dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus"));
    dispatch(fetchAllFormsMenu(275, "allEmployeeStatus"));
    dispatch(fetchAllFormsMenu(377, "allEmpTypeDynamicChildMenus"));
  }, []);
  const { activeFiscalYear } = useSelector((state) => state.dashboard);
  const mergedEmpTypeMenus = useMemo(() => {
    return [
      ...(dashboard?.allEmpTypeDynamicChildMenus || []),
      ...(dashboard?.allEmpTypeChildMenus || []),
    ];
  }, [dashboard?.allEmpTypeDynamicChildMenus, dashboard?.allEmpTypeChildMenus]);

 


    const {
 dataForSalaryComparison,
      previousSalaryComparison,
   
    } = useSelector((state) => ({
  
      dataForSalaryComparison: state.emp_salary_revision.dataForSalaryComparison,
      previousSalaryComparison: state.emp_salary_revision.previousSalaryComparison,

    }));
 

    
  const handlePolicyModalClose = () => {
    setComparisonModal(false);

  };

const comparisonFields = [
  { key: "gradeId", updatedKey: "updatedGradeId", label: "Grade" },
    { key: "designationId", updatedKey: "updatedDesignationId", label: "Designation" },
      { key: "employeeTypeId", updatedKey: "updatedEmployeeTypeId", label: "Employee Type" },
      { key: "employeeStatusId", updatedKey: "updatedEmployeeStatusId", label: "Employee Status" },

  { key: "grossSalary", updatedKey: "updatedGrossSalary", label: "Gross Salary" },
   { key: "basicSalary", updatedKey: "updatedBasicSalary", label: "Basic Salary" },
     { key: "basicFactor", updatedKey: "updatedBasicFactor", label: "Basic Factor" },




  { key: "grossPackage", updatedKey: "updatedGrossPackage", label: "Gross Package" },
  


  { key: "payment_mode_Id", updatedKey: "updatedPayment_mode_Id", label: "Payment Mode" },
    { key: "emp_bankId", updatedKey: "updatedEmp_bankId", label: "Employee Bank" },
  { key: "emp_bank_branchId", updatedKey: "updatedEmp_bank_branchId", label: "Employee Bank Branch" },
  { key: "emp_bank_accNo", updatedKey: "updatedEmp_bank_accNo", label: "Employee Bank Account No" },
  // { key: "emp_bank_accountTitle", updatedKey: "updatedEmp_bank_accountTitle", label: "Employee Bank Account Title" },


    { key: "gratuity_member", updatedKey: "updatedGratuity_member", label: "Gratuity Member" },
  { key: "gratuity_startDate", updatedKey: "updatedGratuity_startDate", label: "Gratuity Start Date" },


    { key: "overtime_allowance", updatedKey: "updatedOvertime_allowance", label: "Overtime Allowance" },
  { key: "overtime_working_day", updatedKey: "updatedOvertime_working_day", label: "Overtime Working Day" },
  { key: "overtime_off_day", updatedKey: "updatedOvertime_off_day", label: "Overtime Off Day" },
  { key: "overtime_holiday", updatedKey: "updatedOvertime_holiday", label: "Overtime Holiday" },



    { key: "eobi_accNo", updatedKey: "updatedEobi_accNo", label: "EOBI Account" },
  { key: "eobi_member", updatedKey: "updatedEobi_member", label: "EOBI Member" },
  { key: "eobi_reg_date", updatedKey: "updatedEobi_reg_date", label: "EOBI Registration Date" },




  { key: "social_security_accNo", updatedKey: "updatedSocial_security_accNo", label: "Social Security Account" },
  { key: "social_security_member", updatedKey: "updatedSocial_security_member", label: "Social Security Member" },
  { key: "social_security_reg_date", updatedKey: "updatedSocial_security_reg_date", label: "Social Security Registration Date" },


  





  // { key: "pf_accNo", updatedKey: "updatedPf_accNo", label: "Provident Fund Account" },
  // { key: "pf_member", updatedKey: "updatedPf_member", label: "Provident Fund Member" },
  // { key: "pf_reg_date", updatedKey: "updatedPf_reg_date", label: "Provident Fund Registration Date" },

  // { key: "pension_accNo", updatedKey: "updatedPension_accNo", label: "Pension Account" },
  // { key: "pension_member", updatedKey: "updatedPension_member", label: "Pension Member" },
  // { key: "pension_reg_date", updatedKey: "updatedPension_reg_date", label: "Pension Registration Date" },
  // { key: "profit_member", updatedKey: "updatedProfit_member", label: "Profit Member" },
  // { key: "regularity_allowance", updatedKey: "updatedRegularity_allowance", label: "Regularity Allowance" },
  // { key: "punctuality_allowance", updatedKey: "updatedPunctuality_allowance", label: "Punctuality Allowance" },
];
  useEffect(()=>{
   if(user?.Employee?.gradeId){
      dispatch(fetchAllDesignationByGradeId(user?.Employee?.gradeId , "allDesignationByGrade"))
   }
  },[user?.Employee?.gradeId])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...user,Employee: {
      gradeId: user?.Employee?.gradeId || "",
      designationId: user?.Employee?.designationId || "",
      employeeTypeId: user?.Employee?.employeeTypeId || "",
      employeeStatusId: user?.Employee?.employeeStatusId || "",
    },
          // revisedDate: revisedDate || null, // fallback
        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          const validationErrors = validate();
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
      
          } else {
          const earningDeductionList = defMapEarningDeductionList.map(
            (item) => ({
              ...item,
              updatedAmount: item.updatedAmount ?? item.amount ?? 0, // fallback if missing
            })
          );

          saveForm(
            {
              ...values,
              basicFactor: defBasicSalaryFactor || values.basicFactor,
                 gratuity_startDate: values.gratuity_startDate
                                  ? formatDates(values.gratuity_startDate, "dd-MMM-yyyy")
                                  : null,
                                   eobi_reg_date: values.eobi_reg_date
                                  ? formatDates(values.eobi_reg_date, "dd-MMM-yyyy")
                                  : null, 
                                    social_security_reg_date: values.social_security_reg_date
                                  ? formatDates(values.social_security_reg_date, "dd-MMM-yyyy")
                                  : null,
              grossPackage:
                values.grossSalary > 0
                  ? Number(values.grossSalary) + Number(totalGross)
                  : Number(defGrossSalary) + Number(totalGross),
            },
            earningDeductionList
          );
        }
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          values,
          handleBlur,
          setFieldTouched,
          handleChange,
          setFieldValue,
          formik,
          handleReset,
        }) => (
          <>
            {/* {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )} */}
{console.log("errr111",errors)}
            <Form className="form form-label-right">
              <fieldset disabled={dataForRead}>

   

{comparisonModal && (
  <CustomModal
    show={comparisonModal}
    onClose={handlePolicyModalClose}
    title="Salary Comparison"
    className="max-w-7xl"
  >
    {/* -------- Top section: Salary fields comparison -------- */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {comparisonFields.map((field, index) => {
        let previousValue = previousSalaryComparison?.[field.key];
        let updatedValue = previousSalaryComparison?.[field.updatedKey];

        // Map IDs to formName for readable display
        if (field.key === "gradeId") previousValue = previousSalaryComparison?.grade?.formName;
        if (field.updatedKey === "updatedGradeId") updatedValue = previousSalaryComparison?.updatedgrade?.formName;

        if (field.key === "designationId") previousValue = previousSalaryComparison?.designation?.formName;
        if (field.updatedKey === "updatedDesignationId") updatedValue = previousSalaryComparison?.updateddesignation?.formName;

        if (field.key === "employeeTypeId") previousValue = previousSalaryComparison?.employeeType?.formName;
        if (field.updatedKey === "updatedEmployeeTypeId") updatedValue = previousSalaryComparison?.updatedemployeeType?.formName;

        if (field.key === "employeeStatusId") previousValue = previousSalaryComparison?.employeeStatus?.formName;
        if (field.updatedKey === "updatedEmployeeStatusId") updatedValue = previousSalaryComparison?.updatedemployeeStatus?.formName;



        // bank
          if (field.key === "emp_bankId") previousValue = previousSalaryComparison?.emp_bank?.Name;
        if (field.updatedKey === "updatedEmp_bankId") updatedValue = previousSalaryComparison?.updatedEmp_bank?.Name;
     
     
        if (field.key === "emp_bank_branchId") previousValue = previousSalaryComparison?.emp_bank_branch?.Name;
        if (field.updatedKey === "updatedEmp_bank_branchId") updatedValue = previousSalaryComparison?.updatedEmp_bank_branch?.Name;
     
        if (field.key === "payment_mode_Id") previousValue = previousSalaryComparison?.payment_mode?.formName;
        if (field.updatedKey === "updatedPayment_mode_Id") updatedValue = previousSalaryComparison?.updatedPayment_mode?.formName;


       return (
  <div
    key={index}
    className="p-4 border border-gray-200 rounded-2xl shadow-sm bg-white"
  >
    <h3 className="text-lg font-semibold text-primary mb-2">{field.label}</h3>
    <p className="text-gray-700 text-sm">
      <span className="font-medium">Previous:</span>{" "}
      {previousValue === true
        ? "Yes"
        : previousValue === false
        ? "No"
        : previousValue ?? "—"}
    </p>
    <p className="text-gray-700 text-sm">
      <span className="font-medium">Updated:</span>{" "}
      {updatedValue === true
        ? "Yes"
        : updatedValue === false
        ? "No"
        : updatedValue ?? "—"}
    </p>
  </div>
);

      })}
    </div>

    {/* -------- Bottom section: Table for array data -------- */}
    <div className="space-y-8">
      {/* Earnings Table */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Earnings</h3>
        <table className="w-full border border-gray-200 text-sm">
          <thead className="border-gray-200 shadow-sm bg-white">
            <tr>
              <th className="border px-3 py-2 text-left">Earning Name</th>
              <th className="border px-3 py-2 text-left">Calculation Type</th>
              <th className="border px-3 py-2 text-left">Factor Value</th>
              <th className="border px-3 py-2 text-left">Previous Amount</th>
              <th className="border px-3 py-2 text-left">Updated Amount</th>
            </tr>
          </thead>
          <tbody>
            {previousSalaryComparison?.EmpSalaryRevisionChildLogs?.filter(
              (item) => item.transactionType === "Earning"
            ).map((item, i) => (
              <tr key={i}>
                <td className="border px-3 py-2">{item?.EarningDeductionName?.earningName}</td>
                <td className="border px-3 py-2">{item?.calculation_type}</td>
                <td className="border px-3 py-2">{item?.factorValue}</td>
                <td className="border px-3 py-2">{item?.amount}</td>
                <td className="border px-3 py-2">{item?.updatedAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Other Earnings Table */}
      {/* <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Other Earnings</h3>
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Calculation Type</th>
              <th className="border px-3 py-2 text-left">Factor Value</th>
              <th className="border px-3 py-2 text-left">Previous Amount</th>
              <th className="border px-3 py-2 text-left">Updated Amount</th>
            </tr>
          </thead>
          <tbody>
            {previousSalaryComparison?.EmpSalaryRevisionChildLogs?.filter(
              (item) => item.transactionType === "OtherEarning"
            ).map((item, i) => (
              <tr key={i}>
                <td className="border px-3 py-2">{item.earning_deduction_name}</td>
                <td className="border px-3 py-2">{item.calculation_type}</td>
                <td className="border px-3 py-2">{item.factorValue}</td>
                <td className="border px-3 py-2">{item.amount}</td>
                <td className="border px-3 py-2">{item.updatedAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* Deductions Table */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Deductions</h3>
        <table className="w-full border border-gray-200 text-sm">
            <thead className="border-gray-200 shadow-sm bg-white">
            <tr>
              <th className="border px-3 py-2 text-left">Deduction Name</th>
              <th className="border px-3 py-2 text-left">Calculation Type</th>
              <th className="border px-3 py-2 text-left">Factor Value</th>
              <th className="border px-3 py-2 text-left">Previous Amount</th>
              <th className="border px-3 py-2 text-left">Updated Amount</th>
            </tr>
          </thead>
          <tbody>
            {previousSalaryComparison?.EmpSalaryRevisionChildLogs?.filter(
              (item) => item.transactionType === "Deduction"
            ).map((item, i) => (
              <tr key={i}>
                <td className="border px-3 py-2">
                  {(dashboard?.allDeductions || [])
                    .filter((x) => x.value === item.earning_deduction_id)
                    .map((x) => <span key={x.value}>{x.label}</span>)}
                </td>
                <td className="border px-3 py-2">{item.calculation_type}</td>
                <td className="border px-3 py-2">{item.factorValue}</td>
                <td className="border px-3 py-2">{item.amount}</td>
                <td className="border px-3 py-2">{item.updatedAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </CustomModal>
)}

                          
                <div className="grid grid-cols-6 gap-x-3 gap-y-1">
                  <div>
                    <label>
                      Salary Revision Date <span style={{ color: "red" }}>*</span>
                    </label>

                    <DatePicker
                      className="form-control"
                      placeholder="revisedDate"
                      selected={
                        values?.revisedDate
                          ? new Date(values.revisedDate)
                          : null
                      }
                      onChange={(date) => {
                        let selectedDate = formatDates(date, "yyyy-MM-dd");
                        setFieldValue("revisedDate", selectedDate);
                      }}
                      maxDate={
                        activeFiscalYear?.payrollMonth?.endDate
                          ? new Date(activeFiscalYear?.payrollMonth?.endDate)
                          : null
                      }
                      dateF
                      dateFormat="dd-MMM-yyyy"
                      name="revisedDate"
                      autoComplete="off"
                    />
                    {touched.revisedDate && errors.revisedDate && (
                      <div className="invalid-feedback d-block">
                        {errors.revisedDate}
                      </div>
                    )}
                  </div>
                </div>




                {/* {confirmationModal && (  */}

                <Modal
                  show={confirmationModal}
                  onHide={confirmationModal}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  {/*begin::Loading*/}
                  {/* {isLoading && <ModalProgressBar />} */}
                  {/*end::Loading*/}
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                      Confirmation
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <span>Are you sure want to update salary?</span>
                  </Modal.Body>
                  <Modal.Footer>
                    <div>
                      <button
                        type="button"
                        onClick={() => setConfirmationModal(false)}
                        className="btn btn-light btn-elevate"
                      >
                        Cancel
                      </button>
                      <> </>
                      <button
                        type="button"
                        onClick={() => {
                          fetchEmployeeSalaryEarningList(
                            user?.employeeId,
                            0,
                            setFieldValue,
                            values?.Employee?.gradeId,
                            values?.Employee?.employeeTypeId
                          );
                          setConfirmationModal(false);
                        }}
                        className="btn btn-primary btn-elevate"
                      >
                        Update Salary
                        {loading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
                    </div>
                  </Modal.Footer>
                </Modal>
                {/* )} */}


 <Modal
                  show={dataSaveonfirmationModal}
                  onHide={dataSaveonfirmationModal}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  {/*begin::Loading*/}
                  {/* {isLoading && <ModalProgressBar />} */}
                  {/*end::Loading*/}
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                      Confirmation
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <span>Are you sure want to save salary?</span>
                  </Modal.Body>
                  <Modal.Footer>
                    <div>
                      <button
                        type="button"
                        onClick={() => setDataSaveConfirmationModal(false)}
                        className="btn btn-light btn-elevate"
                      >
                        Cancel
                      </button>
                      <> </>
                      <button
                        type="button"
                        onClick={(e) => {
                      calculateEmployeeSalaryPolicy(e, setFieldValue, values);
                      handleSubmit();
                      setDataSaveConfirmationModal(false)

                      if (
                        values.revisedDate === null ||
                        values.revisedDate === undefined
                      ) {
                        toast.error("Please select a salary revision date");
                        return;
                      }
                    }}
                        className="btn btn-primary btn-elevate"
                      >
                        Save
                        {loading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
                    </div>
                  </Modal.Footer>
                </Modal>


             

                {user?.employeeId && (
                  <div className="w-full overflow-x-auto">
                    <h6 className="font-bold mb-0 text-primary mt-2">
                      Employee Information
                    </h6>
                    <div className="grid grid-cols-4 gap-x-3 gap-y-2">
                      <div>
                        <SearchSelect
                          name="Employee.gradeId"
                          label={
                            <span>
                              Grade<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          onChange={(e) => {
                            setFieldValue("Employee.gradeId", e.value || null);
                            // fetchEmployeeSalaryEarningList(user.employeeId, 0, setFieldValue, e.value, values.Employee.employeeTypeId);
                            setConfirmationModal(true);
                             dispatch(fetchAllDesignationByGradeId( e.value  , "allDesignationByGrade"))
                              setFieldValue(
                              "Employee.designationId",
                              null
                            );
                          }}
                          value={
                            dashboard?.allEmployeegradeList?.find(
                              (option) =>
                                option.value === values?.Employee?.gradeId
                            ) || null
                          }
                          // options={dashboard?.allEmployeegradeList}
                          options={[
                            // { label: "Select", value: "" },
                            ...(Array.isArray(dashboard?.allEmployeegradeList)
                              ? dashboard?.allEmployeegradeList
                              : []),
                          ]}
                          error={errors?.Employee?.gradeId}
                          touched={touched?.Employee?.gradeId}
                        />
                      </div>

                      {/* Designation */}
                      <div>
                        <SearchSelect
                          name="Employee.designationId"
                          label={
                            <span>
                              Designation
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          onChange={(e) => {
                            setFieldValue(
                              "Employee.designationId",
                              e.value || null
                            );
                          }}
                          // value={
                          //   dashboard?.allDesignations?.find(
                          //     (option) =>
                          //       option.value === values?.Employee?.designationId
                          //   ) || null
                          // }
                             value={
                          dashboard?.allDesignationByGrade?.find(
                            (option) => option.value ===  values?.Employee?.designationId
                          ) || null
                        }
                          // options={dashboard?.allDesignations}
                          options={[
                    
                            ...(Array.isArray(dashboard?.allDesignationByGrade)
                              ? dashboard?.allDesignationByGrade
                              : []),
                          ]}
                          // error={errors?.Employee?.designationId}
                          //  error={errors?.Employee?.designationId}
                          touched={touched?.Employee?.designationId}
                        />
                         {errors?.Employee?.designationId && (
    <span className="invalid-feedback">
      {errors.Employee.designationId}
    </span>
  )}
                      </div>

                      {/* Grade */}

                      {/* Employee Type */}
                      <div>
                        <SearchSelect
                          name="employeeTypeId"
                          label={
                            <span>
                              Employee Type
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          onChange={(e) => {
                            setFieldValue(
                              "Employee.employeeTypeId",
                              e.value || null
                            );
                            setConfirmationModal(true);
                            // fetchEmployeeSalaryEarningList(user.employeeId, 0, setFieldValue, values.Employee.gradeId, e.value);
                          }}
                          value={
                            mergedEmpTypeMenus.find(
                              (option) =>
                                option.value ===
                                values?.Employee?.employeeTypeId
                            ) || null
                          }
                          options={mergedEmpTypeMenus}
                          error={errors?.Employee?.employeeTypeId}
                          touched={touched?.Employee?.employeeTypeId}
                        />
                      </div>

                      <div>
                        <SearchSelect
                          name="employeeStatusId"
                          label={
                            <span>
                              {" "}
                              Employee Status
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={dataForRead}
                          onChange={(e) => {
                            setFieldValue(
                              "Employee.employeeStatusId",
                              e.value || null
                            );
                          }}
                          value={
                            dashboard?.allEmployeeStatus?.find(
                              (option) =>
                                option.value ===
                                values?.Employee?.employeeStatusId
                            ) || null
                          }
                          error={errors?.Employee?.employeeStatusId}
                          touched={touched?.Employee?.employeeStatusId}
                          options={dashboard?.allEmployeeStatus}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion> */}

                {
                  <div className="grid grid-cols-5 gap-x-3 gap-y-2 mt-3">
                    <div className="">
                      <AmountInput
                        field={{
                          name: "grossSalary",
                          value: values.grossSalary,
                          onBlur: () => setFieldTouched("grossSalary", true),
                          onChange: () => {},
                        }}
                        form={{
                          touched,
                          errors,
                          setFieldValue,
                          setFieldTouched,
                        }}
                        label={
                          <span>
                            {" "}
                            Gross Salary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        placeholder="Enter Gross Salary"
                        autoComplete="off"
                        // disabled={!values.revisedDate}
                        disabled={!currentSalaryMethod || currentSalaryMethod == 'Basic to Gross' || !values.revisedDate}
                        // value={values.grossSalary || defGrossSalaryDB || ""}
                        onChange={(e) => {
                          setGrossSalaryDB(e);
                          setFieldValue("grossSalary", e);
                       
                        }}
                      />
                    </div>

                    <div className="">
                      <AmountInput
                        field={{
                          name: "basicSalary",
                          value: values.basicSalary,
                          onBlur: () => setFieldTouched("basicSalary", true),
                          onChange: () => {},
                        }}
                        form={{
                          touched,
                          errors,
                          setFieldValue,
                          setFieldTouched,
                        }}
                        label={
                          <span>
                            Basic Salary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        placeholder="Enter Basic Salary"
                        autoComplete="off"
                        disabled={currentSalaryMethod === "Gross to Basic"}
                        value={values.basicSalary}
                        onChange={(value) => {
                          setBasicSalary(value); // Local state update
                          setFieldValue("basicSalary", value); // Formik update
                        }}
                      />
                    </div>
                    <div className="">
                      <Field
                        name="basicSalaryFactor"
                        type="number"
                        disabled
                        value={values.basicfactor || defBasicSalaryFactor}
                        component={Input}
                        placeholder="Enter Basic Salary"
                        label={
                          <span>
                            {" "}
                            Gross to Basic Factor
                            {Boolean(
                              currentSalaryMethod == "Gross to Basic"
                            ) && (
                              <>
                                <span style={{ color: "red" }}>*</span>
                              </>
                            )}
                          </span>
                        }
                        autoComplete="off"
                      />
                    </div>
                    <div className="mt-5">
                      <input
                        type="button"
                        class="btn btn-success"
                        disabled={!values.revisedDate}
                        onClick={(e) =>
                          calculateEmployeeSalaryPolicy(
                            e,
                            setFieldValue,
                            values
                          )
                        }
                        id="btnSalaryPolicyCalc"
                        value="Calculate"
                      ></input>
                    </div>
                    {dataForSalaryComparison && (  <div className="mt-5 flex justify-end">
                    
                      <button
                    type="button"
                 
                   
                    onClick={(e) => {
                     dispatch(fetchPreviousEmpSalaryComp(user?.Id))
                     setComparisonModal(true)
                     
                    }}
                    className="btn btn-primary btn-elevate m-1"
                  >
                     <Eye className="w-4 h-4 text-white" /> View Last Salary
                    {loading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                  </div>)}

                  </div>
                }
                {/* For Earning WIth Payroll Include ByDefault Yes  */}
                <hr />
                 {currentSalaryMethod && (<>
                <div>
                  <div className="flex justify-between items-center">
                    <h6 className="font-bold mb-0 text-primary">
                      Earnings{"  "}
                    </h6>
                    {!Boolean(currentSalaryMethod) && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          id="Earning"
                          onClick={addRow}
                        >
                          <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                          Add
                        </button>
                      )}
                  </div>
                  <div className="w-full overflow-x-auto">
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr className="custom-table-header">
                          {/* <td>Employee</td> */}
                          {/* <td>Action</td> */}
                          <td>Earning</td>
                          <td>Calculation Type</td>
                          <td>Factor</td>
                          <td>Amount</td>
                          <td>Updated Amount</td>
                        </tr>
                        {defMapEarningDeductionList?.map(
                          (obj, rightindex) =>
                            obj.transactionType == "Earning" &&
                            obj.isPartOfGrossSalary == true && (
                              <>
                                <tr>
                                  {/* <td id={rightindex} onClick={!Boolean(currentSalaryMethod) && deleteRow}>{!Boolean(currentSalaryMethod) && 'Delete'} </td> */}
                                  <td>
                                    {/* <select
                              disabled={Boolean(currentSalaryMethod)}
                              onChange={(e) => {
                                handleFieldChanged(e);
                                setErrors((prev) => ({ ...prev, [`earning_deduction_id-${rightindex}`]: '' })); // Clear error on change

                              }}

                              id={'earning_deduction_id-' + rightindex} value={obj.earning_deduction_id}>
                              <option value="-1"> Select</option>
                              {
                                dashboard.allEarnings?.map((x) => {
                                  return <option disabled={defMapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                                })}
                            </select>
                            {deferrors[`earning_deduction_id-${rightindex}`] && <div className="form-feedBack">{deferrors[`earning_deduction_id-${rightindex}`]}</div>} */}

                                    <SearchSelect
                                      name={`earning_deduction_id-${rightindex}`}
                                      // label={<span>Earning/Deduction <span style={{ color: 'red' }}>*</span></span>}
                                      isDisabled={Boolean(currentSalaryMethod)}
                                      onChange={(e) => {
                                        handleFieldChanged(e);
                                        setErrors((prev) => ({
                                          ...prev,
                                          [`earning_deduction_id-${rightindex}`]: "",
                                        }));
                                      }}
                                      value={
                                        dashboard?.allEarnings?.find(
                                          (option) =>
                                            option.value ===
                                            obj.earning_deduction_id
                                        ) || null
                                      }
                                      error={
                                        deferrors[
                                          `earning_deduction_id-${rightindex}`
                                        ]
                                      }
                                      touched={true} // If you're using Formik, you can manage touched field logic more precisely
                                      options={dashboard?.allEarnings?.map(
                                        (x) => ({
                                          ...x,
                                          isDisabled: !!defMapEarningDeductionList.find(
                                            (el) =>
                                              el.earning_deduction_id ===
                                              x.value
                                          ),
                                        })
                                      )}
                                    />
                                  </td>
                                  <td>
                                    {/* <select value={obj.calculation_type}
                              disabled={Boolean(currentSalaryMethod)}
                              onChange={(e) => {
                                handleFieldChanged(e);
                                setErrors((prev) => ({ ...prev, [`calculation_type-${rightindex}`]: '' })); // Clear error on change

                                if (e.target.value == "Fixed Amount") { obj.factorValue = 0 }
                                else {
                                  obj.amount = 0
                                }

                              }}

                              id={'calculation_type-' + rightindex} >
                              {
                                createDropdown(dropdownData || [])
                              }
                            </select> */}
                                    {/* {deferrors[`calculation_type-${rightindex}`] && <div className="form-feedBack">{deferrors[`calculation_type-${rightindex}`]}</div>} */}
                                    <SearchSelect
                                      name={`calculation_type-${rightindex}`}
                                      isDisabled={Boolean(currentSalaryMethod)}
                                      onChange={(e) => {
                                        handleFieldChanged(e);
                                        setErrors((prev) => ({
                                          ...prev,
                                          [`calculation_type-${rightindex}`]: "",
                                        })); // Clear error

                                        if (e.value === "Fixed Amount") {
                                          obj.factorValue = 0;
                                        } else {
                                          obj.amount = 0;
                                        }
                                      }}
                                      value={
                                        (dropdownData || []).find(
                                          (opt) =>
                                            opt.value === obj.calculation_type
                                        ) || null
                                      }
                                      error={
                                        deferrors[
                                          `calculation_type-${rightindex}`
                                        ]
                                      }
                                      touched={true}
                                      options={dropdownData || []}
                                    />
                                  </td>
                                  {/* <td>{obj.transactionType}</td> */}
                                  {/* <td>

                            <input disabled style={{ width: "100px" }} type="number"

                              onChange={(e) => {
                                handleFieldChanged(e);
                                setErrors((prev) => ({ ...prev, [`factorValue-${rightindex}`]: '' })); // Clear error on change
                              }}
                              value={obj.factorValue} id={'factorValue-' + rightindex}></input>
                            {deferrors[`factorValue-${rightindex}`] && <div className="form-feedBack">{deferrors[`factorValue-${rightindex}`]}</div>}
                          </td> */}
                                  <td>
                                    <AmountInput
                                      field={{
                                        name: `factorValue-${rightindex}`,
                                        value: obj.factorValue,
                                        onBlur: () => {},
                                        onChange: () => {},
                                      }}
                                      form={{
                                        touched: {},
                                        errors: {},
                                        setFieldValue: (field, value) => {
                                          setDefaultMapEarningDeductionList(
                                            (list) =>
                                              list.map((item, idx) =>
                                                idx === rightindex
                                                  ? {
                                                      ...item,
                                                      factorValue: value,
                                                    }
                                                  : item
                                              )
                                          );
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`factorValue-${rightindex}`]: "",
                                          }));
                                        },
                                        setFieldTouched: () => {},
                                      }}
                                      label={null}
                                      disabled={true}
                                      value={obj.factorValue}
                                    />
                                    {deferrors[`factorValue-${rightindex}`] && (
                                      <div className="form-feedBack">
                                        {deferrors[`factorValue-${rightindex}`]}
                                      </div>
                                    )}
                                  </td>

                                  <td>
                                    <AmountInput
                                      field={{
                                        name: `amount-${rightindex}`,
                                        value: obj.amount,
                                        onBlur: () => {},
                                        onChange: () => {},
                                      }}
                                      form={{
                                        touched: {},
                                        errors: {},
                                        setFieldValue: (field, value) => {
                                          setDefaultMapEarningDeductionList(
                                            (list) =>
                                              list.map((item, idx) =>
                                                idx === rightindex
                                                  ? { ...item, amount: value }
                                                  : item
                                              )
                                          );
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`amount-${rightindex}`]: "",
                                          }));
                                        },
                                        setFieldTouched: () => {},
                                      }}
                                      label={null}
                                      disabled={true}
                                      value={obj.amount}
                                    />
                                    {deferrors[`amount-${rightindex}`] && (
                                      <div className="form-feedBack">
                                        {deferrors[`amount-${rightindex}`]}
                                      </div>
                                    )}
                                  </td>

                                  <td>
                                    <AmountInput
                                      field={{
                                        name: `amount-${rightindex}`,
                                        value: obj.updatedAmount,
                                        onBlur: () => {},
                                        onChange: () => {},
                                      }}
                                      form={{
                                        touched: {},
                                        errors: {},
                                        setFieldValue: (field, value) => {
                                          setDefaultMapEarningDeductionList(
                                            (list) =>
                                              list.map((item, idx) =>
                                                idx === rightindex
                                                  ? {
                                                      ...item,
                                                      updatedAmount: value,
                                                    }
                                                  : item
                                              )
                                          );
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`amount-${rightindex}`]: "",
                                          }));
                                        },
                                        setFieldTouched: () => {},
                                      }}
                                      label={null}
                                      disabled={true}
                                      value={obj.updatedAmount}
                                    />
                                    {deferrors[
                                      `updatedAmount-${rightindex}`
                                    ] && (
                                      <div className="form-feedBack">
                                        {deferrors[`amount-${rightindex}`]}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              </>
                            )
                        )}
                      </table>
                    </div>
                  </div>
                  {/* {!Boolean(currentSalaryMethod) && <> <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <input type='button' id="Earning" onClick={addRow} value='+Add'></input>
                      </div>

                    </div>
                    </>} */}
                </div> </>)}
               
                {/* For Earning WIth Payroll Include ByDefault No  */}
                <hr />
                <div>
                  <div className="flex justify-between items-center">
                    <h6 className="font-bold mb-0 text-primary">
                      Other Earnings
                    </h6>
                    {/* {!Boolean(currentSalaryMethod) && ( */}
                      <button
                        type="button"
                        className="btn btn-primary"
                        id="Other"
                        onClick={addRow}
                      >
                        <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                        Add
                      </button>
                    {/* )} */}
                  </div>
                  <div className="w-full overflow-x-auto">
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr className="custom-table-header">
                          {/* <td>Employee</td> */}
                          <td>Earning</td>
                          <td>Calculation Type</td>
                          <td>Factor</td>
                          <td>Amount</td>
                          <td>Updated Amount</td>
                          <td className="text-right">Action</td>
                        </tr>
                        {defMapEarningDeductionList?.map(
                          (obj, rightindex) =>
                            obj.transactionType == "Earning" &&
                            obj.isPartOfGrossSalary == false && (
                              <>
                                <tr>
                                  <td>
                                    <Field
                                      as="select"
                                      name={`earning_deduction_id-${rightindex}`}
                                      id={`earning_deduction_id-${rightindex}`}
                                      className="form-control"
                                      value={obj.earning_deduction_id || ""}
                                      onChange={(e) => {
                                        handleFieldChanged({
                                          target: {
                                            id: `earning_deduction_id-${rightindex}`,
                                            value: e.target.value,
                                          },
                                        });
                                        setErrors((prev) => ({
                                          ...prev,
                                          [`earning_deduction_id-${rightindex}`]: "",
                                        }));
                                      }}
                                    >
                                      <option value="">Select</option>
                                      {(dashboard.allEarnings || []).map(
                                        (x) => (
                                          <option
                                            key={x.value}
                                            value={x.value}
                                            disabled={defMapEarningDeductionList.some(
                                              (el) =>
                                                el.earning_deduction_id ===
                                                x.value
                                            )}
                                          >
                                            {x.label}
                                          </option>
                                        )
                                      )}
                                    </Field>

                                    {deferrors[
                                      `earning_deduction_id-${rightindex}`
                                    ] && (
                                      <div className="form-feedBack">
                                        {
                                          deferrors[
                                            `earning_deduction_id-${rightindex}`
                                          ]
                                        }
                                      </div>
                                    )}
                                  </td>

                                  <td>
                                    <Field
                                      as="select"
                                      name={`calculation_type-${rightindex}`}
                                      id={`calculation_type-${rightindex}`}
                                      className="form-control"
                                      value={obj.calculation_type || ""}
                                      onChange={(e) => {
                                        const selectedValue = e.target.value;

                                        handleFieldChanged({
                                          target: {
                                            id: `calculation_type-${rightindex}`,
                                            value: selectedValue,
                                          },
                                        });

                                        setErrors((prev) => ({
                                          ...prev,
                                          [`calculation_type-${rightindex}`]: "",
                                        }));

                                        if (selectedValue === "Fixed Amount") {
                                          obj.factorValue = 0;
                                        } else {
                                          obj.amount = 0;
                                        }
                                      }}
                                    >
                                      {/* <option value="">Select</option> */}
                                      {(dropdownData || []).map((opt) => (
                                        <option
                                          key={opt.value}
                                          value={opt.value}
                                        >
                                          {opt.label}
                                        </option>
                                      ))}
                                    </Field>

                                    {deferrors[
                                      `calculation_type-${rightindex}`
                                    ] && (
                                      <div className="form-feedBack">
                                        {
                                          deferrors[
                                            `calculation_type-${rightindex}`
                                          ]
                                        }
                                      </div>
                                    )}
                                  </td>

                                  <td>
                                    <AmountInput
                                      field={{
                                        name: `factorValue-${rightindex}`,
                                        value: obj.factorValue,
                                        onBlur: () => {},
                                     
                                      }}
                                      
                                      form={{
                                        touched: {},
                                        errors: {},
                                        setFieldValue: () => {},
                                        setFieldTouched: () => {},
                                      }}
                                            onChange={ (value) => {
                                   
                                          setDefaultMapEarningDeductionList(
                                            (list) =>
                                              list.map((item, idx) =>
                                                idx === rightindex
                                                  ? {
                                                      ...item,
                                                      factorValue: value,
                                                    }
                                                  : item
                                              )
                                          )}}
                                      // label={null}
                                      disabled={
                                        obj.calculation_type === "Fixed Amount"
                                      }
                                      value={obj.factorValue}
                                    />
                                    {deferrors[`factorValue-${rightindex}`] && (
                                      <div className="form-feedBack">
                                        {deferrors[`factorValue-${rightindex}`]}
                                      </div>
                                    )}
                                  </td>

                                  <td>
                                    <AmountInput
                                      field={{
                                        name: `amount-${rightindex}`,
                                        value: obj.amount,
                                        onBlur: () => {},
                                        onChange: (e) => {},
                                      }}
                                      id={"amount-" + rightindex}
                                      onChange={(e) => {
                                        setDefaultMapEarningDeductionList(
                                          (list) =>
                                            list.map((item, idx) =>
                                              idx === rightindex
                                                ? { ...item, amount: Number(e) }
                                                : item
                                            )
                                        );
                                      }}
                                      form={{
                                        touched: {},
                                        errors: {},
                                        setFieldValue: (field, value) => {},
                                        setFieldTouched: () => {},
                                      }}
                                      label={null}
                                      // disabled={
                                      //   obj.calculation_type == "% Of Gross" ||
                                      //   obj.calculation_type == "% Of Basic"
                                      // }
                                      disabled={true}
                                      value={obj.amount}
                                    />
                                    {deferrors[`amount-${rightindex}`] && (
                                      <div className="form-feedBack">
                                        {deferrors[`amount-${rightindex}`]}
                                      </div>
                                    )}
                                  </td>

                                  <td>
                                    <AmountInput
                                      field={{
                                        name: `updatedAmount-${rightindex}`,
                                        value: obj.amount,
                                        onBlur: () => {},
                                        onChange: (e) => {},
                                      }}
                                      id={"updatedAmount-" + rightindex}
                                      onChange={(e) => {
                                        setDefaultMapEarningDeductionList(
                                          (list) =>
                                            list.map((item, idx) =>
                                              idx === rightindex
                                                ? {
                                                    ...item,
                                                    updatedAmount: Number(e),
                                                  }
                                                : item
                                            )
                                        );
                                      }}
                                      form={{
                                        touched: {},
                                        errors: {},
                                        setFieldValue: (field, value) => {},
                                        setFieldTouched: () => {},
                                      }}
                                      label={null}
                                      disabled={
                                        obj.calculation_type == "% Of Gross" ||
                                        obj.calculation_type == "% Of Basic"
                                      }
                                      value={obj.updatedAmount}
                                    />
                                    {deferrors[
                                      `updatedAmount-${rightindex}`
                                    ] && (
                                      <div className="form-feedBack">
                                        {
                                          deferrors[
                                            `updatedAmount-${rightindex}`
                                          ]
                                        }
                                      </div>
                                    )}
                                  </td>
                                  <td id={rightindex}
                                  
                                  // onClick={deleteRow}
                                  onClick={() => deleteRow(rightindex, "Other")}
                                  >
                                    {" "}
                                    <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                  </td>
                                </tr>
                              </>
                            )
                        )}
                      </table>
                    </div>
                  </div>
                  {
                    // <>
                    //   <div className="from-group row">
                    //     <div className="col-12 col-md-4 mt-3">
                    //       <input type='button' id="Other" class="btn btn-primary" onClick={addRow} value='+Add'></input>
                    //     </div>


                    //   </div>
                    // </>
                  }
                </div>
                <hr />
                <div>
                  <div className="flex justify-between items-center">
                    <h6 className="font-bold mb-0 text-primary">
                      Deductions{"  "}
                    </h6>
                    {/* {!Boolean(currentSalaryMethod) && ( */}
                        <button
                          type="button"
                          className="btn btn-primary"
                          id="Deduction"
                          onClick={addRow}
                        >
                          <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                          Add
                        </button>
                      {/* )} */}
                  </div>
                  <div className="w-full overflow-x-auto">
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr className="custom-table-header">
                          {/* <td>Employee</td> */}
                          <td className="col-2">Deduction</td>
                          <td>Calculation Type</td>
                          <td>Factor</td>
                          <td>Amount</td>
                          <td>Updated Amount</td>
                          <td className="text-right">Action</td>
                        </tr>
                        {defMapEarningDeductionList?.map(
                          (obj, rightindex) =>
                            obj.transactionType == "Deduction" && (
                              <>
                                <tr>
                                  {/* <td>
                            <select
                              onChange={(e) => {
                                handleFieldChanged(e);
                                setErrors((prev) => ({ ...prev, [`earning_deduction_id-${rightindex}`]: '' })); // Clear error on change
                              }}

                              id={'earning_deduction_id-' + rightindex} value={obj.earning_deduction_id}>
                              <option value="-1"> Select</option>
                              {
                                dashboard.allDeductions?.map((x) => {
                                  return <option disabled={defMapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                                })}
                            </select>
                            {deferrors[`earning_deduction_id-${rightindex}`] && <div className="form-feedBack">{deferrors[`earning_deduction_id-${rightindex}`]}</div>}
                          </td> */}

                                  <td>
                                    <Field
                                      as="select"
                                      name={`earning_deduction_id-${rightindex}`}
                                      className="form-control"
                                      onChange={(e) => {
                                        handleFieldChanged({
                                          target: {
                                            id: `earning_deduction_id-${rightindex}`,
                                            value: e.target.value,
                                          },
                                        });
                                        setErrors((prev) => ({
                                          ...prev,
                                          [`earning_deduction_id-${rightindex}`]: "",
                                        }));
                                      }}
                                      value={obj.earning_deduction_id || "-1"}
                                    >
                                      <option value="-1">Select</option>
                                      {(dashboard?.allDeductions || []).map(
                                        (x) => (
                                          <option
                                            key={x.value}
                                            value={x.value}
                                            disabled={defMapEarningDeductionList.some(
                                              (el) =>
                                                el.earning_deduction_id ===
                                                x.value
                                            )}
                                          >
                                            {x.label}
                                          </option>
                                        )
                                      )}
                                    </Field>

                                    {deferrors[
                                      `earning_deduction_id-${rightindex}`
                                    ] && (
                                      <div className="form-feedBack">
                                        {
                                          deferrors[
                                            `earning_deduction_id-${rightindex}`
                                          ]
                                        }
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    <Field
                                      as="select"
                                      name={`calculation_type-${rightindex}`}
                                      className="form-control"
                                      value={obj.calculation_type || ""}
                                      onChange={(e) => {
                                        handleFieldChanged({
                                          target: {
                                            id: `calculation_type-${rightindex}`,
                                            value: e.target.value,
                                          },
                                        });
                                        setErrors((prev) => ({
                                          ...prev,
                                          [`calculation_type-${rightindex}`]: "",
                                        }));
                                      }}
                                    >
                                      {(dropdownData || []).map((item) => (
                                        <option
                                          key={item.value}
                                          value={item.value}
                                        >
                                          {item.label}
                                        </option>
                                      ))}
                                    </Field>

                                    {deferrors[
                                      `calculation_type-${rightindex}`
                                    ] && (
                                      <div className="form-feedBack">
                                        {
                                          deferrors[
                                            `calculation_type-${rightindex}`
                                          ]
                                        }
                                      </div>
                                    )}
                                  </td>

                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      style={{ width: "100px" }}
                                      disabled={
                                        obj.calculation_type === "Fixed Amount"
                                      }
                                      id={`factorValue-${rightindex}`}
                                      value={obj.factorValue}
                                      onChange={(e) => {
                                        handleFieldChanged(e);
                                        setErrors((prev) => ({
                                          ...prev,
                                          [`factorValue-${rightindex}`]: "",
                                        }));
                                      }}
                                    />
                                    {deferrors[`factorValue-${rightindex}`] && (
                                      <div className="form-feedBack">
                                        {deferrors[`factorValue-${rightindex}`]}
                                      </div>
                                    )}
                                  </td>

                                  <td>
                                    <AmountInput
                                      field={{
                                        name: `amount-${rightindex}`,
                                        value: obj.amount,
                                        onBlur: () => {},
                                        onChange: (e) => {},
                                      }}
                                      id={"amount-" + rightindex}
                                      onChange={(e) => {
                                        setDefaultMapEarningDeductionList(
                                          (list) =>
                                            list.map((item, idx) =>
                                              idx === rightindex
                                                ? { ...item, amount: Number(e) }
                                                : item
                                            )
                                        );
                                      }}
                                      form={{
                                        touched: {},
                                        errors: {},
                                        setFieldValue: (field, value) => {},
                                        setFieldTouched: () => {},
                                      }}
                                      label={null}
                                      // disabled={
                                      //   obj.calculation_type == "% Of Gross" ||
                                      //   obj.calculation_type == "% Of Basic"
                                      // }
                                      disabled={true}
                                      value={obj.amount}
                                    />

                                    {deferrors[`amount-${rightindex}`] && (
                                      <div className="form-feedBack">
                                        {deferrors[`amount-${rightindex}`]}
                                      </div>
                                    )}
                                  </td>

                                  <td>
                                    <AmountInput
                                      field={{
                                        name: `updatedAmount-${rightindex}`,
                                        value: obj.updatedAmount,
                                        onBlur: () => {},
                                        onChange: (e) => {},
                                      }}
                                      id={"updatedAmount-" + rightindex}
                                      onChange={(e) => {
                                        setDefaultMapEarningDeductionList(
                                          (list) =>
                                            list.map((item, idx) =>
                                              idx === rightindex
                                                ? { ...item, updatedAmount: Number(e) }
                                                : item
                                            )
                                        );
                                      }}
                                      form={{
                                        touched: {},
                                        errors: {},
                                        setFieldValue: (field, value) => {},
                                        setFieldTouched: () => {},
                                      }}
                                      label={null}
                                      disabled={
                                        obj.calculation_type == "% Of Gross" ||
                                        obj.calculation_type == "% Of Basic"
                                      }
                                      value={obj.updatedAmount}
                                    />

                                    {deferrors[
                                      `updatedAmount-${rightindex}`
                                    ] && (
                                      <div className="form-feedBack">
                                        {
                                          deferrors[
                                            `updatedAmount-${rightindex}`
                                          ]
                                        }
                                      </div>
                                    )}
                                  </td>
                                  <td
                                    className="text-right"
                                    id={rightindex}
                                     onClick={() => deleteRow(rightindex, "Deduction")}
                                  >
                                    {" "}
                                    <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                  </td>
                                </tr>
                              </>
                            )
                        )}
                      </table>
                    </div>
                  </div>

                  {/* <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <input type='button' id="Deduction" class="btn btn-primary"
                          onClick={addRow} value='+Add'></input>
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                      </div>

                    </div> */}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-3 gap-y-1 md:grid-cols-8 rtl">
                  <div className="col-span-1 col-start-1 sm:col-start-4 md:col-start-7 grid grid-col-1 gap-y-1 gap-x-1">
                    <div>
                      <AmountInput
                        field={{
                          name: `totalAllowance`,
                          value: totalAllowance,
                          onBlur: () => {},
                          onChange: (e) => {},
                        }}
                        form={{
                          touched: {},
                          errors: {},
                          setFieldValue: (field, value) => {},
                          setFieldTouched: () => {},
                        }}
                        label={"Total Allowance"}
                        disabled={true}
                        value={totalAllowance}
                      />
                      {/* Total Allowance <input type="number" disabled="true" value={totalAllowance} id="txtTotalAllowance"></input> */}
                    </div>
                  </div>
                  <div className="col-span-1 col-start-2 sm:col-start-5 md:col-start-8 grid grid-col-1 gap-y-1 gap-x-1">
                    <div>
                      <AmountInput
                        field={{
                          name: `grossSalary`,
                          value:
                            values.grossSalary > 0
                              ? Number(values.grossSalary) + Number(totalGross)
                              : Number(defGrossSalary) + Number(totalGross),
                          onBlur: () => {},
                          onChange: (e) => {},
                        }}
                        form={{
                          touched: {},
                          errors: {},
                          setFieldValue: (field, value) => {},
                          setFieldTouched: () => {},
                        }}
                        label={"Gross Package"}
                        disabled={true}
                        value={
                          values.grossSalary > 0
                            ? Number(values.grossSalary) + Number(totalGross)
                            : Number(defGrossSalary) + Number(totalGross)
                        }
                      />
                    </div>

                    <div>
                      <AmountInput
                        field={{
                          name: `totalDeduction`,
                          value: { totalDeduction },
                          onBlur: () => {},
                          onChange: (e) => {},
                        }}
                        form={{
                          touched: {},
                          errors: {},
                          setFieldValue: (field, value) => {},
                          setFieldTouched: () => {},
                        }}
                        label={"Total Deductions"}
                        disabled={true}
                        value={totalDeduction}
                      />
                      {/* Total Deductions <input disabled="true" type="number" value={totalDeduction} id="txtTotalDeductions"></input> */}
                    </div>
                    <div>
                      <AmountInput
                        field={{
                          name: `netSalary`,
                          value:
                            values.grossSalary > 0
                              ? Number(values.grossSalary) +
                                Number(totalGross) -
                                Number(totalDeduction)
                              : Number(defGrossSalary) + Number(totalGross),
                          onBlur: () => {},
                          onChange: (e) => {},
                        }}
                        form={{
                          touched: {},
                          errors: {},
                          setFieldValue: (field, value) => {},
                          setFieldTouched: () => {},
                        }}
                        label={"Net Salary"}
                        disabled={true}
                        value={
                          values.grossSalary > 0
                            ? Number(values.grossSalary) +
                              Number(totalGross) -
                              Number(totalDeduction)
                            : Number(defGrossSalary) + Number(totalGross)
                        }
                      />
                      {/* Net Salary <input disabled="true" value={values.grossSalary > 0 ? (Number(values.grossSalary) + Number(totalGross)) - Number(totalDeduction) : Number(defGrossSalary) + Number(totalGross)} type="number" id="txtGrossPackage"></input> */}
                    </div>
                  </div>
                </div>
                <hr />

                <div className="grid grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1">
                  <div>
                    <SearchSelect
                      name="payment_mode_Id"
                      label={
                        <span>
                          {" "}
                          Payment Mode
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={dataForRead && true}
                      onBlur={() => {
                        // handleBlur({ target: { name: "countryId" } });
                      }}
                      onChange={(e) => {
                        setFieldValue("payment_mode_Id", e.value || null);
                        setDefualtPaymentModeCodeList(e);
                      }}
                      // value={defPaymentModeList || null}
                    
                      value={
                        dashboard.allPaymentModeList?.find(
                          (option) => option.value === values.payment_mode_Id
                        ) || null
                      }
                      error={errors.payment_mode_Id}
                      touched={touched.payment_mode_Id}
                      options={dashboard.allPaymentModeList}
                    />
                  </div>
                  <div>
                    <SearchSelect
                      name="emp_bankId"
                      label={<span> Employee Bank</span>}
                      isDisabled={checkReadOnlyStatus(values, [151, 152])}
                      onBlur={() => {
                        // handleBlur({ target: { name: "countryId" } });
                      }}
                      onChange={(e) => {
                        setFieldValue("emp_bankId", e.value);
                        setFieldValue("emp_bank_branchId", null);
                        setDefaultEmpBankBranch(null);
                        setDefaultBanks(e);
                    
                          dispatch(fetchAllBankBranch(e.value));
                        
                      }}
                      value={
                        !checkReadOnlyStatus(values, [151, 152]) ?  
                        dashboard.allBanks?.find(
                          (option) => option.value === values.emp_bankId
                        ) || null
                       : ""
                      }
                      error={errors.emp_bankId}
                      touched={touched.emp_bankId}
                      options={dashboard.allBanks}
                    />
                  </div>
                  <div>
                    <SearchSelect
                      name="emp_bank_branchId"
                      label={<span>Employee Bank Branch</span>}
                      isDisabled={checkReadOnlyStatus(values, [151, 152])}
                      onBlur={() => {
                        // handleBlur({ target: { name: "countryId" } });
                      }}
                      onChange={(e) => {
                        setFieldValue("emp_bank_branchId", e.value);
                        setDefaultEmpBankBranch(e);
                     
                      }}
                      value={
                        !checkReadOnlyStatus(values, [151, 152])
                          ? dashboard.allBankBranch?.find(
                          (option) => option.value === values.emp_bank_branchId
                        ) || null
                          : ""
                      }
                      error={errors.emp_bank_branchId}
                      touched={touched.emp_bank_branchId}
                      options={dashboard.allBankBranch}
                    />
                  </div>
                  <div>
                    <Field
                      maxLength={20}
                      disabled={checkReadOnlyStatus(values, [151, 152])}
                      name="emp_bank_accNo"
                      component={Input}
                      type="number"
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value, 15); // Limit to 3 digits
                      }}
                      // value={clearEmpBankAccField}
                      //onChange={(e) => setEmpBankAccClearField(e.target.value)}
                      placeholder="Enter Bank Account No"
                      label={<span>Bank Account No</span>}
                      autoComplete="off"
                    />

                    {/* <ErrorMessage className="form-feedBack" name="emp_bank_accNo" component="div" /> */}
                  </div>
                  {/* Hidden by Mubin bhai  12-9-2025*/}
                  {/* <div>
                    <Field
                      name="emp_bank_accountTitle"
                      isDisabled={checkReadOnlyStatus(values, [151, 152])}
                      value={
                        !checkReadOnlyStatus(values, [151, 152])
                          ? values.emp_bank_accountTitle
                          : ""
                      }
                      onChange={(e) => {
                        setFieldValue("emp_bank_accountTitle", e.target.value);
                        setBankAccTitleClearField(e.target.value);
                      }}
                      component={Input}
                      placeholder="Enter Bank Account Title"
                      label={<span> Bank Account Title</span>}
                      autoComplete="off"
                    />
                  </div> */}
                </div>

                <hr />
              </fieldset>
              {/* <Accordion defaultActiveKey="">
                <Card>
                  <Card.Header>
                    <div className="accordion-header-btn">
                      <Accordion.Toggle as={Button} eventKey="0">
                        Entitlements
                        <KeyboardArrowDown />
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <div
                        style={{
                          backgroundColor: "rgb(235 243 255)",
                          padding: "20px",
                          borderRadius: "5px",
                          border: "2px solid #adceff",
                        }}
                      >
                        <h6>Earning Entitlements</h6>

                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-12">
                            <input
                              type="checkbox"
                              disabled={dataForRead}
                              name="gratuity_member"
                              onChange={(e) => {
                                setFieldValue(
                                  "gratuity_member",
                                  e.target.checked
                                );
                              }}
                              onBlur={handleBlur}
                              value={values.gratuity_member}
                              checked={values.gratuity_member}
                            />{" "}
                            Gratuity Member
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            {
                              <span>
                                {" "}
                                Date Of Registration
                                {Boolean(values.gratuity_member) && (
                                  <span style={{ color: "red" }}>*</span>
                                )}{" "}
                              </span>
                            }
                            <DatePicker
                              className="form-control"
                              placeholder="Enter Gratuity Reg Date"
                              selected={
                                values.gratuity_member && defGrauityDate
                              }
                              onChange={(date) => {
                                setFieldValue("gratuity_startDate", date);
                                setGrauityDate(date);
                              }}
                              timeInputLabel="Time:"
                              dateFormat="dd-MMM-yyyy"
                              showTimeInput
                              name="gratuity_startDate"
                              autoComplete="off"
                              disabled={!values.gratuity_member || dataForRead}
                              // value = {values.dateOfJoining}
                            />
                            <ErrorMessage
                              className="form-feedBack"
                              name="gratuity_startDate"
                              component="div"
                            />
                          </div>
                        </div>
                        <br></br>
                        <div className="from-group row">
                          <div className="col-12 col-md-3 mt-3">
                            <input
                              name="overtime_allowance"
                              type="checkbox"
                              disabled={dataForRead}
                              onChange={(e) => {
                                setFieldValue(
                                  "overtime_allowance",
                                  e.target.checked
                                );
                              }}
                              onBlur={handleBlur}
                              value={values.overtime_allowance}
                              checked={values.overtime_allowance}
                            />{" "}
                            Over Time
                          </div>
                        </div>

                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="overtime_working_day"
                              disabled={
                                !Boolean(values.overtime_allowance) ||
                                dataForRead
                              }
                              type="number"
                              component={Input}
                              maxLength={2}
                              label={
                                <span>
                                  {" "}
                                  Overtime Factor Working Day
                                  {Boolean(values.overtime_allowance) && (
                                    <span style={{ color: "red" }}>*</span>
                                  )}
                                </span>
                              }
                              autoComplete="off"
                              value={
                                !Boolean(values.overtime_allowance)
                                  ? ""
                                  : values.overtime_working_day
                              }
                            />
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="overtime_off_day"
                              disabled={
                                !Boolean(values.overtime_allowance) ||
                                dataForRead
                              }
                              type="number"
                              component={Input}
                              maxLength={2}
                              label={
                                <span>
                                  {" "}
                                  Overtime Factor Off day
                                  {Boolean(values.overtime_allowance) && (
                                    <span style={{ color: "red" }}>*</span>
                                  )}
                                </span>
                              }
                              autoComplete="off"
                              value={
                                !Boolean(values.overtime_allowance)
                                  ? ""
                                  : values.overtime_off_day
                              }
                            />
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="overtime_holiday"
                              disabled={
                                !Boolean(values.overtime_allowance) ||
                                dataForRead
                              }
                              type="number"
                              component={Input}
                              maxLength={2}
                              label={
                                <span>
                                  {" "}
                                  Overtime Factor Holiday
                                  {Boolean(values.overtime_allowance) && (
                                    <span style={{ color: "red" }}>*</span>
                                  )}
                                </span>
                              }
                              autoComplete="off"
                              value={
                                !Boolean(values.overtime_allowance)
                                  ? ""
                                  : values.overtime_holiday
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <br></br>
                      <div
                        style={{
                          backgroundColor: "rgb(235 243 255)",
                          padding: "20px",
                          borderRadius: "5px",
                          border: "2px solid #adceff",
                        }}
                      >
                        <h6>Deduction Entitlements</h6>

                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-12">
                            <input
                              name="eobi_member"
                              type="checkbox"
                              disabled={dataForRead}
                              onChange={(e) => {
                                setFieldValue("eobi_member", e.target.checked);
                              }}
                              onBlur={handleBlur}
                              value={values.eobi_member}
                              checked={values.eobi_member}
                            />{" "}
                            EOBI Member
                          </div>
                          <div className="col-12 col-md-4 mt-5">
                            {
                              <span>
                                {" "}
                                Date Of Registration
                                {Boolean(values.eobi_member) && (
                                  <span style={{ color: "red" }}>*</span>
                                )}{" "}
                              </span>
                            }

                            <DatePicker
                              className="form-control"
                              placeholder="Enter EOBI Reg Date"
                              selected={values.eobi_member && defEOBIDate}
                              label="EOBI Reg Date"
                              onChange={(date) => {
                                setFieldValue("eobi_reg_date", date);
                                setEOBIDate(date);
                              }}
                              timeInputLabel="Time:"
                              dateFormat="dd-MMM-yyyy"
                              showTimeInput
                              name="eobi_reg_date"
                              autoComplete="off"
                              disabled={!values.eobi_member || dataForRead}
                            />
                            <ErrorMessage
                              className="form-feedBack"
                              name="eobi_reg_date"
                              component="div"
                            />
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="eobi_accNo"
                              type="number"
                              component={Input}
                              onInput={(e) => {
                                e.target.value = amountLimitDynamic(
                                  e.target.value,
                                  15
                                ); // Limit to 3 digits
                              }}
                              placeholder="Enter EOBI Account No"
                              label={
                                <span>
                                  {" "}
                                  EOBI Account No
                                  {Boolean(values.eobi_member) && (
                                    <span style={{ color: "red" }}>*</span>
                                  )}{" "}
                                </span>
                              }
                              autoComplete="off"
                              disabled={!values.eobi_member || dataForRead}
                            />
                          </div>
                        </div>

                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-12">
                            <input
                              type="checkbox"
                              disabled={dataForRead}
                              name="social_security_member"
                              onChange={(e) => {
                                setFieldValue(
                                  "social_security_member",
                                  e.target.checked
                                );
                              }}
                              onBlur={handleBlur}
                              value={values.social_security_member}
                              checked={values.social_security_member}
                            />{" "}
                            Social Security Member
                            {values.social_security_member}
                          </div>
                          <div className="col-12 col-md-4 mt-5">
                            {
                              <span>
                                {" "}
                                Date Of Registration
                                {Boolean(values.social_security_member) && (
                                  <span style={{ color: "red" }}>*</span>
                                )}
                              </span>
                            }
                            <DatePicker
                              className="form-control"
                              placeholder="Enter Social Security Reg Date"
                              selected={
                                values.social_security_member &&
                                defSocialSecurity
                              }
                              onChange={(date) => {
                                setFieldValue("social_security_reg_date", date);
                                setSocialSecurityDate(date);
                              }}
                              timeInputLabel="Time:"
                              dateFormat="dd-MMM-yyyy"
                              showTimeInput
                              name="social_security_reg_date"
                              autoComplete="off"
                              disabled={
                                !values.social_security_member || dataForRead
                              }
                              // value = {values.dateOfJoining}
                            />
                            <ErrorMessage
                              className="form-feedBack"
                              name="social_security_reg_date"
                              component="div"
                            />
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              onInput={(e) => {
                                e.target.value = amountLimitDynamic(
                                  e.target.value,
                                  15
                                ); // Limit to 3 digits
                              }}
                              name="social_security_accNo"
                              component={Input}
                              type="number"
                              placeholder="Enter Social Security AccNo"
                              label={
                                <span>
                                  {" "}
                                  Social Security Account No{" "}
                                  {values.social_security_accNo}
                                  {Boolean(values.social_security_member) && (
                                    <span style={{ color: "red" }}>*</span>
                                  )}
                                </span>
                              }
                              autoComplete="off"
                              disabled={
                                !values.social_security_member || dataForRead
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion> */}
             
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-1">
                <h6 className="m-0 text-black font-bold text-base col-span-1 xl:col-span-2 sm:text-lg py-1">
                  Entitlements
                </h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                  <h6 className="font-bold mb-0 sm:col-span-2 text-primary">
                    Earning
                  </h6>
                  <div className="space-y-1">
                    <div
                      style={{
                        fontSize: "10.2px",
                        // fontWeight: "bold",
                        // padding: "2px",
                      }}
                      className="text-black mt-1 flex justify-start items-center"
                    >
                      <div className="flex justify-start items-center">
                        <input
                          type="checkbox"
                          className="p-0 m-0 mr-1 "
                          disabled={dataForRead}
                          name="gratuity_member"
                          onChange={(e) => {
                            setFieldValue("gratuity_member", e.target.checked);
                          }}
                          onBlur={handleBlur}
                          value={values.gratuity_member}
                          checked={values.gratuity_member}
                        />{" "}
                        Gratuity Member
                      </div>
                    </div>

                    <div>
                      {
                        <label>
                          {" "}
                          Date Of Registration
                          {Boolean(values.gratuity_member) && (
                            <span style={{ color: "red" }}>*</span>
                          )}{" "}
                        </label>
                      }
                      <DatePicker
                        className="form-control"
                        placeholder="Enter Gratuity Reg Date"
                        selected={values.gratuity_member && defGrauityDate}
                        onChange={(date) => {
                          setFieldValue("gratuity_startDate", date);
                          setGrauityDate(date);
                        }}
                        timeInputLabel="Time:"
                        dateFormat="dd-MMM-yyyy"
                        showTimeInput
                        name="gratuity_startDate"
                        autoComplete="off"
                        disabled={!values.gratuity_member || dataForRead}
                        // value = {values.dateOfJoining}
                          minDate={
                                    dateOfJoining
                                      ? new Date(dateOfJoining)
                                      : null
                                  }
                      />
                      <ErrorMessage
                        className="form-feedBack"
                        name="gratuity_startDate"
                        component="div"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div
                      style={{
                        fontSize: "10.2px",
                        // fontWeight: "bold",
                        // padding: "2px",
                      }}
                      className="text-black mt-1 flex justify-start items-center"
                    >
                      <div className="flex justify-start items-center">
                        <input
                          name="overtime_allowance"
                          className="p-0 m-0 mr-1 "
                          type="checkbox"
                          disabled={dataForRead}
                          onChange={(e) => {
                            setFieldValue(
                              "overtime_allowance",
                              e.target.checked
                            );
                          }}
                          onBlur={handleBlur}
                          value={values.overtime_allowance}
                          checked={values.overtime_allowance}
                        />{" "}
                        Over Time
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                      <div>
                        <Field
                          name="overtime_working_day"
                          disabled={
                            !Boolean(values.overtime_allowance) || dataForRead
                          }
                          type="number"
                          component={Input}
                          maxLength={2}
                          label={
                            <span>
                              {" "}
                              Working Day Factor
                              {Boolean(values.overtime_allowance) && (
                                <span style={{ color: "red" }}>*</span>
                              )}
                            </span>
                          }
                          autoComplete="off"
                          value={
                            !Boolean(values.overtime_allowance)
                              ? ""
                              : values.overtime_working_day
                          }
                        />
                      </div>

                      <div>
                        <Field
                          name="overtime_off_day"
                          disabled={
                            !Boolean(values.overtime_allowance) || dataForRead
                          }
                          type="number"
                          component={Input}
                          maxLength={2}
                          label={
                            <span>
                              {" "}
                              Off day Factor
                              {Boolean(values.overtime_allowance) && (
                                <span style={{ color: "red" }}>*</span>
                              )}
                            </span>
                          }
                          autoComplete="off"
                          value={
                            !Boolean(values.overtime_allowance)
                              ? ""
                              : values.overtime_off_day
                          }
                        />
                      </div>

                      <div>
                        <Field
                          name="overtime_holiday"
                          disabled={
                            !Boolean(values.overtime_allowance) || dataForRead
                          }
                          type="number"
                          component={Input}
                          maxLength={2}
                          label={
                            <span>
                              {" "}
                              Holiday Factor
                              {Boolean(values.overtime_allowance) && (
                                <span style={{ color: "red" }}>*</span>
                              )}
                            </span>
                          }
                          autoComplete="off"
                          value={
                            !Boolean(values.overtime_allowance)
                              ? ""
                              : values.overtime_holiday
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                  {localizationId == 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                  <h6 className="font-bold mb-0 sm:col-span-2 text-primary">
                    Deduction
                  </h6>
                  <div className="space-y-1">
                    <div
                      style={{
                        fontSize: "10.2px",
                        // fontWeight: "bold",
                        // padding: "2px",
                      }}
                      className="text-black mt-1 flex justify-start items-center"
                    >
                      <div className="flex justify-start items-center">
                        <input
                          type="checkbox"
                          className="p-0 m-0 mr-1 "
                          name="eobi_member"
                          disabled={dataForRead}
                          onChange={(e) => {
                            setFieldValue("eobi_member", e.target.checked);
                          }}
                          onBlur={handleBlur}
                          value={values.eobi_member}
                          checked={values.eobi_member}
                        />{" "}
                        EOBI Member
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                      <div>
                        {
                          <label>
                            {" "}
                            Date Of Registration
                            {Boolean(values.eobi_member) && (
                              <span style={{ color: "red" }}>*</span>
                            )}{" "}
                          </label>
                        }

                        <DatePicker
                          className="form-control"
                          placeholder="Enter EOBI Reg Date"
                          selected={values.eobi_member && defEOBIDate}
                          label="EOBI Reg Date"
                          onChange={(date) => {
                            setFieldValue("eobi_reg_date", date);
                            setEOBIDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="eobi_reg_date"
                          autoComplete="off"
                          disabled={!values.eobi_member || dataForRead}
                              minDate={
                                    dateOfBirth
                                      ? new Date(dateOfBirth)
                                      : null
                                  }
                        />
                        <ErrorMessage
                          className="form-feedBack"
                          name="eobi_reg_date"
                          component="div"
                        />
                      </div>
                      <div>
                        <Field
                          name="eobi_accNo"
                          type="number"
                          component={Input}
                          onInput={(e) => {
                            e.target.value = amountLimitDynamic(
                              e.target.value,
                              15
                            ); // Limit to 3 digits
                          }}
                          placeholder="Enter EOBI Account No"
                          label={
                            <span>
                              {" "}
                              EOBI Account No
                              {Boolean(values.eobi_member) && (
                                <span style={{ color: "red" }}>*</span>
                              )}{" "}
                            </span>
                          }
                          autoComplete="off"
                          disabled={!values.eobi_member || dataForRead}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div
                      style={{
                        fontSize: "10.2px",
                        // fontWeight: "bold",
                        // padding: "2px",
                      }}
                      className="text-black mt-1 flex justify-start items-center"
                    >
                      <div className="flex justify-start items-center">
                        <input
                          className="p-0 m-0 mr-1 "
                          type="checkbox"
                          disabled={dataForRead}
                          name="social_security_member"
                          onChange={(e) => {
                            setFieldValue(
                              "social_security_member",
                              e.target.checked
                            );
                          }}
                          onBlur={handleBlur}
                          value={values.social_security_member}
                          checked={values.social_security_member}
                        />{" "}
                        Social Security Member
                        {/* {values.social_security_member} */}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                      <div>
                        <label>
                          Date Of Registration
                          {Boolean(values.eobi_member) && (
                            <span style={{ color: "red" }}>*</span>
                          )}
                        </label>
                        <DatePicker
                          className="form-control"
                          placeholder="Enter Social Security Reg Date"
                          selected={
                            values.social_security_member && defSocialSecurity
                          }
                          onChange={(date) => {
                            setFieldValue("social_security_reg_date", date);
                            setSocialSecurityDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="social_security_reg_date"
                          autoComplete="off"
                          disabled={
                            !values.social_security_member || dataForRead
                          }
                          // value = {values.dateOfJoining}
                           minDate={
                                    dateOfBirth
                                      ? new Date(dateOfBirth)
                                      : null
                                  }
                            
                        />
                        <ErrorMessage
                          className="form-feedBack"
                          name="eobi_reg_date"
                          component="div"
                        />
                      </div>
                      <div>
                        <Field
                          onInput={(e) => {
                            e.target.value = amountLimitDynamic(
                              e.target.value,
                              15
                            ); // Limit to 3 digits
                          }}
                          name="social_security_accNo"
                          component={Input}
                          type="number"
                          placeholder="Enter Social Security AccNo"
                          label={
                            <span>
                              {" "}
                              Social Security Account No
                              {Boolean(values.social_security_member) && (
                                <span style={{ color: "red" }}>*</span>
                              )}
                            </span>
                          }
                          autoComplete="off"
                          disabled={
                            !values.social_security_member || dataForRead
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                  )}
              </div>

              <div className="form-group row justify-content-end p-5">
                {!dataForRead ? (
                  <button
                    type="button"
                    onClick={() => {
                      // setemployeeId(null);
                      dispatch(clearPreviousSalaryRevisionFetched());
                      dispatch(fetchCurrentEmpSalary(null));
                      setIds("");
                      setUser({}); // clear the external source
                      setRevisedDate(null);
                      setBasicSalary("");
                      handleReset();
                    }}
                    className="btn btn-light btn-elevate m-1"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    // onClick={onHide}
                    onClick={() => {
                      // setemployeeId(null);
                      dispatch(clearPreviousSalaryRevisionFetched());
                      dispatch(fetchCurrentEmpSalary(null));
                      setIds("");
                      setUser({}); // clear the external source
                      setRevisedDate(null);
                      setBasicSalary("");
                      handleReset();
                    }}
                    className="btn btn-primary btn-elevate"
                  >
                    OK
                  </button>
                )}

                {!dataForRead && isAccessForCreate && (
                  <button
                    type="button"
                    disabled={(!values.grossSalary && !values.grossSalary ) || !dashboard?.allDesignationByGrade}
                    // || defMapEarningDeductionList.some(obj => !obj.updatedAmount || obj.updatedAmount == 0)
                    onClick={(e) => {
                      calculateEmployeeSalaryPolicy(e, setFieldValue, values);
                      // handleSubmit();
                      setDataSaveConfirmationModal(true)

                      if (
                        values.revisedDate === null ||
                        values.revisedDate === undefined
                      ) {
                        toast.error("Please select a salary revision date");
                        return;
                      } 
                      
                      if (
                        values.Employee.designationId === null ||
                        values.Employee.designationId === undefined
                      ) {
                        toast.error("Please select a designation");
                        return;
                      }
                    }}
                    className="btn btn-primary btn-elevate m-1"
                  >
                    Save
                    {loading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                )}
              </div>
            </Form>
            <Modal.Footer>
              {/* {salaryApproverPermission && (
                !dataForRead && Boolean(id) && !Boolean(user.approved) ? (
                  <button
                    type="button"
                    onClick={() => approveSalary(id)}
                    className="btn btn-green btn-elevate"
                  >
                    Approve
                    {approveLoading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                ) : null
              )} */}

              <> </>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
