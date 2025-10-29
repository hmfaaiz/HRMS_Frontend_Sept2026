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
  fetchAllEmployeesWithNoPermissionData,
  fetchAllFormsMenu,


} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import {

  formatDates,


} from "../../../../../utils/common";

import { subYears } from "date-fns";

import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import { fetchExitReasonData } from "../../../../Dashboard/_redux/dashboardActions";
import { CirclePlus, Eye, Trash2, XCircle } from "lucide-react";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { Input, TextArea } from "../../../../../../_metronic/_partials/controls";
import ViewLoans from "./ViewLoans";
import ViewSeparate from "./ViewSeparate";


export const getFinal_SettlementEditSchema = (formData) => {
  return Yup.object().shape({


    employeeId: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    paidDays: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    otherPayment: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    otherPaymentRemarks: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    otherDeduction: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    oherDeductionRemarks: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    loanBalance: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    gratuityAmount: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    pf_employer_amount: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    pf_employee_amount: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    totalPFAmount: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

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
      .required(VALIDATION_MESSAGES.required),

    hrRemarks: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGES.required),


    earning_list: Yup.array().of(
      Yup.object().shape({

        earning_deduction_id: Yup.number()
          .nullable().required(VALIDATION_MESSAGES.required),

        amount_takeHome: Yup.number()
          .nullable().required(VALIDATION_MESSAGES.required),

        amount_actual: Yup.number()
          .nullable().required(VALIDATION_MESSAGES.required),

        days_hours: Yup.number()
          .nullable().required(VALIDATION_MESSAGES.required),

        remarks: Yup.string()
          .nullable().required(VALIDATION_MESSAGES.required),

      })
    ),

    deduction_list: Yup.array().of(
      Yup.object().shape({

        earning_deduction_id: Yup.number()
          .nullable().required(VALIDATION_MESSAGES.required),

        amount_takeHome: Yup.number()
          .nullable().required(VALIDATION_MESSAGES.required),

        amount_actual: Yup.number()
          .nullable().required(VALIDATION_MESSAGES.required),
        days_hours: Yup.number()
          .nullable().required(VALIDATION_MESSAGES.required),

        remarks: Yup.string()
          .nullable().required(VALIDATION_MESSAGES.required),

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
  loading, disbaleLoading, setemployeeId, setPanelMode, panelMode
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  const inputFile = useRef(null);
  const [file, setFile] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");

  const [policyMode, setPolicyMode] = useState("");
  const [separateMode, setSeparateMode] = useState("");

  const [loanPanel, setLoanPanel] = useState("");
  const [separatePanel, setSeparatePanel] = useState("");


  //drop down
  useEffect(() => {
    if (formData.employeeId) {
      dispatch(fetchAllEarningList(1, "", formData.employeeId, true));
      dispatch(fetchAllDeductionList(2, "", formData.employeeId));
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

  const { dataForEdit, activeEmployeeList } = currentState;


  const { allEmployees } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees
    }),
    shallowEqual
  )





  const exitClearanceOptions = [
    { value: 0, label: "No" },
    { value: 1, label: "Yes" },

  ];





  useEffect(() => {
    if (formData.employeeId) {

      const selectedEmp = activeEmployeeList?.find(
        (emp) => emp.value === formData?.employeeId
      );

      if (selectedEmp) {
        setDepartmentId(selectedEmp?.departmentId)
        setDateOfJoining(selectedEmp?.dateOfJoining);



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
    };
  }, [FormUIContext]);

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



          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right" autoComplete="off">
              <fieldset disabled={isdataForRead}>




                <div className="grid lg:grid-cols-6 gap-x-3 mt-1 mb-2">
                  {/* Employee dropdown */}
                  <div className="col-span-1">
                    <SearchSelect
                      name="employeeId"
                      className={!values.employeeId ? 'form-control is-invalid' : 'form-control'}
                      placeholder=""
                      isDisabled={formData.Id}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value === "Select" ? null : Number(e.value);
                        setFieldValue("employeeId", value);
                        dispatch(fetchAllEarningList(1, "", e.value, true));
                        dispatch(fetchAllDeductionList(2, "", e.value));
                        const selectedEmp = activeEmployeeList?.find(
                          (emp) => emp.value === value
                        );

                        if (selectedEmp) {
                          setDepartmentId(selectedEmp?.departmentId);
                          setDateOfJoining(selectedEmp?.dateOfJoining);
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
                      options={activeEmployeeList}
                      isSearchable={true}
                      error={errors.employeeId}
                      touched={touched.employeeId}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="col-span-3 flex items-end justify-start gap-3 mt-6">
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
                        onClick={() => setPanelMode(!panelMode)}
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
                        onClick={() => setSeparatePanel(!separatePanel)}
                        disabled={!values?.employeeId}
                      >
                        <Eye className="w-4 h-4 text-white" />
                        View Separate Details
                      </button>
                    )}
                  </div>
                </div>


                <div className="grid lg:grid-cols-6 gap-x-3 mt-1 mb-2">
                  <div className="col-span-3 flex items-end justify-start gap-3 mt-6">
                    <button



                      className="btn btn-primary btn-elevate"
                    >
                      Calculate
                      {loading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )}
                    </button>
                  </div>
                  <div className="">
                    <Field
                      name="paidDays"
                      component={Input}
                      placeholder="Enter paid days"
                      label={
                        <span>
                          Paid Days
                        </span>
                      }

                      autoComplete="off"
                      type="text"


                    />

                  </div>



                </div>

                <EmployeeProfile
                  employeeId={values?.employeeId || formData?.employeeId}
                  panelMode={panelMode}
                />
                {/* <ViewSeparate
                  employeeId={values?.employeeId || formData?.employeeId}
                  panelMode={separatePanel}
                /> */}





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
                            disabled={!values.employeeId}
                            type="button"
                            className="btn btn-primary btn-elevate text-right"
                            onClick={() =>
                              push({


                                earning_deduction_id: "",
                                amount_takeHome: "",
                                amount_actual: "",
                                days_hours: "",
                                remarks: "",

                              })
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

                                  <td className="w-[200px]">Earning Name</td>
                                  <td className="w-[200px]">Days to be paid</td>
                                  <td className="w-[250px]">Salary Amount</td>
                                  <td className="w-[100px]">Actual Amount</td>
                                  <td className="w-[120px]">Remarks</td>
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


                                        value={
                                          dashboard?.allEarnings
                                            ?.filter((option) => option.value === values.earning_list[index].earning_deduction_id)
                                            ?.map((option) => ({
                                              label: option.label, //  onlyLabel will be displayed
                                              value: option.value,
                                            }))[0] || null
                                        }

                                        onChange={(selectedOption) => {
                                          const selectedValue = selectedOption ? selectedOption.value : "";
                                          setFieldValue(`earning_list[${index}].earning_deduction_id`, selectedValue);
                                        }}

                                        options={
                                          dashboard?.allEarnings?.map((option) => ({
                                            label: option.label, // show only this field as label
                                            value: option.value,     // keep value for Formik binding
                                          })) || []
                                        }

                                      />



                                      {/* Error message */}
                                      {errors?.earning_list?.[index]?.earning_deduction_id && touched?.earning_list?.[index]?.earning_deduction_id && (
                                        <div className="invalid-feedback">
                                          {errors.earning_list[index].earning_deduction_id}
                                        </div>
                                      )}
                                    </td>

                                    <td>
                                      <Field

                                        name={`earning_list[${index}].days_hours`}
                                        className={
                                          errors.earning_list?.[index]?.days_hours && touched.earning_list?.[index]?.days_hours
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        disabled={isdataForRead}
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
                                        className={
                                          errors.earning_list?.[index]?.amount_actual && touched.earning_list?.[index]?.amount_actual
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        disabled={isdataForRead}
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
                                        disabled={isdataForRead}
                                        className="border-none bg-transparent"
                                        type="button"
                                        onClick={() => {
                                          remove(index);
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
                            disabled={!values.employeeId}
                            type="button"
                            className="btn btn-primary btn-elevate text-right"
                            onClick={() =>
                              push({

                                earning_deduction_id: "",
                                amount_takeHome: "",
                                amount_actual: "",
                                days_hours: "",
                                remarks: "",

                              })
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

                                  <td className="w-[200px]">Deduction Name</td>
                                  <td className="w-[200px]">Days to be paid</td>
                                  <td className="w-[250px]">Salary Amount</td>
                                  <td className="w-[100px]">Actual Amount</td>
                                  <td className="w-[120px]">Remarks</td>
                                  <td className="text-right">Action</td>
                                </tr>
                              </thead>
                              <tbody>
                                {values?.deduction_list?.map((row, index) => (
                                  <tr key={index}>
                                    {/* Row Starts */}



                                    <td>




                                      <SearchSelect
                                        name={`deduction_list[${index}].earning_deduction_id`}


                                        value={
                                          dashboard?.allDeductions
                                            ?.filter((option) => option.value === values.deduction_list[index].earning_deduction_id)
                                            ?.map((option) => ({
                                              label: option.label, //  onlyLabel will be displayed
                                              value: option.value,
                                            }))[0] || null
                                        }

                                        onChange={(selectedOption) => {
                                          const selectedValue = selectedOption ? selectedOption.value : "";
                                          setFieldValue(`deduction_list[${index}].earning_deduction_id`, selectedValue);
                                        }}

                                        options={
                                          dashboard?.allDeductions?.map((option) => ({
                                            label: option.label, // show only this field as label
                                            value: option.value,     // keep value for Formik binding
                                          })) || []
                                        }

                                      />



                                      {/* Error message */}
                                      {errors?.deduction_list?.[index]?.earning_deduction_id && touched?.deduction_list?.[index]?.earning_deduction_id && (
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
                                        disabled={isdataForRead}
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
                                        disabled={isdataForRead}
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
                                        disabled={isdataForRead}
                                        className="border-none bg-transparent"
                                        type="button"
                                        onClick={() => {
                                          remove(index);
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
                        component={Input}
                        placeholder="Enter other payment"
                        label={
                          <span>
                            Other Payment
                          </span>
                        }

                        autoComplete="off"
                        type="text"


                      />

                    </div>

                    <div className="grid md:col-span-2">
                      <Field
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
                        name="otherDeduction"
                        component={Input}
                        placeholder="Enter other deduction"
                        label={
                          <span>
                            Other Deduction
                          </span>
                        }

                        autoComplete="off"
                        type="text"

                      />

                    </div>


                    <div className="grid md:col-span-2">
                      <Field
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

                  <div className="grid lg:grid-cols-6 gap-x-3 mt-1 mb-2">
                    <div className="">
                      <Field
                        name="totalPFAmount"
                        component={Input}
                        placeholder="Enter provident fund contribution"
                        label={
                          <span>
                            Total Provident Fund Contribution
                          </span>
                        }

                        autoComplete="off"
                        type="text"

                      />

                    </div>

                    <div className="">
                      <Field
                        name="pf_employer_amount"
                        component={Input}
                        placeholder="Enter employer contribution"
                        label={
                          <span>
                            Employer Contribution
                          </span>
                        }

                        autoComplete="off"
                        type="text"

                      />

                    </div>

                    <div className="">
                      <Field
                        name="pf_employee_amount"
                        component={Input}
                        placeholder="Enter employee contribution"
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
                        label={
                          <span>
                            Total Payable Amount
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
                    HR
                  </h6>

                  <div className="grid lg:grid-cols-6 gap-x-3 mt-1 mb-2">
                    {/* <div className="">
                      <Field
                        name="exitClearence"
                        component={Input}
                        placeholder="Select exit clearance"
                        label={
                          <span>
                            Exit Clearance
                          </span>
                        }

                        autoComplete="off"
                        type="text"

                      />

                    </div> */}


                    <div className="">
                      <SearchSelect
                        label={
                          <span>
                            Exit Clearance
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }

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

                <button
                  type="submit"

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
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
