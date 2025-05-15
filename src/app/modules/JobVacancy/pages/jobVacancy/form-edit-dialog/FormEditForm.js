import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { DatePickerField, Input, TextArea } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,
  fetchAllCountry,
  fetchAllDept,
  fetchAllFormsMenu,

  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { amountLimit, amountLimitDynamic, formatDates } from "../../../../../utils/common";
import DatePicker from "react-datepicker";



const jobVacancyEditSchema = Yup.object().shape({
  subsidiaryId: Yup.string()
    .required(VALIDATION_MESSAGES.required),

  jobCode: Yup.string()
    .min(5, "Job code must be  5 characters")
    .max(10, "Job code must be  10 characters")
    .required(VALIDATION_MESSAGES.required),
  jobDate: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  designationId: Yup.number().required(VALIDATION_MESSAGES.required),
  jobTitle: Yup.string()
    .min(1, "Job title must be at least 1 characters")
    .max(100, "Job title must be at most 100 characters")
    .required(VALIDATION_MESSAGES.required),
  gradeId: Yup.string().required(VALIDATION_MESSAGES.required),
  locationId: Yup.string().required(VALIDATION_MESSAGES.required),
  // countryId: Yup.number().required(VALIDATION_MESSAGES.required),
  // cityId: Yup.number().required(VALIDATION_MESSAGES.required),
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
    .required(VALIDATION_MESSAGES.required)
    .test(
      'not-same-as-designation',
      'Designation and Reporting Designation cannot be the same',
      function (value) {
        const { designationId } = this.parent;
        return value !== designationId;
      }
    ),
  relationshipWithReportTo: Yup.string()
    .min(5, "Must be  5 characters")
    .max(50, "Must be  50 characters")
    .required(VALIDATION_MESSAGES.required),
  noOfPosition: Yup.number()
    .required(VALIDATION_MESSAGES.required)
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .max(999, VALIDATION_MESSAGES.maxNineHundredNinetyNineValue),
  hiringReasonId: Yup.string().required(VALIDATION_MESSAGES.required),
  jobPreferenceId: Yup.string().required(VALIDATION_MESSAGES.required),
  appointmentTypeId: Yup.string().required(VALIDATION_MESSAGES.required),
  priorityTypeId: Yup.string().required(VALIDATION_MESSAGES.required),
  // criticalDays: Yup.number()
  //   .min(1, VALIDATION_MESSAGES.minOneValue)
  //   .max(999, VALIDATION_MESSAGES.maxNineHundredNinetyNineValue),
  jobPeriodStart: Yup.date().nullable(),
  jobPeriodEnd: Yup.date().nullable()
    .min(
      Yup.ref('jobPeriodStart'),
      'End date must be after start date'
    ),
  comment: Yup.string(),

  // desireDateOfApp: Yup.date()
  //   .nullable()
  //   .required(VALIDATION_MESSAGES.required)
  //   .min(
  //     Yup.ref('jobPostingDateFrom'),
  //     'Desire Date of Appointment must be after Job Posting Date From'
  //   ),

  desireDateOfApp: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .min(
      Yup.ref('jobPostingDateFrom'),
      'Desire Date of Appointment must be after Job Posting Date From'
    )
    .when('jobPeriodEnd', (jobPeriodEnd, schema) => {
      return jobPeriodEnd
        ? schema.max(
          Yup.ref('jobPeriodEnd'),
          'Desire Date must be before Job Period End'
        )
        : schema; // if jobPeriodEnd is not set, skip the max check
    }),
  preferredAgeFrom: Yup.number()
    .min(18, VALIDATION_MESSAGES.minAgeEighteenValue)
    .max(99, VALIDATION_MESSAGES.maxAgeNinetyNineValue),

  preferredAgeTo: Yup.number()
    .min(18, VALIDATION_MESSAGES.minAgeEighteenValue)
    .max(99, VALIDATION_MESSAGES.maxAgeNinetyNineValue)
    .moreThan(
      Yup.ref('preferredAgeFrom'),
      'Preferred age (to) must be greater than age from'
    ),
  preferredShiftId: Yup.string().required(VALIDATION_MESSAGES.required),
  preferredGenderId: Yup.string().required(VALIDATION_MESSAGES.required),
  preferredQualificationId: Yup.number().required(VALIDATION_MESSAGES.required),
  preferredJobSkillsId: Yup.string().required(VALIDATION_MESSAGES.required),
  preferredJobIndustryId: Yup.number().required(VALIDATION_MESSAGES.required),
  workExpFrom: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  workExpTo: Yup.number()
    .required(VALIDATION_MESSAGES.required)
    .moreThan(
      Yup.ref('workExpFrom'),
      'Experience (to) must be greater than experience from'
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
      Yup.ref('salaryRangeFrom'),
      'Salary To must be greater than Salary From'
    ),
  // incentivePackages: Yup.string().required(VALIDATION_MESSAGES.required),
  // otherBenefits: Yup.string().required(VALIDATION_MESSAGES.required),
  jobSummary: Yup.string().required(VALIDATION_MESSAGES.required),

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


  //drop down
  useEffect(() => {
    if (!formData.Id) {

      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(158, "allDesignations"));
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
      dispatch(fetchAllDept());

    }
  }, [dispatch, formData.Id]);


  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.job_vacancy,
      userAccess: state?.auth?.userAccess["job_vacancy"],
    };
  }, shallowEqual);



  const { dataForEdit } = currentState;


  const filteredCities = (countryId) => {
    return dashboard?.allCity?.filter((city) => city.code === countryId) || [];
  };



  return (
    <Formik
      enableReinitialize={true}


      initialValues={{
        ...formData,
        jobDate: formData?.jobDate ? formData.jobDate : formatDates(new Date(), 'yyyy-MM-dd'), // set to today if not provided
      }}
      validationSchema={jobVacancyEditSchema}
      onSubmit={(values) => {

        enableLoading();
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue, handleChange }) => (
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
                <div style={{ padding: "10px 0 40px 0px", marginBottom: "15px", marginTop: "15px", borderRadius: "5px", borderBottom: '2px solid rgb(194, 194, 194)' }}>
                  <h6>Job</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">
                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Job Code<span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="jobCode"
                        component={Input}
                        placeholder="Enter code"
                        // disabled={true}
                        type="text"
                        minLength={5}
                        maxLength={10}


                      />
                    </div>


                    <div className="col-12 col-md-4 mt-3">


                      <label> Job Date<span style={{ color: "red" }}>*</span></label>
                      <DatePicker
                        className="form-control"
                        placeholder="Job Date"
                        selected={values?.jobDate ? new Date(values.jobDate) : null}
                        disabled={true}
                        // onChange={(date) => {
                        //   let selectedDate = formatDates(date, 'yyyy-MM-dd')
                        //   setFieldValue("jobDate", selectedDate);
                        // }}
                        dateFormat="dd/MM/yyyy"
                        name="jobDate"
                        autoComplete="off"
                        minDate={new Date()}
                        maxDate={new Date()}


                      />

                      {touched.jobDate && errors.jobDate && (
                        <div className="invalid-feedback d-block">{errors.jobDate}</div>
                      )}
                    </div>

                  </div>


                </div>

                {/* Request For */}

                <div style={{ padding: "10px 0 40px 0px", marginBottom: "15px", marginTop: "15px", borderRadius: "5px", borderBottom: '2px solid rgb(194, 194, 194)' }}>
                  <h6>Request For</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="designationId"
                        label={
                          <span>
                            Designation<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("designationId", e.value || null);
                        }}
                        value={
                          dashboard?.allDesignations?.find(
                            (option) => option.value === values.designationId
                          ) || null
                        }

                        options={dashboard?.allDesignations}

                        error={errors.designationId}
                        touched={touched.designationId}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
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

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="gradeId"
                        label={
                          <span>
                            Grade<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("gradeId", e.value || null);
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





                    <div className="col-12 col-md-4 mt-3">
                      Subsidiary<span style={{ color: "red" }}>*</span>
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          height: "170px",
                          padding: "10px",
                          overflow: "scroll",
                        }}
                      >
                        <div className="multi-select">
                          <div className="dropdown-label"></div>
                          <div
                            className="dropdown-options"
                            style={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              padding: "5px",
                            }}
                          >
                            {dashboard?.allSubsidiaryList?.map((option) => (
                              <div
                                key={option?.value}
                                className="dropdown-option"
                              >
                                <input
                                  style={{ width: "25px" }}
                                  name="subsidiaryId"
                                  type="checkbox"
                                  value={option?.value}
                                  checked={Boolean(
                                    values?.subsidiaryId?.includes(
                                      option?.value?.toString()
                                    )
                                  )}
                                  onChange={handleChange}
                                />
                                {option?.label}
                              </div>
                            ))}
                            {errors.subsidiaryId &&
                              touched.subsidiaryId && (
                                <div className="invalid-text">
                                  {errors.subsidiaryId}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 mt-3">
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

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="cityId"
                        label={<span>City</span>}
                        isDisabled={isdataForRead || !values.countryId}
                        onChange={(e) => {
                          setFieldValue("cityId", e.value || null);
                        }}
                        value={
                          filteredCities(values.countryId).find(
                            (option) => option.value === values.cityId
                          ) || null
                        }
                        options={filteredCities(values.countryId)}
                        error={errors.cityId}
                        touched={touched.cityId}
                      />
                    </div>





                    <div className="col-12 col-md-4 mt-3">
                      Location<span style={{ color: "red" }}>*</span>
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          height: "170px",
                          padding: "10px",
                          overflow: "scroll",
                        }}
                      >
                        <div className="multi-select">
                          <div className="dropdown-label"></div>
                          <div
                            className="dropdown-options"
                            style={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              padding: "5px",
                            }}
                          >
                            {dashboard.allLocationChildMenus?.map((option) => (
                              <div
                                key={option?.value}
                                className="dropdown-option"
                              >
                                <input
                                  style={{ width: "25px" }}
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
                                {option?.label}
                              </div>
                            ))}
                            {errors.locationId &&
                              touched.locationId && (
                                <div className="invalid-text">
                                  {errors.locationId}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="employeeTypeId"
                        label={
                          <span>
                            Employee Type
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("employeeTypeId", e.value || null);
                        }}
                        value={
                          [...(dashboard?.allEmpTypeDynamicChildMenus || []), ...(dashboard?.allEmpTypeChildMenus || [])]
                            .find((option) => option.value === values.employeeTypeId) || null
                        }

                        options={[
                          ...dashboard.allEmpTypeDynamicChildMenus,
                          ...dashboard.allEmpTypeChildMenus
                        ]}

                        error={errors.employeeTypeId}
                        touched={touched.employeeTypeId}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="employeeStatusId"
                        label={
                          <span>
                            Employee Status
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("employeeStatusId", e.value || null);
                        }}
                        value={
                          dashboard?.allEmployeeStatus?.find(
                            (option) => option.value === values.employeeStatusId
                          ) || null
                        }

                        options={dashboard?.allEmployeeStatus}

                        error={errors.employeeStatusId}
                        touched={touched.employeeStatusId}
                      />
                    </div>



                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="departmentId"
                        label={
                          <span>
                            Department <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("departmentId", e.value || null);
                        }}
                        value={
                          dashboard?.allDept?.find(
                            (option) => option.value === values.departmentId
                          ) || null
                        }

                        options={dashboard?.allDept}

                        error={errors.departmentId}
                        touched={touched.departmentId}



                      />
                    </div>



                    <div className="col-12 col-md-4 mt-3">


                      <label> Job Posting Date (From)<span style={{ color: "red" }}>*</span></label>
                      <DatePicker
                        className="form-control"
                        placeholder="Job Posting Date"
                        selected={values?.jobPostingDateFrom ? new Date(values.jobPostingDateFrom) : null}

                        onChange={(date) => {
                          let selectedDate = formatDates(date, 'yyyy-MM-dd')
                          setFieldValue("jobPostingDateFrom", selectedDate);
                        }}
                        dateFormat="dd/MM/yyyy"
                        name="jobPostingDateFrom"
                        autoComplete="off"
                        minDate={new Date()}
                        maxDate={values.jobPostingDateTo}



                      />

                      {touched.jobPostingDateFrom && errors.jobPostingDateFrom && (
                        <div className="invalid-feedback d-block">{errors.jobPostingDateFrom}</div>
                      )}
                    </div>
                    <div className="col-12 col-md-4 mt-3">


                      <label> Job Posting Date (To)<span style={{ color: "red" }}>*</span></label>
                      <DatePicker
                        className="form-control"
                        placeholder="Job Posting Date"
                        selected={values?.jobPostingDateTo ? new Date(values.jobPostingDateTo) : null}

                        onChange={(date) => {
                          let selectedDate = formatDates(date, 'yyyy-MM-dd')
                          setFieldValue("jobPostingDateTo", selectedDate);
                        }}
                        dateFormat="dd/MM/yyyy"
                        name="jobPostingDateTo"
                        autoComplete="off"
                        minDate={values.jobPostingDateFrom || new Date()}


                      />

                      {touched.jobPostingDateTo && errors.jobPostingDateTo && (
                        <div className="invalid-feedback d-block">{errors.jobPostingDateTo}</div>
                      )}
                    </div>

                  </div>


                </div>




                {/* Position Detail */}

                <div style={{ padding: "10px 0 40px 0px", marginBottom: "15px", borderRadius: "5px", marginTop: "15px", borderBottom: '2px solid rgb(194, 194, 194)' }}>
                  <h6>Position Detail</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="reportToDesignationId"
                        label={
                          <span>
                            Report To (Designation)<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("reportToDesignationId", e.value || null);
                        }}
                        value={
                          dashboard?.allDesignations?.find(
                            (option) => option.value === values.reportToDesignationId
                          ) || null
                        }

                        options={dashboard?.allDesignations}
                        error={errors.reportToDesignationId}
                        touched={touched.reportToDesignationId}
                      />
                    </div>

                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>
                          Key relationship with Report To<span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="relationshipWithReportTo"
                        component={TextArea}
                        placeholder="Enter relationship"
                        type="text"

                      />
                    </div>


                  </div>


                </div>



                {/* Job Vacany Detail */}


                <div style={{ padding: "10px 0 40px 0px", marginBottom: "15px", borderRadius: "5px", marginTop: "15px", borderBottom: '2px solid rgb(194, 194, 194)' }}>
                  <h6>Job Vacany Detail</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">


                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          No.of Positions <span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="noOfPosition"
                        component={Input}
                        placeholder="Enter no of position"
                        type="number"

                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="hiringReasonId"
                        label={
                          <span>
                            Hiring Reason<span style={{ color: "red" }}>*</span>
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

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="jobPreferenceId"
                        label={
                          <span>
                            Job Preference<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("jobPreferenceId", e.value || null);
                        }}
                        value={
                          dashboard?.alljobPreferenceList?.find(
                            (option) => option.value === values.jobPreferenceId
                          ) || null
                        }

                        options={dashboard?.alljobPreferenceList}

                        error={errors.jobPreferenceId}
                        touched={touched.jobPreferenceId}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">


                      <label> Job Period Start</label>
                      <DatePicker
                        className="form-control"
                        placeholder="Job period start"
                        selected={values?.jobPeriodStart ? new Date(values.jobPeriodStart) : null}

                        onChange={(date) => {
                          let selectedDate = formatDates(date, 'yyyy-MM-dd')
                          setFieldValue("jobPeriodStart", selectedDate);
                        }}
                        dateFormat="dd/MM/yyyy"
                        name="jobPeriodStart"
                        autoComplete="off"
                        minDate={values?.jobPostingDateFrom ? new Date(values.jobPostingDateFrom) : new Date()}
                        maxDate={values?.jobPeriodEnd ? new Date(values.jobPeriodEnd) :null}
                       


                      />

                      {touched.jobPeriodStart && errors.jobPeriodStart && (
                        <div className="invalid-feedback d-block">{errors.jobPeriodStart}</div>
                      )}
                    </div>

                    <div className="col-12 col-md-4 mt-3">


                      <label> Job Period End</label>
                      <DatePicker
                        className="form-control"
                        placeholder="Job period end"
                        selected={values?.jobPeriodEnd ? new Date(values.jobPeriodEnd) : null}

                        onChange={(date) => {
                          let selectedDate = formatDates(date, 'yyyy-MM-dd')
                          setFieldValue("jobPeriodEnd", selectedDate);
                        }}
                        dateFormat="dd/MM/yyyy"
                        name="jobPeriodEnd"
                        autoComplete="off"
                        minDate={values?.jobPeriodStart ? new Date(values.jobPeriodStart) : new Date()}
                      



                      />

                      {touched.jobPeriodEnd && errors.jobPeriodEnd && (
                        <div className="invalid-feedback d-block">{errors.jobPeriodEnd}</div>
                      )}
                    </div>


                    <div className="col-12 col-md-4 mt-3">


                      <label>  Desire Date of Appointment<span style={{ color: "red" }}>*</span></label>
                      <DatePicker
                        className="form-control"
                        placeholder="Desire Date of Appointment"
                        selected={values?.desireDateOfApp ? new Date(values.desireDateOfApp) : null}

                        onChange={(date) => {
                          let selectedDate = formatDates(date, 'yyyy-MM-dd')
                          setFieldValue("desireDateOfApp", selectedDate);
                        }}
                        dateFormat="dd/MM/yyyy"
                        name="desireDateOfApp"
                        autoComplete="off"
                        minDate={values?.jobPostingDateFrom ? new Date(values.jobPostingDateFrom) : new Date()}
                      //  maxDate={values?.jobPeriodEnd ? new Date(values.jobPeriodEnd) : new Date()}



                      />

                      {touched.desireDateOfApp && errors.desireDateOfApp && (
                        <div className="invalid-feedback d-block">{errors.desireDateOfApp}</div>
                      )}
                    </div>



                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="appointmentTypeId"
                        label={
                          <span>
                            Appointment Type<span style={{ color: "red" }}>*</span>
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
                    </div>

                    <div className="col-12 col-md-4 mt-3">
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

                    {/* <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Critical (in Days)
                        </span>
                      </label>
                      <Field
                        name="criticalDays"
                        component={Input}
                        placeholder="Enter days"

                        type="number"

                      />
                    </div> */}




                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>
                          Comments
                        </span>
                      </label>
                      <Field
                        name="comment"
                        component={TextArea}
                        placeholder="Enter comments"

                        type="text"

                      />
                    </div>

                  </div>


                </div>



                {/* Position Preferences */}


                <div style={{ padding: "10px 0 40px 0px", marginBottom: "15px", borderRadius: "5px", marginTop: "15px", borderBottom: '2px solid rgb(194, 194, 194)' }}>
                  <h6>Position Preferences</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">


                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Preferred Age From
                        </span>
                      </label>
                      <Field
                        name="preferredAgeFrom"
                        component={Input}
                        placeholder="Enter preferred age (from)"

                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimitDynamic(
                            e.target.value,
                            2
                          );
                        }}

                      />

                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Preferred Age To
                        </span>
                      </label>
                      <Field
                        name="preferredAgeTo"
                        component={Input}
                        placeholder="Enter preferred age (to)"
                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimitDynamic(
                            e.target.value,
                            2
                          );
                        }}

                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="preferredQualificationId"
                        label={
                          <span>
                            Preferred Qualification<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("preferredQualificationId", e.value || null);
                        }}
                        value={
                          dashboard?.allQualificationList?.find(
                            (option) => option.value === values.preferredQualificationId
                          ) || null
                        }

                        options={dashboard?.allQualificationList}

                        error={errors.preferredQualificationId}
                        touched={touched.preferredQualificationId}
                      />
                    </div>




                    <div className="col-12 col-md-4 mt-3">
                      Preferred Shift<span style={{ color: "red" }}>*</span>
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          height: "170px",
                          padding: "10px",
                          overflow: "scroll",
                        }}
                      >
                        <div className="multi-select">
                          <div className="dropdown-label"></div>
                          <div
                            className="dropdown-options"
                            style={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              padding: "5px",
                            }}
                          >
                            {dashboard?.allJobShiftList?.map((option) => (
                              <div
                                key={option?.value}
                                className="dropdown-option"
                              >
                                <input
                                  style={{ width: "25px" }}
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
                              </div>
                            ))}
                            {errors.preferredShiftId &&
                              touched.preferredShiftId && (
                                <div className="invalid-text">
                                  {errors.preferredShiftId}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      Preferred Gender<span style={{ color: "red" }}>*</span>
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          height: "170px",
                          padding: "10px",
                          overflow: "scroll",
                        }}
                      >
                        <div className="multi-select">
                          <div className="dropdown-label"></div>
                          <div
                            className="dropdown-options"
                            style={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              padding: "5px",
                            }}
                          >
                            {dashboard?.allGenderList?.map((option) => (
                              <div
                                key={option?.value}
                                className="dropdown-option"
                              >
                                <input
                                  style={{ width: "25px" }}
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
                            {errors.preferredGenderId &&
                              touched.preferredGenderId && (
                                <div className="invalid-text">
                                  {errors.preferredGenderId}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      Preferred Job Skills<span style={{ color: "red" }}>*</span>
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          height: "170px",
                          padding: "10px",
                          overflow: "scroll",
                        }}
                      >
                        <div className="multi-select">
                          <div className="dropdown-label"></div>
                          <div
                            className="dropdown-options"
                            style={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              padding: "5px",
                            }}
                          >
                            {dashboard?.allJobSkillList?.map((option) => (
                              <div
                                key={option?.value}
                                className="dropdown-option"
                              >
                                <input
                                  style={{ width: "25px" }}
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
                              </div>
                            ))}
                            {errors.preferredJobSkillsId &&
                              touched.preferredJobSkillsId && (
                                <div className="invalid-text">
                                  {errors.preferredJobSkillsId}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="preferredJobIndustryId"
                        label={
                          <span>
                            Preferred Job Industry<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("preferredJobIndustryId", e.value || null);
                        }}
                        value={
                          dashboard?.allJobIndustryList?.find(
                            (option) => option.value === values.preferredJobIndustryId
                          ) || null
                        }

                        options={dashboard?.allJobIndustryList}

                        error={errors.preferredJobIndustryId}
                        touched={touched.preferredJobIndustryId}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Work Experience From <span style={{ color: "red" }}>*</span>
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
                            2
                          );
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Work Experience To <span style={{ color: "red" }}>*</span>
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
                            2
                          );
                        }}
                      />
                    </div>



                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>
                          Work Experience Detail
                        </span>
                      </label>
                      <Field
                        name="workExpDetail"
                        component={TextArea}
                        placeholder="Enter work experience detail"

                        type="text"

                      />
                    </div>

                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>
                          Additional Requirement
                        </span>
                      </label>
                      <Field
                        name="additionalReq"
                        component={TextArea}
                        placeholder="Enter additional requirement"

                        type="text"

                      />
                    </div>



                  </div>


                </div>



                {/* Compensation & Benefits */}

                <div style={{ padding: "10px 0 40px 0px", marginBottom: "15px", borderRadius: "5px", marginTop: "15px", borderBottom: '2px solid rgb(194, 194, 194)' }}>
                  <h6>Compensation & Benefits</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">


                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Salary Range (Per Month) From <span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="salaryRangeFrom"
                        component={Input}
                        placeholder="Enter salary range (from)"

                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimit(
                            e.target.value

                          );
                        }}

                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Salary Range (Per Month) To <span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="salaryRangeTo"
                        component={Input}
                        placeholder="Enter salary range (to)"

                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimit(
                            e.target.value

                          );
                        }}

                      />
                    </div>

                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>
                          Incentive Packages
                        </span>
                      </label>
                      <Field
                        name="incentivePackages"
                        component={TextArea}
                        placeholder="Enter incentive packages"

                        type="text"

                      />
                    </div>

                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>
                          Other Benefits
                        </span>
                      </label>
                      <Field
                        name="otherBenefits"
                        component={TextArea}
                        placeholder="Enter other benefits"

                        type="text"

                      />
                    </div>

                  </div>


                </div>


                {/*  Job Summary */}
                <div style={{ padding: "10px 0 40px 0px", marginBottom: "15px", borderRadius: "5px", marginTop: "15px", borderBottom: '2px solid rgb(194, 194, 194)' }}>
                  <h6>Job Summary</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">


                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>
                          Job Summary <span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="jobSummary"
                        component={TextArea}
                        placeholder="Enter job summary"

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
                Ok
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
      )
      }
    </Formik >
  );
}
