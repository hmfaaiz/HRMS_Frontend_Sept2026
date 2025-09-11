import React, { useEffect, useState, useMemo } from "react";
import { Accordion, Button, Card, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
  fetchAllDeductionList,
  fetchAllEarningList,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
// // import { CheckBox } from "@material-ui/icons";
import axios from "axios";
import { amountLimit } from "../../../../../utils/common";
import { DROPDOWN, VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { KeyboardArrowDown } from "@material-ui/icons";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { CirclePlus, Trash2 } from "lucide-react";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
export const USERS_URL = process.env.REACT_APP_API_URL;

const formValidation = Yup.object().shape({
  subsidiaryId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  gradeId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  employeeTypeId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  currencyId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  salaryMethod: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .notOneOf(["-1"], VALIDATION_MESSAGES.required),

  //   salaryMethod: Yup.string()
  //   .required('Required*') // Make it required
  // .notOneOf(['-1'], 'Please select a valid salary method'),

  basicFactor: Yup.string()
    .max(100, "Value cannot be greater than 100")
    .when("salaryMethod", {
      is: "Gross to Basic", // if select value is 2
      then: Yup.string().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.string().notRequired(),
    }),

  overtime_working_day: Yup.number()
    .max(100, "Value cannot be greater than 100")
    .min(0, "Value cannot be less than 0")
    .when("overtime_allowance", {
      is: (value) => value === true || value == 1,
      then: Yup.number().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().notRequired(),
    }),
  overtime_off_day: Yup.number()
    .max(100, "Value cannot be greater than 100")
    .min(0, "Value cannot be less than 0")
    .when("overtime_allowance", {
      is: (value) => value === true || value == 1,
      then: Yup.number().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().notRequired(),
    }),
  overtime_holiday: Yup.number()
    .max(100, "Value cannot be greater than 100")
    .min(0, "Value cannot be less than 0")
    .when("overtime_allowance", {
      is: (value) => value === true || value == 1,
      then: Yup.number().required(VALIDATION_MESSAGES.required),
      otherwise: Yup.number().notRequired(),
    }),
});
export function BankEditForm({
  saveCompensationBenefits,
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
}) {
  const { dashboard } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [defEffectiveDate, setEffectiveDate] = useState(null);
  const [defEmployeeGrade = null, setDefualtEmployeeGrade] = useState(null);
  const [defCurrencyCodeList = null, setDefualtCurrencyCodeList] = useState(
    null
  );
  const [defchildEmptypeMenus = null, setDefaultChildEmpTypeMenus] = useState(
    null
  );
  const [defEarningList = null, setDefaultEarningList] = useState([]);
  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);
  const [deferrors, setErrors] = useState({});
  const [defAllowanceLimit, setDefaultAllowanceLimit] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [salaryMethodDisabled, setsalaryMethodDisabled] = useState(true);

  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(126, "allCurrencyCodeList")); // For All currecy Codes
      dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList")); // For All Grade Codes
      dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus")); // For EmployeeType
      // dispatch(fetchAllEarningList(1)); // For Earning
      // dispatch(fetchAllDeductionList(2)); // For deduction
      // dispatch(fetchAllFormsMenu(133, "allSubsidiaryList")); // For All Subsisidaries
    }
  }, [dispatch]);

  const fetchCompensationEarningDeductionList = async (compensationId) => {
    try {
      if (id != undefined) {
        const response = await axios.post(
          `${USERS_URL}/compensation/read-all-compensation-ed-heads`,
          { Id: compensationId || 0 }
        );

        setDefaultEarningList(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getSalaryMethod = async (subsidiaryId, setFieldValue) => {
    const response = await axios.post(
      `${USERS_URL}/policy/read-policy-by-subsidiaryId`,
      { subsidiaryId: subsidiaryId || 0 }
    );
    const salaryMethod = response?.data?.data?.[0].salaryMethod;
    if (salaryMethod) {
      setFieldValue("salaryMethod", salaryMethod);
      setsalaryMethodDisabled(true);
      if (salaryMethod == "Basic to Gross") {
        setFieldValue("basicFactor", "");
        setDefaultAllowanceLimit("");
      }
    } else {
      setsalaryMethodDisabled(false);
      setFieldValue("salaryMethod", "");
    }
  };

  useEffect(() => {
    const emptypeId = defchildEmptypeMenus?.value
      ? defchildEmptypeMenus.value
      : user.employeeTypeId;
    setDefaultChildEmpTypeMenus(
      dashboard.allEmpTypeChildMenus &&
        dashboard.allEmpTypeChildMenus.filter((item) => {
          return item.value === emptypeId;
        })
    );
  }, [user?.employeeTypeId, dashboard.employeeTypeId]);
  //======================= End

  useEffect(() => {
    const subsidiaryId = defSubsidiary?.value
      ? defSubsidiary.value
      : user.subsidiaryId;
    dispatch(fetchAllEarningList(1, subsidiaryId, "", true)); // For Earning
    dispatch(fetchAllDeductionList(2, subsidiaryId)); // For deduction
    setDefualtSubsidiaryList(
      dashboard.allSubsidiaryList &&
        dashboard.allSubsidiaryList.filter((item) => {
          return item.value === subsidiaryId;
        })
    );
  }, [user?.subsidiaryId, dashboard.subsidiaryId]);

  useEffect(() => {
    const gradeId = defEmployeeGrade?.value
      ? defEmployeeGrade.value
      : user.gradeId;
    setDefualtEmployeeGrade(
      dashboard.allEmployeeGradeList &&
        [{ label: "All", value: -1 }, ...dashboard.allEmployeeGradeList].filter(
          (item) => {
            return item.value === gradeId;
          }
        )
    );
    fetchCompensationEarningDeductionList(user.Id);
  }, [user?.gradeId, dashboard.gradeId]);

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

  const handleChanged = (e) => {
    const newValue = e.value;

    fetchCompensationEarningDeductionList(50);
  };

  //===== Date Of End Date
  useEffect(() => {
    if (user.effective_date) {
      setEffectiveDate(new Date(user.effective_date));
    }
  }, [user.effective_date]);

  //=========== END

  // const addRow = (element) => {
  //   setDefaultEarningList([
  //     ...defEarningList,
  //     { transactionType: element.target.id, isPartOfGrossSalary: 1 },
  //   ]);
  // };

  // 11-9-2025

  const addRow = (element) => {
  const type = element.target.id;

  // sirf Earning ya Deduction allow karo
  if (type !== "Earning" && type !== "Deduction") {
    console.warn("Invalid transactionType, row not added:", type);
    return;
  }

  setDefaultEarningList((prev) => [
    ...prev,
    {
      transactionType: type,
      isPartOfGrossSalary: 1,
      earning_deduction_id: "",
      calculation_type: "",
      amount: 0,
      factorValue: 0,
    },
  ]);
};


  // wrong deletion
  // const deleteRow = (element) => {
  //   const data = defEarningList;
  //   data.splice(element.target.id, 1);
  //   setDefaultEarningList([...data]);
  // };



  const deleteRow = (rowIndex) => {
  setDefaultEarningList((prev) => prev.filter((_, idx) => idx !== rowIndex));
};


  // Fetch record from database by ID

  const handleFieldChanged = (el) => {
    const index = el.target.id.split("-")[1];
    const key = el.target.id.split("-")[0];

    setDefaultEarningList([
      ...defEarningList.map((val, ind) => {
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



  const validate = () => {
    const newErrors = {};
    defEarningList.forEach((objValidate, index) => {
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

  const handleModalClose = () => {
    setFormValues(null);
    setShowModal(false);
  };
  const handleModalYes = () => {
    setDefaultAllowanceLimit("");
    enableLoading();
    saveCompensationBenefits(
      formValues,
      defEarningList,
      dashboard.allEmployeeGradeList
    );
    setShowModal(false);
    setFormValues(null);
  };

  return (
    <>
      {/* Confirmation Modal */}
      {
        <Modal
          show={showModal}
          onHide={handleModalClose}
          style={{ zIndex: "99999" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure to save the records? System will overwrite all the
            created data of selected combination
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              No
            </Button>
            <Button variant="primary" onClick={handleModalYes}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      }
      {/* Confirmation Modal */}
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          const validationErrors = validate();
           {console.log("aaaaaaa22222",validationErrors)}
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
          } else {
            if (values.salaryMethod == "Gross to Basic") {
              let i = 0;
              i = Number(values.basicFactor || 0);
              defEarningList.forEach((element, index) => {
                if (
                  element.factorValue > 0 &&
                  element.isPartOfGrossSalary == "1" &&
                  element.transactionType == "Earning"
                ) {
                  i += Number(element.factorValue || 0);
                }
              });
              if (i == 100) {
                if (values.gradeId == "all") {
                  setFormValues(values);
                  setShowModal(true);
                } else {
                  setDefaultAllowanceLimit("");
                  enableLoading();
                  saveCompensationBenefits(
                    values,
                    defEarningList,
                    dashboard.allEmployeeGradeList
                  );
                }
              } else {
                setDefaultAllowanceLimit("Allowance must be exactly 100%.");
              }
            } else if (values.salaryMethod == "Basic to Gross") {
              if (values.gradeId == "all") {
                setFormValues(values);
                setShowModal(true);
              } else {
                setDefaultAllowanceLimit("");
                enableLoading();
                saveCompensationBenefits(
                  values,
                  defEarningList,
                  dashboard.allEmployeeGradeList
                );
              }
            }
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
          formik,
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {console.log("aaaaaaa1111",errors)}
              <Form className="form form-label-right">
                <fieldset disabled={isUserForRead}>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                    <div>
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            {" "}
                            Subsidiary
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={(isUserForRead || Boolean(id)) && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                          setDefualtSubsidiaryList(e);
                          dispatch(fetchAllEarningList(1, e.value, "", true)); // For Earning
                          dispatch(fetchAllDeductionList(2, e.value));
                          setDefaultEarningList([]);
                          getSalaryMethod(e.value, setFieldValue);
                          //handlePaymenModeChanged(e)
                        }}
                        value={defSubsidiary || null}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                        options={dashboard.allSubsidiaryList}
                      />
                      {/* <SubsidiarySelect
                        name="subsidiaryId"
                        label={
                          <span>
                            {" "}
                            Subsidiary
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={(isUserForRead || Boolean(id)) && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                          setDefualtSubsidiaryList(e);
                          dispatch(fetchAllEarningList(1, e.value, "", true)); // For Earning
                          dispatch(fetchAllDeductionList(2, e.value));
                          setDefaultEarningList([]);
                          getSalaryMethod(e.value, setFieldValue);
                          //handlePaymenModeChanged(e)
                        }}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                        currentValue={values?.subsidiaryId}
                        initializeSubsidiary={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                          setDefualtSubsidiaryList(e);
                          dispatch(fetchAllEarningList(1, e.value, "", true)); // For Earning
                          dispatch(fetchAllDeductionList(2, e.value));
                          setDefaultEarningList([]);
                          getSalaryMethod(e.value, setFieldValue);
                        }}
                      /> */}
                      {/* <ErrorMessage className="form-feedBack" name="subsidiaryId" component="div" /> */}
                    </div>

                    <div>
                      <SearchSelect
                        name="gradeId"
                        label={
                          <span>
                            {" "}
                            Grade<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={(isUserForRead || Boolean(id)) && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("gradeId", e.value || null);
                          setDefualtEmployeeGrade(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={defEmployeeGrade || null}
                        error={errors.gradeId}
                        touched={touched.gradeId}
                        options={[
                          { label: "All", value: -1 },
                          ...dashboard.allEmployeeGradeList,
                        ]}
                      />
                    </div>
                    <div>
                      <SearchSelect
                        name="employeeTypeId"
                        label={
                          <span>
                            {" "}
                            Employee Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={(isUserForRead || Boolean(id)) && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("employeeTypeId", e.value || null);
                          setDefaultChildEmpTypeMenus(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={defchildEmptypeMenus || null}
                        error={errors.employeeTypeId}
                        touched={touched.employeeTypeId}
                        options={dashboard.allEmpTypeChildMenus}
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
                        isDisabled={(isUserForRead || Boolean(id)) && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("currencyId", e.value || null);
                          setDefualtCurrencyCodeList(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                          handleChanged(e);
                        }}
                        value={defCurrencyCodeList || null}
                        error={errors.currencyId}
                        touched={touched.currencyId}
                        options={dashboard.allCurrencyCodeList}
                      />
                    </div>
                    <div>
                      <Select
                        label={
                          <span>
                            {" "}
                            Salary Method<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        name="salaryMethod"
                        defaultValue="Gross to Basic"
                        value={values.salaryMethod}
                        onChange={(e) => {
                          setFieldValue("salaryMethod", e.target.value);
                          if (e.target.value == "Basic to Gross") {
                            setFieldValue("basicFactor", "");
                            setDefaultAllowanceLimit("");
                          }
                          setDefaultEarningList([]);
                        }}
                        error={errors.salaryMethod}
                        touched={touched.salaryMethod}
                        onBlur={handleBlur}
                        style={{ display: "block" }}
                        autoComplete="off"
                        disabled={salaryMethodDisabled}
                      >
                        <option value="-1" label="Select" />
                        <option
                          selected
                          value="Gross to Basic"
                          label="Gross to Basic"
                        />
                        <option value="Basic to Gross" label="Basic to Gross" />
                      </Select>
                      {errors.salaryMethod && touched.salaryMethod && (
                        <ErrorMessage
                          className="form-feedBack"
                          name="salaryMethod"
                          component="div"
                        />
                      )}
                    </div>
                    <div>
                      <Field
                        name="basicFactor"
                        component={Input}
                        maxLength={2}
                        placeholder="Enter Basic Factor"
                        disabled={values.salaryMethod == "Basic to Gross"}
                        label={
                          <span>
                            {" "}
                            Basic Factor
                            {Boolean(
                              values.salaryMethod != "Basic to Gross"
                            ) && <span style={{ color: "red" }}>*</span>}
                          </span>
                        }
                        autoComplete="off"
                        error={errors.currencyId}
                        touched={touched.currencyId}
                      />
                      {/* <ErrorMessage className="form-feedBack" name="basicFactor" component="div" /> */}
                    </div>
                  </div>
                  <hr />
                  <div>
                    <div className="flex justify-between items-center">
                      <h6 className="font-bold mb-0 text-primary">
                        Earnings{"  "}
                      </h6>
                      <button
                        type="button"
                        className="btn btn-primary"
                        id="Earning"
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
                            <td>Earning</td>
                            <td>Caculation Type</td>
                            <td>Factor</td>
                            <td>Amount</td>
                            <td>Part Of Gross Salary</td>
                            <td className="text-right">Action</td>
                          </tr>
                          {defEarningList?.map(
                            (obj, rightindex) =>
                              obj.transactionType == "Earning" && (
                                <>
                                  <tr>
                                    {/* <td id={rightindex} onClick={deleteRow}>
                                      {" "}
                                      Delete
                                    </td> */}
                                    <td>
                                      <select
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
                                        className="form-control"
                                        value={obj.earning_deduction_id}
                                      >
                                        <option value="-1"> Select</option>
                                        {dashboard.allEarnings?.map((x) => {
                                          return (
                                            <option
                                              disabled={
                                                defEarningList.find(
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
                                    {/* <td>
                            {obj.earningName}
                          </td> */}
                                    <td>
                                      <select
                                        value={obj.calculation_type}
                                        className="form-control"
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
                                        {createDropdown(
                                          DROPDOWN[values.salaryMethod] || []
                                        )}
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
                                    {/* <td>{obj.calculation_type}</td> */}
                                    <td>
                                      {
                                        <input
                                          name="basicFactorEarn"
                                          disabled={
                                            obj.calculation_type ==
                                            "Fixed Amount"
                                          }
                                          className="form-control"
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
                                      }
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
                                          onChange: () => {},
                                        }}
                                        form={{
                                          touched: {},
                                          errors: {},
                                          setFieldValue: (field, value) => {
                                            setDefaultEarningList((list) =>
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
                                        className="form-control"
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
                                    <td>
                                      <select
                                        value={obj.isPartOfGrossSalary}
                                        className="form-control"
                                        onChange={handleFieldChanged}
                                        id={"isPartOfGrossSalary-" + rightindex}
                                      >
                                        <option selected value="-1">
                                          Select
                                        </option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                      </select>
                                    </td>
                                    <td id={rightindex} className="text-right">
                                      <button
                                        className="border-none bg-transparent"
                                        type="button"
                                        onClick={() => deleteRow(rightindex)}
                                      >
                                        <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                      </button>
                                    </td>
                                  </tr>
                                </>
                              )
                          )}
                        </table>
                      </div>
                      <span className="invalid-feedback" id="msgLimitAllowance">
                        {defAllowanceLimit}
                      </span>
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
                        <table class=" table table-head-custom table-vertical-center overflow-hidden table-hover">
                          <tr className="custom-table-header">
                            {/* <td>Employee</td> */}
                            <td>Deduction</td>
                            <td>Calculation Type</td>
                            <td>Factor</td>
                            <td>Amount</td>
                            <td className="text-right">Action</td>
                            {/* <td>Part Of Gross Salary</td> */}
                          </tr>
                          {defEarningList?.map(
                            (obj, rightindex) =>
                              obj.transactionType == "Deduction" && (
                                <>
                                  <tr>
                                    {/* <td id={rightindex} onClick={deleteRow}>
                                  {" "}
                                  Delete
                                </td> */}

                                    <td>
                                      {" "}
                                      <select
                                        className="form-control"
                                        onChange={handleFieldChanged}
                                        id={
                                          "earning_deduction_id-" + rightindex
                                        }
                                        value={obj.earning_deduction_id}
                                      >
                                        <option value="-1">Select</option>
                                        {dashboard.allDeductions?.map((x) => {
                                          return (
                                            <option
                                              disabled={
                                                defEarningList.find(
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
                                        className="form-control"
                                        id={"calculation_type-" + rightindex}
                                      >
                                        {createDropdown(
                                          DROPDOWN[values.salaryMethod] || []
                                        )}
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

                                    <td>
                                      <input
                                        className="form-control"
                                        type="number"
                                        onChange={handleFieldChanged}
                                        disabled={
                                          obj.calculation_type == "Fixed Amount"
                                        }
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
                                          onChange: () => {},
                                        }}
                                        form={{
                                          touched: {},
                                          errors: {},
                                          setFieldValue: (field, value) => {
                                            setDefaultEarningList((list) =>
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
                                    <td id={rightindex} className="text-right">
                                      <button
                                        className="border-none bg-transparent"
                                        type="button"
                                        onClick={() => deleteRow(rightindex)}
                                      >
                                        <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                      </button>
                                    </td>
                                  </tr>
                                </>
                              )
                          )}
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* <div
                    style={{
                      backgroundColor: "rgb(235 243 255)",
                      padding: "20px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                    }}
                  >
                    <h6>Deductions</h6>
                    <table class=" table table-head-custom table-vertical-center overflow-hidden table-hover">
                      <tr style={{ backgroundColor: "#4d5f7a", color: "#fff" }}>
                        <td></td>
                        <td>Deduction</td>
                        <td>Calculation Type</td>
                        <td>Factor</td>
                        <td>Amount</td>
                      </tr>
                      {defEarningList?.map(
                        (obj, rightindex) =>
                          obj.transactionType == "Deduction" && (
                            <>
                              <tr>

                                <td>
                                  {" "}
                                  <select
                                    style={{ width: "200px" }}
                                    onChange={handleFieldChanged}
                                    id={"earning_deduction_id-" + rightindex}
                                    value={obj.earning_deduction_id}
                                  >
                                    <option value="-1">Select</option>
                                    {dashboard.allDeductions?.map((x) => {
                                      return (
                                        <option
                                          disabled={
                                            defEarningList.find(
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
                                    value={obj.calculation_type}
                                    onChange={(e) => {
                                      handleFieldChanged(e);
                                      setErrors((prev) => ({
                                        ...prev,
                                        [`calculation_type-${rightindex}`]: "",
                                      })); // Clear error on change

                                      if (e.target.value == "Fixed Amount") {
                                        obj.factorValue = 0;
                                      } else {
                                        obj.amount = 0;
                                      }
                                    }}
                                    id={"calculation_type-" + rightindex}
                                  >
                                    {createDropdown(
                                      DROPDOWN[values.salaryMethod] || []
                                    )}
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

                                <td>
                                  <input
                                    style={{ width: "80px" }}
                                    type="number"
                                    onChange={handleFieldChanged}
                                    disabled={
                                      obj.calculation_type == "Fixed Amount"
                                    }
                                    value={obj.factorValue}
                                    id={"factorValue-" + rightindex}
                                  ></input>
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
                                        setDefaultEarningList((list) =>
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
                                    disabled={
                                      obj.calculation_type == "% Of Gross" ||
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
                              </tr>
                            </>
                          )
                      )}
                    </table>
                    <input
                      type="button"
                      id="Deduction"
                      onClick={addRow}
                      value="+Add"
                    ></input>
                  </div> */}

                  <hr />

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
                          > */}
                  <h6 className="font-bold mb-0 text-primary">Entitlements</h6>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                    <div className="col-span-2 text-black mt-1">
                      <label>Earning</label>
                      <div
                        className="grid grid-cols-1 gap-x-3 gap-y-1"
                        style={{
                          fontSize: "10.2px",
                          // fontWeight: "bold",
                          // padding: "2px",
                        }}
                      >
                        <div className="flex justify-start items-center">
                          <input
                            type="checkbox"
                            className="p-0 m-0 mr-1 "
                            name="gratuity_member"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.gratuity_member}
                            checked={values.gratuity_member}
                          />{" "}
                          Gratuity Member
                        </div>
                        <div className="flex justify-start items-center">
                          <input
                            name="overtime_allowance"
                            className="p-0 m-0 mr-1 "
                            type="checkbox"
                            onChange={handleChange}
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
                            disabled={!Boolean(values.overtime_allowance)}
                            type="number"
                            component={Input}
                            maxLength={2}
                            label={
                              <span>
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

                        <div>
                          <Field
                            name="overtime_off_day"
                            disabled={!Boolean(values.overtime_allowance)}
                            type="number"
                            component={Input}
                            maxLength={2}
                            label={
                              <span>
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

                        <div>
                          <Field
                            name="overtime_holiday"
                            disabled={!Boolean(values.overtime_allowance)}
                            type="number"
                            component={Input}
                            maxLength={2}
                            label={
                              <span>
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
                        {/* <div className="col-12 col-md-4 mt-3">
                        <input
                          type="checkbox"
                          name="shift_allowance"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.shift_allowance}
                          checked={values.shift_allowance}
                        />  Shift Allowance

                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        <input
                          type="checkbox"
                          name="regularity_allowance"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.regularity_allowance}
                          checked={values.regularity_allowance}
                        /> Regularity Allowance
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        <input
                          type="checkbox"
                          name="punctuality_allowance"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.punctuality_allowance}
                          value={values.punctuality_allowance}
                        /> Punctuality Allowance

                      </div> */}
                      </div>
                    </div>

                                     {dashboard?.allSubsidiaryList?.find(
  (option) => option.value === values.subsidiaryId
)?.localizationId === 1 && (
                    <div className="col-span-1 text-black mt-1">
                      <label>Deduction</label>
                      <div
                        className="grid grid-cols-1 gap-x-3 gap-y-1"
                        style={{
                          fontSize: "10.2px",
                          // fontWeight: "bold",
                          // padding: "2px",
                        }}
                      >
                        <div className="flex justify-start items-center">
                          <input
                            className="p-0 m-0 mr-1 "
                            name="eobi_member"
                            type="checkbox"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.eobi_member}
                            checked={values.eobi_member}
                          />{" "}
                          EOBI Member
                        </div>
                        <div className="flex justify-start items-center">
                          <input
                            className="p-0 m-0 mr-1"
                            type="checkbox"
                            name="social_security_member"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.social_security_member}
                            checked={values.social_security_member}
                          />{" "}
                          Social Security Member
                        </div>
                      </div>
                    </div>
)}
                  </div>
                  {/* </div> */}
                  {/* <br></br> */}

                  {/* </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion> */}
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
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
