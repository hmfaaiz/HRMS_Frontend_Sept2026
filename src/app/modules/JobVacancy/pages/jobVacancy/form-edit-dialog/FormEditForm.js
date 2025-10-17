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
  subsidiaryId: Yup.string().required(VALIDATION_MESSAGES.required),

  jobCode: Yup.string()
    .min(5, "Job code must be  5 characters")
    .max(10, "Job code must be  10 characters")
    .required(VALIDATION_MESSAGES.required),
  jobDate: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  designationId: Yup.number()
  .nullable()
  .required(VALIDATION_MESSAGES.required),
  jobTitle: Yup.string()
    .min(1, "Job title must be at least 1 characters")
    .max(100, "Job title must be at most 100 characters")
    .required(VALIDATION_MESSAGES.required),
  gradeId: Yup.number()
  .nullable()
  .required(VALIDATION_MESSAGES.required),
  locationId: Yup.string().required(VALIDATION_MESSAGES.required),
  countryId: Yup.number().nullable(), // optional banane ke liye

  cityId: Yup.string()
    .nullable() // <- apply globally
    .when("countryId", {
      is: (val) => val !== undefined && val !== null && val !== "",
      then: Yup.string().required(VALIDATION_MESSAGES.required),
    }),

  // employeeTypeId: Yup.number().required(VALIDATION_MESSAGES.required),
  // employeeStatusId: Yup.number().required(VALIDATION_MESSAGES.required),
  departmentId: Yup.number().required(VALIDATION_MESSAGES.required),
  jobPostingDateFrom: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .typeError("Invalid date"),

  // jobPostingDateTo: Yup.date()
  //   .nullable()
  //   .required(VALIDATION_MESSAGES.required)
  //   .typeError("Invalid date")
  //   .min(
  //     Yup.ref("jobPostingDateFrom"),
  //     "Job Posting To date must be after From date"
  //   ),
  // jobPostingDateTo: Yup.date()
  //   .nullable()
  //   .required(VALIDATION_MESSAGES.required)
  //   .typeError("Invalid date")
  //   .min(
  //     Yup.ref("jobPostingDateFrom"),
  //     "Job Posting To date must be after From date"
  //   )
  //   .max(
  //     Yup.ref("jobPeriodEnd"),
  //     "Job Posting To date must be before Job Period End"
  //   ),

  jobPostingDateTo: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .min(
      Yup.ref("jobPostingDateFrom"),
      "Job Posting To date must be after From date"
    )
    .when("jobPeriodEnd", (jobPeriodEnd, schema) =>
      jobPeriodEnd
        ? schema.max(
          Yup.ref("jobPeriodEnd"),
          "Job Posting To date must be before Job Period End"
        )
        : schema
    ),

  reportToDesignationId: Yup.number()
  .nullable()
    .required(VALIDATION_MESSAGES.required)
    .test(
      "not-same-as-designation",
      "Designation and Reporting Designation cannot be the same",
      function (value) {
        const { designationId } = this.parent;
        return value !== designationId;
      }
    ),
  relationshipWithReportTo: Yup.string()
  .nullable()
    .min(5, "Must be  5 characters")
    .required(VALIDATION_MESSAGES.required),
  noOfPosition: Yup.number()
    .required(VALIDATION_MESSAGES.required)
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .max(999, VALIDATION_MESSAGES.maxNineHundredNinetyNineValue),
  hiringReasonId: Yup.string().required(VALIDATION_MESSAGES.required),
  jobPreferenceId: Yup.string().required(VALIDATION_MESSAGES.required),
  // appointmentTypeId: Yup.number()
  // .nullable()
  // .required(VALIDATION_MESSAGES.required),
  priorityTypeId: Yup.number()
  .nullable()
  .required(VALIDATION_MESSAGES.required),

  jobPeriodStart: Yup.date()
    .nullable()
    .min(Yup.ref("jobPostingDateTo"), "Start date must be after posting date"),
  jobPeriodEnd: Yup.date()
    .nullable()
    .min(Yup.ref("jobPeriodStart"), "End date must be after start date"),
  comment: Yup.string(),

  desireDateOfApp: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .min(
      Yup.ref("jobPostingDateFrom"),
      "Desire Date of Appointment must be after Job Posting Date From"
    )

    .test(
      "within-job-period",
      "Desired Date of Appointment must be within the Job Period range",
      function (value) {
        const { jobPeriodStart, jobPeriodEnd } = this.parent;

        if (!value) return true; // Already handled by .required()

        if (jobPeriodStart && value > jobPeriodStart) {
          return this.createError({
            message:
              "Desired Date of Appointment must be before or same as Job Period Start",
          });
        }

        if (jobPeriodEnd && value > jobPeriodEnd) {
          return this.createError({
            message:
              "Desired Date of Appointment must be before or same as Job Period End",
          });
        }

        return true;
      }
    ),

  preferredAgeFrom: Yup.number()
    .nullable()
    .min(15, VALIDATION_MESSAGES.minAgeFifteenValue)
    .max(99, VALIDATION_MESSAGES.maxAgeNinetyNineValue),

  preferredAgeTo: Yup.number()
    .nullable()
    .min(15, VALIDATION_MESSAGES.minAgeFifteenValue)
    .max(99, VALIDATION_MESSAGES.maxAgeNinetyNineValue)
    .moreThan(
      Yup.ref("preferredAgeFrom"),
      "Preferred age (to) must be greater than age (from)"
    ),
  preferredShiftId: Yup.string().nullable().required(VALIDATION_MESSAGES.required),
  preferredGenderId: Yup.string().nullable().required(VALIDATION_MESSAGES.required),
  preferredQualificationId: Yup.number().required(VALIDATION_MESSAGES.required),
  // preferredJobSkillsId: Yup.string().required(VALIDATION_MESSAGES.required),
  preferredJobSkillsId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .test(
      "no-duplicate-skills",
      "Preferred and optional skills must not have overlapping values.",
      function (value) {
        const { optionalJobSkillsId } = this.parent;

        if (!value || !optionalJobSkillsId) return true;

        const preferredIds = value.split(",").map((id) => id.trim());
        const optionalIds = optionalJobSkillsId
          .split(",")
          .map((id) => id.trim());

        const hasCommon = preferredIds.some((id) => optionalIds.includes(id));
        return !hasCommon;
      }
    ),

  optionalJobSkillsId: Yup.string().nullable(),
  preferredJobIndustryId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
  workExpFrom: Yup.number()
    .min(0, VALIDATION_MESSAGES.minZeroValue)

    .required(VALIDATION_MESSAGES.required),

  workExpTo: Yup.number()
    .min(0, VALIDATION_MESSAGES.minZeroValue)
    .required(VALIDATION_MESSAGES.required)
    .moreThan(
      Yup.ref("workExpFrom"),
      "Experience (to) must be greater than experience from"
    ),
  // workExpDetail: Yup.string().required(VALIDATION_MESSAGES.required),
  // additionalReq: Yup.string().required(VALIDATION_MESSAGES.required),
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
  // incentivePackages: Yup.string().required(VALIDATION_MESSAGES.required),
  // otherBenefits: Yup.string().required(VALIDATION_MESSAGES.required),
  jobSummary: Yup.string(),
  // .required(VALIDATION_MESSAGES.required),
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

  //drop down
  useEffect(() => {
    if (!formData.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      // dispatch(fetchAllFormsMenu(158, "allDesignations"));
      dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
      dispatch(fetchAllCountry());
      dispatch(fetchAllCity());
      dispatch(fetchAllFormsMenu(89, "allLocationChildMenus")); // For Location
      dispatch(fetchAllFormsMenu(377, "allEmpTypeDynamicChildMenus"));
      dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus"));
      dispatch(fetchAllFormsMenu(275, "allEmployeeStatus"));
      dispatch(fetchAllFormsMenu(410, "allHiringReasonList"));
      dispatch(fetchAllFormsMenu(442, "alljobPreferenceList"));
      dispatch(fetchAllFormsMenu(409, "allAppointmentTypeList"));
      dispatch(fetchAllFormsMenu(412, "allPriorityTypeList"));
      dispatch(fetchAllFormsMenu(108, "allQualificationList"));
      dispatch(fetchAllFormsMenu(413, "allJobShiftList"));
      dispatch(fetchAllFormsMenu(187, "allGenderList"));
      dispatch(fetchAllFormsMenu(414, "allJobSkillList"));
      dispatch(fetchAllFormsMenu(416, "allJobIndustryList"));
      dispatch(fetchAllParentDept());
    }
  }, [dispatch, formData.Id]);

  const { currentState, userAccess, currentUser } = useSelector((state) => {
    return {
      currentState: state.job_vacancy,
      userAccess: state?.auth?.userAccess["job_vacancy"],
      currentUser: state.auth.user,
    };
  }, shallowEqual);

  const { dataForEdit } = currentState;

  const filteredCities = (countryId) => {
    return dashboard?.allCity?.filter((city) => city.code === countryId) || [];
  };

  const cleanedFormData = useMemo(() => {
    if (formData && !isdataForRead && formData.jobPostingStatus === 3) {
      const {
        Id,
        jobCode,
        jobFinalizedeDate,
        jobPostingStatus,
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
        jobDate,
        ...rest
      } = formData;
      return rest;
    }
    return formData;
  }, [formData]);

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
  }, []);

  useEffect(() => {
    if (cleanedFormData?.gradeId) {
      dispatch(fetchAllDesignationByGradeId(cleanedFormData?.gradeId, "allDesignationByGrade"))
    }
  }, [cleanedFormData?.gradeId])

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...cleanedFormData,
        jobCode: cleanedFormData.jobCode ? cleanedFormData?.jobCode : jobCode,
        jobDate: cleanedFormData?.jobDate
          ? cleanedFormData?.jobDate
          : formatDates(new Date(), "yyyy-MM-dd"),

        comment: he.decode(
          cleanedFormData?.comment || ""
        ), workExpDetail: he.decode(
          cleanedFormData?.workExpDetail || ""
        ), additionalReq: he.decode(
          cleanedFormData?.additionalReq || ""
        ), incentivePackages: he.decode(
          cleanedFormData?.incentivePackages || ""
        ), otherBenefits: he.decode(
          cleanedFormData?.otherBenefits || ""
        ), jobSummary: he.decode(
          cleanedFormData?.jobSummary || ""
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
                        Job Date<span style={{ color: "red" }}>*</span>
                      </label>
                      <DatePicker
                        className="form-control"
                        placeholder="Job Date"
                        selected={
                          values?.jobDate ? new Date(values.jobDate) : null
                        }
                        disabled={true}
                        dateFormat="dd-MMM-yyyy"
                        name="jobDate"
                        autoComplete="off"
                        minDate={new Date()}
                        maxDate={new Date()}
                      />

                      {touched.jobDate && errors.jobDate && (
                        <div className="invalid-feedback d-block">
                          {errors.jobDate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Request For */}

                <hr></hr>

                <div className="mt-1">
                  <h6 className="font-bold mb-0 text-primary my-2">
                    Request For
                  </h6>

                  <div className="grid lg:grid-cols-6 gap-x-3 gap-y-1">
                    <div className="">
                      <SearchSelect
                        name="gradeId"
                        label={
                          <span>
                            Grade<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          if (e?.value) {
                            setFieldValue("gradeId", e.value || null);
                            setFieldValue("designationId", null)
                            setFieldValue("jobTitle", "")
                            dispatch(fetchAllDesignationByGradeId(e?.value, "allDesignationByGrade"))
                          }
                        }}
                        value={
                          dashboard?.allEmployeegradeList?.find(
                            (option) => option.value === values.gradeId
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
                        isDisabled={isdataForRead || !values?.gradeId}
                        onChange={(e) => {
                          setFieldValue("designationId", e.value || null);
                          setFieldValue("jobTitle", e.label || ""); // Set job title based on designation
                        }}
                        value={
                          dashboard?.allDesignationByGrade?.find(
                            (option) => option.value === values.designationId
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
                      {/* <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === values.subsidiaryId
                          ) || null
                        }
                        options={dashboard?.allSubsidiaryList}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      /> */}
                      <SubsidiarySelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                        currentValue={values?.subsidiaryId}
                        initializeSubsidiary={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                      />
                    </div>

                    <div className="">
                      <SearchSelect
                        name="countryId"
                        label={<span>Country</span>}
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          const selectedCountryId = e.value || null;
                          setFieldValue("countryId", selectedCountryId);
                          setFieldValue("cityId", null); // Reset city on country change
                        }}
                        value={
                          dashboard?.allCountry?.find(
                            (option) => option.value === values.countryId
                          ) || null
                        }
                        options={dashboard?.allCountry}
                        error={errors.countryId}
                        touched={touched.countryId}
                      />
                    </div>

                    <div className="">
                      <label>City</label>

                      <div className="overflow-auto max-h-16 border-none scrollbar-fancy">
                        {filteredCities(values.countryId).map((option) => (
                          <div key={option?.value}>
                            {" "}
                            <label className="flex items-center space-x-1">
                              <input
                                className="mr-1"
                                name="cityId"
                                type="checkbox"
                                value={option?.value}
                                checked={Boolean(
                                  values?.cityId?.includes(
                                    option?.value?.toString()
                                  )
                                )}
                                onChange={handleChange}
                              />
                              {option?.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.cityId && touched.cityId && (
                        <div className="invalid-feedback">{errors.cityId}</div>
                      )}
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-x-3 mt-1 ">
                    <div className="">
                      <h6 className="font-semibold mb-0 text-primary my-2 text-sm">
                        &nbsp;
                      </h6>

                      <div className="grid md:grid-cols-3 gap-x-3">
                        <div className="">
                          <SearchSelect
                            name="employeeTypeId"
                            label={<span>Employee Type</span>}
                            isDisabled={isdataForRead}
                            onChange={(e) => {
                              setFieldValue("employeeTypeId", e.value || null);
                            }}
                            value={
                              [
                                ...(dashboard?.allEmpTypeDynamicChildMenus ||
                                  []),
                                ...(dashboard?.allEmpTypeChildMenus || []),
                              ].find(
                                (option) =>
                                  option.value === values.employeeTypeId
                              ) || null
                            }
                            options={[
                              ...dashboard.allEmpTypeDynamicChildMenus,
                              ...dashboard.allEmpTypeChildMenus,
                            ]}
                            error={errors.employeeTypeId}
                            touched={touched.employeeTypeId}
                          />
                        </div>

                        <div className="">
                          <SearchSelect
                            name="employeeStatusId"
                            label={<span>Employee Status</span>}
                            isDisabled={isdataForRead}
                            onChange={(e) => {
                              setFieldValue(
                                "employeeStatusId",
                                e.value || null
                              );
                            }}
                            value={
                              dashboard?.allEmployeeStatus?.find(
                                (option) =>
                                  option.value === values.employeeStatusId
                              ) || null
                            }
                            options={dashboard?.allEmployeeStatus}
                            error={errors.employeeStatusId}
                            touched={touched.employeeStatusId}
                          />
                        </div>

                        <div className="">
                          <SearchSelect
                            name="departmentId"
                            label={
                              <span>
                                Department{" "}
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            isDisabled={isdataForRead}
                            onChange={(e) => {
                              setFieldValue("departmentId", e.value || null);
                            }}
                            value={
                              dashboard?.allParentDept?.find(
                                (option) => option.value === values.departmentId
                              ) || null
                            }
                            options={dashboard?.allParentDept}
                            error={errors.departmentId}
                            touched={touched.departmentId}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div>
                        <h6 className="font-bold mb-0 text-primary my-2">
                          Job Posting
                        </h6>
                      </div>

                      <div className="grid md:grid-cols-3 gap-x-3">
                        <div className="">
                          <label>
                            {" "}
                            From
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <Field
                            className="form-control"
                            component={DatePickerField}
                            placeholder="Job Posting Date"
                            selected={
                              values?.jobPostingDateFrom
                                ? new Date(values.jobPostingDateFrom)
                                : null
                            }
                            onChange={(date) => {
                              let selectedDate = formatDates(
                                date,
                                "yyyy-MM-dd"
                              );
                              setFieldValue("jobPostingDateFrom", selectedDate);
                            }}
                            dateFormat="dd-MMM-yyyy"
                            name="jobPostingDateFrom"
                            autoComplete="off"
                            minDate={new Date()}
                            maxDate={values.jobPostingDateTo}
                          />

                          {/* {touched.jobPostingDateFrom &&
                            errors.jobPostingDateFrom && (
                              <div className="invalid-feedback d-block">
                                {errors.jobPostingDateFrom}
                              </div>
                            )} */}
                        </div>
                        <div className="">
                          <label>
                            {" "}
                            To
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <Field
                            className="form-control"
                            component={DatePickerField}
                            placeholder="Job Posting Date"
                            selected={
                              values?.jobPostingDateTo
                                ? new Date(values.jobPostingDateTo)
                                : null
                            }
                            onChange={(date) => {
                              let selectedDate = formatDates(
                                date,
                                "yyyy-MM-dd"
                              );
                              setFieldValue("jobPostingDateTo", selectedDate);
                            }}
                            dateFormat="dd-MMM-yyyy"
                            name="jobPostingDateTo"
                            autoComplete="off"
                            minDate={values.jobPostingDateFrom || new Date()}
                          />

                          {/* {touched.jobPostingDateTo &&
                            errors.jobPostingDateTo && (
                              <div className="invalid-feedback d-block">
                                {errors.jobPostingDateTo}
                              </div>
                            )} */}
                        </div>

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
                      </div>
                    </div>
                  </div>
                </div>

                {/* Position Detail */}
                <hr></hr>

                <h6 className="font-bold mb-0 text-primary my-2">
                  Position Detail
                </h6>

                <div className="grid md:grid-cols-6 gap-x-3 gap-y-1">
                  <div className="">
                    <SearchSelect
                      name="reportToDesignationId"
                      label={
                        <span>
                          Report To (Designation)
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isdataForRead}
                      onChange={(e) => {
                        setFieldValue("reportToDesignationId", e.value || null);
                      }}
                      value={
                        dashboard?.allDesignations?.find(
                          (option) =>
                            option.value === values.reportToDesignationId
                        ) || null
                      }
                      options={dashboard?.allDesignations}
                      error={errors.reportToDesignationId}
                      touched={touched.reportToDesignationId}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-x-3 mt-1">
                  <div className=" col-span-6 ">
                    <label>
                      <span>
                        Key relationship with Report To
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="relationshipWithReportTo"
                      component={TextArea}
                      placeholder="Enter relationship"
                      type="text"
                      className="form-control"
                    />
                    {/* <ErrorMessage
                      className="form-feedBack"
                      name="relationshipWithReportTo"
                      component="div"
                    /> */}
                  </div>
                </div>

                {/* Job Vacany Detail */}
                <hr></hr>

                <div className="grid md:grid-cols-2 gap-x-3">
                  <div>
                    <div>
                      {" "}
                      <h6 className="font-bold mb-0 text-primary my-2">
                        Job Vacany Detail
                      </h6>
                    </div>
                    <div className="grid md:grid-cols-3 gap-x-3">
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
                    </div>
                  </div>

                  <div>
                    <div>
                      {" "}
                      <h6 className="font-bold mb-0 text-primary my-2">
                        Job Period
                      </h6>
                    </div>

                    <div className="grid md:grid-cols-3 gap-x-3">
                      <div className="">
                        <label> From</label>
                        <Field
                          className="form-control"
                          placeholder="Job period start"
                          component={DatePickerField}
                          selected={
                            values?.jobPeriodStart
                              ? new Date(values.jobPeriodStart)
                              : null
                          }
                          onChange={(date) => {
                            let selectedDate = formatDates(date, "yyyy-MM-dd");
                            setFieldValue("jobPeriodStart", selectedDate);
                          }}
                          dateFormat="dd-MMM-yyyy"
                          name="jobPeriodStart"
                          autoComplete="off"
                          minDate={
                            values?.jobPostingDateFrom
                              ? new Date(values.jobPostingDateFrom)
                              : new Date()
                          }
                          maxDate={
                            values?.jobPeriodEnd
                              ? new Date(values.jobPeriodEnd)
                              : null
                          }
                        />

                        {/* {touched.jobPeriodStart && errors.jobPeriodStart && (
                          <div className="invalid-feedback d-block">
                            {errors.jobPeriodStart}
                          </div>
                        )} */}
                      </div>

                      <div className="">
                        <label>To</label>
                        <Field
                          className="form-control"
                          component={DatePickerField}
                          placeholder="Job period end"
                          selected={
                            values?.jobPeriodEnd
                              ? new Date(values.jobPeriodEnd)
                              : null
                          }
                          onChange={(date) => {
                            let selectedDate = formatDates(date, "yyyy-MM-dd");
                            setFieldValue("jobPeriodEnd", selectedDate);
                          }}
                          dateFormat="dd-MMM-yyyy"
                          name="jobPeriodEnd"
                          autoComplete="off"
                          minDate={
                            values?.jobPeriodStart
                              ? new Date(values.jobPeriodStart)
                              : new Date()
                          }
                        />

                        {/* {touched.jobPeriodEnd && errors.jobPeriodEnd && (
                          <div className="invalid-feedback d-block">
                            {errors.jobPeriodEnd}
                          </div>
                        )} */}
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
                            console.log("selectedDate111", selectedDate);
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
                        //  maxDate={values?.jobPeriodEnd ? new Date(values.jobPeriodEnd) : new Date()}
                        />

                        {/* {touched.desireDateOfApp && errors.desireDateOfApp && (
                          <div className="invalid-feedback d-block">
                            {errors.desireDateOfApp}
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-6 gap-x-3 mt-1">
                  {/* <div className="">
                    <SearchSelect
                      name="appointmentTypeId"
                      label={
                        <span>
                          Appointment Type
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isdataForRead}
                      onChange={(e) => {
                        setFieldValue("appointmentTypeId", e.value || null);
                      }}
                      value={
                        dashboard?.allAppointmentTypeList?.find(
                          (option) => option.value === values.appointmentTypeId
                        ) || null
                      }
                      options={dashboard?.allAppointmentTypeList}
                      error={errors.appointmentTypeId}
                      touched={touched.appointmentTypeId}
                    />
                  </div> */}

                  <div className="">
                    <SearchSelect
                      name="priorityTypeId"
                      label={
                        <span>
                          Priority<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isdataForRead}
                      onChange={(e) => {
                        setFieldValue("priorityTypeId", e.value || null);
                      }}
                      value={
                        dashboard?.allPriorityTypeList?.find(
                          (option) => option.value === values.priorityTypeId
                        ) || null
                      }
                      options={dashboard?.allPriorityTypeList}
                      error={errors.priorityTypeId}
                      touched={touched.priorityTypeId}
                    />
                  </div>
                </div>

                {/* <div className=" col-span-6  mt-1">
                  <label>
                    <span>Job Vacancy Detail</span>
                  </label>
                  <Field
                    name="comment"
                    component={TextArea}
                    placeholder="Enter job vacancy detail"
                    className="form-control " // Force full height
                    type="text"
                  />
                </div> */}


                <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-1">
                  <div className="">
                    <RichTextInput
                      label="Job Vacancy Detail"
                      name="comment"
                      touched={touched?.comment}
                      errors={errors?.comment}
                      value={values?.comment || ""}
                      onChange={(e) => {
                        setFieldValue("comment", e);
                      }}
                    />
                  </div>
                </div>

                <hr></hr>

                {/* Position Preferences */}

                <div className="grid md:grid-cols-6 gap-x-3">
                  <div className="grid col-span-4">
                    <h6 className="font-bold mb-0 text-primary my-2">
                      Position Preferences
                    </h6>

                    <div className="grid md:grid-cols-4 gap-x-3">
                      <div className="">
                        <label>
                          {" "}
                          Shift<span style={{ color: "red" }}>*</span>
                        </label>

                        <div className="overflow-auto max-h-16 border-none scrollbar-fancy">
                          {dashboard?.allJobShiftList?.map((option) => (
                            <div key={option?.value}>
                              <label className="flex items-center space-x-1">
                                <input
                                  className="mr-1"
                                  name="preferredShiftId"
                                  type="checkbox"
                                  value={option?.value}
                                  checked={Boolean(
                                    values?.preferredShiftId?.includes(
                                      option?.value?.toString()
                                    )
                                  )}
                                  onChange={handleChange}
                                />
                                {option?.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        {errors.preferredShiftId &&
                          touched.preferredShiftId && (
                            <div className="invalid-feedback">
                              {errors.preferredShiftId}
                            </div>
                          )}
                      </div>

                      <div className="mt-1">
                        <label>
                          {" "}
                          Gender<span style={{ color: "red" }}>*</span>
                        </label>

                        <div className="overflow-auto max-h-16 border-none scrollbar-fancy ">
                          {dashboard?.allGenderList?.map((option) => (
                            <div
                              key={option.value}
                              className="flex justify-start items-center border-none "
                            >
                              <input
                                className="mr-1"
                                name="preferredGenderId"
                                type="checkbox"
                                value={option?.value}
                                checked={Boolean(
                                  values?.preferredGenderId?.includes(
                                    option?.value?.toString()
                                  )
                                )}
                                onChange={handleChange}
                              />
                              {option?.label}
                            </div>
                          ))}
                        </div>
                        {errors.preferredGenderId &&
                          touched.preferredGenderId && (
                            <div className="invalid-feedback">
                              {errors.preferredGenderId}
                            </div>
                          )}
                      </div>

                      <div className="">
                        <label>Mandatory Job Skills</label>
                        <span style={{ color: "red" }}>*</span>

                        <div className="overflow-auto max-h-16 border-none scrollbar-fancy ">
                          {dashboard?.allJobSkillList?.map((option) => (
                            <label className="flex items-center space-x-1">
                              <input
                                className="mr-1"
                                name="preferredJobSkillsId"
                                type="checkbox"
                                value={option?.value}
                                checked={Boolean(
                                  values?.preferredJobSkillsId?.includes(
                                    option?.value?.toString()
                                  )
                                )}
                                onChange={handleChange}
                              />
                              {option?.label}
                            </label>
                          ))}
                        </div>
                        {errors.preferredJobSkillsId &&
                          touched.preferredJobSkillsId && (
                            <div className="invalid-feedback">
                              {errors.preferredJobSkillsId}
                            </div>
                          )}
                      </div>

                      <div className="mt-1">
                        <label> Optional Skills</label>
                        <div>
                          <div className="overflow-auto max-h-16 border-none scrollbar-fancy">
                            {dashboard?.allJobSkillList?.map((option) => (
                              <div key={option?.value}>
                                <label className="flex items-center space-x-1">
                                  <input
                                    className="mr-1"
                                    name="optionalJobSkillsId"
                                    type="checkbox"
                                    value={option?.value}
                                    checked={Boolean(
                                      values?.optionalJobSkillsId?.includes(
                                        option?.value?.toString()
                                      )
                                    )}
                                    onChange={handleChange}
                                  />
                                  {option?.label}{" "}
                                </label>
                              </div>
                            ))}
                            {/* {errors.optionalJobSkillsId &&
                              touched.optionalJobSkillsId && (
                                <div className="invalid-text">
                                  {errors.optionalJobSkillsId}
                                </div>
                              )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid col-span-2 ">
                    <div>
                      <h6 className="font-bold mb-0 text-primary my-2">Age</h6>

                      <div className="grid md:grid-cols-2 gap-x-3">
                        <div className="">
                          <label>
                            <span> From</span>
                          </label>
                          <Field
                            name="preferredAgeFrom"
                            component={Input}
                            placeholder="Enter age (from)"
                            type="number"
                            onInput={(e) => {
                              e.target.value = amountLimitDynamic(
                                e.target.value,
                                2
                              );
                            }}
                          />
                        </div>

                        <div className="">
                          <label>
                            <span>To</span>
                          </label>
                          <Field
                            name="preferredAgeTo"
                            component={Input}
                            placeholder="Enter age (to)"
                            type="number"
                            onInput={(e) => {
                              e.target.value = amountLimitDynamic(
                                e.target.value,
                                2
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">
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
                      name="preferredJobIndustryId"
                      label={
                        <span>
                          Job Industry
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isdataForRead}
                      onChange={(e) => {
                        setFieldValue(
                          "preferredJobIndustryId",
                          e.value || null
                        );
                      }}
                      value={
                        dashboard?.allJobIndustryList?.find(
                          (option) =>
                            option.value === values.preferredJobIndustryId
                        ) || null
                      }
                      options={dashboard?.allJobIndustryList}
                      error={errors.preferredJobIndustryId}
                      touched={touched.preferredJobIndustryId}
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

                {/* <div className="mt-1  ">
                  <label>
                    <span>Work Experience Detail</span>
                  </label>
                  <Field
                    name="workExpDetail"
                    component={TextArea}
                    placeholder="Enter work experience detail"
                    className="form-control"
                    type="text"
                  />
                </div> */}

                <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-1">
                  <div className="">
                    <RichTextInput
                      label="Work Experience Detail"
                      name="workExpDetail"
                      touched={touched?.workExpDetail}
                      errors={errors?.workExpDetail}
                      value={values?.workExpDetail || ""}
                      onChange={(e) => {
                        setFieldValue("workExpDetail", e);
                      }}
                    />
                  </div>
                </div>

                {/* <div className=" mt-1">
                  <label>
                    <span>Additional Requirement</span>
                  </label>
                  <Field
                    name="additionalReq"
                    component={TextArea}
                    placeholder="Enter additional requirement"
                    className="form-control"
                    type="text"
                  />
                </div> */}

                <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-1">
                  <div className="">
                    <RichTextInput
                      label="Additional Requirement"
                      name="additionalReq"
                      touched={touched?.additionalReq}
                      errors={errors?.additionalReq}
                      value={values?.additionalReq || ""}
                      onChange={(e) => {
                        setFieldValue("additionalReq", e);
                      }}
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

                <hr></hr>
                <h6 className="font-bold mb-0 text-primary my-2">
                  Compensation & Benefits
                </h6>

                {/* <div className="mt-1">
                  <label>
                    <span>Incentive Packages</span>
                  </label>
                  <Field
                    name="incentivePackages"
                    component={TextArea}
                    placeholder="Enter incentive packages"
                    className="form-control "
                    type="text"
                  />
                </div> */}

                <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-1">
                  <div className="">
                    <RichTextInput
                      label="Incentive Packages"
                      name="incentivePackages"
                      touched={touched?.incentivePackages}
                      errors={errors?.incentivePackages}
                      value={values?.incentivePackages || ""}
                      onChange={(e) => {
                        setFieldValue("incentivePackages", e);
                      }}
                    />
                  </div>
                </div>

                {/* <div className="mt-1">
                  <label>
                    <span>Other Benefits</span>
                  </label> */}
                {/* <Field
                    name="otherBenefits"
                    component={TextArea}
                    placeholder="Enter other benefits"
                    className="form-control"
                    type="text"
                  /> */}

                <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-1">
                  <div className="">
                    <RichTextInput
                      label="Other Benefits"
                      name="otherBenefits"
                      touched={touched?.otherBenefits}
                      errors={errors?.otherBenefits}
                      value={values?.otherBenefits || ""}
                      onChange={(e) => {
                        setFieldValue("otherBenefits", e);
                      }}
                    />
                  </div>
                </div>
                {/* </div> */}

                {/* <div className=" mt-1">
                  <label>
                    <span>
                      Job Summary<span style={{ color: "red" }}>*</span>
                    </span>
                  </label>
                  <Field
                    name="jobSummary"
                    component={TextArea}
                    placeholder="Enter job summary"
                    className="form-control"
                    type="text"
                  />
             
                </div> */}

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

            {/* <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button> */}

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
      )}
    </Formik>
  );
}
