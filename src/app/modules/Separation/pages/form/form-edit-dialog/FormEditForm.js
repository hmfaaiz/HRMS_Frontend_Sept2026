import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  MaskInput,
  Select,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import axios from "axios";
import * as actions from "../../../_redux/redux-Actions";
import {
  fetchAllCity,
  fetchAllCountry,
  fetchAllDept,
  fetchAllEmployeesWithNoPermissionData,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
  getAllJobVacancy,

} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import {
  amountLimitDynamic,
  formatDates,
  getFileName,
  getUploadUrl,
} from "../../../../../utils/common";

import { subYears } from "date-fns";

import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import { fetchExitReasonData } from "../../../../Dashboard/_redux/dashboardActions";
import { Eye, XCircle } from "lucide-react";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";


export const getSeparationEditSchema = (formData) => {
  return Yup.object()
    .shape({

      employeeId: Yup.number()
        .required(VALIDATION_MESSAGES.required),

      exitTypeId: Yup.number()
        .required(VALIDATION_MESSAGES.required),

      exitReasonId: Yup.number()
        .required(VALIDATION_MESSAGES.required),


      resignationDate: Yup.date()

        .required(VALIDATION_MESSAGES.required),

      lastWorkingDate: Yup.date()
        .required(VALIDATION_MESSAGES.required)
        .min(
          Yup.ref("resignationDate"),
          "Last working day cannot be before resignation date"
        ),

      resignationAcceptanceDate: Yup.date()
        // .required(VALIDATION_MESSAGES.required)
        .nullable()
        .min(
          Yup.ref("resignationDate"),
          "Acceptance date day cannot be before resignation date"
        ),




      finalSettlementPolicy: Yup.number()

        .required(VALIDATION_MESSAGES.required),

      noticePeriodDays: Yup.number()

        .required(VALIDATION_MESSAGES.required),
      noticePeriodtype: Yup.number()

        .required(VALIDATION_MESSAGES.required),




      resignationAttachment: Yup.mixed()
        .required(VALIDATION_MESSAGES.required)
        .test("fileSize", "File size must be less than 1 MB", (value) => {
          // Skip validation if it's an existing file (string)
          if (typeof value === "string") return true;
          return value && value.size <= 3 * 1024 * 1024; // 3 MB
        })
        .test("fileType", "Unsupported file format", (value) => {
          if (typeof value === "string") return true;
          return (
            value &&
            [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "image/jpeg",
              "image/png",
            ].includes(value.type)
          );
        }),



    })


};

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
  const [servicePeriod, setGetServicePeriod] = useState("");
  const [policyMode, setPolicyMode] = useState("");
  const [separateMode, setSeparateMode] = useState("");



  const handlePolicyModalClose = () => {
    setPolicyMode(false);
separateMode(false)
  };


  //drop down
  useEffect(() => {
    if (!formData.Id) {



      dispatch(fetchAllFormsMenu(526, "allExitTypeList"));
      dispatch(fetchExitReasonData(formData?.exitTypeId));
      dispatch(
        fetchAllEmployeesWithNoPermissionData(
          "allEmployeesWithNoPermissionList"
        )
      );
    }
    else {
      dispatch(fetchExitReasonData(formData?.exitTypeId));
      dispatch(actions.fetchEmpBySeparationFlag({ flag: null, employeeId: formData?.employeeId }));

    }
  }, [dispatch, formData.Id]);


  const { currentState } = useSelector((state) => {
    return {
      currentState: state.separation,
      userAccess: state?.auth?.userAccess["separation"],
    };
  }, shallowEqual);

  const { dataForEdit, activeEmployeeList } = currentState;


  const { allEmployees } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees
    }),
    shallowEqual
  )


  const allEmployeetatus = [
    { value: 1, label: "Active Employee" },
    { value: 2, label: "Resigned Employee" },
    { value: 3, label: "Separated Employee" },
  ];

  const allfinalSettlementPolicy = [
    { value: 1, label: "Policy # 01" },
    { value: 2, label: "Policy # 02" },
    { value: 3, label: "Policy # 03" },
    { value: 4, label: "Policy # 04" },
  ];

  const allNoticePeriodType = [
    { value: 1, label: "Employee" },
    { value: 2, label: "Employer" },

  ];


  const getServicePeriod = (start, end) => {
    console.log("hitting222322",start,end)
    if (!start || !end) return "";

    const startDate = new Date(start);
    const endDate = new Date(end);

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();


    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += prevMonth.getDate();
    }


    if (months < 0) {
      years -= 1;
      months += 12;
    }
    setGetServicePeriod(`${years} Year(s), ${months} Month(s), ${days} Day(s)`)

    return `${years} Year(s), ${months} Month(s), ${days} Day(s)`;
  };


  useEffect(() => {
    if (formData.employeeId) {

      const selectedEmp = activeEmployeeList?.find(
        (emp) => emp.value === formData?.employeeId
      );
      console.log("selectedEmp1111", selectedEmp)
      if (selectedEmp) {
        setDepartmentId(selectedEmp?.departmentId)
        setDateOfJoining(selectedEmp?.dateOfJoining);
        console.log("hittin11111g", dateOfJoining, formData.lastWorkingDate)
        getServicePeriod(dateOfJoining, formData.lastWorkingDate);
        
      }
    }

  }, [activeEmployeeList]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...formData, }}
      validationSchema={getSeparationEditSchema(formData)}
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
        setFieldTouched
      }) => (
        <>


          {policyMode && (
            <>
              <Modal
                show={policyMode}
                onHide={!policyMode}
                style={{ zIndex: "99999" }}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Final Settlement Policy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="space-y-6">
                    {/* Policy #01 */}
                    <div className="p-4 border border-gray-200 rounded-2xl shadow-sm bg-white">
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        Policy # 01 [Process Salary in One Phase]
                      </h3>
                      <p className="text-gray-700 text-sm">
                        Process Salary from Starting Date of Current Payroll Month till Last Working Date in FINAL SETTLEMENT
                      </p>
                    </div>

                    {/* Policy #02 */}
                    <div className="p-4 border border-gray-200 rounded-2xl shadow-sm bg-white">
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        Policy # 02 [Process Salary in Two Phases]
                      </h3>
                      <p className="text-gray-700 text-sm">
                        During notice period only last month salary will be paid via FINAL SETTLEMENT remaining via 'Normal Payroll Process'
                      </p>
                    </div>

                    {/* Policy #03 */}
                    <div className="p-4 border border-gray-200 rounded-2xl shadow-sm bg-white">
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        Policy # 03 [Process Salary in Two Phases]
                      </h3>
                      <p className="text-gray-700 text-sm">
                        From 'Starting Date of Current Payroll Month' till 'Resignation Date' as Normal Salary.
                        Remaining Working days in FINAL SETTLEMENT
                      </p>
                    </div>

                    {/* Policy #04 */}
                    <div className="p-4 border border-gray-200 rounded-2xl shadow-sm bg-white">
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        Policy # 04 [Separated Employees]
                      </h3>
                      <p className="text-gray-700 text-sm">
                        These records are generated for Regular Payroll Process.
                      </p>
                    </div>
                  </div>
                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={handlePolicyModalClose}>
                    Cancel
                  </Button>


                </Modal.Footer>
              </Modal>
            </>
          )} 
          
          
           {separateMode && (
            <>
              <Modal
                show={separateMode}
                onHide={!separateMode}
                style={{ zIndex: "99999" }}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="space-y-6">

                      <span>Are you sure want to separate this record?</span>
                  
                  
                  </div>
                </Modal.Body>

               <Modal.Footer>
                       <div>
                         <button
                           type="button"
                           onClick={handlePolicyModalClose}
                           className="btn btn-light btn-elevate"
                         >
                           Cancel
                         </button>
                         <> </>
                         <button
                           type="button"
                         onClick={() =>
    dispatch(actions.separateById(
      { employeeId: formData.employeeId, Id: formData.Id },
      onHide
    ))
  }
                           className="btn btn-primary btn-elevate"
                         >
                           Yes
                           {loading && (
                             <span className="ml-3 mr-3 spinner spinner-white"></span>
                           )}
                         </button>
                       </div>
                     </Modal.Footer>
              </Modal>
            </>
          )}


          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right" autoComplete="off">
              <fieldset disabled={isdataForRead}>




                <div className="grid lg:grid-cols-6 gap-x-3 mt-1 mb-2">

                  {!formData.Id && (
                    <div className="">
                      <SearchSelect
                        label={
                          <span>
                            Employee Status
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        name="employeetatus"
                        onChange={(e) => {
                          setFieldValue("employeetatus", e?.value ?? null);
                          dispatch(actions.fetchEmpBySeparationFlag({ flag: e?.value, employeeId: null }));
                        }}
                        value={
                          allEmployeetatus?.find(
                            (option) =>
                              String(option.value) ===
                              String(values.employeetatus)
                          ) || null
                        }
                        error={errors.employeetatus}
                        touched={touched.employeetatus}
                        options={allEmployeetatus}
                      />
                    </div>
                  )}


                  <div className="">
                    <SearchSelect
                      name="employeeId"
                      className={!values.employeeId ? 'form-control is-invalid' : 'form-control'}
                      placeholder=""
                      isDisabled={formData.Id}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value === "Select" ? null : Number(e.value);
                        setFieldValue("employeeId", value);
                      

                        const selectedEmp = activeEmployeeList?.find(
                          (emp) => emp.value === value
                        );

                        if (selectedEmp) {
                          setDepartmentId(selectedEmp?.departmentId)
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
                      // value={values.employeeId}
                      autoComplete="off"

                      options={activeEmployeeList}
                      isSearchable={true} // Ensure search functionality is enabled
                      error={errors.employeeId}
                      touched={touched.employeeId}
                    />
                  </div>


                  <div className="mt-6">



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
                      >


                        <Eye className="w-4 h-4 text-white" />
                        View Details
                      </button>
                    )}




                  </div>
                </div>

                <EmployeeProfile
                  employeeId={values?.employeeId || formData?.employeeId}
                  panelMode={panelMode}
                />





                <hr></hr>
                {/* Personal Information */}


                <div >

                  <h6 className="font-bold mb-0 text-primary my-2">
                    Leaving Reasons
                  </h6>

                  <div className="grid lg:grid-cols-6 gap-x-3 mt-1">
                    <div className="">
                      <SearchSelect
                        name="exitTypeId"
                        label={
                          <span>
                            Exit Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead || !values.employeeId}
                        onChange={(e) => {
                          setFieldValue("exitTypeId", e.value || null);
                          dispatch(fetchExitReasonData(e.value));
                        }}
                        value={
                          dashboard?.allExitTypeList?.find(
                            (option) => option?.value == values?.exitTypeId
                          ) || null
                        }
                        options={dashboard?.allExitTypeList}
                        error={errors.exitTypeId}
                        touched={touched.exitTypeId}
                      />
                    </div>

                    <div className="">
                      <SearchSelect
                        name="exitReasonId"
                        label={
                          <span>
                            Exit Reason<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead || !values.employeeId}
                        onChange={(e) => {
                          setFieldValue("exitReasonId", e.value || null);

                        }}
                        value={
                          dashboard?.allExitReasonList?.find(
                            (option) => option?.value == values?.exitReasonId
                          ) || null
                        }
                        options={dashboard?.allExitReasonList}
                        error={errors.exitReasonId}
                        touched={touched.exitReasonId}
                      />
                    </div>

                    <div className="md:col-span-4">
                      <Field
                        name="exitRemark"
                        component={TextArea}
                        placeholder="Enter exit remarks"
                        label={<span>Exit Remarks</span>}
                        className="form-control "  // Force full height
                        autoComplete="off"
                      />
                    </div>

                  </div>







                </div>

                <hr></hr>

                <div

                >

                  <h6 className="font-bold mb-0 text-primary">
                    Resignation & Notice Period Info
                  </h6>




                  <div className="grid lg:grid-cols-6 gap-x-3">
                    <div className="">
                      <label>
                        Resignation Submission Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        className="form-control"
                        placeholder="Resignation Submission Date"
                        disabled={!values.employeeId}
                        component={DatePickerField}
                        selected={
                          values?.resignationDate
                            ? new Date(values.resignationDate)
                            : null
                        }
                        onChange={(date) => {
                          let selectedDate = formatDates(date, "yyyy-MM-dd");
                          setFieldValue("resignationDate", selectedDate);
                          if (date && values.lastWorkingDate) {
                            const diffDays = Math.floor(
                              (new Date(values.lastWorkingDate) - new Date(date)) /
                              (1000 * 60 * 60 * 24)
                            );
                            setFieldValue("noticePeriodDays", diffDays);

                          }
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="resignationDate"
                        autoComplete="off"
                        maxDate={new Date()}
                        minDate={new Date(dateOfJoining)}
                      />


                    </div>

                    <div className="">
                      <label>
                        Last Working Date<span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        className="form-control"
                        placeholder="Last Working date"
                        component={DatePickerField}
                        disabled={!values.employeeId}
                        selected={
                          values?.lastWorkingDate
                            ? new Date(values.lastWorkingDate)
                            : null
                        }
                        onChange={(date) => {
                          let selectedDate = formatDates(date, "yyyy-MM-dd");
                          setFieldValue("lastWorkingDate", selectedDate);
                          getServicePeriod(dateOfJoining,selectedDate)
                          if (values.resignationDate && date) {
                            const diffDays = Math.floor(
                              (new Date(date) - new Date(values.resignationDate)) /
                              (1000 * 60 * 60 * 24)
                            );
                            setFieldValue("noticePeriodDays", diffDays);
                            console.log("diff111", diffDays)

                          }
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="lastWorkingDate"
                        autoComplete="off"
                        // maxDate={new Date()}
                        minDate={new Date(dateOfJoining)}
                      />


                    </div>

                    <div className="">
                      <Field
                        name="totalServicePeriod"
                        component={Input}
                        placeholder="Auto total service period"
                        label={
                          <span>
                            Total Service Period
                          </span>
                        }
                        value={servicePeriod ||
                          dateOfJoining && values.lastWorkingDate
                          ? getServicePeriod(dateOfJoining, values.lastWorkingDate)
                          : ""
                        }
                        autoComplete="off"
                        type="text"
                        disabled
                      />

                    </div>


                    <div className="">
                      <SearchSelect
                        label={
                          <span>
                            Final Settlement Policy
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead || !values.employeeId}
                        name="finalSettlementPolicy"
                        onChange={(e) => {
                          setFieldValue("finalSettlementPolicy", e?.value ?? null);
                        }}

                        value={
                          allfinalSettlementPolicy?.find(
                            (option) => option?.value == values?.finalSettlementPolicy
                          ) || null
                        }
                        error={errors.finalSettlementPolicy}
                        touched={touched.finalSettlementPolicy}
                        options={allfinalSettlementPolicy}
                      />
                    </div>

                    <div className="mt-6">



                      {policyMode ? (
                        <button
                          type="button"
                          className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                          onClick={() => setPolicyMode(!policyMode)}
                        >
                          <XCircle className="w-3 h-3 text-black" />
                          Cancel
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary d-flex align-items-center gap-2"
                          onClick={() => setPolicyMode(!policyMode)}
                        >


                          <Eye className="w-4 h-4 text-white" />
                          View Details
                        </button>
                      )}




                    </div>



                  </div>




                  <div className="grid lg:grid-cols-6 gap-x-3">

                    <div>

                      <div className="flex items-center gap-1 mt-1">
                        <label>Accepted By</label>
                        <input
                          name="all_report_to"
                          type="checkbox"
                          // onChange={handleChange}
                          onChange={() =>
                            setFieldValue(
                              "all_report_to",
                              !values?.all_report_to
                            )
                          }
                          onBlur={handleBlur}
                          value={values.all_report_to}
                          checked={values.all_report_to}
                          label="Show All"
                        />
                        <label>Show All</label>
                        <ErrorMessage
                          className="form-feedBack"
                          name="all_report_to"
                          component="div"
                        />
                      </div>
                      <SearchSelect
                        name="acceptedEmployeeId"
                        isDisabled={isdataForRead || !values.employeeId}
                        // onBlur={() => {
                        //   handleBlur({ target: { name: "countryId" } });
                        // }}
                        onChange={(e) => {
                          setFieldValue("acceptedEmployeeId", e.value || null);


                        }}
                        value={
                          dashboard?.allEmployeesWithNoPermissionList?.find(
                            (option) => option?.value == values?.acceptedEmployeeId
                          ) || null
                        }
                        error={errors.acceptedEmployeeId}
                        touched={touched.acceptedEmployeeId}
                        // options={dashboard.allEmployees.filter(x => x.value != values.Id)}
                        options={[
                          { value: null, label: "Select" }, // Adding "All" option with value empty string


                          ...dashboard.allEmployeesWithNoPermissionList.filter(
                            (x) => {
                              if (values?.all_report_to) {
                                // If "All" is selected, do not filter by department and exclude current user
                                return x.value !== values.employeeId;
                              } else {
                                // If "All" is not selected, filter based on departmentId and exclude current user
                                return (
                                  x.departmentId === departmentId &&
                                  x.value !== values.employeeId
                                );
                              }
                            }
                          ),
                        ]}
                      />
                    </div>

                    <div className="">
                      <label>
                        Date of Resignation Acceptance
                      </label>
                      <Field
                        className="form-control"
                        placeholder="Date of Resignation Acceptance"
                        component={DatePickerField}
                        disabled={!values.employeeId}
                        selected={
                          values?.resignationAcceptanceDate
                            ? new Date(values.resignationAcceptanceDate)
                            : null
                        }
                        onChange={(date) => {
                          let selectedDate = formatDates(date, "yyyy-MM-dd");
                          setFieldValue("resignationAcceptanceDate", selectedDate);
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="resignationAcceptanceDate"
                        autoComplete="off"
                        maxDate={new Date()}
                        minDate={new Date(dateOfJoining)}

                      />


                    </div>

                    <div className="md:col-span-4">
                      <Field
                        name="acceptanceRemarks"
                        component={TextArea}
                        placeholder="Enter remarks"
                        label={<span>Remarks</span>}
                        className="form-control "  // Force full height
                        autoComplete="off"
                      />
                    </div>




                  </div>







                  <div className="grid lg:grid-cols-6 gap-x-3">

                    <div className="">
                      <Field
                        name="noticePeriodDays"
                        component={Input}
                        disabled={true}
                        placeholder="Auto notice period in days"
                        label={
                          <span>

                            Notice Period Days

                          </span>
                        }
                        value={
                          values.resignationDate && values.lastWorkingDate
                            ? Math.floor(
                              (new Date(values.lastWorkingDate) - new Date(values.resignationDate)) /
                              (1000 * 60 * 60 * 24)
                            )
                            : ""
                        }

                        autoComplete="off"
                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimitDynamic(
                            e.target.value,
                            3
                          ); // Limit to 3 digits
                        }}
                      />
                    </div>


                    <div className="">
                      <SearchSelect
                        label={
                          <span>
                            Notice Period Type
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead || !values.employeeId}
                        name="noticePeriodtype"
                        onChange={(e) => {
                          setFieldValue("noticePeriodtype", e?.value ?? null);
                        }}

                        value={
                          allNoticePeriodType?.find(
                            (option) => option?.value == values?.noticePeriodtype
                          ) || null
                        }
                        error={errors.noticePeriodtype}
                        touched={touched.noticePeriodtype}
                        options={allNoticePeriodType}
                      />
                    </div>

                    <div className="md:col-span-4">
                      <Field
                        name="hrRemarks"
                        component={TextArea}
                        placeholder="Enter hr remarks"
                        className="form-control"  // Force full height
                        label={
                          <span>

                            HR Remarks
                          </span>
                        }
                        autoComplete="off"
                      />

                    </div>


                  </div>


                </div>



                <div className="grid lg:grid-cols-6 gap-x-3">

                  <div className="col-span-1">

                    <FileUpload
                      label={
                        <>
                          Resignation Letter Attachment<span style={{ color: "red" }}>*</span>
                        </>
                      }
                      id="file"
                      name="file"
                      type="file"
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      ref={inputFile}
                      className="hidden"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("resignationAttachment", file);
                      }}


                    />
                    {errors.resignationAttachment && touched.resignationAttachment && (
                      <div className="invalid-feedback">{errors.resignationAttachment}</div>
                    )}


                    {/* </label> */}

                    {/* Show existing file if any */}
                    {formData.resignationAttachment && formData.resignationAttachment === formData.resignationAttachment && (
                      <div className="mt-2">
                        <strong>Existing File: </strong>
                        <a
                          href={getUploadUrl(formData.resignationAttachment)}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          {getFileName(formData.resignationAttachment)}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="">
                    <label className="flex items-center gap-2">
                      <Field
                        type="checkbox"
                        name="blackList"
                        checked={values.blackList}
                        onChange={(e) => setFieldValue("blackList", e.target.checked)}
                      />
                      <span>
                        Mark as Blacklisted
                      </span>
                    </label>
                    {errors.blackList && touched.blackList && (
                      <div className="invalid-feedback">{errors.blackList}</div>
                    )}
                  </div>




                  <div className="md:col-span-4">
                    <Field
                      name="blackListRemarks"
                      component={TextArea}
                      placeholder="Enter remarks"
                      className="form-control"  // Force full height
                      label={
                        <span>

                          Remarks
                        </span>
                      }
                      autoComplete="off"
                    />

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
                   disabled={formData.separatedFlag}
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


                {formData.Id && !formData.separatedFlag && (
                  <button

                    onClick={() => {
                      
                      setSeparateMode(true)
                    }}
                    className="btn btn-primary btn-elevate"
                  >
                    Separate
                    {loading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                )}

              </>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
