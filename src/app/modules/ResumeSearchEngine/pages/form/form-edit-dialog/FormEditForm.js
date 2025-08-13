import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { amountLimit, amountLimitDynamic, formatDates, getFileName, getUploadUrl } from "../../../../../utils/common";
import DatePicker from "react-datepicker";
import { CirclePlus, Trash2 } from "lucide-react";


export const getApplicantProfileEditSchema = (formData) => {
  return Yup.object().shape({
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
    applicantStatusId: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    dateOfBirth: Yup.date()
      .nullable()
      .typeError('Invalid date format')
      .required(VALIDATION_MESSAGES.required),


    nic_no: Yup.string()
      .matches(/^\d{5}-\d{7}-\d{1}$/, 'ID Card No must be in the format 12345-6789012-3')
      .required(VALIDATION_MESSAGES.required),

    // .matches(/^\d{15}$/, 'Passport number must be exactly 15 digits long and contain only digits.'),
    passportNo: Yup.string()
      .max(15, 'Passport number must be at most 15 characters'),
    // .required(VALIDATION_MESSAGES.required),


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

    phone_cell: Yup.string()
      .nullable() // Allows null values
      .matches(/^0[0-9]*$/, 'Cell number must start with 0 and contain only digits') // Must start with 0 and contain only digits
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


    email: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
    //   // .required(VALIDATION_MESSAGES.required),
    password: Yup.string()
      .nullable()
      .when([], {
        is: () => !formData || !formData.Id, // Only apply validation in "create" mode
        then: Yup.string()
          .min(5, "At least 5 characters are required")
          .max(15, "At most 15 characters are required")
          .required("Password is required"),
        otherwise: Yup.string().nullable()
      }),

    file: Yup.mixed()
      .required(VALIDATION_MESSAGES.required)
      .test("fileSize", "File size must be less than 1 MB", value => {
        // Skip validation if it's an existing file (string)
        if (typeof value === "string") return true;
        return value && value.size <= 3 * 1024 * 1024;  // 3 MB
      })
      .test("fileType", "Unsupported file format", value => {
        if (typeof value === "string") return true;
        return value && [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/jpeg",
          "image/png"
        ].includes(value.type);
      }),


    details_applicant_skills: Yup.array().of(
      Yup.object().shape({
        skill: Yup.string()
          .trim()
          .required(VALIDATION_MESSAGES.required),
        description: Yup.string()
          .trim()
          .required(VALIDATION_MESSAGES.required),
        ratingScale: Yup.number()

          .min(1, "Minimum rating is 1")
          .max(10, "Maximum rating is 5")
          .required(VALIDATION_MESSAGES.required),
        startDate: Yup.date()
          .nullable()
          .required(VALIDATION_MESSAGES.required),
        endDate: Yup.date()
          .nullable()
          .min(Yup.ref("startDate"), VALIDATION_MESSAGES.endDateMustBeAfterStartDate)
          .required(VALIDATION_MESSAGES.required),
      })
    ),


    details_applicant_work_experience: Yup.array()
      .of(
        Yup.object().shape({
          companyName: Yup.string().required(VALIDATION_MESSAGES.required),
          positionHeld: Yup.string().required(VALIDATION_MESSAGES.required),
          countryId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
          cityId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
          startDate: Yup.date().nullable().required(VALIDATION_MESSAGES.required),
          endDate: Yup.date()
            .nullable()
            .min(Yup.ref("startDate"), "End date must be after start date")
            .required(VALIDATION_MESSAGES.required),
        })
      )
      .test(
        "no-overlapping-dates",
        "Work experience dates must not overlap.",
        function (entries) {
          if (!entries || entries.length <= 1) return true;

          // Filter out invalid dates
          const validEntries = entries.filter(
            (entry) => entry.startDate && entry.endDate
          );

          // Sort by start date
          const sorted = [...validEntries].sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
          );

          for (let i = 0; i < sorted.length - 1; i++) {
            const currentEnd = new Date(sorted[i].endDate);
            const nextStart = new Date(sorted[i + 1].startDate);

            if (currentEnd >= nextStart) {
              return false; // Overlapping period detected
            }
          }

          return true;
        }
      ),

    details_applicant_academic_info: Yup.array()
      .of(
        Yup.object().shape({
          institutionId: Yup.number()
            .nullable()
            .required(VALIDATION_MESSAGES.required),

          degreeId: Yup.number()
            .nullable()
            .required(VALIDATION_MESSAGES.required),

          countryId: Yup.number()
            .nullable()
            .required(VALIDATION_MESSAGES.required),

          cityId: Yup.number()
            .nullable()
            .required(VALIDATION_MESSAGES.required),

          gpa: Yup.number()
            .nullable()
            .min(0, "GPA must be 0 or more")
            .max(4, "GPA must be 4 or less")
            .required(VALIDATION_MESSAGES.required),

          startDate: Yup.date()
            .nullable()
            .required(VALIDATION_MESSAGES.required),

          endDate: Yup.date()
            .nullable()
            .min(
              Yup.ref("startDate"),
              VALIDATION_MESSAGES.endDateMustBeAfterStartDate
            )
            .required(VALIDATION_MESSAGES.required),
        })
      )
      .test(
        "no-overlapping-academic-dates",
        "Academic date ranges must not overlap.",
        function (entries) {
          if (!entries || entries.length <= 1) return true;

          // Filter out entries without valid dates
          const validEntries = entries.filter(
            (entry) => entry.startDate && entry.endDate
          );

          // Sort by startDate
          const sorted = [...validEntries].sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
          );

          for (let i = 0; i < sorted.length - 1; i++) {
            const currentEnd = new Date(sorted[i].endDate);
            const nextStart = new Date(sorted[i + 1].startDate);

            if (currentEnd >= nextStart) {
              return false; // Overlap detected
            }
          }

          return true;
        }
      ),


    details_applicant_vacancy: Yup.array()
      .of(
        Yup.object().shape({
          jobVacancyId: Yup.number()
            .nullable()
            .required(VALIDATION_MESSAGES.required),
          applicationDate: Yup.date()
            .nullable()
            .required(VALIDATION_MESSAGES.required),
          // applicationStatusId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
          statusDate: Yup.date()
            .nullable()
            .required(VALIDATION_MESSAGES.required),
          appointmentTypeId: Yup.number()
            .nullable()
            .required(VALIDATION_MESSAGES.required),
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

};


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

  const inputFile = useRef(null);
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

      dispatch(fetchAllFormsMenu(109, "allInstitution"));
      dispatch(fetchAllFormsMenu(108, "allDegreeTitle"));
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

  const ratingOptions = [
    { label: "Select", value: "" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" }
  ];


  const selectedJobVacancy = (values) =>
    dashboard?.allJobVacancyList?.find(
      (x) => x.value === values?.jobVacancyId
    );


  return (
    <Formik
      enableReinitialize={true}


      initialValues={formData}

      validationSchema={getApplicantProfileEditSchema(formData)}
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
            <Form className="form form-label-right" autoComplete="off">
              <fieldset disabled={isdataForRead}>



                {/* Job */}


                <h6 className="font-bold mb-0 text-primary my-2">
                  Applicant Profile
                </h6>

                <div className="grid lg:grid-cols-6 gap-x-3 gap-y-1">
                  <div className="">
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

                  <div className="">

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
                  <div className="">
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

                  <div className="">
                    <Field
                      name="firstName"
                      component={Input}
                      placeholder=" first name"
                      label={<span> First Name<span style={{ color: 'red' }}>*</span></span>}
                      autoComplete="off"
                    />
                  </div>
                  <div className="">
                    <Field
                      name="middleName"
                      component={Input}
                      placeholder=" middle name"
                      label={<span> Middle Name</span>}
                      autoComplete="off"
                    />
                  </div>
                  <div className="">
                    <Field
                      name="lastName"
                      component={Input}
                      placeholder=" last name"
                      label={<span> Last Name<span style={{ color: 'red' }}>*</span></span>}
                      autoComplete="off"
                    />
                  </div>


                </div>


                <hr></hr>

                {/* Applicant General Information*/}


                <div >

                  <h6 className="font-bold mb-0 text-primary my-2">
                    Applicant General Information
                  </h6>

                  <div className="grid lg:grid-cols-4 gap-x-3 gap-y-1">



                    <div className="">
                      <Field
                        name="applicantCanJoin"
                        component={Input}
                        placeholder="Enter applicant can join"
                        label={<span> Applicant can join<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                        type="number"
                      />
                    </div>

                    <div className="">
                      <Field
                        name="currentDesignation"
                        component={Input}
                        placeholder="Enter current designation"
                        label={<span> Current Designation<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"

                      />
                    </div>
                    <div className="">
                      <Field
                        name="lastDawnSalary"
                        component={Input}
                        placeholder="Enter last drawn salary"
                        label={<span> Last Drawn Salary<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                        type="number"
                      />
                    </div>


                    <div className="">
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
                  </div>

                </div>
                <div className="grid lg:grid-cols-5 gap-x-3 gap-y-1 mt-1">
                  <div className="">
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

                  <div className="">
                    <Field
                      name="expectedSalaryRangeFrom"
                      component={Input}
                      placeholder="Enter expected salary range(from)"
                      label={<span> Expected Salary Range(From)<span style={{ color: 'red' }}>*</span></span>}
                      autoComplete="off"
                      type="number"
                    />
                  </div>


                  <div className="">
                    <Field
                      name="expectedSalaryRangeTo"
                      component={Input}
                      placeholder="Enter expected salary range(to)"
                      label={<span> Expected Salary Range(To)<span style={{ color: 'red' }}>*</span></span>}
                      autoComplete="off"
                      type="number"
                    />
                  </div>

                  <div className="">
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


                  <div className="">
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

                </div>
                <div className="grid gap-x-3 gap-y-1 mt-1">

                  <div className="">
                    <Field
                      name="otherInformation"
                      component={TextArea}
                      placeholder="Enter other information"
                      label={<span> Other Information</span>}
                      autoComplete="off"

                    />
                  </div>



                </div>



              </fieldset>
              <hr></hr>

              {/* Details Work Experience */}
              <div className="w-full overflow-x-auto mt-1">

                <FieldArray name="details_applicant_work_experience">
                  {({ push, remove }) => (
                    <div>
                      <div className="flex justify-between items-center">
                        <h6 className="font-bold mb-0 text-primary">
                          Work Experience{"  "}
                        </h6>
                        {!isdataForRead && (
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                companyName: "",
                                countryId: "",
                                positionHeld: "",
                                cityId: "",
                                startDate: "", // ✅ fix this key name
                                endDate: "",

                              })
                            }
                            className="btn btn-primary btn-sm"
                          >
                            <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "} Add Detail
                          </button>
                        )}
                      </div>
                      <div className="w-full overflow-x-auto">
                        <div className="react-bootstrap-table table-responsive">
                          <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                            <tr className="custom-table-header">



                              <td className="min-w-32">Company</td>
                              <td className="min-w-32"> Position Held</td>
                              <td className="min-w-32">Country</td>
                              <td className="min-w-32">City</td>
                              <td className="min-w-32">Start Date</td>
                              <td className="min-w-32">End Date</td>
                              <th>Action</th>

                            </tr>

                            <tbody>
                              {values?.details_applicant_work_experience &&
                                values?.details_applicant_work_experience?.length > 0 &&
                                values?.details_applicant_work_experience?.map((detail, index) => (
                                  <tr key={index}>


                                    {/* job vacancy selection */}
                                    <td>
                                      <Field
                                        name={`details_applicant_work_experience[${index}].companyName`}
                                        component={Input}
                                        disabled={isdataForRead}
                                        placeholder="Enter company"
                                        autoComplete="off"

                                      />


                                      {errors.details_applicant_work_experience?.[index]?.companyName &&
                                        touched.details_applicant_work_experience?.[index]?.companyName && (
                                          <div className="text-danger">
                                            {errors.details_applicant_work_experience[index]?.companyName}
                                          </div>
                                        )}
                                    </td>


                                    <td>
                                      <Field
                                        name={`details_applicant_work_experience[${index}].positionHeld`}
                                        component={Input}
                                        disabled={isdataForRead}
                                        placeholder="Enter position"
                                        autoComplete="off"

                                      />

                                      {errors.details_applicant_work_experience?.[index]?.positionHeld &&
                                        touched.details_applicant_work_experience?.[index]?.positionHeld && (
                                          <div className="text-danger">
                                            {errors.details_applicant_work_experience[index].positionHeld}
                                          </div>
                                        )}
                                    </td>
                                    {/* country */}

                                    <td>

                                      <SearchSelect
                                        name={`details_applicant_work_experience[${index}].countryId`}

                                        isDisabled={isdataForRead}
                                        onChange={(e) => {
                                          const selectedCountryId = e.value || null;
                                          setFieldValue(`details_applicant_work_experience[${index}].countryId`, selectedCountryId);
                                          setFieldValue(`details_applicant_work_experience[${index}].cityId`, null); // Reset city on country change
                                        }}
                                        value={
                                          dashboard?.allCountry?.find(
                                            (x) => x.value === values.details_applicant_work_experience[index]?.countryId
                                          ) || null
                                        }
                                        options={dashboard?.allCountry || []}
                                        getOptionLabel={(x) => x.label} // optional: customize label rendering
                                        getOptionValue={(x) => x.value} // optional: customize value extraction
                                        placeholder="Select Status"
                                      />
                                      {errors.details_applicant_work_experience?.[index]?.countryId &&
                                        touched.details_applicant_work_experience?.[index]?.countryId && (
                                          <div className="text-danger">
                                            {errors.details_applicant_work_experience[index].countryId}
                                          </div>
                                        )}


                                    </td>

                                    {/* city  */}
                                    <td>
                                      <SearchSelect
                                        name={`details_applicant_work_experience[${index}].cityId`}

                                        isDisabled={isdataForRead || !values.details_applicant_work_experience[index]?.countryId}
                                        onChange={(e) => {
                                          setFieldValue(`details_applicant_work_experience[${index}].cityId`, e.value || null);
                                        }}
                                        value={
                                          filteredCities(values.details_applicant_work_experience[index]?.countryId).find(
                                            (option) => option.value === values.details_applicant_work_experience[index]?.cityId
                                          ) || null
                                        }
                                        options={filteredCities(values.details_applicant_work_experience[index]?.countryId)}

                                      />

                                      {errors.details_applicant_work_experience?.[index]?.cityId &&
                                        touched.details_applicant_work_experience?.[index]?.cityId && (
                                          <div className="text-danger">
                                            {errors.details_applicant_work_experience[index].cityId}
                                          </div>
                                        )}
                                    </td>

                                    {/* start date  */}
                                    <td>
                                      <DatePicker
                                        className="form-control"
                                        style={{ width: '130px' }}
                                        placeholderText="Select Date"
                                        selected={
                                          values?.details_applicant_work_experience?.[index]?.startDate
                                            ? new Date(values.details_applicant_work_experience[index].startDate)
                                            : null
                                        }
                                        onChange={(date) => {
                                          const selectedDate = formatDates(date, 'yyyy-MM-dd'); // or use date.toISOString().split('T')[0]
                                          setFieldValue(`details_applicant_work_experience[${index}].startDate`, selectedDate);
                                        }}
                                        dateFormat="dd-MMM-yyyy"
                                        name={`details_applicant_work_experience[${index}].startDate`}
                                        autoComplete="off"
                                        disabled={isdataForRead}
                                        minDate={values?.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                        maxDate={new Date()} // optional: restrict future dates
                                        showPopperArrow={false}
                                      />

                                      {errors.details_applicant_work_experience?.[index]?.startDate &&
                                        touched.details_applicant_work_experience?.[index]?.startDate && (
                                          <div className="text-danger">
                                            {errors.details_applicant_work_experience[index].startDate}
                                          </div>
                                        )}
                                    </td>

                                    {/* end date  */}
                                    <td>
                                      <DatePicker
                                        className="form-control"
                                        style={{ width: '130px' }}
                                        placeholderText="Select Date"
                                        selected={
                                          values?.details_applicant_work_experience?.[index]?.endDate
                                            ? new Date(values.details_applicant_work_experience[index].endDate)
                                            : null
                                        }
                                        onChange={(date) => {
                                          const selectedDate = formatDates(date, 'yyyy-MM-dd'); // or use date.toISOString().split('T')[0]
                                          setFieldValue(`details_applicant_work_experience[${index}].endDate`, selectedDate);
                                        }}
                                        dateFormat="dd-MMM-yyyy"
                                        name={`details_applicant_work_experience[${index}].endDate`}
                                        autoComplete="off"
                                        disabled={isdataForRead}
                                        minDate={values?.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                        maxDate={new Date()} // optional: restrict future dates
                                        showPopperArrow={false}
                                      />

                                      {errors.details_applicant_work_experience?.[index]?.endDate &&
                                        touched.details_applicant_work_experience?.[index]?.endDate && (
                                          <div className="text-danger">
                                            {errors.details_applicant_work_experience[index].endDate}
                                          </div>
                                        )}
                                    </td>


                                    <td className="text-right">
                                      <button disabled={isdataForRead} className="bg-transparent border-none" type="button" onClick={() => {
                                        remove(index)
                                      }}>
                                        <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>

                        </div>
                      </div>
                    </div>
                  )}





                </FieldArray>

              </div>

              {typeof errors.details_applicant_work_experience === 'string' && (
                <div className="text-danger">{errors.details_applicant_work_experience}</div>
              )}

              <hr></hr>
              {/* Details Academic Info */}
              <div className="w-full overflow-x-auto mt-1">
                <FieldArray name="details_applicant_academic_info">
                  {({ push, remove }) => (
                    <div>
                      <div className="flex justify-between items-center">
                        <h6 className="font-bold mb-0 text-primary">
                          Academic Info{"  "}
                        </h6>
                        {!isdataForRead && (
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                institutionId: "",
                                degreeId: "",
                                countryId: "",
                                cityId: "",
                                gpa: "",
                                startDate: "",
                                endDate: "",

                              })
                            }
                            className="btn btn-primary btn-sm"
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



                              <td className="min-w-32">Institution</td>
                              <td className="min-w-32">Degree</td>
                              <td className="min-w-32">Country</td>
                              <td className="min-w-32">City</td>
                              <td className="min-w-32">CGPA</td>
                              <td className="min-w-32">Start Date</td>
                              <td className="min-w-32">End Date</td>
                              <th>Action</th>

                            </tr>

                            <tbody>
                              {values?.details_applicant_academic_info &&
                                values?.details_applicant_academic_info?.length > 0 &&
                                values?.details_applicant_academic_info?.map((detail, index) => (
                                  <tr key={index}>


                                    {/* job vacancy selection */}

                                    {/* institution */}

                                    <td>
                                      <SearchSelect
                                        name={`details_applicant_academic_info[${index}].institutionId`}
                                        className="form-control"
                                        style={{ width: '130px' }}
                                        isDisabled={isdataForRead}
                                        value={
                                          dashboard?.allInstitution?.find(
                                            (x) => x.value === values.details_applicant_academic_info[index]?.institutionId
                                          ) || null
                                        }
                                        onChange={(e) => {

                                          setFieldValue(`details_applicant_academic_info[${index}].institutionId`, e?.value);
                                        }}
                                        options={dashboard.allInstitution || []}
                                        getOptionLabel={(x) => x.label} // optional: customize label rendering
                                        getOptionValue={(x) => x.value} // optional: customize value extraction
                                        placeholder="Select Status"
                                      />

                                      {errors.details_applicant_academic_info?.[index]?.institutionId &&
                                        touched.details_applicant_academic_info?.[index]?.institutionId && (
                                          <div className="text-danger">
                                            {errors.details_applicant_academic_info[index].institutionId}
                                          </div>
                                        )}
                                    </td>



                                    {/* degree */}

                                    <td>
                                      <SearchSelect
                                        name={`details_applicant_academic_info[${index}].degreeId`}
                                        className="form-control"
                                        style={{ width: '130px' }}
                                        isDisabled={isdataForRead}
                                        value={
                                          dashboard?.allDegreeTitle?.find(
                                            (x) => x.value === values.details_applicant_academic_info[index]?.degreeId
                                          ) || null
                                        }
                                        onChange={(e) => {

                                          setFieldValue(`details_applicant_academic_info[${index}].degreeId`, e?.value);
                                        }}
                                        options={dashboard?.allDegreeTitle || []}
                                        getOptionLabel={(x) => x.label} // optional: customize label rendering
                                        getOptionValue={(x) => x.value} // optional: customize value extraction
                                        placeholder="Select Status"
                                      />

                                      {errors.details_applicant_academic_info?.[index]?.degreeId &&
                                        touched.details_applicant_academic_info?.[index]?.degreeId && (
                                          <div className="text-danger">
                                            {errors.details_applicant_academic_info[index].degreeId}
                                          </div>
                                        )}
                                    </td>


                                    {/* country */}

                                    <td>

                                      <SearchSelect
                                        name={`details_applicant_academic_info[${index}].countryId`}

                                        isDisabled={isdataForRead}
                                        onChange={(e) => {
                                          const selectedCountryId = e.value || null;
                                          setFieldValue(`details_applicant_academic_info[${index}].countryId`, selectedCountryId);
                                          setFieldValue(`details_applicant_academic_info[${index}].cityId`, null); // Reset city on country change
                                        }}
                                        value={
                                          dashboard?.allCountry?.find(
                                            (x) => x.value === values.details_applicant_academic_info[index]?.countryId
                                          ) || null
                                        }
                                        options={dashboard?.allCountry || []}
                                        getOptionLabel={(x) => x.label} // optional: customize label rendering
                                        getOptionValue={(x) => x.value} // optional: customize value extraction
                                        placeholder="Select Status"
                                      />
                                      {errors.details_applicant_academic_info?.[index]?.countryId &&
                                        touched.details_applicant_academic_info?.[index]?.countryId && (
                                          <div className="text-danger">
                                            {errors.details_applicant_academic_info[index].countryId}
                                          </div>
                                        )}


                                    </td>

                                    {/* city  */}
                                    <td>
                                      <SearchSelect
                                        name={`details_applicant_academic_info[${index}].cityId`}

                                        isDisabled={isdataForRead || !values.details_applicant_academic_info[index]?.countryId}
                                        onChange={(e) => {
                                          setFieldValue(`details_applicant_academic_info[${index}].cityId`, e.value || null);
                                        }}
                                        value={
                                          filteredCities(values.details_applicant_academic_info[index]?.countryId).find(
                                            (option) => option.value === values.details_applicant_academic_info[index]?.cityId
                                          ) || null
                                        }
                                        options={filteredCities(values.details_applicant_academic_info[index]?.countryId)}

                                      />

                                      {errors.details_applicant_academic_info?.[index]?.cityId &&
                                        touched.details_applicant_academic_info?.[index]?.cityId && (
                                          <div className="text-danger">
                                            {errors.details_applicant_academic_info[index].cityId}
                                          </div>
                                        )}
                                    </td>

                                    {/* cgpa */}


                                    <td>
                                      <Field
                                        name={`details_applicant_academic_info[${index}].gpa`}
                                        component={Input}
                                        disabled={isdataForRead}
                                        placeholder="Enter company"
                                        autoComplete="off"
                                        type="number"

                                      />


                                      {errors.details_applicant_academic_info?.[index]?.gpa &&
                                        touched.details_applicant_academic_info?.[index]?.gpa && (
                                          <div className="text-danger">
                                            {errors.details_applicant_academic_info[index]?.gpa}
                                          </div>
                                        )}
                                    </td>

                                    {/* start date  */}
                                    <td>

                                      <DatePicker
                                        className="form-control"
                                        style={{ width: '130px' }}
                                        placeholderText="Select Date"
                                        selected={
                                          values?.details_applicant_academic_info?.[index]?.startDate
                                            ? new Date(values.details_applicant_academic_info[index].startDate)
                                            : null
                                        }
                                        onChange={(date) => {
                                          const selectedDate = formatDates(date, 'yyyy-MM-dd'); // or use date.toISOString().split('T')[0]
                                          setFieldValue(`details_applicant_academic_info[${index}].startDate`, selectedDate);
                                        }}
                                        dateFormat="dd-MMM-yyyy"
                                        name={`details_applicant_academic_info[${index}].startDate`}
                                        autoComplete="off"
                                        disabled={isdataForRead}
                                        minDate={values?.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                        maxDate={new Date()} // optional: restrict future dates
                                        showPopperArrow={false}
                                      />

                                      {errors.details_applicant_academic_info?.[index]?.startDate &&
                                        touched.details_applicant_academic_info?.[index]?.startDate && (
                                          <div className="text-danger">
                                            {errors.details_applicant_academic_info[index].startDate}
                                          </div>
                                        )}
                                    </td>

                                    {/* end date  */}
                                    <td>

                                      <DatePicker
                                        className="form-control"
                                        style={{ width: '130px' }}

                                        placeholderText="Select Date"
                                        selected={
                                          values?.details_applicant_academic_info?.[index]?.endDate
                                            ? new Date(values.details_applicant_academic_info[index].endDate)
                                            : null
                                        }
                                        onChange={(date) => {
                                          const selectedDate = formatDates(date, 'yyyy-MM-dd'); // or use date.toISOString().split('T')[0]
                                          console.log("selectedDate1111", selectedDate)
                                          setFieldValue(`details_applicant_academic_info[${index}].endDate`, selectedDate);
                                        }}
                                        dateFormat="dd-MMM-yyyy"
                                        name={`details_applicant_academic_info[${index}].endDate`}
                                        autoComplete="off"
                                        disabled={isdataForRead}
                                        minDate={values?.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                        maxDate={new Date()} // optional: restrict future dates
                                        showPopperArrow={false}
                                      />

                                      {errors.details_applicant_academic_info?.[index]?.endDate &&
                                        touched.details_applicant_academic_info?.[index]?.endDate && (
                                          <div className="text-danger">
                                            {errors.details_applicant_academic_info[index].endDate}
                                          </div>
                                        )}
                                    </td>

                                    <td className="text-right">
                                      <button disabled={isdataForRead} className="bg-transparent border-none" type="button" onClick={() => {
                                        remove(index)
                                      }}>
                                        <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                      </button>
                                    </td>

                                  </tr>
                                ))}
                            </tbody>
                          </table>


                        </div>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </div>

              {typeof errors.details_applicant_academic_info === 'string' && (
                <div className="text-danger">{errors.details_applicant_academic_info}</div>
              )}

              <hr></hr>
              {/* Details Skills  */}
              <div className="w-full overflow-x-auto mt-1">
                <FieldArray name="details_applicant_skills">
                  {({ push, remove }) => (
                    <div>
                      <div className="flex justify-between items-center">
                        <h6 className="font-bold mb-0 text-primary">
                          Skills{"  "}
                        </h6>
                        {!isdataForRead && (
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                skill: "",
                                description: "",
                                ratingScale: "",
                                startDate: "",
                                endDate: "",
                              })
                            }
                            className="btn btn-primary btn-sm"
                          >
                            <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "} Add Detail
                          </button>
                        )}
                      </div>
                      <div className="w-full overflow-x-auto">
                        <div className="react-bootstrap-table table-responsive">
                          <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                            <tr className="custom-table-header">


                              <td className="col-2"> Skill</td>
                              <td className="col-3">Description</td>

                              <td className="col-2">Rating</td>
                              <td className="col-2">Start Date</td>
                              <td className="col-2">End Date</td>
                              <th>Action</th>
                            </tr>

                            <tbody>
                              {values?.details_applicant_skills &&
                                values?.details_applicant_skills?.length > 0 &&
                                values?.details_applicant_skills?.map((detail, index) => (
                                  <tr key={index}>




                                    {/* skill */}


                                    <td>
                                      <Field
                                        name={`details_applicant_skills[${index}].skill`}
                                        component={Input}
                                        disabled={isdataForRead}
                                        placeholder="Enter skill"
                                        autoComplete="off"


                                      />


                                      {errors.details_applicant_skills?.[index]?.skill &&
                                        touched.details_applicant_skills?.[index]?.skill && (
                                          <div className="text-danger">
                                            {errors.details_applicant_skills[index]?.skill}
                                          </div>
                                        )}
                                    </td>


                                    {/* description */}


                                    <td>
                                      <Field
                                        name={`details_applicant_skills[${index}].description`}
                                        component={Input}
                                        disabled={isdataForRead}
                                        placeholder="Enter description"
                                        autoComplete="off"


                                      />


                                      {errors.details_applicant_skills?.[index]?.description &&
                                        touched.details_applicant_skills?.[index]?.description && (
                                          <div className="text-danger">
                                            {errors.details_applicant_skills[index]?.description}
                                          </div>
                                        )}
                                    </td>

                                    {/* rating */}
                                    <td>
                                      <SearchSelect
                                        name={`details_applicant_skills[${index}].ratingScale`}
                                        className="form-control"
                                        style={{ width: '130px' }}
                                        isDisabled={isdataForRead}
                                        value={
                                          ratingOptions?.find(
                                            (x) => x.value == values.details_applicant_skills[index]?.ratingScale
                                          ) || null
                                        }
                                        onChange={(e) => {

                                          setFieldValue(`details_applicant_skills[${index}].ratingScale`, e?.value);
                                        }}
                                        options={ratingOptions || []}
                                        getOptionLabel={(x) => x.label} // optional: customize label rendering
                                        getOptionValue={(x) => x.value} // optional: customize value extraction
                                        placeholder="Select Status"
                                      />

                                      {errors.details_applicant_skills?.[index]?.ratingScale &&
                                        touched.details_applicant_skills?.[index]?.ratingScale && (
                                          <div className="text-danger">
                                            {errors.details_applicant_skills[index].ratingScale}
                                          </div>
                                        )}
                                    </td>



                                    {/* start date  */}
                                    <td>
                                      <DatePicker
                                        className="form-control"
                                        style={{ width: '130px' }}
                                        placeholderText="Select Date"
                                        selected={
                                          values?.details_applicant_skills?.[index]?.startDate
                                            ? new Date(values.details_applicant_skills[index].startDate)
                                            : null
                                        }
                                        onChange={(date) => {
                                          const selectedDate = formatDates(date, 'yyyy-MM-dd'); // or use date.toISOString().split('T')[0]
                                          setFieldValue(`details_applicant_skills[${index}].startDate`, selectedDate);
                                        }}
                                        dateFormat="dd-MMM-yyyy"
                                        name={`details_applicant_skills[${index}].startDate`}
                                        autoComplete="off"
                                        disabled={isdataForRead}
                                        minDate={values?.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                        maxDate={new Date()} // optional: restrict future dates
                                        showPopperArrow={false}
                                      />

                                      {errors.details_applicant_skills?.[index]?.startDate &&
                                        touched.details_applicant_skills?.[index]?.startDate && (
                                          <div className="text-danger">
                                            {errors.details_applicant_skills[index].startDate}
                                          </div>
                                        )}
                                    </td>

                                    {/* end date  */}
                                    <td>
                                      <DatePicker
                                        className="form-control"
                                        style={{ width: '130px' }}
                                        placeholderText="Select Date"
                                        selected={
                                          values?.details_applicant_skills?.[index]?.endDate
                                            ? new Date(values.details_applicant_skills[index].endDate)
                                            : null
                                        }
                                        onChange={(date) => {
                                          const selectedDate = formatDates(date, 'yyyy-MM-dd'); // or use date.toISOString().split('T')[0]
                                          setFieldValue(`details_applicant_skills[${index}].endDate`, selectedDate);
                                        }}
                                        dateFormat="dd-MMM-yyyy"
                                        name={`details_applicant_skills[${index}].endDate`}
                                        autoComplete="off"
                                        disabled={isdataForRead}
                                        minDate={values?.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                        maxDate={new Date()} // optional: restrict future dates
                                        showPopperArrow={false}
                                      />

                                      {errors.details_applicant_skills?.[index]?.endDate &&
                                        touched.details_applicant_skills?.[index]?.endDate && (
                                          <div className="text-danger">
                                            {errors.details_applicant_skills[index].endDate}
                                          </div>
                                        )}
                                    </td>
                                    <td className="text-right">
                                      <button disabled={isdataForRead} className="bg-transparent border-none" type="button" onClick={() => {
                                        remove(index)
                                      }}>
                                        <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                      </button>
                                    </td>


                                  </tr>
                                ))}
                            </tbody>
                          </table>


                        </div>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </div>
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
