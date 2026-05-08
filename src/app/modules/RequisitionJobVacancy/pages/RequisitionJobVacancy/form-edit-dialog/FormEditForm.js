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
import { CircleX } from "lucide-react";

const jobVacancyEditSchema = Yup.object().shape({
  // jobCode: Yup.string()
  //   .min(5, "Job code must be  5 characters")
  //   .max(10, "Job code must be  10 characters")
    // .required(VALIDATION_MESSAGES.required),
  dateOfRequest: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  jobTitle: Yup.string()
    .min(1, "Job title must be at least 1 characters")
    .max(100, "Job title must be at most 100 characters")
    .required(VALIDATION_MESSAGES.required),

  locationId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  jobPreferenceId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  noOfPosition: Yup.number()
    .required(VALIDATION_MESSAGES.required)
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .max(999, VALIDATION_MESSAGES.maxNineHundredNinetyNineValue),
  hiringReasonId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  desireDateOfApp: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  workExpFrom: Yup.number()
    .nullable()
    .min(0, VALIDATION_MESSAGES.minZeroValue)

    .required(VALIDATION_MESSAGES.required),

  gradeId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  designationId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  workExpTo: Yup.number()
    .nullable()
    .min(0, VALIDATION_MESSAGES.minZeroValue)
    .max(60, "Experience (to) should not be greater than 60.")
    .required(VALIDATION_MESSAGES.required)
    .moreThan(
      Yup.ref("workExpFrom"),
      "Experience (to) must be greater than experience from",
    ),

  preferredQualificationId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  salaryRangeFrom: Yup.number()
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .required(VALIDATION_MESSAGES.required),

  salaryRangeTo: Yup.number()
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .required(VALIDATION_MESSAGES.required)
    .moreThan(
      Yup.ref("salaryRangeFrom"),
      "Salary To must be greater than Salary From",
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
      dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
      dispatch(fetchAllFormsMenu(410, "allHiringReasonList"));
      dispatch(fetchAllFormsMenu(442, "alljobPreferenceList"));
      dispatch(fetchAllFormsMenu(108, "allQualificationList"));

      dispatch(fetchAllParentDept());
      dispatch(
        fetchAllEmployeesWithNoPermissionData(
          "allEmployeesWithNoPermissionList",
        ),
      );
    } else {
      dispatch(
        fetchAllDesignationByGradeId(
          formData?.gradeId,
          "allDesignationByGrade",
        ),
      );
    }
  }, [dispatch, formData.Id]);

  const { currentUser, empAuthorityList, isPolicyExists } = useSelector(
    (state) => {
      return {
        currentUser: state.auth.user,
        empAuthorityList:
          state?.requisition_job_vacancy?.empAuthorityList || [],
        isPolicyExists: state?.requisition_job_vacancy?.isPolicyExists,
      };
    },
    shallowEqual,
  );

  // const fetchData = async (setJobCode) => {
  //   if (!formData.Id) {
  //     dispatch(
  //       getLatestTableId(
  //         "r_jobvacancy",
  //         "jobCode",
  //         "companyId =" + currentUser.companyId,
  //         setJobCode,
  //       ),
  //     );
  //   }
  // };
  // useEffect(() => {
  //   fetchData(setJobCode);
  // }, [formData.Id]);

  // jobPostingStatus 4: Requisition Request
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...formData,
        // jobCode: formData.jobCode ? formData?.jobCode : jobCode,
        departmentId: currentUser?.EmployeeMapping?.departmentId,
        dateOfRequest: formData?.dateOfRequest
          ? formData?.dateOfRequest
          : formatDates(new Date(), "yyyy-MM-dd"),

        jobSummary: he.decode(formData?.jobSummary || ""),
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

        saveForm({ ...values, authortiesList: empAuthorityList });
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
              <fieldset disabled={isdataForRead || !isPolicyExists}>
                {/* Job */}
                {/* {console.log("error", errors)} */}
                <div>
                  <div className="flex justify-between gap-2">
                    <div>
                      {empAuthorityList.length === 0 && !isPolicyExists ? (
                        <span className="text-xs text-red-500 font-semibold">
                          Designation workflow policy does not exist for this
                          employee.
                        </span>
                      ) : (
                        empAuthorityList.length === 0 &&
                        isPolicyExists && (
                          <span className="text-xs text-gray-500 font-semibold">
                            Workflow Policy is defined but there are no Workflow
                            Authorities as per the policy.
                          </span>
                        )
                      )}
                    </div>
                    <div className="items-end">
                      <CircleX
                        className="w-4 h-4 text-black cursor-pointer"
                        onClick={onHide}
                      />
                    </div>
                  </div>
                  {/* <h6>Job</h6> */}
                  {/* <div className="grid md:grid-cols-6 gap-x-2">
                   
                  </div> */}
                </div>

                {/* Job Vacany Detail */}
                {/* <hr></hr> */}

                <div className="grid md:grid-cols-1 gap-x-2">
                  <div>
                    <div>
                      {" "}
                      <h6 className="font-bold mb-0 text-primary my-1">
                        Job Vacany Detail
                      </h6>
                    </div>
                    <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-x-2">
                      {values?.Id ? (
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
                      ) : null}

                      <div className="">
                        <label>
                          {" "}
                          Date of Request{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <DatePicker
                          className="form-control"
                          placeholder="Date of Request "
                          selected={
                            values?.dateOfRequest
                              ? new Date(values.dateOfRequest)
                              : null
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
                        <SearchSelect
                          name="gradeId"
                          label={
                            <span>
                              Grade<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={isdataForRead || !isPolicyExists}
                          onChange={(e) => {
                            if (e?.value) {
                              setFieldValue("gradeId", e.value || null);
                              setFieldValue("designationId", null);
                              setFieldValue("jobTitle", "");
                              dispatch(
                                fetchAllDesignationByGradeId(
                                  e?.value,
                                  "allDesignationByGrade",
                                ),
                              );
                            }
                          }}
                          value={
                            dashboard?.allEmployeegradeList?.find(
                              (option) => option.value === values.gradeId,
                            ) || null
                          }
                          options={dashboard?.allEmployeegradeList}
                          error={errors.gradeId}
                          touched={touched.gradeId}
                        />
                      </div>
                      <div className="">
                        <SearchSelect
                          name="designationId"
                          label={
                            <span>
                              Designation<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={
                            isdataForRead || !values?.gradeId || !isPolicyExists
                          }
                          onChange={(e) => {
                            setFieldValue("designationId", e.value || null);
                            setFieldValue("jobTitle", e.label || ""); // Set job title based on designation
                          }}
                          value={
                            dashboard?.allDesignationByGrade?.find(
                              (option) => option.value === values.designationId,
                            ) || null
                          }
                          options={dashboard?.allDesignationByGrade}
                          error={errors.designationId}
                          touched={touched.designationId}
                        />
                      </div>
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
                          isDisabled={isdataForRead || !isPolicyExists}
                          onChange={(e) => {
                            setFieldValue("hiringReasonId", e.value || null);
                            setFieldValue("isReplacement", false);
                            setFieldValue("replacementEmpId", null);
                          }}
                          value={
                            dashboard?.allHiringReasonList?.find(
                              (option) =>
                                option.value === values.hiringReasonId,
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
                            disabled={
                              values.hiringReasonId === 427 ? false : true
                            }
                            // onChange={handleChange}
                            onChange={() =>
                              setFieldValue(
                                "isReplacement",
                                !values?.isReplacement,
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
                          isDisabled={
                            isdataForRead ||
                            !values.isReplacement ||
                            Number(values.hiringReasonId) !== 427 ||
                            !isPolicyExists
                          }
                          onChange={(e) => {
                            setFieldValue("replacementEmpId", e.value || null);
                          }}
                          value={
                            dashboard?.allEmployeesWithNoPermissionList?.find(
                              (option) =>
                                option?.value == values?.replacementEmpId,
                            ) || null
                          }
                          error={errors.replacementEmpId}
                          touched={touched.replacementEmpId}
                          options={[
                            { value: null, label: "Select" },
                            ...dashboard.allEmployeesWithNoPermissionList.filter(
                              (x) =>
                                x.departmentId ===
                                currentUser?.EmployeeMapping?.departmentId,
                            ),
                          ]}
                        />
                      </div>

                      <div className="">
                        <label>
                          <span>
                            Work Exp. From (No. of Years)
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        </label>
                        <Field
                          name="workExpFrom"
                          component={Input}
                          placeholder="Enter work experience (from)"
                          type="number"
                          onInput={(e) => {
                            e.target.value = amountLimitDynamic(
                              e.target.value,
                              2,
                            );
                          }}
                        />
                      </div>

                      <div className="">
                        <label>
                          <span>
                            Work Exp. To (No. of Years)
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        </label>
                        <Field
                          name="workExpTo"
                          component={Input}
                          placeholder="Enter work experience (to)"
                          type="number"
                          onInput={(e) => {
                            e.target.value = amountLimitDynamic(
                              e.target.value,
                              2,
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr></hr>

                {/* Position Preferences */}

                <div className="grid md:grid-cols-6 gap-x-2">
                  <div className="grid col-span-4">
                    <h6 className="font-bold mb-0 text-primary my-2">
                      Position Preferences
                    </h6>

                    <div className="grid md:grid-cols-4 gap-x-2">
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
                                      option?.value?.toString(),
                                    ),
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
                          isDisabled={isdataForRead || !isPolicyExists}
                          onChange={(e) => {
                            setFieldValue("jobPreferenceId", e.value || null);
                          }}
                          value={
                            dashboard?.alljobPreferenceList?.find(
                              (option) =>
                                option.value === values.jobPreferenceId,
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
                              : // : new Date()
                                (() => {
                                  const tomorrow = new Date();
                                  tomorrow.setDate(tomorrow.getDate() + 1); // current date + 1 day
                                  return tomorrow;
                                })()
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
                          isDisabled={isdataForRead || !isPolicyExists}
                          onChange={(e) => {
                            setFieldValue(
                              "preferredQualificationId",
                              e.value || null,
                            );
                          }}
                          value={
                            dashboard?.allQualificationList?.find(
                              (option) =>
                                option.value ===
                                values.preferredQualificationId,
                            ) || null
                          }
                          options={dashboard?.allQualificationList}
                          error={errors.preferredQualificationId}
                          touched={touched.preferredQualificationId}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <h6 className="font-bold mb-0 text-primary my-2">
                      {/* Salary Range (Per Month) */}
                      Proposed Salary Range (Per Month)
                    </h6>

                    <div className="grid md:grid-cols-2 gap-x-2 gap-y-1">
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
                          disabled={isdataForRead || !isPolicyExists}
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
                          disabled={isdataForRead || !isPolicyExists}
                          label={
                            <span>
                              To
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-2 gap-y-1 mt-1">
                  <div className="">
                    <RichTextInput
                      label="  Job Summary"
                      name="jobSummary"
                      touched={touched?.jobSummary}
                      disabled={isdataForRead || !isPolicyExists}
                      errors={errors?.jobSummary}
                      value={values?.jobSummary || ""}
                      onChange={(e) => {
                        setFieldValue("jobSummary", e);
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
                  <div>
                    <Field
                      name="reasonForRequest"
                      component={TextArea}
                      label="Reason for Request"
                    />
                  </div>
                  <div>
                    <Field
                      name="keyResponsibility"
                      component={TextArea}
                      label="Key Responsibility"
                    />
                  </div>
                </div>

                {/* Compensation & Benefits */}
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
                Submit
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
