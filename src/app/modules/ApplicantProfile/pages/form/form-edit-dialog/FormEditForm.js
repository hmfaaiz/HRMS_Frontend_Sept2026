import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { DatePickerField, Input, MaskInput, Select, TextArea } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,
  fetchAllCountry,
  fetchAllDept,
  fetchAllFormsMenu,

  fetchAllSubsidiaryData,
  getAllJobVacancy,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { amountLimit, amountLimitDynamic, formatDates } from "../../../../../utils/common";
import DatePicker from "react-datepicker";



const applicantProfileEditSchema = Yup.object().shape({
  subsidiaryId: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  title: Yup.string()
    .required(VALIDATION_MESSAGES.required),

  applicantCode: Yup.string()
    .min(5, "Job code must be  5 characters")
    .max(10, "Job code must be  10 characters")
    .required(VALIDATION_MESSAGES.required),

  firstName: Yup.string()
    .required(VALIDATION_MESSAGES.required),
  lastName: Yup.string()
    .required(VALIDATION_MESSAGES.required),
  middleName: Yup.string()
    .nullable(),
  // .required(VALIDATION_MESSAGES.required),

  dateOfBirth: Yup.date()
    .nullable()
    .typeError('Invalid date format')
    .required(VALIDATION_MESSAGES.required),


  nic_no: Yup.string()
    .matches(/^\d{5}-\d{7}-\d{1}$/, 'ID Card No must be in the format 12345-6789012-3')
    .required(VALIDATION_MESSAGES.required),


  passportNo: Yup.string()
    .matches(/^\d{15}$/, 'Passport number must be exactly 15 digits long and contain only digits.'),


  maritalStatus: Yup.string()
    .required(VALIDATION_MESSAGES.required),

  gender: Yup.string()
    .required(VALIDATION_MESSAGES.required),

  relation_name: Yup.string()
    .required(VALIDATION_MESSAGES.required),

  religionId: Yup.string()
    .required(VALIDATION_MESSAGES.required),

  //address
  additional_summary: Yup.string()
    .required(VALIDATION_MESSAGES.required),


  phone_official: Yup.string()
    .nullable() // Allows null values
    .matches(/^0[0-9]*$/, 'Phone number must start with 0 and contain only digits') // Must start with 0 and contain only digits
    .notRequired(), // Make it optional if you want


  email_personal: Yup.string()
    .nullable() // Allows null values
    .email('Invalid email address')
    .required(VALIDATION_MESSAGES.required),


  applicantCanJoin: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  lastDawnSalary: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  lastDawnSalaryCurrencyId: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  lastDawnSalaryPayTypeId: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  expectedSalaryRangeFrom: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  expectedSalaryRangeTo: Yup.number()
    .required(VALIDATION_MESSAGES.required),


  expectedSalaryCurrencyId: Yup.number()
    .required(VALIDATION_MESSAGES.required),


  expectedSalaryPayTypeId: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  // otherInformation: Yup.string()
  //   .required(VALIDATION_MESSAGES.required),


  currentDesignation: Yup.string()
    .required(VALIDATION_MESSAGES.required),


  jobVacancyId: Yup.string().nullable(), // optional banane ke liye


  countryId: Yup.number()
    .nullable(), // optional banane ke liye

  cityId: Yup.string()
    .nullable() // <- apply globally
    .when('countryId', {
      is: (val) => val !== undefined && val !== null && val !== '',
      then: Yup.string().required(VALIDATION_MESSAGES.required),
    }),




  details_applicant_vacancy: Yup.array()
    .of(
      Yup.object().shape({
        jobVacancyId: Yup.number()
          .nullable()
          .required(VALIDATION_MESSAGES.required),
        applicationDate: Yup.date().required(VALIDATION_MESSAGES.required),
        applicationStatusId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
        statusDate: Yup.date().required(VALIDATION_MESSAGES.required),
        appointmentTypeId: Yup.number().required(VALIDATION_MESSAGES.required),
      })
    )
    .test('unique-jobVacancyId', 'Each Job Vacancy must be unique.', function (vacancies) {
      if (!vacancies) return true;

      const jobVacancyIds = vacancies.map((v) => v.jobVacancyId);
      const duplicates = jobVacancyIds.filter((id, idx) => jobVacancyIds.indexOf(id) !== idx);

      if (duplicates.length > 0) {
        return this.createError({
          path: `details_applicant_vacancy`, // attaches error to the array
          message: `Duplicate Job Vacancy selected.`,
        });
      }

      return true;
    })

})


  .test('check-marital-status', 'Invalid marital status for selected title', function (value) {
    // if (title === 'Mrs.' && maritalStatus === '261') {
    const { title, maritalStatus, gender } = value;

    // Check conditions based on title // 196 == Single
    if (title === 'Mrs.' && maritalStatus !== '267') { //married

      return this.createError({ path: 'maritalStatus', message: 'Mrs. only for Married' });
    }

    if (title === 'Mrs.' && maritalStatus === '266') { //single
      return this.createError({ path: 'maritalStatus', message: 'Mrs. cannot be single.' });
    }

    if ((title == 'Mrs.' || title == 'Ms.') && gender == 'Male') {
      return this.createError({ path: 'gender', message: 'Mrs. Ms. cannot be male.' });
    }

    // if ((title === 'Mr.' || title === 'Dr.' || title === 'Professor.' || title === 'Captain') && gender === 'Female') {
    //   return this.createError({ path: 'gender', message: 'Mr. cannot be female.' });
    // }

    if ((title === 'Mr.') && gender === 'Female') {
      return this.createError({ path: 'gender', message: 'Mr. cannot be female.' });
    }


    // if (title === 'Mr.' && maritalStatus != 266 && maritalStatus != 267 && maritalStatus != 269) { //divorced

    //   return this.createError({ path: 'maritalStatus', message: 'Mr. cannot be female.' });
    // }
    if (title === 'Mr.' && maritalStatus == 268) { //Widow

      return this.createError({ path: 'maritalStatus', message: 'Mr. cannot be widow.' });
    }

    if (title === 'Ms.' && maritalStatus == 267) {

      return this.createError({ path: 'maritalStatus', message: 'Ms. only for single woman.' });
    }




    return true; // No error
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

      dispatch(fetchAllCountry());
      dispatch(fetchAllCity());

      dispatch(fetchAllFormsMenu(190, "allMaritalStatus"));
      dispatch(fetchAllFormsMenu(87, "allReligionChildMenus")); // For Religion
      dispatch(fetchAllFormsMenu(126, "allCurrencyCodeList")); // For All currecy Codes
      dispatch(getAllJobVacancy("allJobVacancyList")); // For All job vacancy
      dispatch(fetchAllFormsMenu(408, "allApplicationStatusList")); // For All application status
      dispatch(fetchAllFormsMenu(409, "allAppointmentTypeList")); // For All application status


    }
  }, [dispatch, formData.Id]);


  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.applicant_profile,
      userAccess: state?.auth?.userAccess["applicant_profile"],
    };
  }, shallowEqual);



  const { dataForEdit } = currentState;


  const filteredCities = (countryId) => {
    return dashboard?.allCity?.filter((city) => city.code === countryId) || [];
  };

  const salaryPayTypeIdOptions = [

    { value: 0, label: "Per Month" },
    { value: 1, label: "Per Year" },
  ];



  return (
    <Formik
      enableReinitialize={true}


      initialValues={formData}

      validationSchema={applicantProfileEditSchema}
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
                  <h6>Applicant Profile</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">
                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Applicant Code<span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="applicantCode"
                        component={Input}
                        placeholder="Enter code"
                        // disabled={true}
                        type="text"
                        minLength={5}
                        maxLength={10}
                      // error={ errors.applicantCode}

                      />

                    </div>

                    <div className="col-12 col-md-4 mt-3">

                      <SearchSelect
                        name="subsidiaryId"
                        isDisabled={isdataForRead}
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }

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
                      />
                    </div>


                  </div>
                  {/* Following Mr. Mubin's instructions, I am using this type of code block. */}



                  <div className="form-group row col-12 col-md-12  p-0 m-0">
                    <div className="col-12 col-md-2 mt-3">
                      <Select
                        label={<span> Title<span style={{ color: 'red' }}>*</span></span>}
                        name="title"
                        value={values.title}
                        onChange={handleChange}

                        style={{ display: "block" }}
                      >
                        <option label="Select Title" />
                        <option value="Mr." label="Mr." />
                        <option value="Mrs." label="Mrs." />
                        <option value="Ms." label="Ms." />
                        <option value="Dr." label="Dr." />
                        <option value="Professor." label="Professor." />


                      </Select>
                      {errors.title && touched.title && (
                        <div className="invalid-text">{errors.title}</div>
                      )}
                    </div>


                    <div className="col-12 col-md-3 mt-3">
                      <Field
                        name="firstName"
                        component={Input}
                        placeholder=" first name"
                        label={<span> First Name<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-3 mt-3">
                      <Field
                        name="middleName"
                        component={Input}
                        placeholder=" middle name"
                        label={<span> Middle Name</span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-3 mt-3">
                      <Field
                        name="lastName"
                        component={Input}
                        placeholder=" last name"
                        label={<span> Last Name<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>


                  </div>



                </div>



                {/* Personal Information */}


                <div style={{ padding: "10px 0 40px 0px", marginBottom: "15px", borderRadius: "5px", marginTop: "15px", borderBottom: '2px solid rgb(194, 194, 194)' }}>
                  <h6>Personal Information</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">

                    <div className="col-12 col-md-4 mt-3">


                      <label> Date Of Birth <span style={{ color: "red" }}>*</span></label>
                      <DatePicker
                        className="form-control"
                        placeholder="Date Of Birth"
                        selected={values?.dateOfBirth ? new Date(values.dateOfBirth) : null}

                        onChange={(date) => {
                          let selectedDate = formatDates(date, 'yyyy-MM-dd')
                          setFieldValue("dateOfBirth", selectedDate);
                        }}
                        dateFormat="dd/MM/yyyy"
                        name="dateOfBirth"
                        autoComplete="off"
                        maxDate={new Date()}

                      />

                      {touched.dateOfBirth && errors.dateOfBirth && (
                        <div className="invalid-feedback d-block">{errors.dateOfBirth}</div>
                      )}
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="nic_no"
                        mask={[

                          /[1-9]/,
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          "-",
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          "-",
                          /\d/,
                        ]}
                        component={MaskInput}
                        placeholder=" ID Card No"
                        label={<span> Id Card No<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                      {/* <ErrorMessage style={{color:"red"}} name="nic_no" component="div" /> */}
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="passportNo"
                        maxLength="15"
                        component={Input}
                        placeholder=" Passport No"
                        label=" Passport No"
                        autoComplete="off"
                      />
                    </div>




                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        label={
                          <span>
                            Marital Status<span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        name="maritalStatus"
                        onChange={(e) => {
                          setFieldValue("maritalStatus", e?.value ?? null);
                        }}
                        value={
                          dashboard.allMaritalStatus?.find(
                            (option) => String(option.value) === String(values.maritalStatus)
                          ) || null
                        }
                        error={errors.maritalStatus}
                        touched={touched.maritalStatus}
                        options={dashboard.allMaritalStatus}
                      />
                    </div>


                    <div className="col-12 col-md-4 mt-3">
                      <Select
                        label={<span> Gender<span style={{ color: 'red' }}>*</span></span>}
                        name="gender"
                        value={values.gender}
                        // onChange={handleChange}

                        style={{ display: "block" }}
                        autoComplete="off"
                        onChange={(e) => {
                          setFieldValue("gender", e.target.value)


                        }}

                      >
                        <option label="Select Gender" />
                        <option value="Male" label="Male" />
                        <option value="Female" label="Female" />

                      </Select>
                      {errors.gender && touched.gender && (
                        <div className="invalid-text">{errors.gender}</div>
                      )}

                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="religionId"
                        label={<span> Religion<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("religionId", e.value || null);

                        }}
                        value={
                          dashboard.allReligionChildMenus?.find(
                            (option) => option.value === values.religionId
                          ) || null
                        }
                        error={errors.religionId}
                        touched={touched.religionId}
                        options={dashboard.allReligionChildMenus}
                      />
                    </div>


                    <div className="col-12 col-md-4 mt-3">
                      <Select
                        label={<span> Nationality</span>}
                        name="nationality"
                        value={values.nationality}
                        onChange={handleChange}
                        style={{ display: "block" }}
                      >
                        <option value="-1" label="Select Nationality" />
                        <option value="Pakistani" label="Pakistani" />
                        <option value="Other" label="Other" />

                      </Select>
                      {errors.nationality && touched.nationality && (
                        <div className="invalid-text">{errors.nationality}</div>
                      )}
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          S/O, D/O, W/O
                        </span>
                      </label>
                      <Field
                        name="relation_name"
                        component={Input}
                        placeholder="Enter  S/O, D/O, W/O"

                        type="text"

                      />
                    </div>





                  </div>


                </div>




                {/* Current Address*/}


                <div style={{ padding: "10px 0 40px 0px", marginBottom: "15px", borderRadius: "5px", marginTop: "15px", borderBottom: '2px solid rgb(194, 194, 194)' }}>
                  <h6>Current Address</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">






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

                    <div className="col-12 col-md-12 mt-3">
                      <Field
                        name="additional_summary"
                        component={TextArea}
                        placeholder="Enter Address"
                        label={<span> Address<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="phone_official"
                        component={Input}
                        maxLength="15"
                        placeholder="03151110002"
                        label="Phone (Offical) "
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="phone_cell"
                        component={Input}
                        maxLength="15"
                        placeholder="03151110002"
                        label="Cell No."
                        autoComplete="off"
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="email_personal"
                        component={Input}
                        placeholder="example@gmail.com"
                        label="Personal Email"
                        autoComplete="off"
                        maxLength="30"
                      />
                    </div>

                  </div>


                </div>





                {/* Applicant General Information*/}


                <div style={{ padding: "10px 0 40px 0px", marginBottom: "15px", borderRadius: "5px", marginTop: "15px", borderBottom: '2px solid rgb(194, 194, 194)' }}>
                  <h6>Applicant General Information</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">

                    <div className="form-group row col-12 col-md-12  p-0 m-0">

                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="applicantCanJoin"
                          component={Input}
                          placeholder="Enter applicant can join"
                          label={<span> Applicant can join<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                          type="number"
                        />
                      </div>

                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="currentDesignation"
                          component={Input}
                          placeholder="Enter current designation"
                          label={<span> Current Designation<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"

                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="lastDawnSalary"
                        component={Input}
                        placeholder="Enter last dawn salary"
                        label={<span> Last Dawn Salary<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                        type="number"
                      />
                    </div>


                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="lastDawnSalaryCurrencyId"
                        label={<span> Currency<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("lastDawnSalaryCurrencyId", e.value || null);



                        }}
                        value={
                          dashboard.allCurrencyCodeList?.find(
                            (option) => option.value === values.lastDawnSalaryCurrencyId
                          ) || null
                        }
                        error={errors.lastDawnSalaryCurrencyId}
                        touched={touched.lastDawnSalaryCurrencyId}
                        options={dashboard.allCurrencyCodeList}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="lastDawnSalaryPayTypeId"
                        isDisabled={isdataForRead}
                        label={
                          <span>
                            Per Month / Per Year<span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        value={salaryPayTypeIdOptions.find(
                          (option) => option.value === values.lastDawnSalaryPayTypeId
                        ) || null}
                        onChange={(e) => {
                          setFieldValue("lastDawnSalaryPayTypeId", e?.value !== undefined ? e.value : null)
                        }}
                        options={salaryPayTypeIdOptions}
                        error={errors.lastDawnSalaryPayTypeId}
                        touched={touched.lastDawnSalaryPayTypeId}
                      />

                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="expectedSalaryRangeFrom"
                        component={Input}
                        placeholder="Enter expected salary range(from)"
                        label={<span> Expected Salary Range(From)<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                        type="number"
                      />
                    </div>


                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="expectedSalaryRangeTo"
                        component={Input}
                        placeholder="Enter expected salary range(to)"
                        label={<span> Expected Salary Range(To)<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                        type="number"
                      />
                    </div>

                    <div className="col-12 col-md-2 mt-3">
                      <SearchSelect
                        name="expectedSalaryCurrencyId"
                        label={<span> Currency<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("expectedSalaryCurrencyId", e.value || null);



                        }}
                        value={
                          dashboard.allCurrencyCodeList?.find(
                            (option) => option.value === values.expectedSalaryCurrencyId
                          ) || null
                        }
                        error={errors.expectedSalaryCurrencyId}
                        touched={touched.expectedSalaryCurrencyId}
                        options={dashboard.allCurrencyCodeList}
                      />
                    </div>


                    <div className="col-12 col-md-2 mt-3">
                      <SearchSelect
                        name="expectedSalaryPayTypeId"
                        label={<span> Per Month / Per Year<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isdataForRead}
                        value={salaryPayTypeIdOptions.find(
                          (option) => option.value === values.expectedSalaryPayTypeId
                        ) || null}
                        onChange={(e) => {
                          setFieldValue("expectedSalaryPayTypeId", e?.value !== undefined ? e.value : null)
                        }}


                        error={errors.expectedSalaryPayTypeId}
                        touched={touched.expectedSalaryPayTypeId}
                        options={salaryPayTypeIdOptions}
                      />
                    </div>



                    <div className="col-12 col-md-12 mt-3">
                      <Field
                        name="otherInformation"
                        component={TextArea}
                        placeholder="Enter other information"
                        label={<span> Other Information</span>}
                        autoComplete="off"

                      />
                    </div>

                  </div>


                </div>


              </fieldset>

              <FieldArray name="details_applicant_vacancy">
                {({ push, remove }) => (
                  <div
                    style={{
                      backgroundColor: "rgb(235 243 255)",
                      padding: "20px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                      marginTop: "20px",
                    }}
                  >
                    <h6>Applicant Vacancy</h6>
                    <table className="table table-head-custom table-vertical-center  table-hover">
                      <thead>
                        <tr
                          style={{ backgroundColor: "#4d5f7a", color: "#fff" }}
                        >
                          <th>Action</th>


                          <th className="col-3">Job Vacancy</th>
                          <th className="col-2">Application Date</th>
                          <th className="col-2">Application Status</th>
                          <th className="col-2"> Status Date</th>

                          <th className="col-2">Appointment Type Type</th>

                        </tr>
                      </thead>
                      <tbody>
                        {values?.details_applicant_vacancy &&
                          values?.details_applicant_vacancy?.length > 0 &&
                          values?.details_applicant_vacancy?.map((detail, index) => (
                            <tr key={index}>
                              {/* <td>
                                {!isdataForRead && (


                                  <button
                                    type="button"
                                    // onClick={() => remove(index)}
                                    onClick={() => {
                                      const item = values.details_applicant_vacancy[index];

                                      // Only push to deleted array if item has an Id (means it's from backend)
                                      if (item?.Id) {
                                        const deleted = values.deleted_applicant_vacancy || [];
                                        deleted.push(item);
                                        setFieldValue("deleted_applicant_vacancy", deleted);
                                      }

                                      // Remove from main array
                                      const updatedList = [...values.details_applicant_vacancy];
                                      updatedList.splice(index, 1); // remove 1 item at position 'index'
                                      setFieldValue("details_applicant_vacancy", updatedList); // THIS IS IMPORTANT
                                    }}


                                    className="btn btn-danger btn-sm"
                                  >
                                    Delete
                                  </button>

                                )}
                              </td> */}
                              <td>
                                <button disabled={isdataForRead} className="btn btn-danger btn-elevate" type="button" onClick={() => {
                                  remove(index)
                                }}>
                                  Delete
                                </button>
                              </td>
                              {/* job vacancy selection */}
                              <td>
                                <SearchSelect
                                  name={`details_applicant_vacancy[${index}].jobVacancyId`}
                                  className="form-control"
                                  style={{ width: '200px', zIndex: 9999 }}
                                  disabled={isdataForRead || values.details_applicant_vacancy[index]?.Id}
                                  value={
                                    dashboard?.allJobVacancyList?.find(
                                      (x) => x.value === values.details_applicant_vacancy[index]?.jobVacancyId
                                    ) || null
                                  }
                                  onChange={(e) => {

                                    setFieldValue(`details_applicant_vacancy[${index}].jobVacancyId`, e?.value);
                                  }}
                                  options={
                                    dashboard?.allJobVacancyList
                                      ?.filter(
                                        (x) =>
                                          !values?.subsidiaryId || x?.subsidiaryId === values?.subsidiaryId
                                      )
                                      .map((x) => ({
                                        label: x.mergeLabel,
                                        value: x.value,
                                        disabled: values.details_applicant_vacancy.some(
                                          (el) => el.jobVacancyId === x.value
                                        ),
                                      })) || []
                                  }
                                  getOptionLabel={(x) => x.label}
                                  getOptionValue={(x) => x.value}
                                  isOptionDisabled={(x) => x.disabled}
                                  placeholder="Select--"
                                />

                                {errors.details_applicant_vacancy?.[index]?.jobVacancyId &&
                                  touched.details_applicant_vacancy?.[index]?.jobVacancyId && (
                                    <div className="text-danger">
                                      {errors.details_applicant_vacancy[index]?.jobVacancyId}
                                    </div>
                                  )}
                              </td>


                              <td>
                                <DatePicker
                                  className="form-control"
                                  style={{ width: '130px' }}
                                  placeholderText="Select Date"
                                  selected={
                                    values?.details_applicant_vacancy?.[index]?.applicationDate
                                      ? new Date(values.details_applicant_vacancy[index].applicationDate)
                                      : null
                                  }
                                  onChange={(date) => {
                                    const selectedDate = formatDates(date, 'yyyy-MM-dd'); // or use date.toISOString().split('T')[0]
                                    setFieldValue(`details_applicant_vacancy[${index}].applicationDate`, selectedDate);
                                  }}
                                  dateFormat="dd/MM/yyyy"
                                  name={`details_applicant_vacancy[${index}].applicationDate`}
                                  autoComplete="off"
                                  disabled={isdataForRead}
                                  maxDate={new Date()} // optional: restrict future dates
                                  showPopperArrow={false}
                                />

                                {errors.details_applicant_vacancy?.[index]?.applicationDate &&
                                  touched.details_applicant_vacancy?.[index]?.applicationDate && (
                                    <div className="text-danger">
                                      {errors.details_applicant_vacancy[index].applicationDate}
                                    </div>
                                  )}
                              </td>


                              <td>
                                <SearchSelect
                                  name={`details_applicant_vacancy[${index}].applicationStatusId`}
                                  className="form-control"
                                  style={{ width: '130px' }}
                                  disabled={isdataForRead}
                                  value={
                                    dashboard?.allApplicationStatusList?.find(
                                      (x) => x.value === values.details_applicant_vacancy[index]?.applicationStatusId
                                    ) || null
                                  }
                                  onChange={(e) => {

                                    setFieldValue(`details_applicant_vacancy[${index}].applicationStatusId`, e?.value);
                                  }}
                                  options={dashboard?.allApplicationStatusList || []}
                                  getOptionLabel={(x) => x.label} // optional: customize label rendering
                                  getOptionValue={(x) => x.value} // optional: customize value extraction
                                  placeholder="Select Status"
                                />

                                {errors.details_applicant_vacancy?.[index]?.applicationStatusId &&
                                  touched.details_applicant_vacancy?.[index]?.applicationStatusId && (
                                    <div className="text-danger">
                                      {errors.details_applicant_vacancy[index].applicationStatusId}
                                    </div>
                                  )}
                              </td>

                              <td>
                                <DatePicker
                                  className="form-control"
                                  style={{ width: '130px' }}
                                  placeholderText="Select Date"
                                  selected={
                                    values?.details_applicant_vacancy?.[index]?.statusDate
                                      ? new Date(values.details_applicant_vacancy[index].statusDate)
                                      : null
                                  }
                                  onChange={(date) => {
                                    const selectedDate = formatDates(date, 'yyyy-MM-dd'); // or use date.toISOString().split('T')[0]
                                    setFieldValue(`details_applicant_vacancy[${index}].statusDate`, selectedDate);
                                  }}
                                  dateFormat="dd/MM/yyyy"
                                  name={`details_applicant_vacancy[${index}].statusDate`}
                                  autoComplete="off"
                                  disabled={isdataForRead}
                                  maxDate={new Date()} // optional: restrict future dates
                                  showPopperArrow={false}
                                />

                                {errors.details_applicant_vacancy?.[index]?.statusDate &&
                                  touched.details_applicant_vacancy?.[index]?.statusDate && (
                                    <div className="text-danger">
                                      {errors.details_applicant_vacancy[index].statusDate}
                                    </div>
                                  )}
                              </td>

                              {/* allAppointmentTypeList */}
                              <td>
                                <SearchSelect
                                  name={`details_applicant_vacancy[${index}].appointmentTypeId`}
                                  className="form-control"
                                  style={{ width: '130px' }}
                                  disabled={isdataForRead}
                                  value={
                                    dashboard?.allAppointmentTypeList?.find(
                                      (x) => x.value === values.details_applicant_vacancy[index]?.appointmentTypeId
                                    ) || null
                                  }
                                  onChange={(e) => {

                                    setFieldValue(`details_applicant_vacancy[${index}].appointmentTypeId`, e?.value);
                                  }}
                                  options={dashboard?.allAppointmentTypeList || []}
                                  getOptionLabel={(x) => x.label} // optional: customize label rendering
                                  getOptionValue={(x) => x.value} // optional: customize value extraction
                                  placeholder="Select Status"
                                />

                                {errors.details_applicant_vacancy?.[index]?.appointmentTypeId &&
                                  touched.details_applicant_vacancy?.[index]?.appointmentTypeId && (
                                    <div className="text-danger">
                                      {errors.details_applicant_vacancy[index].appointmentTypeId}
                                    </div>
                                  )}
                              </td>




                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {!isdataForRead && (
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            jobVacancyId: "",
                            applicationDate: "",
                            applicationStatusId: "",
                            statusDate: "",
                            appointmentTypeId: "", // ✅ fix this key name


                          })
                        }
                        className="btn btn-primary btn-sm"
                      >
                        + Add Detail
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>
              {typeof errors.details_applicant_vacancy === 'string' && (
                <div className="text-danger">{errors.details_applicant_vacancy}</div>
              )}

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



            {!isdataForRead && (
              <button
                type="submit"
                onClick={() => { handleSubmit() }}
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
