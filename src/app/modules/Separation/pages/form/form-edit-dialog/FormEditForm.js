import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
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
  getLatestTableId,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import {
  amountLimit,
  amountLimitDynamic,
  formatDates,
  getFileName,
  getUploadUrl,
} from "../../../../../utils/common";
import DatePicker from "react-datepicker";
import { subYears } from "date-fns";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { CirclePlus, Trash2, Upload, User } from "lucide-react";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import { fetchExitReasonData } from "../../../../Dashboard/_redux/dashboardActions";
export const USERS_URL = process.env.REACT_APP_API_URL;

export const getApplicantProfileEditSchema = (formData) => {
  return Yup.object()
    .shape({
      subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),

      title: Yup.string().required(VALIDATION_MESSAGES.required),

      applicantCode: Yup.string()
        .min(6, "Job code must be  6 characters")
        .max(6, "Job code must be  6 characters")
        .required(VALIDATION_MESSAGES.required),

      firstName: Yup.string().required(VALIDATION_MESSAGES.required),
      lastName: Yup.string().required(VALIDATION_MESSAGES.required),
      middleName: Yup.string().nullable(),
      // .required(VALIDATION_MESSAGES.required),
      applicantStatusId: Yup.number()
        .nullable()
        .required(VALIDATION_MESSAGES.required),
      nationality: Yup.string().required(VALIDATION_MESSAGES.required),
      dateOfBirth: Yup.date()
        .nullable()
        .typeError("Invalid date format")
        .required(VALIDATION_MESSAGES.required)
        .max(subYears(new Date(), 15), "Must be at least 15 years old"),

      nic_no: Yup.string()
        .matches(
          /^\d{5}-\d{7}-\d{1}$/,
          "ID Card No must be in the format 12345-6789012-3"
        )
        .required(VALIDATION_MESSAGES.required),

      // .matches(/^\d{15}$/, 'Passport number must be exactly 15 digits long and contain only digits.'),
      passportNo: Yup.string()
        .nullable()
        .max(15, "Passport number must be at most 15 characters"),
      // .required(VALIDATION_MESSAGES.required),

      maritalStatus: Yup.string().required(VALIDATION_MESSAGES.required),

      gender: Yup.string().required(VALIDATION_MESSAGES.required),

      relation_name: Yup.string().required(VALIDATION_MESSAGES.required),

      religionId: Yup.string().required(VALIDATION_MESSAGES.required),

      //address
      additional_summary: Yup.string().required(VALIDATION_MESSAGES.required),

      phone_official: Yup.string()
        .nullable() // Allows null values
        .matches(
          /^0[0-9]*$/,
          "Phone number must start with 0 and contain only digits"
        ) // Must start with 0 and contain only digits
        .notRequired(), // Make it optional if you want

      phone_cell: Yup.string()
        .nullable() // Allows null values
        .matches(
          /^0[0-9]*$/,
          "Cell number must start with 0 and contain only digits"
        ) // Must start with 0 and contain only digits
        .notRequired(), // Make it optional if you want

      email_personal: Yup.string()
        .nullable() // Allows null values
        .email("Invalid email address")
        .required(VALIDATION_MESSAGES.required),

      applicantCanJoin: Yup.number()
        .min(1, VALIDATION_MESSAGES.minOneValue)
        .required(VALIDATION_MESSAGES.required),

      lastDawnSalary: Yup.number()
        .min(0, VALIDATION_MESSAGES.minZeroValue)
        .required(VALIDATION_MESSAGES.required),

      lastDawnSalaryCurrencyId: Yup.number().required(
        VALIDATION_MESSAGES.required
      ),

      lastDawnSalaryPayTypeId: Yup.number().required(
        VALIDATION_MESSAGES.required
      ),

      expectedSalaryRangeFrom: Yup.number()
        .min(0, VALIDATION_MESSAGES.minZeroValue)
        .required(VALIDATION_MESSAGES.required),

      expectedSalaryRangeTo: Yup.number()
        .min(0, VALIDATION_MESSAGES.minZeroValue)
        .required(VALIDATION_MESSAGES.required)
        .test(
          "is-greater",
          'Expected salary range "To" must be greater than "From"',
          function (value) {
            const { expectedSalaryRangeFrom } = this.parent;
            return value > expectedSalaryRangeFrom;
          }
        ),

      expectedSalaryCurrencyId: Yup.number().required(
        VALIDATION_MESSAGES.required
      ),

      expectedSalaryPayTypeId: Yup.number().required(
        VALIDATION_MESSAGES.required
      ),

      // otherInformation: Yup.string()
      //   .required(VALIDATION_MESSAGES.required),

      currentDesignation: Yup.string().required(VALIDATION_MESSAGES.required),

      jobVacancyId: Yup.string().nullable(), // optional banane ke liye

      countryId: Yup.number().nullable(), // optional banane ke liye

      cityId: Yup.string()
        .nullable() // <- apply globally
        .when("countryId", {
          is: (val) => val !== undefined && val !== null && val !== "",
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
          otherwise: Yup.string().nullable(),
        }),

      file: Yup.mixed()
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

      details_applicant_skills: Yup.array()
        .of(
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
              .nullable()
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
          "unique-skill",
          "Duplicate skill names are not allowed.",
          function (skills) {
            if (!Array.isArray(skills)) return true; // ✅ safely skip if not an array

            const skillNames = skills.map((s) => s.skill?.trim().toLowerCase());
            const duplicates = skillNames.filter(
              (name, idx) => skillNames.indexOf(name) !== idx
            );

            if (duplicates.length > 0) {
              return this.createError({
                path: "details_applicant_skills",
                message: "Duplicate skill are not allowed.",
              });
            }

            return true;
          }
        ),

      details_applicant_work_experience: Yup.array()
        .of(
          Yup.object().shape({
            companyName: Yup.string().required(VALIDATION_MESSAGES.required),
            positionHeld: Yup.string().required(VALIDATION_MESSAGES.required),
            countryId: Yup.number()
              .nullable()
              .required(VALIDATION_MESSAGES.required),
            cityId: Yup.number()
              .nullable()
              .required(VALIDATION_MESSAGES.required),
            startDate: Yup.date()
              .nullable()
              .required(VALIDATION_MESSAGES.required),
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
              .nullable(),
            // .required(VALIDATION_MESSAGES.required),
            appointmentTypeId: Yup.number()
              .nullable()
              .required(VALIDATION_MESSAGES.required),
          })
        )
        .test(
          "unique-jobVacancyId",
          "Each Job Vacancy must be unique.",
          function (vacancies) {
            if (!vacancies) return true;

            const jobVacancyIds = vacancies.map((v) => v.jobVacancyId);
            const duplicates = jobVacancyIds.filter(
              (id, idx) => jobVacancyIds.indexOf(id) !== idx
            );

            if (duplicates.length > 0) {
              return this.createError({
                path: `details_applicant_vacancy`, // attaches error to the array
                message: `Duplicate Job Vacancy selected.`,
              });
            }

            return true;
          }
        )
        .test(
          "only-one-activeCV",
          "Only one Active Vacancy can be selected.",
          function (vacancies) {
            if (!vacancies) return true;
            const activeCount = vacancies.filter((v) => v.activeCV === true).length;
            if (activeCount > 1) {
              return this.createError({
                path: `details_applicant_vacancy`,
                message: `Only one record can be marked as Active Vacancy.`,
              });
            }
            return true;
          }
        ),
    })

    .test(
      "check-marital-status",
      "Invalid marital status for selected title",
      function (value) {
        // if (title === 'Mrs.' && maritalStatus === '261') {
        const { title, maritalStatus, gender } = value;

        // Check conditions based on title // 196 == Single
        if (title === "Mrs." && maritalStatus !== "267") {
          //married

          return this.createError({
            path: "maritalStatus",
            message: "Mrs. only for Married",
          });
        }

        if (title === "Mrs." && maritalStatus === "266") {
          //single
          return this.createError({
            path: "maritalStatus",
            message: "Mrs. cannot be single.",
          });
        }

        if ((title == "Mrs." || title == "Ms.") && gender == "Male") {
          return this.createError({
            path: "gender",
            message: "Mrs. Ms. cannot be male.",
          });
        }

        // if ((title === 'Mr.' || title === 'Dr.' || title === 'Professor.' || title === 'Captain') && gender === 'Female') {
        //   return this.createError({ path: 'gender', message: 'Mr. cannot be female.' });
        // }

        if (title === "Mr." && gender === "Female") {
          return this.createError({
            path: "gender",
            message: "Mr. cannot be female.",
          });
        }

        // if (title === 'Mr.' && maritalStatus != 266 && maritalStatus != 267 && maritalStatus != 269) { //divorced

        //   return this.createError({ path: 'maritalStatus', message: 'Mr. cannot be female.' });
        // }
        if (title === "Mr." && maritalStatus == 268) {
          //Widow

          return this.createError({
            path: "maritalStatus",
            message: "Mr. cannot be widow.",
          });
        }

        if (title === "Ms." && maritalStatus == 267) {
          return this.createError({
            path: "maritalStatus",
            message: "Ms. only for single woman.",
          });
        }

        return true; // No error
      }
    );
};

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isdataForRead,
  enableLoading,
  loading, disbaleLoading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const [profile_image, setImage] = useState(
    formData?.profile_image
  );
  const inputFile = useRef(null);
  const [file, setFile] = useState("");
  const [applicantCode, setApplicantCode] = useState("");
  const [allSkillNames, setAllSkillNames] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  // At top of your component
  const [skillsAutoAdded, setSkillsAutoAdded] = useState(false);

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
      dispatch(fetchAllFormsMenu(128, "allNationalities"));
      dispatch(fetchAllFormsMenu(414, "allJobSkillList"));


      dispatch(fetchAllFormsMenu(526, "allExitTypeList"));
      dispatch(fetchExitReasonData(formData?.exitTypeId));
      dispatch(
        fetchAllEmployeesWithNoPermissionData(
          "allEmployeesWithNoPermissionList"
        )
      );
    }
  }, [dispatch, formData.Id]);


  const { currentState, userAccess, currentUser } = useSelector((state) => {
    return {
      currentState: state.separation,
      userAccess: state?.auth?.userAccess["separation"],
      currentUser: state.auth.user,
    };
  }, shallowEqual);

  const { dataForEdit } = currentState;


  const { allEmployees } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees
    }),
    shallowEqual
  )


  const allEmployeetatus = [
    { value: "1", label: "Active Employee" },
    { value: "2", label: "Resigned Employee" },
    { value: "3", label: "Separated Employee" },
  ];

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...formData, applicantCode: formData.applicantCode ? formData?.applicantCode : applicantCode }}
      validationSchema={getApplicantProfileEditSchema(formData)}
      onSubmit={async (values) => {
        enableLoading();

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
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right" autoComplete="off">
              <fieldset disabled={isdataForRead}>




                <div className="grid lg:grid-cols-4 gap-x-3 mt-1">
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

                  <div className="">
                    <SearchSelect
                      name="employeeId"
                      className={!values.employeeId ? 'form-control is-invalid' : 'form-control'}
                      placeholder=""
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value === 'Select' ? null : Number(e.value);
                        setFieldValue('employeeId', value);
                        // setemployeeId(value);
                        const selectedEmp = allEmployees.find(emp => emp.value === value);

                      }}
                      label={
                        <span>
                          Employee
                        </span>
                      }
                      value={
                        dashboard.allEmployeesWithNoPermissionList.find(
                          (option) =>
                            option.value === values.employeeId
                        ) || null
                      }
                      // value={values.employeeId}
                      autoComplete="off"

                      options={dashboard.allEmployeesWithNoPermissionList}
                      isSearchable={true} // Ensure search functionality is enabled
                    />
                  </div>

                </div>







                <hr></hr>
                {/* Personal Information */}


                <div >

                  <h6 className="font-bold mb-0 text-primary my-2">
                    Leaving Reasons
                  </h6>
                  <div className="grid lg:grid-cols-4 gap-x-3 ">



                  </div>
                  <div className="grid lg:grid-cols-4 gap-x-3 mt-1">
                    <div className="">
                      <SearchSelect
                        name="exitTypeId"
                        label={
                          <span>
                            Exit Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
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
                        isDisabled={isdataForRead}
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

                  </div>


                  <div className="mt-1">
                    <Field
                      name="exitRemark"
                      component={TextArea}
                      placeholder="Enter exit remarks"
                      label={<span>Exit remarks</span>}
                      className="form-control "  // Force full height
                      autoComplete="off"
                    />
                  </div>



                </div>

                <hr></hr>

                <div

                >

                  <h6 className="font-bold mb-0 text-primary">
                    Resignation & Notice Period Info
                  </h6>
                  <div className="grid lg:grid-cols-5 gap-x-3">


                    {/* <div className="">
                      <SearchSelect
                        label={
                          <span>
                            Accepted By
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        name="maritalStatus"
                        onChange={(e) => {
                          setFieldValue("maritalStatus", e?.value ?? null);
                        }}
                        value={
                          dashboard.allMaritalStatus?.find(
                            (option) =>
                              String(option.value) ===
                              String(values.maritalStatus)
                          ) || null
                        }
                        error={errors.maritalStatus}
                        touched={touched.maritalStatus}
                        options={dashboard.allMaritalStatus}
                      />
                    </div> */}

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
                        isDisabled={isdataForRead && true}
                        // onBlur={() => {
                        //   handleBlur({ target: { name: "countryId" } });
                        // }}
                        onChange={(e) => {
                          setFieldValue("acceptedEmployeeId", e.value || null);


                        }}
                        value={
                          dashboard?.allEmployeesWithNoPermissionList?.find(
                            (option) => option?.value == values?.exitTypeId
                          ) || null
                        }
                        error={errors.acceptedEmployeeId}
                        touched={touched.acceptedEmployeeId}
                        // options={dashboard.allEmployees.filter(x => x.value != values.Id)}
                        options={[
                          { value: null, label: "Select" }, // Adding "All" option with value empty string
                          // ...dashboard.allEmployeesWithNoPermissionList.filter(x => x.departmentId == values.departmentId && x.value != values.Id), // Spread the rest of the menu options

                          ...dashboard.allEmployeesWithNoPermissionList.filter(
                            (x) => {
                              if (values?.all_report_to) {
                                // If "All" is selected, do not filter by department and exclude current user
                                return x.value !== values.Id;
                              } else {
                                // If "All" is not selected, filter based on departmentId and exclude current user
                                return (
                                  x.departmentId === values.departmentId &&
                                  x.value !== values.Id
                                );
                              }
                            }
                          ),
                        ]}
                      />
                    </div>

                            <div className="">
                      <label>
                        Date of Resignation Acceptance <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        className="form-control"
                        placeholder="Date of Resignation Acceptance"
                        component={DatePickerField}
                        selected={
                          values?.resignationDate
                            ? new Date(values.resignationDate)
                            : null
                        }
                        onChange={(date) => {
                          let selectedDate = formatDates(date, "yyyy-MM-dd");
                          setFieldValue("resignationDate", selectedDate);
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="resignationDate"
                        autoComplete="off"
                        maxDate={new Date()}
                      />


                    </div>

                    <div className="">
                      <label>
                        Date of Resignation Acceptance <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        className="form-control"
                        placeholder="Date of Resignation Acceptance"
                        component={DatePickerField}
                        selected={
                          values?.resignationDate
                            ? new Date(values.resignationDate)
                            : null
                        }
                        onChange={(date) => {
                          let selectedDate = formatDates(date, "yyyy-MM-dd");
                          setFieldValue("resignationDate", selectedDate);
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="resignationDate"
                        autoComplete="off"
                        maxDate={new Date()}
                      />


                    </div>



                  </div>

                  <div className="mt-1">
                    <Field
                      name="applicantStatusReason"
                      component={TextArea}
                      placeholder="Enter applicant status reason"
                      label={<span>Remarks</span>}
                      className="form-control "  // Force full height
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid lg:grid-cols-5 gap-x-3">
                    <div className="">
                      <label>
                        Resignation Submission Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        className="form-control"
                        placeholder="Date Of Birth"
                        component={DatePickerField}
                        selected={
                          values?.dateOfBirth
                            ? new Date(values.dateOfBirth)
                            : null
                        }
                        onChange={(date) => {
                          let selectedDate = formatDates(date, "yyyy-MM-dd");
                          setFieldValue("dateOfBirth", selectedDate);
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="dateOfBirth"
                        autoComplete="off"
                        maxDate={new Date()}
                      />


                    </div>

                    <div className="">
                      <label>
                        Last Working date <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        className="form-control"
                        placeholder="Date Of Birth"
                        component={DatePickerField}
                        selected={
                          values?.dateOfBirth
                            ? new Date(values.dateOfBirth)
                            : null
                        }
                        onChange={(date) => {
                          let selectedDate = formatDates(date, "yyyy-MM-dd");
                          setFieldValue("dateOfBirth", selectedDate);
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="dateOfBirth"
                        autoComplete="off"
                        maxDate={new Date()}
                      />


                    </div>




                  </div>

                  <div className="grid lg:grid-cols-5 gap-x-3">

                    <div className="">
                      <Field
                        name="applicantCanJoin"
                        component={Input}
                        placeholder="Enter applicant can join in days"
                        label={
                          <span>
                            {" "}
                            Total Service Period
                            <span style={{ color: "red" }}>*</span>
                          </span>
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
                            Final Settlement Policy
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        name="maritalStatus"
                        onChange={(e) => {
                          setFieldValue("maritalStatus", e?.value ?? null);
                        }}
                        value={
                          dashboard.allMaritalStatus?.find(
                            (option) =>
                              String(option.value) ===
                              String(values.maritalStatus)
                          ) || null
                        }
                        error={errors.maritalStatus}
                        touched={touched.maritalStatus}
                        options={dashboard.allMaritalStatus}
                      />
                    </div>


                  </div>




                  <div className="grid lg:grid-cols-5 gap-x-3">

                    <div className="">
                      <Field
                        name="applicantCanJoin"
                        component={Input}
                        placeholder="Enter applicant can join in days"
                        label={
                          <span>
                            {" "}
                            Notice Period Days
                            <span style={{ color: "red" }}>*</span>
                          </span>
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
                        isDisabled={isdataForRead}
                        name="maritalStatus"
                        onChange={(e) => {
                          setFieldValue("maritalStatus", e?.value ?? null);
                        }}
                        value={
                          dashboard.allMaritalStatus?.find(
                            (option) =>
                              String(option.value) ===
                              String(values.maritalStatus)
                          ) || null
                        }
                        error={errors.maritalStatus}
                        touched={touched.maritalStatus}
                        options={dashboard.allMaritalStatus}
                      />
                    </div>


                  </div>
                  <div className="mt-1">
                    <Field
                      name="additional_summary"
                      component={TextArea}
                      placeholder="Enter Address"
                      className="form-control"  // Force full height
                      label={
                        <span>

                          Address<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />

                  </div>

                </div>

                {/* Applicant General Information*/}
                <hr></hr>

                <div className="mt-1" >
                  <Field
                    name="otherInformation"
                    component={TextArea}
                    placeholder="Enter other information"
                    label={<span> Other Information</span>}
                    className="form-control "  // Force full height
                    autoComplete="off"
                  />
                </div>

                <div className="grid lg:grid-cols-5 gap-x-3">

                  <div className="">
                    <Field
                      name="applicantCanJoin"
                      component={Input}
                      placeholder="Enter applicant can join in days"
                      label={
                        <span>
                          {" "}
                          Notice Period Days
                          <span style={{ color: "red" }}>*</span>
                        </span>
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
                          Mark as Blacklisted
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isdataForRead}
                      name="maritalStatus"
                      onChange={(e) => {
                        setFieldValue("maritalStatus", e?.value ?? null);
                      }}
                      value={
                        dashboard.allMaritalStatus?.find(
                          (option) =>
                            String(option.value) ===
                            String(values.maritalStatus)
                        ) || null
                      }
                      error={errors.maritalStatus}
                      touched={touched.maritalStatus}
                      options={dashboard.allMaritalStatus}
                    />
                  </div>


                </div>
                <div className="mt-1">
                  <Field
                    name="additional_summary"
                    component={TextArea}
                    placeholder="Enter Address"
                    className="form-control"  // Force full height
                    label={
                      <span>

                        Remarks<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    autoComplete="off"
                  />

                </div>


                <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-3 mt-2">
                  <div className="col-span-1">

                    <FileUpload
                      label={
                        <>
                          CV<span style={{ color: "red" }}>*</span>
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
                        setFieldValue("file", file);
                      }}


                    />
                    {errors.file && touched.file && (
                      <div className="invalid-feedback">{errors.file}</div>
                    )}


                    {/* </label> */}

                    {/* Show existing file if any */}
                    {formData.file && formData.file === formData.file && (
                      <div className="mt-2">
                        <strong>Existing File: </strong>
                        <a
                          href={getUploadUrl(formData.file)}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          {getFileName(formData.file)}
                        </a>
                      </div>
                    )}
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
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
