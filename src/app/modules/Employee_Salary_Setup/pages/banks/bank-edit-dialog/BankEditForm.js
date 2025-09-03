import React, { useEffect, useState } from "react";
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
} from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import axios from "axios";
import { amountLimit, amountLimitDynamic, formatDates } from "../../../../../utils/common";
import {
  DEFAULT_CALCULATION_TYPE_DROPDOWN,
  DROPDOWN,
  VALIDATION_MESSAGES,
} from "../../../../../utils/constants";
import { KeyboardArrowDown, Tune } from "@material-ui/icons";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { CirclePlus, Trash2 } from "lucide-react";
export const USERS_URL = process.env.REACT_APP_API_URL;

const formValidation = Yup.object().shape({
  employeeId: Yup.string().required(VALIDATION_MESSAGES.required),
  currencyId: Yup.string().required(VALIDATION_MESSAGES.required),
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

  emp_bankId: Yup.number().when("payment_mode_Id", {
    is: 153, // if select value is 153
    then: Yup.number().required(VALIDATION_MESSAGES.required),
    otherwise: Yup.number().notRequired(),
  }),

  emp_bank_branchId: Yup.number().when("payment_mode_Id", {
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
export function BankEditForm({
  saveEarningDeductionTran,
  user,
  actionsLoading,
  onHide,
  roles,
  centers,
  userStatusTypes,
  isUserForRead,
  values,
  enableLoading,
  loading,
  id,
  approveSalary,
  approveLoading,
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
  const [defCurrencyCodeList = null, setDefualtCurrencyCodeList] = useState(
    null
  );
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
  const [isDropdownDisabled, setDropdownDisabled] = useState(false);
  const [clearBankAccTitleField, setBankAccTitleClearField] = useState("");
  const [clearComBankAccField, setComBankAccClearField] = useState("");
  const [clearEmpBankAccField, setEmpBankAccClearField] = useState("");
  const [dropdownValue, setDropdownValue] = useState(null);
  const [defTotalAllowance, setTotaAllowance] = useState(0);
  const [defBasicSalaryFactor, setBasicSalaryFactor] = useState(0);
  const [defGrossSalary, setGrossSalary] = useState(0);
  const [defBasicSalary, setBasicSalary] = useState(0);
  const [defGrossSalaryDB, setGrossSalaryDB] = useState(0);
  const [defBasicSalaryDB, setBasicSalaryDB] = useState(0);
  const [deferrors, setErrors] = useState({});
  const [dateOfJoining, setDateOfJoining] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [dropdownData, setdropdownData] = useState(
    DEFAULT_CALCULATION_TYPE_DROPDOWN
  );
  const [currentSalaryMethod, setcurrentSalaryMethod] = useState("");
  const [salaryApproverPermission, setSalaryApproverPermission] = useState(
    false
  );

  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllActiveEmployees());

      dispatch(fetchAllActiveEmployeesSalaryForDDL(null));
      dispatch(fetchAllFormsMenu(126, "allCurrencyCodeList")); // For All currecy Codes
      //dispatch(fetchAllFormsMenu(158, "allDesignations")); // For All Designations
      dispatch(fetchAllEmpCompensationBenefitsForDDL(2));
      dispatch(fetchAllFormsMenu(150, "allPaymentModeList")); // For All Payment Codes

      dispatch(fetchAllBanks(1));
      dispatch(fetchAllCompanyBanks(1));
      // dispatch(fetchAllBankBranch(47));
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
    const emp_bank_branchId = defEmpBankBranch?.value
      ? defEmpBankBranch.value
      : user.emp_bank_branchId;
    setDefaultEmpBankBranch(
      dashboard.allBankBranch &&
        dashboard.allBankBranch.filter((item) => {
          return item.value === emp_bank_branchId;
        })
    );
  }, [user?.emp_bank_branchId, dashboard.emp_bank_branchId]);

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

    fetchEmployeeSalaryEarningList(employeeId, 0, null);
  }, [user?.employeeId, dashboard.employeeId]);

  useEffect(() => {
    const currencyId = defCurrencyCodeList?.value
      ? defCurrencyCodeList.value
      : user.currencyId;

    setDefualtCurrencyCodeList(
      dashboard.allCurrencyCodeList &&
        dashboard.allCurrencyCodeList.filter((item) => {
          return item.value === currencyId;
        })
    );
  }, [user?.currencyId, dashboard.currencyId]);

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
  }, [user?.payment_mode_Id, dashboard.payment_mode_Id]);

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

  const fetchEmployeeSalaryEarningList = async (
    empId,
    basicSalary,
    setFieldValue
  ) => {
    try {
      const response = await axios.post(
        `${USERS_URL}/employee_salary_earning/read-all-emp-earning_byId`,
        { id: empId, basicSalary: basicSalary || 0 }
      );

      if (!response?.data?.data?.[0]?.transactionType) {
        setDefaultMapEarningDeductionList([]);
      } else {
        setDefaultMapEarningDeductionList(response?.data?.data);
      }
     
      setBasicSalaryFactor(
        response?.data?.data[0]?.basicSalaryFactor ||
          response?.data?.data[0]?.basicFactor ||
          ""
      );
      setGrossSalaryDB(response?.data?.data[0]?.grossSalary || "");
      setBasicSalaryDB(response?.data?.data[0]?.basicSalary || "");
      setBasicSalary(response?.data?.data[0]?.basicSalary || "");
      setDateOfJoining(response?.data?.data[0]?.dateOfJoining || "");
      setDateOfBirth(response?.data?.data[0]?.dateOfBirth || "");
     

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
        setDefualtCurrencyCodeList(
          dashboard.allCurrencyCodeList &&
            dashboard.allCurrencyCodeList.filter((item) => {
              return item.value === currencyId;
            })
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFieldChanged = (el) => {
    const index = el.target.id.split("-")[1];
    const key = el.target.id.split("-")[0];
    setDefaultMapEarningDeductionList([
      ...defMapEarningDeductionList.map((val, ind) => {
        if (ind == index) {
          if (!(key == "factorValue" && Number(el.target.value) > 100)) {
            val[key] =
              key == "calculation_type"
                ? el.target.value
                : Number(el.target.value);
          }
        }
        return val;
      }),
    ]);
  };

  const addRow = (element) => {
    if (element.target.id == "Other") {
      setDefaultMapEarningDeductionList([
        ...defMapEarningDeductionList,
        { transactionType: "Earning", isPartOfGrossSalary: 0 },
      ]);
    } else {
      setDefaultMapEarningDeductionList([
        ...defMapEarningDeductionList,
        { transactionType: element.target.id, isPartOfGrossSalary: 1 },
      ]);
    }
  };

  const deleteRow = (element) => {
    const data = defMapEarningDeductionList;
    data.splice(element.target.id, 1);

    setDefaultMapEarningDeductionList([...data]);
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
              x.amount = (grossSalaryInput * x.factorValue) / 100;
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
            x.amount = (basicSalaryNumber * x.factorValue) / 100;
            if (x.isPartOfGrossSalary) {
              basicSalaryNumber += x.amount;
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
            basicSalaryNumber = Number(basicSalaryNumber) + x.amount;
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
            gross = Number(gross) + x.amount;
          }
          return gross; // Return the updated grossSalaryInput
        })
      );

      setFieldValue("grossSalary", gross + basicSalaryNumber);
      setGrossSalary(gross + basicSalaryNumber);
      setGrossSalaryDB(gross + basicSalaryNumber);
    }
  };

  // const totalAllowance = defMapEarningDeductionList?.reduce((prev, curr) => {
  //   return curr.transactionType == 'Earning' && curr.isPartOfGrossSalary == false ? prev + curr.amount : prev
  // }, 0) || 0;

  // The above code was written by another developer. The issue is that total earnings and other earnings are not being summed up correctly.
  // So I have updated the below code"

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
        !objValidate.amount &&
        objValidate.calculation_type == "Fixed Amount"
      ) {
        newErrors[`amount-${index}`] = VALIDATION_MESSAGES.required;
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

  const fetchBranch = (bankId) => {
    dispatch(fetchAllBankBranch(bankId));
  };

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

 console.log("dateOfJoining111",dateOfJoining)

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          const validationErrors = validate();

          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
          } else {
            enableLoading();
            saveEarningDeductionTran(
              {
                ...values,
                
                 gratuity_startDate: values.gratuity_startDate
                    ? formatDates(values.gratuity_startDate, "dd-MMM-yyyy")
                    : null,
                     eobi_reg_date: values.eobi_reg_date
                    ? formatDates(values.eobi_reg_date, "dd-MMM-yyyy")
                    : null, 
                      social_security_reg_date: values.social_security_reg_date
                    ? formatDates(values.social_security_reg_date, "dd-MMM-yyyy")
                    : null,
                basicFactor: defBasicSalaryFactor,
                grossPackage:
                  values.grossSalary > 0
                    ? Number(values.grossSalary) + Number(totalGross)
                    : Number(defGrossSalary) + Number(totalGross),
              },
              defMapEarningDeductionList
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
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <fieldset disabled={isUserForRead}>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1">
                    <div>
                      <SearchSelect
                        name="employeeId"
                        label={
                          <span>
                            {" "}
                            Employee<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={user.employeeId && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("employeeId", e.value || null);
                          setEmployeeDefault(e);
                          handleChanged(e, setFieldValue);
                          dispatch(fetchAllEarningList(1, "", e.value, true));
                          dispatch(fetchAllDeductionList(2, "", e.value));
                          //  dispatch(fetchAllActiveEmployees(e.value));
                        }}
                        value={
                          (user.employeeId &&
                            dashboard.allEmployeesSalaryDDL &&
                            dashboard.allEmployeesSalaryDDL.filter((item) => {
                              return item.value === user.employeeId;
                            })) ||
                          defEmployee ||
                          null
                        }
                        error={errors.employeeId}
                        touched={touched.employeeId}
                        options={dashboard.allEmployeesSalaryDDL}
                      />
                    </div>
                    <div>
                      <SearchSelect
                        name="currencyId"
                        label={
                          <span>
                            {" "}
                            Currency<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("currencyId", e.value);
                          setDefualtCurrencyCodeList(e);
                          // dispatch(fetchAllBanks(e.value));
                        }}
                        value={defCurrencyCodeList}
                        error={errors.currencyId}
                        touched={touched.currencyId}
                        options={dashboard.allCurrencyCodeList}
                      />
                    </div>

                    <div>
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
                        disabled={
                          !currentSalaryMethod ||
                          currentSalaryMethod == "Basic to Gross"
                        }
                        value={defGrossSalaryDB || ""}
                        onChange={(e) => {
                          setGrossSalaryDB(e);
                          setFieldValue("grossSalary", e);
                        }}
                      />
                    </div>

                    <div>
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
                    <div>
                      <Field
                        name="basicSalaryFactor"
                        type="number"
                        disabled
                        value={defBasicSalaryFactor}
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
                  </div>
                  <div className="mt-3 text-right">
                    <input
                      type="button"
                      class="btn btn-primary btn-elevate"
                      onClick={(e) =>
                        calculateEmployeeSalaryPolicy(e, setFieldValue, values)
                      }
                      id="btnSalaryPolicyCalc"
                      value="Calculate"
                    ></input>
                  </div>
                  <hr />
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
                            <td>Earning</td>
                            <td>Calculation Type</td>
                            <td>Factor</td>
                            <td>Amount</td>
                            <td className="text-right">Action</td>
                          </tr>
                          {defMapEarningDeductionList?.map(
                            (obj, rightindex) =>
                              obj.transactionType == "Earning" &&
                              obj.isPartOfGrossSalary == true && (
                                <>
                                  <tr>
                                    <td>
                                      <select
                                        disabled={Boolean(currentSalaryMethod)}
                                        className="form-control"
                                        onChange={(e) => {
                                          handleFieldChanged(e);
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`earning_deduction_id-${rightindex}`]: "",
                                          })); // Clear error on change
                                        }}
                                        id={
                                          "earning_deduction_id-" + rightindex
                                        }
                                        value={obj.earning_deduction_id}
                                      >
                                        <option value="-1"> Select</option>
                                        {dashboard.allEarnings?.map((x) => {
                                          return (
                                            <option
                                              disabled={
                                                defMapEarningDeductionList.find(
                                                  (el) =>
                                                    el.earning_deduction_id ==
                                                    x.value
                                                )
                                                  ? true
                                                  : false
                                              }
                                              value={x.value}
                                            >
                                              {" "}
                                              {x.label}{" "}
                                            </option>
                                          );
                                        })}
                                      </select>
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
                                      <select
                                        className="form-control"
                                        value={obj.calculation_type}
                                        disabled={Boolean(currentSalaryMethod)}
                                        onChange={(e) => {
                                          handleFieldChanged(e);
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`calculation_type-${rightindex}`]: "",
                                          })); // Clear error on change

                                          if (
                                            e.target.value == "Fixed Amount"
                                          ) {
                                            obj.factorValue = 0;
                                          } else {
                                            obj.amount = 0;
                                          }
                                        }}
                                        id={"calculation_type-" + rightindex}
                                      >
                                        {createDropdown(dropdownData || [])}
                                      </select>
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
                                    {/* <td>{obj.transactionType}</td> */}
                                    <td>
                                      <input
                                        className="form-control"
                                        disabled
                                        type="number"
                                        onChange={(e) => {
                                          handleFieldChanged(e);
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`factorValue-${rightindex}`]: "",
                                          })); // Clear error on change
                                        }}
                                        value={obj.factorValue}
                                        id={"factorValue-" + rightindex}
                                      ></input>
                                      {deferrors[
                                        `factorValue-${rightindex}`
                                      ] && (
                                        <div className="form-feedBack">
                                          {
                                            deferrors[
                                              `factorValue-${rightindex}`
                                            ]
                                          }
                                        </div>
                                      )}
                                    </td>
                                    <td>
                                      <AmountInput
                                        className="form-control"
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
                                    <td
                                      className="text-right"
                                      id={rightindex}
                                      onClick={
                                        !Boolean(currentSalaryMethod) &&
                                        deleteRow
                                      }
                                    >
                                      {!Boolean(currentSalaryMethod) && (
                                        <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                      )}{" "}
                                    </td>
                                  </tr>
                                </>
                              )
                          )}
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* For Earning WIth Payroll Include ByDefault No  */}
                  <hr />
                  <div>
                    <div className="flex justify-between items-center">
                      <h6 className="font-bold mb-0 text-primary">
                        Other Earnings{"  "}
                      </h6>
                      <button
                        type="button"
                        className="btn btn-primary"
                        id="Other"
                        onClick={addRow}
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
                            <td>Earning</td>
                            <td>Calculation Type</td>
                            <td>Factor</td>
                            <td>Amount</td>
                            <td className="text-right">Action</td>
                          </tr>
                          {defMapEarningDeductionList?.map(
                            (obj, rightindex) =>
                              obj.transactionType == "Earning" &&
                              obj.isPartOfGrossSalary == false && (
                                <>
                                  <tr>
                                    <td>
                                      <select
                                        className="form-control"
                                        onChange={(e) => {
                                          handleFieldChanged(e);
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`earning_deduction_id-${rightindex}`]: "",
                                          })); // Clear error on change
                                        }}
                                        // onChange={handleFieldChanged}

                                        id={
                                          "earning_deduction_id-" + rightindex
                                        }
                                        value={obj.earning_deduction_id}
                                      >
                                        <option value="-1"> Select</option>
                                        {dashboard.allEarnings?.map((x) => {
                                          return (
                                            <option
                                              disabled={
                                                defMapEarningDeductionList.find(
                                                  (el) =>
                                                    el.earning_deduction_id ==
                                                    x.value
                                                )
                                                  ? true
                                                  : false
                                              }
                                              value={x.value}
                                            >
                                              {" "}
                                              {x.label}{" "}
                                            </option>
                                          );
                                        })}
                                      </select>
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
                                      <select
                                        className="form-control"
                                        value={obj.calculation_type}
                                        onChange={(e) => {
                                          handleFieldChanged(e);
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`calculation_type-${rightindex}`]: "",
                                          })); // Clear error on change

                                          if (
                                            e.target.value == "Fixed Amount"
                                          ) {
                                            obj.factorValue = 0;
                                          } else {
                                            obj.amount = 0;
                                          }
                                        }}
                                        id={"calculation_type-" + rightindex}
                                      >
                                        {createDropdown(dropdownData || [])}
                                        {/* <option value="-1">Select</option>
                              <option value="% Of Gross">% Of Gross</option>
                              <option value="Fixed Amount">Fixed Amount</option> */}
                                      </select>
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
                                    {/* <td>{obj.transactionType}</td> */}
                                    <td>
                                      <input
                                        className="form-control"
                                        disabled={
                                          obj.calculation_type == "Fixed Amount"
                                        }
                                        type="number"
                                        onChange={(e) => {
                                          handleFieldChanged(e);
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`factorValue-${rightindex}`]: "",
                                          })); // Clear error on change
                                        }}
                                        value={obj.factorValue}
                                        id={"factorValue-" + rightindex}
                                      ></input>
                                      {deferrors[
                                        `factorValue-${rightindex}`
                                      ] && (
                                        <div className="form-feedBack">
                                          {
                                            deferrors[
                                              `factorValue-${rightindex}`
                                            ]
                                          }
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
                                                  ? {
                                                      ...item,
                                                      amount: Number(e),
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
                                          obj.calculation_type ==
                                            "% Of Gross" ||
                                          obj.calculation_type == "% Of Basic"
                                        }
                                        value={obj.amount}
                                      />
                                      {deferrors[`amount-${rightindex}`] && (
                                        <div className="form-feedBack">
                                          {deferrors[`amount-${rightindex}`]}
                                        </div>
                                      )}
                                    </td>
                                    <td
                                      className="text-right"
                                      id={rightindex}
                                      onClick={deleteRow}
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
                  </div>
                  <hr />
                  <div>
                    <div className="flex justify-between items-center">
                      <h6 className="font-bold mb-0 text-primary">
                        Deductions{"  "}
                      </h6>
                      <button
                        type="button"
                        className="btn btn-primary"
                        id="Deduction"
                        onClick={addRow}
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
                            <td>Deduction</td>
                            <td>Calculation Type</td>
                            <td>Factor</td>
                            <td>Amount</td>
                            <td className="text-right">Action</td>
                          </tr>
                          {defMapEarningDeductionList?.map(
                            (obj, rightindex) =>
                              obj.transactionType == "Deduction" && (
                                <>
                                  <tr>
                                    <td>
                                      <select
                                        className="form-control"
                                        onChange={(e) => {
                                          handleFieldChanged(e);
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`earning_deduction_id-${rightindex}`]: "",
                                          })); // Clear error on change
                                        }}
                                        id={
                                          "earning_deduction_id-" + rightindex
                                        }
                                        value={obj.earning_deduction_id}
                                      >
                                        <option value="-1"> Select</option>
                                        {dashboard.allDeductions?.map((x) => {
                                          return (
                                            <option
                                              disabled={
                                                defMapEarningDeductionList.find(
                                                  (el) =>
                                                    el.earning_deduction_id ==
                                                    x.value
                                                )
                                                  ? true
                                                  : false
                                              }
                                              value={x.value}
                                            >
                                              {" "}
                                              {x.label}{" "}
                                            </option>
                                          );
                                        })}
                                      </select>
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
                                      <select
                                        className="form-control"
                                        value={obj.calculation_type}
                                        onChange={(e) => {
                                          handleFieldChanged(e);
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`calculation_type-${rightindex}`]: "",
                                          })); // Clear error on change
                                        }}
                                        id={"calculation_type-" + rightindex}
                                      >
                                        {createDropdown(dropdownData || [])}
                                      </select>
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
                                    {/* <td>{obj.transactionType}</td> */}
                                    <td>
                                      <input
                                        className="form-control"
                                        disabled={
                                          obj.calculation_type == "Fixed Amount"
                                        }
                                        type="number"
                                        onChange={(e) => {
                                          handleFieldChanged(e);
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`factorValue-${rightindex}`]: "",
                                          })); // Clear error on change
                                        }}
                                        value={obj.factorValue}
                                        id={"factorValue-" + rightindex}
                                      ></input>
                                      {deferrors[
                                        `factorValue-${rightindex}`
                                      ] && (
                                        <div className="form-feedBack">
                                          {
                                            deferrors[
                                              `factorValue-${rightindex}`
                                            ]
                                          }
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
                                                  ? {
                                                      ...item,
                                                      amount: Number(e),
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
                                          obj.calculation_type ==
                                            "% Of Gross" ||
                                          obj.calculation_type == "% Of Basic"
                                        }
                                        value={obj.amount}
                                      />

                                      {deferrors[`amount-${rightindex}`] && (
                                        <div className="form-feedBack">
                                          {deferrors[`amount-${rightindex}`]}
                                        </div>
                                      )}
                                    </td>
                                    <td
                                      className="text-right"
                                      id={rightindex}
                                      onClick={deleteRow}
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
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-3 gap-y-1 md:grid-cols-8 rtl">
                    <div className="col-span-1 col-start-1 sm:col-start-4 md:col-start-7 grid grid-col-1 gap-y-1 gap-x-1">
                      <div>
                        <AmountInput
                          field={{
                            name: `grossSalary`,
                            value:
                              values.grossSalary > 0
                                ? Number(values.grossSalary) +
                                  Number(totalGross)
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
                    </div>
                    <div className="col-span-1 col-start-2 sm:col-start-5 md:col-start-8 grid grid-col-1 gap-y-1 gap-x-1">
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
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("payment_mode_Id", e.value || null);
                          setDefualtPaymentModeCodeList(e);
                        }}
                        value={defPaymentModeList || null}
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
                          setDefaultBanks(e);
                          dispatch(fetchAllBanks(e.value));
                          fetchBranch(e.value);
                        }}
                        value={
                          !checkReadOnlyStatus(values, [151, 152])
                            ? defBank
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
                          dispatch(fetchAllBankBranch(e.value));
                        }}
                        value={
                          !checkReadOnlyStatus(values, [151, 152])
                            ? defEmpBankBranch
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
                          e.target.value = amountLimitDynamic(
                            e.target.value,
                            15
                          ); // Limit to 3 digits
                        }}
                        // value={clearEmpBankAccField}
                        //onChange={(e) => setEmpBankAccClearField(e.target.value)}
                        placeholder="Enter Bank Account No"
                        label={<span>Bank Account No</span>}
                        autoComplete="off"
                      />
                      {/* <ErrorMessage className="form-feedBack" name="emp_bank_accNo" component="div" /> */}
                    </div>

                    <div>
                      <Field
                        name="emp_bank_accountTitle"
                        disabled={checkReadOnlyStatus(values, [151])}
                        value={
                          !checkReadOnlyStatus(values, [151])
                            ? values.emp_bank_accountTitle
                            : ""
                        }
                        onChange={(e) => {
                          setFieldValue(
                            "emp_bank_accountTitle",
                            e.target.value
                          );
                          setBankAccTitleClearField(e.target.value);
                        }}
                        component={Input}
                        placeholder="Enter Bank Account Title"
                        label={<span> Bank Account Title</span>}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <hr />
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
                              disabled={isUserForRead}
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
                            // showTimeInput
                            name="gratuity_startDate"
                            autoComplete="off"
                            disabled={!values.gratuity_member || isUserForRead}
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
                              disabled={isUserForRead}
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
                                !Boolean(values.overtime_allowance) ||
                                isUserForRead
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
                                !Boolean(values.overtime_allowance) ||
                                isUserForRead
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
                                !Boolean(values.overtime_allowance) ||
                                isUserForRead
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
                              disabled={isUserForRead}
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
                              // showTimeInput
                              name="eobi_reg_date"
                              autoComplete="off"
                              disabled={!values.eobi_member || isUserForRead}
                            
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
                              disabled={!values.eobi_member || isUserForRead}
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
                              disabled={isUserForRead}
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
                                values.social_security_member &&
                                defSocialSecurity
                              }
                              onChange={(date) => {
                                setFieldValue("social_security_reg_date", date);
                                setSocialSecurityDate(date);
                              }}
                              timeInputLabel="Time:"
                              dateFormat="dd-MMM-yyyy"
                              // showTimeInput
                              name="social_security_reg_date"
                              autoComplete="off"
                              disabled={
                                !values.social_security_member || isUserForRead
                              }
                               minDate={
                                    dateOfBirth
                                      ? new Date(dateOfBirth)
                                      : null
                                  }
                            
                              // value = {values.dateOfJoining}
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
                                !values.social_security_member || isUserForRead
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {salaryApproverPermission &&
                (!isUserForRead && Boolean(id) && !Boolean(user.approved) ? (
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
                ) : null)}

              {!isUserForRead ? (
                <button
                  type="button"
                  onClick={onHide}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onHide}
                  className="btn btn-primary btn-elevate"
                >
                  OK
                </button>
              )}

              <> </>
              {!isUserForRead && (
                <button
                  type="submit"
                  onClick={() => handleSubmit()}
                  className="btn btn-primary btn-elevate"
                >
                  Save
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              )}
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
