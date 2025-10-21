import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import he from "he";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,
  fetchAllCountry,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
  getLatestTableId,
  fetchAllParentDept,
  fetchAllDesignationByGradeId,
  fetchAllEmployeesWithNoPermissionData,
  fetchAllDept,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import {
  amountLimit,
  amountLimitDynamic,
  formatDates,
} from "../../../../../utils/common";
import DatePicker from "react-datepicker";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { RichTextInput } from "../../../../../../_metronic/_partials/controls/forms/RichTextInput";

const jobVacancyEditSchema = Yup.object().shape({


  jobCode: Yup.string()
    .min(5, "Job code must be  5 characters")
    .max(10, "Job code must be  10 characters")
    .required(VALIDATION_MESSAGES.required),
  dateOfRequest: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  jobTitle: Yup.string()
    .min(1, "Job title must be at least 1 characters")
    .max(100, "Job title must be at most 100 characters")
    .required(VALIDATION_MESSAGES.required),

  locationId: Yup.string()
    .nullable().required(VALIDATION_MESSAGES.required),
  jobPreferenceId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  noOfPosition: Yup.number()
    .required(VALIDATION_MESSAGES.required)
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .max(999, VALIDATION_MESSAGES.maxNineHundredNinetyNineValue),
  hiringReasonId: Yup.string()
    .nullable().required(VALIDATION_MESSAGES.required),

  desireDateOfApp: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required),



  // notApprovedRemarks: Yup.string().when("decision", {
  //     is: 0, // if decision === 2
  //     then: (schema) => schema.required(VALIDATION_MESSAGES.required),
  //     otherwise: (schema) => schema.nullable().notRequired(),
  //   }),

  workExpFrom: Yup.number()
  .nullable()
    .min(0, VALIDATION_MESSAGES.minZeroValue)

    .required(VALIDATION_MESSAGES.required),

  workExpTo: Yup.number()
   .nullable()
    .min(0, VALIDATION_MESSAGES.minZeroValue)
    .required(VALIDATION_MESSAGES.required)
    .moreThan(
      Yup.ref("workExpFrom"),
      "Experience (to) must be greater than experience from"
    ),

  preferredQualificationId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  decision: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  requisitionReferenceNo: Yup.string()
    .nullable(),
    // .required(VALIDATION_MESSAGES.required),


  salaryRangeFrom: Yup.number()
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .required(VALIDATION_MESSAGES.required),

  salaryRangeTo: Yup.number()
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .required(VALIDATION_MESSAGES.required)
    .moreThan(
      Yup.ref("salaryRangeFrom"),
      "Salary To must be greater than Salary From"
    ),

  isReplacement: Yup.boolean(),
  replacementEmpId: Yup.string()
    .nullable()
    .when("isReplacement", {
      is: true, // jab isReplacement true ho
      then: (schema) => schema.required(VALIDATION_MESSAGES.required),
      otherwise: (schema) => schema.notRequired(),
    }),

  // jobSummary: Yup.string().required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isdataForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const [jobCode, setJobCode] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  //drop down
  useEffect(() => {
    if (!formData.Id) {

      dispatch(fetchAllFormsMenu(89, "allLocationChildMenus")); // For Location

      dispatch(fetchAllFormsMenu(410, "allHiringReasonList"));
      dispatch(fetchAllFormsMenu(442, "alljobPreferenceList"));
      dispatch(fetchAllFormsMenu(108, "allQualificationList"));

      dispatch(fetchAllParentDept());
      dispatch(fetchAllEmployeesWithNoPermissionData("allEmployeesWithNoPermissionList"));
      dispatch(fetchAllDept());
    }
  }, [dispatch, formData.Id]);

  const { currentUser } = useSelector((state) => {
    return {

      currentUser: state.auth.user,
    };
  }, shallowEqual);

  console.log("currentUser1111", currentUser)

  const fetchData = async (setJobCode) => {
    if (!formData.Id) {
      dispatch(
        getLatestTableId(
          "r_jobvacancy",
          "jobCode",
          "companyId =" + currentUser.companyId,
          setJobCode
        )
      );
    }
  };
  useEffect(() => {
    fetchData(setJobCode);
  }, [formData.Id]);

  const decisionOptions = [
    { value: 0, label: "Not Approved" },
    { value: 1, label: "Approved" },
    // { value: 2, label: "Send Back for Clarification" },

  ];

  // jobPostingStatus 4: Requisition Request
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...formData,
        jobCode: formData.jobCode ? formData?.jobCode : jobCode, departmentId: currentUser?.EmployeeMapping?.departmentId,
        dateOfRequest: formData?.dateOfRequest
          ? formData?.dateOfRequest
          : formatDates(new Date(), "yyyy-MM-dd"), dateOfReviewed: formData?.dateOfReviewed
            ? formData?.dateOfReviewed
            : formatDates(new Date(), "yyyy-MM-dd"),

        jobSummary: he.decode(
          formData?.jobSummary || ""
        ),
      }}
      validationSchema={jobVacancyEditSchema}
      onSubmit={(values) => {
        values.preferredAgeFrom =
          values.preferredAgeFrom === "" || values.preferredAgeFrom === null
            ? null
            : Number(values.preferredAgeFrom);

        values.preferredAgeTo =
          values.preferredAgeTo === "" || values.preferredAgeTo === null
            ? null
            : Number(values.preferredAgeTo);
        enableLoading();

        saveForm(values);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        handleChange,
        setFieldTouched,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isdataForRead}>
                {/* Job */}
                {console.log("errors111", errors)}
                <div>
                  {/* <h6>Job</h6> */}
                  <div className="grid md:grid-cols-6 gap-x-3">
                    <div className="">
                      <label>
                        <span>
                          Job Code<span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="jobCode"
                        component={Input}
                        placeholder="Enter code"
                        disabled={true}
                        type="text"
                        minLength={5}
                        maxLength={10}
                      />
                      {/* {errors.jobCode && (
                        <div className="invalid-feedback d-block">{errors.jobCode}</div>
                      )} */}
                    </div>

                    <div className="">
                      <label>
                        {" "}
                        Date Of Recieved <span style={{ color: "red" }}>*</span>
                      </label>
                      <DatePicker
                        className="form-control"
                        placeholder="Date of Recieved "
                        selected={
                          values?.dateOfRequest ? new Date(values.dateOfRequest) : null
                        }
                        disabled={true}
                        dateFormat="dd-MMM-yyyy"
                        name="dateOfRequest"
                        autoComplete="off"
                        minDate={new Date()}
                        maxDate={new Date()}
                      />

                      {touched.dateOfRequest && errors.dateOfRequest && (
                        <div className="invalid-feedback d-block">
                          {errors.dateOfRequest}
                        </div>
                      )}
                    </div>


                    <div className="">
                      <label>
                        {" "}
                        Date Of Reviewed<span style={{ color: "red" }}>*</span>
                      </label>
                      <DatePicker
                        className="form-control"
                        placeholder="Date Of Reviewed "
                        selected={
                          values?.dateOfReviewed ? new Date(values.dateOfReviewed) : null
                        }
                        disabled={true}
                        dateFormat="dd-MMM-yyyy"
                        name="dateOfReviewed"
                        autoComplete="off"
                        minDate={new Date()}
                        maxDate={new Date()}
                      />

                      {touched.dateOfReviewed && errors.dateOfReviewed && (
                        <div className="invalid-feedback d-block">
                          {errors.dateOfReviewed}
                        </div>
                      )}
                    </div>



                    <div>


                      <label>Requested By</label>



                      <SearchSelect
                        name="requestedBy"
                        isDisabled={true}

                        onChange={(e) => {
                          setFieldValue("requestedBy", e.value || null);


                        }}
                        // value={
                        //   dashboard?.allEmployeesWithNoPermissionList?.find(
                        //     (option) => option?.value == values?.requestedBy  || option?.value == currentUser?.employeeIdMapping
                        //   ) || null
                        // }

                        value={
                          dashboard?.allEmployeesWithNoPermissionList?.find(
                            (option) =>
                              option?.value ===
                              (values?.requestedBy ?? currentUser?.employeeIdMapping)
                          ) || null
                        }
                        error={errors.requestedBy}
                        touched={touched.requestedBy}

                        options={dashboard.allEmployeesWithNoPermissionList}

                      />
                    </div>





                    <div>


                      <label>Request Reviewed By </label>



                      <SearchSelect
                        name="requestReviewedBy"
                        isDisabled={true}

                        onChange={(e) => {
                          setFieldValue("requestReviewedBy", e.value || null);


                        }}
                        value={
                          dashboard?.allEmployeesWithNoPermissionList?.find(
                            (option) => option?.value == values?.requestReviewedBy || option?.value == currentUser?.employeeIdMapping
                          ) || null
                        }
                        error={errors.requestReviewedBy}
                        touched={touched.requestReviewedBy}

                        options={dashboard.allEmployeesWithNoPermissionList}

                      />
                    </div>


                    <div className="">
                      <label>
                        <span>
                          Requisition Reference No. (if any)
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </span>
                      </label>
                      <Field
                        name="requisitionReferenceNo"
                        component={Input}
                        placeholder="Enter requisition reference no."
                        type="number"
                        max={20}
                      />
                    </div>

                  </div>
                </div>


                {/* Job Vacany Detail */}
                <hr></hr>

                <div className="grid md:grid-cols-1 gap-x-3">
                  <div>
                    <div>
                      {" "}
                      <h6 className="font-bold mb-0 text-primary my-2">
                        Job Vacany Detail
                      </h6>
                    </div>
                    <div className="grid md:grid-cols-6 gap-x-3">
                      <div className="">
                        <label>
                          <span>
                            Job Title<span style={{ color: "red" }}>*</span>
                          </span>
                        </label>
                        <Field
                          name="jobTitle"
                          component={Input}
                          placeholder="Enter job title"
                          type="text"
                        />
                      </div>

                      <div className="">
                        <label>
                          <span>
                            No.of Positions
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        </label>
                        <Field
                          name="noOfPosition"
                          component={Input}
                          placeholder="Enter no of position"
                          type="number"
                        />
                      </div>


                      <div className="">
                        <SearchSelect
                          name="hiringReasonId"
                          label={
                            <span>
                              Hiring Reason
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={isdataForRead}
                          onChange={(e) => {
                            setFieldValue("hiringReasonId", e.value || null);
                          }}
                          value={
                            dashboard?.allHiringReasonList?.find(
                              (option) => option.value === values.hiringReasonId
                            ) || null
                          }
                          options={dashboard?.allHiringReasonList}
                          error={errors.hiringReasonId}
                          touched={touched.hiringReasonId}
                        />
                      </div>


                      <div>

                        <div className="flex items-center gap-1 mt-1">
                          <label>Replacement By</label>
                          <input
                            name="isReplacement"
                            type="checkbox"
                            // onChange={handleChange}
                            onChange={() =>
                              setFieldValue(
                                "isReplacement",
                                !values?.isReplacement
                              )
                            }

                            value={values.isReplacement}
                            checked={values.isReplacement}
                            label="Is Replacement"
                          />

                          <ErrorMessage
                            className="form-feedBack"
                            name="isReplacement"
                            component="div"
                          />
                        </div>
                        <SearchSelect
                          name="replacementEmpId"
                          isDisabled={isdataForRead || !values.isReplacement}

                          onChange={(e) => {
                            setFieldValue("replacementEmpId", e.value || null);


                          }}
                          value={
                            dashboard?.allEmployeesWithNoPermissionList?.find(
                              (option) => option?.value == values?.replacementEmpId
                            ) || null
                          }
                          error={errors.replacementEmpId}
                          touched={touched.replacementEmpId}

                          options={[
                            { value: null, label: "Select" },
                            ...dashboard.allEmployeesWithNoPermissionList.filter(
                              (x) => x.departmentId === currentUser?.EmployeeMapping?.departmentId
                            ),
                          ]}

                        />
                      </div>


                       <div className="">
                                          <label>
                                            <span>
                                              Work Experience From
                                              <span style={{ color: "red" }}>*</span>
                                            </span>
                                          </label>
                                          <Field
                                            name="workExpFrom"
                                            component={Input}
                                            placeholder="Enter work experience (from)"
                                            type="number"
                                            onInput={(e) => {
                                              e.target.value = amountLimitDynamic(e.target.value, 2);
                                            }}
                                          />
                                        </div>
                      
                                        <div className="">
                                          <label>
                                            <span>
                                              Work Experience To
                                              <span style={{ color: "red" }}>*</span>
                                            </span>
                                          </label>
                                          <Field
                                            name="workExpTo"
                                            component={Input}
                                            placeholder="Enter work experience (to)"
                                            type="number"
                                            onInput={(e) => {
                                              e.target.value = amountLimitDynamic(e.target.value, 2);
                                            }}
                                          />
                                        </div>

                    </div>

                  </div>


                </div>






                <hr></hr>

                {/* Position Preferences */}

                <div className="grid md:grid-cols-6 gap-x-3">
                  <div className="grid col-span-6">
                    <h6 className="font-bold mb-0 text-primary my-2">
                      Position Preferences
                    </h6>

                    <div className="grid md:grid-cols-6 gap-x-3 ">



                      <div className="">
                        <label>
                          {" "}
                          Location<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="overflow-auto max-h-16 border-none scrollbar-fancy">
                          {dashboard.allLocationChildMenus?.map((option) => (
                            <div key={option?.value}>
                              <label className="flex items-center space-x-1">
                                <input
                                  className="mr-1"
                                  name="locationId"
                                  type="checkbox"
                                  value={option?.value}
                                  checked={Boolean(
                                    values?.locationId?.includes(
                                      option?.value?.toString()
                                    )
                                  )}
                                  onChange={handleChange}
                                />
                                {option?.label}{" "}
                              </label>
                            </div>
                          ))}
                        </div>
                        {errors.locationId && touched.locationId && (
                          <div className="invalid-feedback">
                            {errors.locationId}
                          </div>
                        )}
                      </div>
                      <div className="">
                        <SearchSelect
                          name="jobPreferenceId"
                          label={
                            <span>
                              Job Preference
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={isdataForRead}
                          onChange={(e) => {
                            setFieldValue("jobPreferenceId", e.value || null);
                          }}
                          value={
                            dashboard?.alljobPreferenceList?.find(
                              (option) =>
                                option.value === values.jobPreferenceId
                            ) || null
                          }
                          options={dashboard?.alljobPreferenceList}
                          error={errors.jobPreferenceId}
                          touched={touched.jobPreferenceId}
                        />
                      </div>


                      <div className="">
                        <label>
                          {" "}
                          Desire Date of Appointment
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Field
                          className="form-control"
                          component={DatePickerField}
                          placeholder="Desire Date of Appointment"
                          selected={
                            values?.desireDateOfApp
                              ? new Date(values.desireDateOfApp)
                              : null
                          }
                          onChange={(date) => {
                            let selectedDate = formatDates(date, "yyyy-MM-dd");

                            setFieldValue("desireDateOfApp", selectedDate);
                          }}
                          dateFormat="dd-MMM-yyyy"
                          name="desireDateOfApp"
                          autoComplete="off"
                          minDate={
                            values?.jobPostingDateFrom
                              ? new Date(values.jobPostingDateFrom)
                              : new Date()
                          }

                        />


                      </div>
                      <div className="">
                        <SearchSelect
                          name="preferredQualificationId"
                          label={
                            <span>
                              Qualification
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={isdataForRead}
                          onChange={(e) => {
                            setFieldValue(
                              "preferredQualificationId",
                              e.value || null
                            );
                          }}
                          value={
                            dashboard?.allQualificationList?.find(
                              (option) =>
                                option.value === values.preferredQualificationId
                            ) || null
                          }
                          options={dashboard?.allQualificationList}
                          error={errors.preferredQualificationId}
                          touched={touched.preferredQualificationId}
                        />
                      </div>


                      <div className="">
                        <SearchSelect
                          name="departmentId"
                          label={
                            <span>
                              Department
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={isdataForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("departmentId", e.value || null);

                          }}

                          value={
                            dashboard.allDept?.find(
                              (option) => option?.value === values?.departmentId
                            ) || null
                          }
                          error={errors.departmentId}
                          touched={touched.departmentId}
                          options={dashboard.allDept}
                        />
                      </div>
                    </div>


                  </div>
                </div>



                <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-1">
                  <div className="">
                    <RichTextInput
                      label="  Job Summary"
                      name="jobSummary"
                      touched={touched?.jobSummary}
                      errors={errors?.jobSummary}
                      value={values?.jobSummary || ""}
                      onChange={(e) => {
                        setFieldValue("jobSummary", e);
                      }}


                    />
                  </div>
                </div>



                <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-1">
                  <div >
                    <Field
                      name="reasonForRequest"
                      component={TextArea}
                      label="Reason for Request"
                    />
                  </div>
                </div>


                <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-1">
                  <div >
                    <Field
                      name="keyResponsibility"
                      component={TextArea}
                      label="Key Responsibility"
                    />
                  </div>
                </div>


                <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-1">
                  <div >
                    <Field
                      name="hrRemarks"
                      component={TextArea}
                      label="HR Remarks"
                    />
                  </div>
                </div>


                <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-1">
                  <div >
                    <Field
                      name="additionalNotes"
                      component={TextArea}
                      label="Additional Notes"
                    />
                  </div>
                </div>



                {/* Compensation & Benefits */}

                <hr></hr>

                <h6 className="font-bold mb-0 text-primary my-2">
                  Salary Range (Per Month)
                </h6>

                <div className="grid md:grid-cols-6 gap-x-3 gap-y-1">
                  <div className="">
                    <AmountInput
                      field={{
                        name: `salaryRangeFrom`,
                        value: values?.salaryRangeFrom,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      disabled={isdataForRead}
                      placeholder="Enter salary range (from)"
                      label={
                        <span>
                          From
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  </div>

                  <div className="">
                    <AmountInput
                      field={{
                        name: `salaryRangeTo`,
                        value: values?.salaryRangeTo,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      placeholder="Enter salary range (to)"
                      disabled={isdataForRead}
                      label={
                        <span>
                          To
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  </div>



                </div>


                <div className="grid md:grid-cols-6 gap-x-3 gap-y-1">

                  <div className="md:col-span-1 mt-1">
                    <label htmlFor="decision">
                      Decision<span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="decision"
                      as="select"
                      className="form-control"
                      disabled={isdataForRead}
                      onChange={(e) => {
                        setFieldValue("decision", e.target.value); // Use the raw value
                        setFieldValue("notApprovedRemarks", "")
                      }}
                    >
                      <option value="">Select </option>
                      {decisionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    {errors.decision &&
                      touched.decision && (
                        <div className="text-red-400 text-xs mt-1">
                          {errors.decision}
                        </div>
                      )}
                  </div>





                  <div className="md:col-span-5 mt-1">
                    <Field
                      name="notApprovedRemarks"

                      component={TextArea}
                      label="Decision Remarks"
                    />
                  </div>
                </div>
                <hr></hr>




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
      )
      }
    </Formik >
  );
}
