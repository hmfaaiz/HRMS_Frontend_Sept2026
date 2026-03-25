import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { useFormUIContext } from "../FormUIContext";
import * as Yup from "yup";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import axios from "axios";
import * as actions from "../../../_redux/redux-Actions";
import DatePicker from "react-datepicker";
import {

  fetchAllDeductionList,

  fetchAllEarningList,
  getAllLoanType


} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

import { CirclePlus, Eye, Trash2, XCircle } from "lucide-react";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { Input, TextArea } from "../../../../../../_metronic/_partials/controls";
import ViewLoans from "./ViewLoans";
;
import { finalSettlementById } from "../../../_redux/redux-Actions";
import { fetchAllEarning, fetchSeparatedEmployeeById } from "../../../../Dashboard/_redux/dashboardActions";
import SeparatedEmpProfile from "../../../../../utils/common-modules/SeparatedEmpProfile";
import SeparatedAttendanceSummary from "../../../../../utils/common-modules/SeparatedAttendnaceSummary";
import { getSeparatedAttSummaryEmpById } from "../../../../Dashboard/_redux/dashboardCrud";


export const getFinal_SettlementEditSchema = (formData) => {
  return Yup.object().shape({


    employeeId: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    paidDays: Yup.number()
      .nullable(),

    otherPayment: Yup.number()
      .nullable(),

    otherPaymentRemarks: Yup.string()
      .nullable()
      .when('otherPayment', {
        is: (val) => val !== null && val !== undefined && val !== '' && Number(val) > 0,
        then: (schema) => schema.required(VALIDATION_MESSAGES.required),
        otherwise: (schema) => schema.nullable(),
      }),

    otherDeduction: Yup.number()
      .nullable(),

    oherDeductionRemarks: Yup.string()
      .nullable()
      .when('otherDeduction', {
        is: (val) => val !== null && val !== undefined && val !== '' && Number(val) > 0,
        then: (schema) => schema.required(VALIDATION_MESSAGES.required),
        otherwise: (schema) => schema.nullable(),
      }),

    loanBalance: Yup.number()
      .nullable()
    ,

    gratuityAmount: Yup.number()
      .nullable()
    ,

    pf_employer_amount: Yup.number()
      .nullable()
    ,

    pf_employee_amount: Yup.number()
      .nullable()
    ,

    totalPFAmount: Yup.number()
      .nullable()
    ,

    totalEarnings: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    totalDeduction: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    netSalary: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    netFinalSettlementAmount: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    exitClearence: Yup.number()
      .nullable()
    ,

    hrRemarks: Yup.string()
      .nullable()
    ,


    earning_list: Yup.array().of(
      Yup.object().shape({

        earning_deduction_id: Yup.number()
          .nullable().required(VALIDATION_MESSAGES.required),

        amount_takeHome: Yup.number()
          .nullable().required(VALIDATION_MESSAGES.required),

        amount_actual: Yup.number()
          .nullable(),

        days_hours: Yup.number()
          .nullable(),

        remarks: Yup.string()
          .nullable(),

      })
    ),

    deduction_list: Yup.array().of(
      Yup.object().shape({

        earning_deduction_id: Yup.number()
          .nullable().required(VALIDATION_MESSAGES.required),

        amount_takeHome: Yup.number()
          .nullable().required(VALIDATION_MESSAGES.required),

        amount_actual: Yup.number()
          .nullable(),
        days_hours: Yup.number()
          .nullable(),

        remarks: Yup.string()
          .nullable(),

      })
    ),


  });
}

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isdataForRead,
  enableLoading,
  loading, disbaleLoading, setemployeeId, setPanelMode, panelMode, setAttSumPanelMode, attSumPanelMode
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);


  const [departmentId, setDepartmentId] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [payrollMonthEligibility, setPayrollMonthEligibility] = useState("");


  const [loanPanel, setLoanPanel] = useState(false);
  const [separatePanel, setSeparatePanel] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [hitAttSummary, setHitAttSum] = useState(false);
  const [toBeCalculated, setToBeCalculated] = useState(false);
  const [finalizeModal, setFinalizeModal] = useState(false);
  const [data, setData] = useState({});

  //drop down
  useEffect(() => {
    if (formData.employeeId) {
      dispatch(fetchAllEarningList(1, "", formData.employeeId, true));
      dispatch(fetchAllDeductionList(2, "", formData.employeeId));

      dispatch(getAllLoanType({ subsidiaryId: formData?.subsidiaryId }));
      dispatch(fetchAllEarning());
      // dispatch(fetchSeparatedEmployeeById(formData?.employeeId));


    }







    // Always run for active employee
    dispatch(actions.fetchEmpBySeparationFlag({ flag: 1, employeeId: formData?.employeeId }));



  }, [dispatch, formData.Id, formData.employeeId]);


  const { currentState } = useSelector((state) => {
    return {
      currentState: state.final_settlement,
      userAccess: state?.auth?.userAccess["final_settlement"],
    };
  }, shallowEqual);

  const { activeEmployeeList, entities } = currentState;




  const exitClearanceOptions = [
    { value: 0, label: "Not Received" },
    { value: 1, label: "Received" },

  ];



  const finalize = (values, setFieldValue) => {
    setFieldValue("settlementFinalized", true)
  }

  useEffect(() => {
    if (formData.employeeId) {

      const selectedEmp = activeEmployeeList?.find(
        (emp) => emp.value === formData?.employeeId
      );

      if (selectedEmp) {
        setDepartmentId(selectedEmp?.departmentId)
        setDateOfJoining(selectedEmp?.dateOfJoining);
        setPayrollMonthEligibility(selectedEmp?.payrollMonthEligibility);



      }
    }

  }, [activeEmployeeList]);

  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      setemployeeId: FormUIContext.setemployeeId,
      setPanelMode: FormUIContext.setPanelMode,
      panelMode: FormUIContext.panelMode,
      setAttSumPanelMode: FormUIContext.setAttSumPanelMode,
      attSumPanelMode: FormUIContext.attSumPanelMode,
    };
  }, [FormUIContext]);


  const handleCalculate = (setFieldValue, values, earningList, deductionList, otherPayment, otherDeduction) => {


    // Calculate total earnings based on paid days
    const totalEarning = earningList.reduce((sum, item) => {
      const amount_takeHome = Number(item.amount_takeHome) || 0;

      return sum + amount_takeHome;
    }, 0);

    // Calculate total deductions based on paid days
    const totalDeduction = deductionList.reduce((sum, item) => {
      const amount_takeHome = Number(item.amount_takeHome) || 0;

      return sum + Number(amount_takeHome);
    }, 0);

    const totalEarningWithOther = totalEarning + Number(otherPayment || 0);
    const totalDeductionWithOther = totalDeduction + Number(otherDeduction || 0);
    // Calculate net salary
    const netSalary = Number(totalEarningWithOther) - Number(totalDeductionWithOther);

    // Update form fields
    setFieldValue("totalEarnings", Number(totalEarningWithOther).toFixed(2));
    setFieldValue("totalDeduction", Number(totalDeductionWithOther).toFixed(2));
    setFieldValue("netSalary", netSalary.toFixed(2));

    // Calculate total PF Amount (ensure all numeric)
    const netFinalSettlementAmount =
      netSalary + Number(values.gratuityAmount || 0) - Number(values.loanBalance || 0);

    setFieldValue("netFinalSettlementAmount", netFinalSettlementAmount.toFixed(2));
    setToBeCalculated(false)
  };
  const callAttendanceSummaryDate = (employeeId) => {
    if (employeeId) {
      getSeparatedAttSummaryEmpById(employeeId)
        .then((res) => {
          const result = res?.data?.data;

          // if false -> set empty object
          if (!result || result === false) {
            setData({});
          } else {
            setData(result);
          }
        })
        .catch(() => setData({}));
    } else {
      setData({});
    }
  };
  console.log("attSumPanelMode222", data)
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...formData, employeetatus: 1 }}
      validationSchema={getFinal_SettlementEditSchema(formData)}
      onSubmit={async (values) => {
        enableLoading();
        saveForm(values);

      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue, handleBlur,
        handleChange,
        setFieldTouched, validateForm
      }) => (
        <>


          <Modal
            show={finalizeModal}
            onHide={finalizeModal}
            aria-labelledby="example-modal-sizes-title-lg"
          >

            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <span>Are you sure you want to finalize and save the salary?
                Once finalized, this transaction will no longer be editable.</span>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("settlementFinalized", false);
                    setFinalizeModal(false)
                  }}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
                <> </>
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("settlementFinalized", true);
                    handleSubmit();
                    setFinalizeModal(false)
                  }}
                  className="btn btn-primary btn-elevate"
                >
                  Finalize
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              </div>
            </Modal.Footer>
          </Modal>

          <Modal
            show={confirmationModal}
            onHide={confirmationModal}
            aria-labelledby="example-modal-sizes-title-lg"
          >

            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <span>Enabling auto-calculation will replace all manual entries. Are you sure you want to proceed with the salary calculation?</span>
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

                    dispatch(finalSettlementById({ "employeeId": values.employeeId, "paidDays": values.paidDays || 0 }))

                    setConfirmationModal(false);
                    setHitAttSum(!hitAttSummary);
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

          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right" autoComplete="off">
              <fieldset >




                <div className="grid lg:grid-cols-6 gap-x-3 mt-1 mb-2">
                  {/* Employee dropdown */}
                  <div className="col-span-1">
                    <SearchSelect
                      name="employeeId"
                      className={!values.employeeId ? 'form-control is-invalid' : 'form-control'}
                      placeholder=""
                      isDisabled={formData.Id || isdataForRead}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value === "Select" ? null : Number(e.value);
                        setFieldValue("employeeId", value);
                        dispatch(fetchAllEarningList(1, "", e.value, true));
                        dispatch(fetchAllDeductionList(2, "", e.value));
                        setAttSumPanelMode(false)
                        const selectedEmp = activeEmployeeList?.find(
                          (emp) => emp.value === value
                        );

                        if (selectedEmp) {
                          setDepartmentId(selectedEmp?.departmentId);
                          setDateOfJoining(selectedEmp?.dateOfJoining);
                          setPayrollMonthEligibility(selectedEmp?.payrollMonthEligibility);
                        }
                      }}
                      label={
                        <span>
                          Employee<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={
                        activeEmployeeList?.find(
                          (option) => option?.value === values?.employeeId
                        ) || null
                      }
                      autoComplete="off"
                      // options={activeEmployeeList}
                      options={
                        activeEmployeeList?.map((option) => {
                          // check if this employee already exists in entities array
                          const isAlreadyUsed = entities?.some(
                            (entity) => entity.employeeId === option.value
                          );

                          const notForFinalSettlement = entities?.some(
                            (entity) =>
                              entity.employeeId === option.value &&
                              entity.Separation?.isNotEligibleForFinalSettlement === true
                          );


                          return {
                            label: option.label,
                            value: option.value,
                            isDisabled: isAlreadyUsed || notForFinalSettlement // disable if already used
                          };
                        }) || []
                      }
                      isSearchable={true}
                      error={errors.employeeId}
                      touched={touched.employeeId}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="col-span-5 flex items-end justify-start gap-3 mt-6 " style={{ pointerEvents: 'auto', opacity: 1 }}>
                    {panelMode ? (
                      <button
                        type="button"
                        className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                        onClick={() => setPanelMode(!panelMode)}
                      >
                        <XCircle className="w-3 h-3 text-black" />
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => {
                          setPanelMode(!panelMode)
                          setSeparatePanel(false)
                          setAttSumPanelMode(false)
                        }}
                        disabled={!values?.employeeId}
                      >
                        <Eye className="w-4 h-4 text-white" />
                        View Details
                      </button>
                    )}

                    {separatePanel ? (
                      <button
                        type="button"
                        className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                        onClick={() => setSeparatePanel(!separatePanel)}
                      >
                        <XCircle className="w-3 h-3 text-black" />
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => {
                          setSeparatePanel(!separatePanel)
                          setPanelMode(false)
                          setAttSumPanelMode(false)

                        }}
                        disabled={!values?.employeeId}
                      >
                        <Eye className="w-4 h-4 text-white" />
                        View Separate Details
                      </button>
                    )}


                    {attSumPanelMode ? (
                      <button
                        type="button"
                        className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                        onClick={() => setAttSumPanelMode(!attSumPanelMode)}
                      >
                        <XCircle className="w-3 h-3 text-black" />
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => {
                          callAttendanceSummaryDate(values?.employeeId);
                          setAttSumPanelMode(!attSumPanelMode)
                          setSeparatePanel(false)
                          setPanelMode(false)


                        }}
                        disabled={!values?.employeeId}
                      >
                        <Eye className="w-4 h-4 text-white" />
                        View Attendance Summary Details
                      </button>
                    )}


                  </div>

                  <div className="col-span-5 flex items-end justify-start gap-3 mt-6 " style={{ pointerEvents: 'auto', opacity: 1 }}>

                    {payrollMonthEligibility === false &&
                      <span>
                        Last Working Date of Employee does not falls in any Payroll Month.
                        Kindly create Payroll Month first and then proceed with Final Settlement.
                      </span>
                    }
                  </div>



                </div>
                {console.log("attSumPanelMode111", attSumPanelMode)}
                <EmployeeProfile
                  employeeId={values?.employeeId || formData?.employeeId}
                  panelMode={panelMode}
                />
                <SeparatedEmpProfile
                  employeeId={values?.employeeId || formData?.employeeId}
                  panelMode={separatePanel}
                />

                <SeparatedAttendanceSummary
                  employeeId={values?.employeeId || formData?.employeeId}
                  panelMode={attSumPanelMode} hitAttSummary={hitAttSummary}
                  data={data}
                />

                <div className="grid lg:grid-cols-6 gap-x-3 mt-1 mb-2">
                  <div className="col-span-2 flex items-end justify-start gap-3 mt-6 ">


                    <div className="flex items-end gap-3">

                      <div>
                        <button
                          type="button"
                          className="btn btn-primary btn-elevate"
                          disabled={!values.employeeId || isdataForRead || !payrollMonthEligibility}
                          onClick={() => {
                            setConfirmationModal(true);
                            setAttSumPanelMode(false)

                          }

                          }
                        >
                          Auto Calculate Final Settlement
                          {loading && (
                            <span className="ml-3 mr-3 spinner spinner-white"></span>
                          )}
                        </button>
                      </div>

                      <div className="  w-[300px]">


                        <Field
                          name="paidDays"
                          component={Input}
                          placeholder="Enter paid days"
                          disabled={isdataForRead}
                          label={
                            <span>
                              Paid Days
                            </span>
                          }
                          onChange={(e) => {
                            const value = e.target.value
                            setFieldValue("paidDays", value);
                            handleCalculate(value, setFieldValue, values, values.earning_list, values.deduction_list)
                          }

                          }

                          autoComplete="off"
                          type="text"


                        />
                      </div>


                    </div>

                  </div>



                </div>







                <hr></hr>
                {/* Personal Information */}


                <div

                >

                  <h6 className="font-bold mb-0 text-primary">
                    Earnings
                  </h6>

                  <FieldArray name="earning_list">
                    {({ insert, remove, push }) => (
                      <>
                        <div className="flex justify-end items-center text-right ">

                          {/* {!isdataForRead && values?.earning_list.length < 31 && ( */}
                          <button
                            disabled={!values.employeeId || isdataForRead}
                            type="button"
                            className="btn btn-primary btn-elevate text-right"
                            onClick={() => {
                              push({


                                earning_deduction_id: "",
                                amount_takeHome: "",
                                amount_actual: "",
                                days_hours: "",
                                remarks: "",

                              })
                              setToBeCalculated(true)
                            }}
                          >
                            <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3 " />{" "}
                            Add
                          </button>
                          {/* )} */}
                        </div>
                        <div className="w-full overflow-x-auto">
                          <div className="react-bootstrap-table table-responsive">
                            <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                              <thead>
                                <tr className="custom-table-header">

                                  <td className="w-[310px]">Earning Name</td>
                                  <td className="w-[310px]">Days to be paid</td>
                                  <td className="w-[310px]">Salary Amount</td>
                                  <td className="w-[310px]">Actual Amount</td>
                                  <td className="w-[310px]">Remarks</td>
                                  <td className="text-right">Action</td>
                                </tr>
                              </thead>
                              <tbody>
                                {values?.earning_list?.map((row, index) => (
                                  <tr key={index}>
                                    {/* Row Starts */}



                                    <td>
                                      <SearchSelect
                                        name={`earning_list[${index}].earning_deduction_id`}
                                        isDisabled={isdataForRead}
                                        value={
                                          dashboard?.allEarningList
                                            ?.filter(
                                              (option) => option.value === values.earning_list[index].earning_deduction_id
                                            )
                                            ?.map((option) => ({
                                              label: option.label,
                                              value: option.value,
                                            }))[0] || null
                                        }
                                        onChange={(selectedOption) => {
                                          const selectedValue = selectedOption ? selectedOption.value : "";
                                          setFieldValue(`earning_list[${index}].earning_deduction_id`, selectedValue);
                                        }}
                                        options={
                                          dashboard?.allEarningList?.map((option) => {
                                            // check if already selected in any other row
                                            const isSelectedInAnotherRow = values.earning_list.some(
                                              (item, i) =>
                                                i !== index && item.earning_deduction_id === option.value
                                            );

                                            return {
                                              label: option.label,
                                              value: option.value,
                                              isDisabled: isSelectedInAnotherRow, // disable if already chosen elsewhere
                                            };
                                          }) || []
                                        }
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        isOptionDisabled={(option) => option.isDisabled} // disable the selected ones
                                      />

                                      {errors?.earning_list?.[index]?.earning_deduction_id &&
                                        touched?.earning_list?.[index]?.earning_deduction_id && (
                                          <div className="invalid-feedback">
                                            {errors.earning_list[index].earning_deduction_id}
                                          </div>
                                        )}
                                    </td>


                                    <td>
                                      <Field

                                        name={`earning_list[${index}].days_hours`}
                                        disabled
                                        className={
                                          errors.earning_list?.[index]?.days_hours && touched.earning_list?.[index]?.days_hours
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }

                                        onChange={(e) => {
                                          const value = e.target.value === "Select" ? "" : e.target.value;
                                          setFieldValue(`earning_list[${index}].days_hours`, value);
                                        }}
                                        value={row?.days_hours || ""}
                                      >


                                      </Field>

                                      {/* Error message */}
                                      {errors?.earning_list?.[index]?.days_hours && touched?.earning_list?.[index]?.days_hours && (
                                        <div className="invalid-feedback">
                                          {errors.earning_list[index].days_hours}
                                        </div>
                                      )}
                                    </td>
                                    <td>
                                      <Field

                                        name={`earning_list[${index}].amount_actual`}
                                        disabled
                                        className={
                                          errors.earning_list?.[index]?.amount_actual && touched.earning_list?.[index]?.amount_actual
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }

                                        onChange={(e) => {

                                          const value = e.target.value === "Select" ? "" : e.target.value;
                                          setFieldValue(`earning_list[${index}].amount_actual`, value);
                                        }}
                                        value={row?.amount_actual || ""}
                                      >


                                      </Field>

                                      {/* Error message */}
                                      {errors?.earning_list?.[index]?.amount_actual && touched?.earning_list?.[index]?.amount_actual && (
                                        <div className="invalid-feedback">
                                          {errors.earning_list[index].amount_actual}
                                        </div>
                                      )}
                                    </td>


                                    <td>
                                      <Field

                                        name={`earning_list[${index}].amount_takeHome`}
                                        className={
                                          errors.earning_list?.[index]?.amount_takeHome && touched.earning_list?.[index]?.amount_takeHome
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        disabled={isdataForRead}
                                        onChange={(e) => {
                                          setToBeCalculated(true)
                                          const value = e.target.value === "Select" ? "" : e.target.value;
                                          setFieldValue(`earning_list[${index}].amount_takeHome`, value);

                                        }}
                                        value={row?.amount_takeHome || ""}
                                      >


                                      </Field>

                                      {/* Error message */}
                                      {errors?.earning_list?.[index]?.amount_takeHome && touched?.earning_list?.[index]?.amount_takeHome && (
                                        <div className="invalid-feedback">
                                          {errors.earning_list[index].amount_takeHome}
                                        </div>
                                      )}
                                    </td>



                                    <td>
                                      <Field

                                        name={`earning_list[${index}].remarks`}
                                        className={
                                          errors.earning_list?.[index]?.remarks && touched.earning_list?.[index]?.remarks
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        disabled={isdataForRead}
                                        onChange={(e) => {
                                          const value = e.target.value === "Select" ? "" : e.target.value;
                                          setFieldValue(`earning_list[${index}].remarks`, value);
                                        }}
                                        value={row?.remarks || ""}
                                      >


                                      </Field>

                                      {/* Error message */}
                                      {errors?.earning_list?.[index]?.remarks && touched?.earning_list?.[index]?.remarks && (
                                        <div className="invalid-feedback">
                                          {errors.earning_list[index].remarks}
                                        </div>
                                      )}
                                    </td>

                                    {/* Delete Button Starts */}
                                    {/* {!values?.earning_list[index]?.isPresent && ( */}
                                    <td className="text-right">
                                      <button
                                        // disabled={isdataForRead || values?.earning_list?.[index]?.AutoCalculation == 1}
                                        className="border-none bg-transparent"
                                        style={{
                                          display: isdataForRead || values?.earning_list?.[index]?.AutoCalculation === 1 ? "none" : "inline-flex"
                                        }}
                                        type="button"
                                        onClick={() => {
                                          remove(index);
                                          setToBeCalculated(true)
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                      </button>
                                    </td>
                                    {/* )} */}

                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </FieldArray>





                </div>

                <hr></hr>




                <div

                >

                  <h6 className="font-bold mb-0 text-primary">
                    Deductions
                  </h6>

                  <FieldArray name="deduction_list">
                    {({ insert, remove, push }) => (
                      <>
                        <div className="flex justify-end items-center text-right ">

                          {/* {!isdataForRead && values?.deduction_list.length < 31 && ( */}
                          <button
                            disabled={!values.employeeId || isdataForRead}
                            type="button"
                            className="btn btn-primary btn-elevate text-right"
                            onClick={() => {
                              push({

                                earning_deduction_id: "",
                                amount_takeHome: "",
                                amount_actual: "",
                                days_hours: "",
                                remarks: "",

                              })
                              setToBeCalculated(true)
                            }
                            }
                          >
                            <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3 " />{" "}
                            Add
                          </button>
                          {/* )} */}
                        </div>
                        <div className="w-full overflow-x-auto">
                          <div className="react-bootstrap-table table-responsive">
                            <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                              <thead>
                                <tr className="custom-table-header">

                                  <td className="w-[310px]">Deduction Name</td>
                                  <td className="w-[310px]">Days to be paid</td>
                                  <td className="w-[310px]">Salary Amount</td>
                                  <td className="w-[310px]">Actual Amount</td>
                                  <td className="w-[310px]">Remarks</td>
                                  <td className="text-right">Action</td>
                                </tr>
                              </thead>
                              <tbody>
                                {values?.deduction_list?.map((row, index) => (
                                  <tr key={index}>



                                    <td>
                                      <SearchSelect
                                        name={`deduction_list[${index}].earning_deduction_id`}
                                        isDisabled={isdataForRead}
                                        value={
                                          dashboard?.allDeductions
                                            ?.filter(
                                              (option) => option.value === values.deduction_list[index].earning_deduction_id
                                            )
                                            ?.map((option) => ({
                                              label: option.label,
                                              value: option.value,
                                            }))[0] || null
                                        }
                                        onChange={(selectedOption) => {
                                          const selectedValue = selectedOption ? selectedOption.value : "";
                                          setFieldValue(`deduction_list[${index}].earning_deduction_id`, selectedValue);
                                        }}
                                        options={
                                          dashboard?.allDeductions?.map((option) => {
                                            // check if already selected in another row
                                            const isSelectedInAnotherRow = values.deduction_list.some(
                                              (item, i) =>
                                                i !== index && item.earning_deduction_id === option.value
                                            );

                                            return {
                                              label: option.label,
                                              value: option.value,
                                              isDisabled: isSelectedInAnotherRow, // disable if already chosen elsewhere
                                            };
                                          }) || []
                                        }
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        isOptionDisabled={(option) => option.isDisabled} // React-Select disables those options
                                      />

                                      {/* Error message */}
                                      {errors?.deduction_list?.[index]?.earning_deduction_id &&
                                        touched?.deduction_list?.[index]?.earning_deduction_id && (
                                          <div className="invalid-feedback">
                                            {errors.deduction_list[index].earning_deduction_id}
                                          </div>
                                        )}
                                    </td>


                                    <td>
                                      <Field

                                        name={`deduction_list[${index}].days_hours`}
                                        className={
                                          errors.deduction_list?.[index]?.days_hours && touched.deduction_list?.[index]?.days_hours
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        disabled
                                        onChange={(e) => {
                                          const value = e.target.value === "Select" ? "" : e.target.value;
                                          setFieldValue(`deduction_list[${index}].days_hours`, value);
                                        }}
                                        value={row?.days_hours || ""}
                                      >


                                      </Field>

                                      {/* Error message */}
                                      {errors?.deduction_list?.[index]?.days_hours && touched?.deduction_list?.[index]?.days_hours && (
                                        <div className="invalid-feedback">
                                          {errors.deduction_list[index].days_hours}
                                        </div>
                                      )}
                                    </td>
                                    <td>
                                      <Field

                                        name={`deduction_list[${index}].amount_actual`}
                                        className={
                                          errors.deduction_list?.[index]?.amount_actual && touched.deduction_list?.[index]?.amount_actual
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        disabled
                                        onChange={(e) => {
                                          const value = e.target.value === "Select" ? "" : e.target.value;
                                          setFieldValue(`deduction_list[${index}].amount_actual`, value);
                                        }}
                                        value={row?.amount_actual || ""}
                                      >


                                      </Field>

                                      {/* Error message */}
                                      {errors?.deduction_list?.[index]?.amount_actual && touched?.deduction_list?.[index]?.amount_actual && (
                                        <div className="invalid-feedback">
                                          {errors.deduction_list[index].amount_actual}
                                        </div>
                                      )}
                                    </td>


                                    <td>
                                      <Field

                                        name={`deduction_list[${index}].amount_takeHome`}
                                        className={
                                          errors.deduction_list?.[index]?.amount_takeHome && touched.deduction_list?.[index]?.amount_takeHome
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        disabled={isdataForRead}
                                        onChange={(e) => {
                                          setToBeCalculated(true)
                                          const value = e.target.value === "Select" ? "" : e.target.value;
                                          setFieldValue(`deduction_list[${index}].amount_takeHome`, value);


                                        }}
                                        value={row?.amount_takeHome || ""}
                                      >


                                      </Field>

                                      {/* Error message */}
                                      {errors?.deduction_list?.[index]?.amount_takeHome && touched?.deduction_list?.[index]?.amount_takeHome && (
                                        <div className="invalid-feedback">
                                          {errors.deduction_list[index].amount_takeHome}
                                        </div>
                                      )}
                                    </td>



                                    <td>
                                      <Field

                                        name={`deduction_list[${index}].remarks`}
                                        className={
                                          errors.deduction_list?.[index]?.remarks && touched.deduction_list?.[index]?.remarks
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        disabled={isdataForRead}
                                        onChange={(e) => {
                                          const value = e.target.value === "Select" ? "" : e.target.value;
                                          setFieldValue(`deduction_list[${index}].remarks`, value);
                                        }}
                                        value={row?.remarks || ""}
                                      >


                                      </Field>

                                      {/* Error message */}
                                      {errors?.deduction_list?.[index]?.remarks && touched?.deduction_list?.[index]?.remarks && (
                                        <div className="invalid-feedback">
                                          {errors.deduction_list[index].remarks}
                                        </div>
                                      )}
                                    </td>

                                    {/* Delete Button Starts */}
                                    {/* {!values?.deduction_list[index]?.isPresent && ( */}
                                    <td className="text-right">
                                      <button
                                        //  disabled={isdataForRead || values?.deduction_list?.[index]?.AutoCalculation==1}
                                        style={{
                                          display: isdataForRead || values?.deduction_list?.[index]?.AutoCalculation === 1 ? "none" : "inline-flex"
                                        }}
                                        className="border-none bg-transparent"
                                        type="button"
                                        onClick={() => {
                                          remove(index);
                                          setToBeCalculated(true)
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                      </button>
                                    </td>
                                    {/* )} */}

                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </FieldArray>


                  <div className="grid md:grid-cols-6 gap-x-3 mt-1 mb-2">
                    <div className="">
                      <Field
                        name="otherPayment"
                        disabled={isdataForRead}
                        component={Input}
                        placeholder="Enter other payment"
                        label={
                          <span>
                            Other Payment
                          </span>
                        }
                        onChange={(e) => {

                          setToBeCalculated(true)
                          let otherPayment = e.target.value;
                          setFieldValue("otherPayment", otherPayment)
                          handleCalculate(setFieldValue, values, values.earning_list, values.deduction_list, otherPayment, values.otherDeduction)

                        }}

                        autoComplete="off"
                        type="text"


                      />

                    </div>

                    <div className="grid md:col-span-2">
                      <Field
                        disabled={isdataForRead}
                        name="otherPaymentRemarks"
                        component={Input}
                        placeholder="Enter remarks"
                        label={
                          <span>
                            Remarks
                          </span>
                        }

                        autoComplete="off"
                        type="text"

                      />

                    </div>

                    <div className="">
                      <Field
                        disabled={isdataForRead}
                        name="otherDeduction"
                        component={Input}
                        placeholder="Enter other deduction"
                        label={
                          <span>
                            Other Deduction
                          </span>
                        }
                        onChange={(e) => {

                          setToBeCalculated(true)
                          let otherDeduction = e.target.value;
                          setFieldValue("otherDeduction", otherDeduction)

                          handleCalculate(setFieldValue, values, values.earning_list, values.deduction_list, values.otherPayment, otherDeduction)
                        }}

                        autoComplete="off"
                        type="text"

                      />

                    </div>


                    <div className="grid md:col-span-2">
                      <Field
                        disabled={isdataForRead}
                        name="oherDeductionRemarks"
                        component={Input}
                        placeholder="Enter remarks"
                        label={
                          <span>
                            Remarks
                          </span>
                        }

                        autoComplete="off"
                        type="text"

                      />

                    </div>
                  </div>

                  <div className=" grid lg:grid-cols-1 gap-x-3 mt-1 mb-2 ">
                    <div className="flex md:grid-cols-6 justify-end gap-x-3 ">
                      <div className="">
                        <Field
                          name="totalEarnings"
                          component={Input}
                          placeholder="Enter total paid earning"
                          disabled
                          value={Number(values.totalEarnings || 0).toFixed(2)}
                          label={
                            <span>
                              Total Paid Earning
                            </span>
                          }

                          autoComplete="off"
                          type="text"

                        />

                      </div>

                      <div className="">
                        <Field
                          name="totalDeduction"
                          component={Input}
                          placeholder="Enter total paidd eduction"
                          disabled
                          value={Number(values.totalDeduction || 0).toFixed(2)}
                          label={
                            <span>
                              Total Paid Deduction
                            </span>
                          }

                          autoComplete="off"
                          type="text"

                        />

                      </div>

                      <div className="">
                        <Field
                          name="netSalary"
                          component={Input}
                          placeholder="Enter net salary"
                          disabled
                          value={Number(values.netSalary || 0).toFixed(2)}
                          label={
                            <span>
                              Net Salary
                            </span>
                          }

                          autoComplete="off"
                          type="text"

                        />

                      </div>

                    </div>





                  </div>
                </div>
                <hr></hr>


                <div >

                  <h6 className="font-bold mb-0 text-primary">
                    Loan Detail
                  </h6>

                  <div className="grid lg:grid-cols-6 gap-x-3 mt-1 mb-2">
                    <div className="">
                      <Field
                        name="loanBalance"
                        component={Input}
                        value={Number(values.loanBalance || 0).toFixed(2)}
                        placeholder="Auto total loan outstanding"
                        label={
                          <span>
                            Total Loan Outstanding
                          </span>
                        }

                        autoComplete="off"
                        type="text"
                        disabled
                      />

                    </div>

                    <div className="mt-6">



                      {loanPanel ? (
                        <button
                          type="button"
                          className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                          onClick={() => setLoanPanel(!loanPanel)}
                        >
                          <XCircle className="w-3 h-3 text-black" />
                          Cancel
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary d-flex align-items-center gap-2"
                          onClick={() => setLoanPanel(!loanPanel)}
                          disabled={!values?.employeeId}
                        >


                          <Eye className="w-4 h-4 text-white" />
                          View Details
                        </button>
                      )}




                    </div>


                  </div>
                  <ViewLoans
                    employeeId={values?.employeeId || formData?.employeeId}
                    panelMode={loanPanel}
                    values={values}
                    errors={errors}
                  />


                </div>


                <hr></hr>


                <div >

                  <h6 className="font-bold mb-0 text-primary">
                    Grautity Detail
                  </h6>

                  <div className="grid lg:grid-cols-6 gap-x-3 mt-1 mb-2">
                    <div className="">
                      <Field
                        name="gratuityAmount"
                        component={Input}
                        value={Number(values.gratuityAmount || 0).toFixed(2)}
                        placeholder="Auto gratuity amount"
                        label={
                          <span>
                            Gratuity Amount
                          </span>
                        }

                        autoComplete="off"
                        type="text"
                        disabled
                      />

                    </div>



                  </div>

                </div>


                <hr></hr>


                <div >

                  <h6 className="font-bold mb-0 text-primary">
                    Provident Fund Detail
                  </h6>

                  <div className="flex justify-between items-center gap-4 mt-1 mb-2 w-full">
                    <div className="min-w-[260px]">
                      <Field
                        name="totalPFAmount"
                        component={Input}
                        value={Number(values.totalPFAmount || 0).toFixed(2)}
                        placeholder="Enter provident fund contribution"
                        disabled
                        label={
                          <span>
                            Total Provident Fund Contribution
                          </span>
                        }

                        autoComplete="off"
                        type="text"

                      />

                    </div>

                    <div className="min-w-[260px]">
                      <Field
                        name="pf_employer_amount"
                        component={Input}
                        placeholder="Enter employer contribution"
                        disabled
                        value={Number(values.pf_employer_amount || 0).toFixed(2)}
                        label={
                          <span>
                            Employer Contribution
                          </span>
                        }

                        autoComplete="off"
                        type="text"

                      />

                    </div>

                    <div className="min-w-[260px]">
                      <Field
                        name="pf_employee_amount"
                        component={Input}
                        placeholder="Enter employee contribution"
                        value={Number(values.pf_employee_amount || 0).toFixed(2)}
                        disabled
                        label={
                          <span>
                            Employee Contribution
                          </span>
                        }

                        autoComplete="off"
                        type="text"

                      />

                    </div>

                  </div>

                </div>


                <hr></hr>


                <div >

                  <h6 className="font-bold mb-0 text-primary">
                    Payment Details
                  </h6>

                  <div className="grid lg:grid-cols-6 gap-x-3 mt-1 mb-2">







                    <div className="">
                      <Field
                        name="netFinalSettlementAmount"
                        component={Input}
                        placeholder="Auto total payable amount"
                        disabled
                        value={Number(values.netFinalSettlementAmount || 0).toFixed(2)}
                        label={
                          <span>
                            Total Payable Amount
                          </span>
                        }

                        autoComplete="off"
                        type="text"

                      />

                    </div>
                    {toBeCalculated ? (
                      <button
                        type="button"
                        disabled={!payrollMonthEligibility}

                        onClick={() => {
                          handleCalculate(setFieldValue, values, values.earning_list, values.deduction_list, values.otherPayment, values.otherDeduction)
                        }}
                        className="mt-6 flex items-center justify-center gap-2 px-2.5 py-1 text-sm h-[25px] w-fit bg-red-500 text-white border-none rounded"

                      >
                        Calculate
                        {loading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>

                    ) : null}

                  </div>

                </div>


                <hr></hr>


                <div >

                  <h6 className="font-bold mb-0 text-primary">
                    HR
                  </h6>

                  <div className="grid lg:grid-cols-6 gap-x-3 mt-1 mb-2">



                    <div className="">
                      <SearchSelect
                        label={
                          <span>
                            Exit Clearance
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={true}
                        name="exitClearence"
                        onChange={(e) => {
                          setFieldValue("exitClearence", e?.value ?? null);
                        }}

                        value={
                          exitClearanceOptions?.find(
                            (option) => option?.value == values?.exitClearence
                          ) || null
                        }
                        error={errors.exitClearence}
                        touched={touched.exitClearence}
                        options={exitClearanceOptions}
                      />
                    </div>

                    <div className="grid md:col-span-5">
                      <Field
                        name="hrRemarks"
                        disabled={isdataForRead}
                        component={TextArea}
                        placeholder="Enter remarks"
                        label={
                          <span>
                            Remarks
                          </span>
                        }

                        autoComplete="off"
                        type="text"

                      />

                    </div>



                  </div>

                </div>

              </fieldset>



            </Form>
          </Modal.Body>
          <Modal.Footer>
            {!isdataForRead ? (
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

            {!isdataForRead && (

              <>
                {toBeCalculated ? (
                  <></>


                ) : (
                  <>


                    <button
                      type="button"
                      disabled={!values.exitClearence || isdataForRead || values.settlementFinalized || values.netFinalSettlementAmount < 0 || !payrollMonthEligibility}
                      onClick={() => {
                        setFinalizeModal(true)
                      }}
                      className="btn btn-primary btn-elevate"
                    >
                      Finalize
                      {loading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )}
                    </button>


                    <button
                      type="submit"
                      disabled={values.settlementFinalized || isdataForRead || !payrollMonthEligibility}

                      onClick={() => {
                        handleSubmit();
                      }}
                      className="btn btn-primary btn-elevate"
                    >
                      Save
                      {loading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )}
                    </button>


                  </>
                )
                }







              </>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
