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
    formData?.profile_image || toAbsoluteUrl("/media/logos/defaultImg.png")
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
    }
  }, [dispatch, formData.Id]);



  const { currentState, userAccess, currentUser } = useSelector((state) => {
    return {
      currentState: state.applicant_profile,
      userAccess: state?.auth?.userAccess["applicant_profile"],
      currentUser: state.auth.user,
    };
  }, shallowEqual);

  const { dataForEdit } = currentState;
  const fetchData = async (setApplicantCode) => {

    if (!formData.Id) {

      dispatch(
        getLatestTableId(
          "r_applicant_profile",
          "applicantCode",
          "companyId =" + currentUser.companyId,
          setApplicantCode
        )
      );
    }
  };
  useEffect(() => {
    fetchData(setApplicantCode)
  }, [])

  const filteredCities = (countryId) => {
    return dashboard?.allCity?.filter((city) => city.code === countryId) || [];
  };

  const salaryPayTypeIdOptions = [
    { value: 0, label: "Per Month" },
    { value: 1, label: "Per Year" },
  ];

  const ratingOptions = [
    { label: "--Select--", value: "" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];


  const getSkillNamesFromIds = (skillIds) => {
    if (!Array.isArray(skillIds)) {
      if (typeof skillIds === 'string') {
        skillIds = skillIds.split(',').map((s) => s.trim());
      } else {
        return [];
      }
    }

    return skillIds
      .map((id) =>
        dashboard?.allJobSkillList?.find(
          (skill) => String(skill.value) === String(id)
        )
      )
      .filter(Boolean)
      .map((skill) => skill.label);
  };


  const printSkills = async (formData, vacancyArray, forDelete = null) => {
    const collected = [];
    console.log("printSkills called with vacancyArray:", vacancyArray.length);
    vacancyArray.forEach((item) => {
      const selectedVacancy = dashboard?.allJobVacancyList?.find(
        (x) => x.value === item.jobVacancyId
      );

      const skillIds = selectedVacancy?.preferredJobSkillsId || [];
      const skillNames = getSkillNamesFromIds(skillIds);

      skillNames.forEach((name) => {
        collected.push({
          skillName: name,
          jobVacancyId: selectedVacancy?.value,
        });
      });
    });

    // ✅ Filter out duplicate skill names
    const uniqueBySkill = [];
    const seen = new Set();

    collected.forEach((item) => {
      const key = item.skillName.toLowerCase();
      if (!seen.has(key)) {
        uniqueBySkill.push(item);
        seen.add(key);
      }
    });



    // ✅ Set for UI dropdown or tracking
    setAllSkillNames(uniqueBySkill.map((s) => s.skillName));

    // ✅ Remove existing skills related to the deleted jobVacancyId
    let cleanedFormData = { ...formData };
    if (forDelete) {
      cleanedFormData.details_applicant_skills = (formData.details_applicant_skills || []).filter(
        (skill) => skill.jobVacancyId !== forDelete
      );
    }

    // ✅ Add new skills
    return updateApplicantSkills(cleanedFormData, uniqueBySkill);
  };

  const selectedJobVacancy = (values) =>
    dashboard?.allJobVacancyList?.find((x) => x.value === values?.jobVacancyId);

  const onImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setFile(img);

      setImage(URL.createObjectURL(img));
    }
  };

  useEffect(() => {
    if (formData.Id && formData?.profile_image) {
      setImage(formData.profile_image);
    }
    else{
       setImage(toAbsoluteUrl("/media/logos/defaultImg.png")); // new case
        
    }
  }, [formData.Id,formData?.profile_image]);

  const deleteApplicantVacancyDetail = (Id) => {
    // server request for deleting customer by id
    enableLoading();

    if (Id) {
      dispatch(actions.deleteApplicantVacancyDetail(Id)).then(() => {
        disbaleLoading();
        onHide();
      });
    }
    disbaleLoading();

  };





  const updateApplicantSkills = (formData, skillWithJobList) => {
    const existingSkills = formData.details_applicant_skills || [];
    const existingSkillNames = existingSkills.map((s) => s.skill?.toLowerCase());

    const newSkills = skillWithJobList
      .filter(
        (item) =>
          item?.skillName &&
          !existingSkillNames.includes(item.skillName.toLowerCase())
      )
      .map((item) => ({
        Id: null,
        applicantId: formData.Id,
        skill: item.skillName || '',
        description: '',
        ratingScale: null,
        startDate: null,
        endDate: null,
        isActive: true,
        createdBy: null,
        updatedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        jobVacancyId: item.jobVacancyId,
      }));

    return {
      details_applicant_skills: [...existingSkills, ...newSkills],
    };
  };


  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...formData, applicantCode: formData.applicantCode ? formData?.applicantCode : applicantCode }}
      validationSchema={getApplicantProfileEditSchema(formData)}
      onSubmit={async (values) => {
        enableLoading();
        if (file) {
          let formData = new FormData();
          await formData.append("image", file);
          await axios
            .post(`${USERS_URL}/profile/image-upload`, formData)
            .then((res) => {
              setImage(res.data.imageUrl);
              saveForm(values, res.data.imageUrl);
            });
        } else {
          saveForm(values, values.profile_image || profile_image);
        }
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        handleChange,
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
                {/* Job */}
                <div
                  style={{
                    padding: "10px 0 40px 0px",
                    marginBottom: "15px",
                    marginTop: "15px",
                    borderRadius: "5px",
                    borderBottom: "2px solid rgb(194, 194, 194)",
                  }}
                >
                  <h6>Applicant Profile</h6>

                  {/* Code Name Image */}
                  <div className="form-group row col-12 col-md-12  p-0 m-0">
                    {/* Code Name  */}
                    <div className="form-group row col-12 col-md-10  p-0 m-0">
                      {/* Code  */}
                      <div className="form-group row col-12 col-md-12  p-0 m-0">
                        <div className="col-12 col-md-5 mt-3">
                          <label>
                            <span>
                              Applicant Code
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          </label>
                          <Field
                            name="applicantCode"
                            component={Input}
                            placeholder="Enter code"
                            disabled={true}
                            type="text"
                            minLength={6}
                            maxLength={6}
                          // error={ errors.applicantCode}
                          />
                        </div>

                        <div className="col-12 col-md-5 mt-3">
                          <SearchSelect
                            name="subsidiaryId"
                            isDisabled={isdataForRead}
                            label={
                              <span>
                                Subsidiary
                                <span style={{ color: "red" }}>*</span>
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

                      {/* Name  */}

                      <div className="form-group row col-12 col-md-12  p-0 m-0">
                        <div className="col-12 col-md-2 mt-3">
                          <Select
                            label={
                              <span>
                                {" "}
                                Title<span style={{ color: "red" }}>*</span>
                              </span>
                            }
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
                            label={
                              <span>
                                {" "}
                                First Name
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
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
                            label={
                              <span>
                                {" "}
                                Last Name<span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="col-12 col-md-2 ">
                      <div>
                        <div>
                          {/* <div>
                            <img
                              name="profile_image"
                              width={120}
                              height={120}
                              src={profile_image || formData?.profile_image}
                            />
                            <h4>Select Image </h4>
                            <input
                              type="file"
                              name="myImage"
                              accept=".jpg, .jpeg, .png"
                              onChange={onImageChange}
                            />
                            <ErrorMessage
                              className="form-feedBack"
                              name="myImage"
                              component="div"
                            />
                          </div> */}

                          <div className="text-center" style={{
                            height: "220px",          // Fixed height
                            width: "120px",          // Fixed height
                            overflow: "hidden",       // Prevent stretching
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            // justifyContent: "space-between",
                          }}>
                            <img
                              name="profile_image"
                              width={120}
                              height={120}
                              src={profile_image || formData?.profile_image}
                              alt="Profile"
                              // className="img-thumbnail"
                              style={{
                                objectFit: "cover",
                                borderRadius: "50%",
                                // flexShrink: 0,           // Prevent image from shrinking
                              }}
                            />

                            <h5 className="mt-2">Select Image</h5>

                            {/* Custom upload button */}
                            <label htmlFor="myImage" className="btn btn-sm btn-outline-primary mt-2">
                              Upload Image
                            </label>

                            {/* Hidden file input */}
                            <input
                              id="myImage"
                              type="file"
                              name="myImage"
                              accept=".jpg, .jpeg, .png"
                              onChange={onImageChange}
                              style={{ display: "none" }}
                            />

                            {/* File name truncation */}
                            {/* {selectedFileName && (
                              <div
                                style={{
                                  maxWidth: "100%",
                                  height: "100%",
                                  overflow: "hidden",
                                  // textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.8rem",
                                  marginTop: "5px",
                                }}
                                title={selectedFileName} // Tooltip on hover
                              >
                                {selectedFileName}
                              </div>
                            )} */}

                            {/* Formik error display */}
                            <ErrorMessage
                              className="form-feedBack text-danger"
                              name="myImage"
                              component="div"
                            />
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Job Vacancy */}

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
                            style={{
                              backgroundColor: "#4d5f7a",
                              color: "#fff",
                            }}
                          >
                            <th>Action</th>

                            <th className="col-3">Job Vacancy</th>
                            <th className="col-2">Application Date</th>
                            <th className="col-2">Application Status</th>
                            <th className="col-2"> Status Date</th>

                            <th className="col-2">Appointment Type</th>
                            <th className="col-1">Active Vacancy</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values?.details_applicant_vacancy &&
                            values?.details_applicant_vacancy?.length > 0 &&
                            values?.details_applicant_vacancy?.map(
                              (detail, index) => (
                                <tr key={index}>
                                  <td>
                                    <button
                                      disabled={
                                        isdataForRead ||
                                        selectedJobVacancy(
                                          values.details_applicant_vacancy[
                                          index
                                          ]
                                        )?.jobPostingStatus == 3
                                      }
                                      className="btn btn-danger btn-elevate"
                                      type="button"
                                      // onClick={async () => {
                                      //   deleteApplicantVacancyDetail(detail.Id)
                                      //   remove(index);

                                      //   const result = await printSkills(formData, values.details_applicant_vacancy, { delete: detail.Id });



                                      //   // ✅ Make sure result exists before setting
                                      //   if (result?.details_applicant_skills) {
                                      //     setFieldValue("details_applicant_skills", result.details_applicant_skills);
                                      //   }
                                      // }}

                                      onClick={async () => {
                                        deleteApplicantVacancyDetail(detail.Id);
                                        const updatedVacancies = values.details_applicant_vacancy.filter((_, i) => i !== index); // ❗️ manually filter

                                        remove(index); // update Formik

                                        const result = await printSkills(formData, updatedVacancies, detail.Id); // ❗️ directly pass updated

                                        if (result?.details_applicant_skills) {
                                          setFieldValue("details_applicant_skills", result.details_applicant_skills);
                                        }
                                      }}

                                    >
                                      Delete
                                    </button>
                                  </td>
                                  {/* job vacancy selection */}
                                  <td>
                                    <SearchSelect
                                      name={`details_applicant_vacancy[${index}].jobVacancyId`}
                                      className="form-control"
                                      style={{ width: "200px", zIndex: 9999 }}
                                      isDisabled={
                                        isdataForRead ||
                                        selectedJobVacancy(
                                          values.details_applicant_vacancy[
                                          index
                                          ]
                                        )?.jobPostingStatus == 3
                                      }
                                      value={
                                        dashboard?.allJobVacancyList?.find(
                                          (x) =>
                                            x.value ===
                                            values.details_applicant_vacancy[
                                              index
                                            ]?.jobVacancyId
                                        ) || null
                                      }
                                      // onChange={async (e) => {
                                      //   setFieldValue(
                                      //     `details_applicant_vacancy[${index}].jobVacancyId`,
                                      //     e?.value
                                      //   );
                                      //   const result = await printSkills(formData, values.details_applicant_vacancy);



                                      //   // ✅ Make sure result exists before setting
                                      //   if (result?.details_applicant_skills) {
                                      //     setFieldValue("details_applicant_skills", result.details_applicant_skills);
                                      //   }

                                      // }}

                                      onChange={async (e) => {
                                        // Step 1: Update the field
                                        setFieldValue(
                                          `details_applicant_vacancy[${index}].jobVacancyId`,
                                          e?.value
                                        );

                                        // Step 2: Manually construct updated array
                                        const updatedVacancyArray = values.details_applicant_vacancy.map((item, i) =>
                                          i === index ? { ...item, jobVacancyId: e?.value } : item
                                        );

                                        // Step 3: Call with updated array
                                        const result = await printSkills(formData, updatedVacancyArray);

                                        if (result?.details_applicant_skills) {
                                          setFieldValue("details_applicant_skills", result.details_applicant_skills);
                                        }
                                      }}

                                      options={
                                        dashboard?.allJobVacancyList
                                          ?.filter(
                                            (x) =>
                                              x?.jobPostingStatus === 1 && // ✅ Only include items where jobPostingStatus === 1
                                              (!values?.subsidiaryId ||
                                                x?.subsidiaryId ===
                                                values?.subsidiaryId) // ✅ Optional filter by subsidiaryId
                                          )
                                          .map((x) => ({
                                            label: x.label,
                                            value: x.value,
                                            disabled: values.details_applicant_vacancy.some(
                                              (el) =>
                                                el.jobVacancyId === x.value
                                            ),
                                          })) || []
                                      }
                                      getOptionLabel={(x) => x.label}
                                      getOptionValue={(x) => x.value}
                                      isOptionDisabled={(x) => x.disabled}
                                      placeholder="Select--"
                                    />

                                    {errors.details_applicant_vacancy?.[index]
                                      ?.jobVacancyId &&
                                      touched.details_applicant_vacancy?.[index]
                                        ?.jobVacancyId && (
                                        <div className="text-danger">
                                          {
                                            errors.details_applicant_vacancy[
                                              index
                                            ]?.jobVacancyId
                                          }
                                        </div>
                                      )}
                                  </td>

                                  <td>
                                    <DatePicker
                                      className="form-control"
                                      style={{ width: "130px" }}
                                      placeholderText="Select Date"
                                      selected={
                                        values?.details_applicant_vacancy?.[
                                          index
                                        ]?.applicationDate
                                          ? new Date(
                                            values.details_applicant_vacancy[
                                              index
                                            ].applicationDate
                                          )
                                          : null
                                      }
                                      onChange={(date) => {
                                        const selectedDate = formatDates(
                                          date,
                                          "yyyy-MM-dd"
                                        ); // or use date.toISOString().split('T')[0]
                                        setFieldValue(
                                          `details_applicant_vacancy[${index}].applicationDate`,
                                          selectedDate
                                        );
                                      }}
                                      dateFormat="dd-MMM-yyyy"
                                      name={`details_applicant_vacancy[${index}].applicationDate`}
                                      disabled={
                                        isdataForRead ||
                                        selectedJobVacancy(
                                          values.details_applicant_vacancy[
                                          index
                                          ]
                                        )?.jobPostingStatus == 3
                                      }
                                      maxDate={new Date()} // optional: restrict future dates
                                      showPopperArrow={false}
                                    />

                                    {errors.details_applicant_vacancy?.[index]
                                      ?.applicationDate &&
                                      touched.details_applicant_vacancy?.[index]
                                        ?.applicationDate && (
                                        <div className="text-danger">
                                          {
                                            errors.details_applicant_vacancy[
                                              index
                                            ].applicationDate
                                          }
                                        </div>
                                      )}
                                  </td>

                                  {/* applicant status */}

                                  <td>
                                    <SearchSelect
                                      name={`details_applicant_vacancy[${index}].applicationStatusId`}
                                      className="form-control"
                                      style={{ width: "130px" }}
                                      isDisabled={
                                        isdataForRead ||
                                        selectedJobVacancy(
                                          values.details_applicant_vacancy[
                                          index
                                          ]
                                        )?.jobPostingStatus == 3
                                      }
                                      value={
                                        dashboard?.allApplicationStatusList?.find(
                                          (x) =>
                                            x.value ===
                                            values.details_applicant_vacancy[
                                              index
                                            ]?.applicationStatusId
                                        ) || null
                                      }
                                      onChange={(e) => {
                                        setFieldValue(
                                          `details_applicant_vacancy[${index}].applicationStatusId`,
                                          e?.value
                                        );

                                        const selectedDate = formatDates(
                                          new Date(),
                                          "yyyy-MM-dd"
                                        );
                                        setFieldValue(
                                          `details_applicant_vacancy[${index}].statusDate`,
                                          selectedDate
                                        );
                                      }}
                                      options={
                                        dashboard?.allApplicationStatusList ||
                                        []
                                      }
                                      getOptionLabel={(x) => x.label} // optional: customize label rendering
                                      getOptionValue={(x) => x.value} // optional: customize value extraction
                                      placeholder="Select Status"
                                    />

                                    {errors.details_applicant_vacancy?.[index]
                                      ?.applicationStatusId &&
                                      touched.details_applicant_vacancy?.[index]
                                        ?.applicationStatusId && (
                                        <div className="text-danger">
                                          {
                                            errors.details_applicant_vacancy[
                                              index
                                            ].applicationStatusId
                                          }
                                        </div>
                                      )}
                                  </td>

                                  <td>
                                    <DatePicker
                                      className="form-control"
                                      style={{ width: "130px" }}
                                      placeholderText="Select Date"
                                      selected={
                                        values?.details_applicant_vacancy?.[
                                          index
                                        ]?.statusDate
                                          ? new Date(
                                            values.details_applicant_vacancy[
                                              index
                                            ].statusDate
                                          )
                                          : null
                                      }
                                      onChange={(date) => {
                                        const selectedDate = formatDates(
                                          date,
                                          "yyyy-MM-dd"
                                        ); // or use date.toISOString().split('T')[0]
                                        setFieldValue(
                                          `details_applicant_vacancy[${index}].statusDate`,
                                          selectedDate
                                        );
                                      }}
                                      dateFormat="dd-MMM-yyyy"
                                      name={`details_applicant_vacancy[${index}].statusDate`}
                                      autoComplete="off"
                                      disabled={isdataForRead || true}
                                      maxDate={new Date()} // optional: restrict future dates
                                      showPopperArrow={false}
                                    />

                                    {errors.details_applicant_vacancy?.[index]
                                      ?.statusDate &&
                                      touched.details_applicant_vacancy?.[index]
                                        ?.statusDate && (
                                        <div className="text-danger">
                                          {
                                            errors.details_applicant_vacancy[
                                              index
                                            ].statusDate
                                          }
                                        </div>
                                      )}
                                  </td>

                                  {/* allAppointmentTypeList */}
                                  <td>
                                    <SearchSelect
                                      name={`details_applicant_vacancy[${index}].appointmentTypeId`}
                                      className="form-control"
                                      style={{ width: "130px" }}
                                      isDisabled={
                                        isdataForRead ||
                                        selectedJobVacancy(
                                          values.details_applicant_vacancy[
                                          index
                                          ]
                                        )?.jobPostingStatus == 3
                                      }
                                      value={
                                        dashboard?.allAppointmentTypeList?.find(
                                          (x) =>
                                            x.value ===
                                            values.details_applicant_vacancy[
                                              index
                                            ]?.appointmentTypeId
                                        ) || null
                                      }
                                      onChange={(e) => {
                                        setFieldValue(
                                          `details_applicant_vacancy[${index}].appointmentTypeId`,
                                          e?.value
                                        );
                                      }}
                                      options={
                                        dashboard?.allAppointmentTypeList || []
                                      }
                                      getOptionLabel={(x) => x.label} // optional: customize label rendering
                                      getOptionValue={(x) => x.value} // optional: customize value extraction
                                      placeholder="Select Status"
                                    />

                                    {errors.details_applicant_vacancy?.[index]
                                      ?.appointmentTypeId &&
                                      touched.details_applicant_vacancy?.[index]
                                        ?.appointmentTypeId && (
                                        <div className="text-danger">
                                          {
                                            errors.details_applicant_vacancy[
                                              index
                                            ].appointmentTypeId
                                          }
                                        </div>
                                      )}
                                  </td>

                                  <td>
                                    <input
                                      name={`details_applicant_vacancy[${index}].activeCV`}
                                      type="checkbox"
                                      disabled={
                                        isdataForRead ||
                                        selectedJobVacancy(
                                          values.details_applicant_vacancy[
                                          index
                                          ]
                                        )?.jobPostingStatus == 3
                                      }
                                      checked={
                                        values.details_applicant_vacancy?.[
                                          index
                                        ]?.activeCV
                                      }
                                      onChange={(e) => {
                                        setFieldValue(
                                          `details_applicant_vacancy[${index}].activeCV`,
                                          e.target.checked
                                        );

                                        if (e.target.checked) {
                                          setFieldValue(
                                            `details_applicant_vacancy[${index}].applicationStatusId`,
                                            values.applicantStatusId
                                          );
                                        }
                                      }}
                                    />
                                    {errors.details_applicant_vacancy?.[index]
                                      ?.activeCV &&
                                      touched.details_applicant_vacancy?.[index]
                                        ?.activeCV && (
                                        <div className="text-danger">
                                          {
                                            errors.details_applicant_vacancy[
                                              index
                                            ].activeCV
                                          }
                                        </div>
                                      )}
                                  </td>
                                </tr>
                              )
                            )}
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
                {typeof errors.details_applicant_vacancy === "string" && (
                  <div className="text-danger">
                    {errors.details_applicant_vacancy}
                  </div>
                )}

                {/* Applicant Status Information */}

                <div
                  style={{
                    padding: "10px 0 40px 0px",
                    marginBottom: "15px",
                    borderRadius: "5px",
                    marginTop: "15px",
                    borderBottom: "2px solid rgb(194, 194, 194)",
                  }}
                >
                  <h6>Applicant Status Information</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="applicantStatusId"
                        label={
                          <span>
                            Applicant Status
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="form-control"
                        style={{ width: "130px" }}
                        isDisabled={isdataForRead}
                        value={
                          dashboard?.allApplicationStatusList?.find(
                            (x) => x.value === values.applicantStatusId
                          ) || null
                        }
                        onChange={(e) => {
                          const selectedValue = e?.value;
                          setFieldValue("applicantStatusId", selectedValue);
                          const selectedDate = formatDates(
                            new Date(),
                            "yyyy-MM-dd"
                          );
                          // Update applicationStatusId for all rows where activeCV is true
                          const updatedList = values.details_applicant_vacancy.map(
                            (item, idx) => {
                              if (item.activeCV) {
                                return {
                                  ...item,
                                  applicationStatusId: selectedValue,
                                  statusDate: selectedDate,
                                };
                              }
                              return item;
                            }
                          );

                          setFieldValue(
                            "details_applicant_vacancy",
                            updatedList
                          );
                        }}
                        options={dashboard?.allApplicationStatusList || []}
                        getOptionLabel={(x) => x.label} // optional: customize label rendering
                        getOptionValue={(x) => x.value} // optional: customize value extraction
                        placeholder="Select Status"
                      />

                      {errors.applicantStatusId &&
                        touched.applicantStatusId && (
                          <div className="text-danger">
                            {errors.applicantStatusId}
                          </div>
                        )}
                    </div>

                    <div className="col-12 col-md-12 mt-3" style={{ height: '150px' }}>
                      <Field
                        name="applicantStatusReason"
                        component={TextArea}
                        placeholder="Enter applicant status reason"
                        label={<span>Applicant Status Reason</span>}
                        className="form-control h-100"  // Force full height
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Information */}

                <div
                  style={{
                    padding: "10px 0 40px 0px",
                    marginBottom: "15px",
                    borderRadius: "5px",
                    marginTop: "15px",
                    borderBottom: "2px solid rgb(194, 194, 194)",
                  }}
                >
                  <h6>Personal Information</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">
                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        {" "}
                        Date Of Birth <span style={{ color: "red" }}>*</span>
                      </label>
                      <DatePicker
                        className="form-control"
                        placeholder="Date Of Birth"
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

                      {touched.dateOfBirth && errors.dateOfBirth && (
                        <div className="invalid-feedback d-block">
                          {errors.dateOfBirth}
                        </div>
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
                        label={
                          <span>
                            {" "}
                            Id Card No<span style={{ color: "red" }}>*</span>
                          </span>
                        }
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
                        onBlur={(e) => {
                          const value = e.target.value.trim();
                          setFieldValue(
                            "passportNo",
                            value == "" ? null : value
                          );
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        label={
                          <span>
                            Marital Status
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

                    <div className="col-12 col-md-4 mt-3">
                      <Select
                        label={
                          <span>
                            {" "}
                            Gender<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        name="gender"
                        value={values.gender}
                        // onChange={handleChange}

                        style={{ display: "block" }}
                        autoComplete="off"
                        onChange={(e) => {
                          setFieldValue("gender", e.target.value);
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
                        label={
                          <span>
                            {" "}
                            Religion<span style={{ color: "red" }}>*</span>
                          </span>
                        }
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

                    {/* <div className="col-12 col-md-4 mt-3">
                      <Select
                        label={<span> Nationality</span>}
                        name="nationality"
                        value={values.nationality}
                        onChange={handleChange}
                        style={{ display: "block" }}
                      >
                        <option value="" label="Select Nationality" />
                        <option value="Pakistani" label="Pakistani" />
                        <option value="Other" label="Other" />
                      </Select>
                      {errors.nationality && touched.nationality && (
                        <div className="invalid-text">{errors.nationality}</div>
                      )}
                    </div> */}

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="nationality"
                        label={
                          <span>
                            {" "}
                            Nationality<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue(
                            "nationality",
                            e.value || null
                          );
                        }}
                        value={
                          dashboard.allNationalities?.find(
                            (option) =>
                              option.value === values.nationality
                          ) || null
                        }
                        error={errors.nationality}
                        touched={touched.nationality}
                        options={dashboard.allNationalities}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          S/O, D/O, W/O <span style={{ color: "red" }}>*</span>
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

                <div
                  style={{
                    padding: "10px 0 40px 0px",
                    marginBottom: "15px",
                    borderRadius: "5px",
                    marginTop: "15px",
                    borderBottom: "2px solid rgb(194, 194, 194)",
                  }}
                >
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

                    <div className="col-12 col-md-12 mt-3 mb-5"style={{ height: '150px' }}>
                      <Field
                        name="additional_summary"
                        component={TextArea}
                        placeholder="Enter Address"
                        className="form-control h-100"  // Force full height
                        label={
                          <span>
                            {" "}
                            Address<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        autoComplete="off"
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-5">
                      <Field
                        name="phone_official"
                        component={Input}
                        maxLength="15"
                        placeholder="03151110002"
                        label="Phone (Offical) "
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-5">
                      <Field
                        name="phone_cell"
                        component={Input}
                        maxLength="15"
                        placeholder="03151110002"
                        label="Cell No."
                        autoComplete="off"
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-5">
                      <label>
                        Personal Email<span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="email_personal"
                        component={Input}
                        placeholder="example@gmail.com"
                        // label="Personal Email"
                        autoComplete="off"
                        maxLength="30"
                      />
                    </div>
                  </div>
                </div>

                {/* Applicant General Information*/}

                <div
                  style={{
                    padding: "10px 0 40px 0px",
                    marginBottom: "15px",
                    borderRadius: "5px",
                    marginTop: "15px",
                    borderBottom: "2px solid rgb(194, 194, 194)",
                  }}
                >
                  <h6>Applicant General Information</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">
                    <div className="form-group row col-12 col-md-12  p-0 m-0">
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="applicantCanJoin"
                          component={Input}
                          placeholder="Enter applicant can join in days"
                          label={
                            <span>
                              {" "}
                              Applicant can join (Days)
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

                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="currentDesignation"
                          component={Input}
                          placeholder="Enter current designation"
                          label={
                            <span>
                              {" "}
                              Current Designation
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="lastDawnSalary"
                        component={Input}
                        placeholder="Enter last drawn salary"
                        label={
                          <span>
                            {" "}
                            Last Drawn Salary
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        autoComplete="off"
                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimit(e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="lastDawnSalaryCurrencyId"
                        label={
                          <span>
                            {" "}
                            Currency<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue(
                            "lastDawnSalaryCurrencyId",
                            e.value || null
                          );
                        }}
                        value={
                          dashboard.allCurrencyCodeList?.find(
                            (option) =>
                              option.value === values.lastDawnSalaryCurrencyId
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
                            Per Month / Per Year
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={
                          salaryPayTypeIdOptions.find(
                            (option) =>
                              option.value === values.lastDawnSalaryPayTypeId
                          ) || null
                        }
                        onChange={(e) => {
                          setFieldValue(
                            "lastDawnSalaryPayTypeId",
                            e?.value !== undefined ? e.value : null
                          );
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
                        label={
                          <span>
                            {" "}
                            Expected Salary Range(From)
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        autoComplete="off"
                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimit(e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="expectedSalaryRangeTo"
                        component={Input}
                        placeholder="Enter expected salary range(to)"
                        label={
                          <span>
                            {" "}
                            Expected Salary Range(To)
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        autoComplete="off"
                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimit(e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-2 mt-3">
                      <SearchSelect
                        name="expectedSalaryCurrencyId"
                        label={
                          <span>
                            {" "}
                            Currency<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue(
                            "expectedSalaryCurrencyId",
                            e.value || null
                          );
                        }}
                        value={
                          dashboard.allCurrencyCodeList?.find(
                            (option) =>
                              option.value === values.expectedSalaryCurrencyId
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
                        label={
                          <span>
                            {" "}
                            Per Month / Per Year
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isdataForRead}
                        value={
                          salaryPayTypeIdOptions.find(
                            (option) =>
                              option.value === values.expectedSalaryPayTypeId
                          ) || null
                        }
                        onChange={(e) => {
                          setFieldValue(
                            "expectedSalaryPayTypeId",
                            e?.value !== undefined ? e.value : null
                          );
                        }}
                        error={errors.expectedSalaryPayTypeId}
                        touched={touched.expectedSalaryPayTypeId}
                        options={salaryPayTypeIdOptions}
                      />
                    </div>

                    <div className="col-12 col-md-12 mt-3" style={{ height: '150px' }}>
                      <Field
                        name="otherInformation"
                        component={TextArea}
                        placeholder="Enter other information"
                        label={<span> Other Information</span>}
                        className="form-control h-100"  // Force full height
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-12 mt-3 d-flex flex-column ">
                  <label
                    style={{
                      "margin-right": "0.5rem",
                    }}
                  >
                    {" "}
                    Attachment: <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    name="file"
                    type="file"
                    accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                    ref={inputFile}
                    onChange={(event) => {
                      // Update Formik's value
                      const file = event.currentTarget.files[0];
                      setFieldValue("file", file);
                    }}
                  />
                  {errors.file && touched.file && (
                    <div className="text-danger mt-1">{errors.file}</div>
                  )}

                  <div>
                    <br />
                    {formData?.file && (
                      <>
                        <label>
                          <strong>Existing File:</strong>
                        </label>
                        {
                          <a href={getUploadUrl(formData.file)} target="_blank">
                            <span>{getFileName(formData.file)}</span>
                          </a>
                        }
                      </>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    padding: "10px 0 40px 0px",
                    marginBottom: "15px",
                    borderRadius: "5px",
                    marginTop: "15px",
                    borderBottom: "2px solid rgb(194, 194, 194)",
                  }}
                >
                  <h6>User Credentials</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">
                    <div className="col-12 col-md-6 mt-3">
                      <label>
                        Email <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        disabled={isdataForRead}
                        name="email"
                        component={Input}
                        placeholder="example@gmail.com"
                        maxLength="30"
                        autoComplete="off" // Add this to prevent autofill
                      />
                    </div>

                    <div className="col-12 col-md-6 mt-3">
                      <label>
                        New Password{" "}
                        {!formData.Id && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                      </label>
                      <Field
                        name="password"
                        component={Input} // Custom component
                        // disabled={id}
                        placeholder="New password"
                        type="password"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Details Work Experience */}

              <FieldArray name="details_applicant_work_experience">
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
                    <h3>Work Experience</h3>
                    <table className="table table-head-custom table-vertical-center  table-hover">
                      <thead>
                        <tr
                          style={{ backgroundColor: "#4d5f7a", color: "#fff" }}
                        >
                          <th>Action</th>

                          <td className="col-2">Company</td>
                          <td className="col-2"> Position Held</td>
                          <td className="col-2">Country</td>
                          <td className="col-2">City</td>
                          <td className="col-2">Start Date</td>
                          <td className="col-2">End Date</td>
                        </tr>
                      </thead>
                      <tbody>
                        {values?.details_applicant_work_experience &&
                          values?.details_applicant_work_experience?.length >
                          0 &&
                          values?.details_applicant_work_experience?.map(
                            (detail, index) => (
                              <tr key={index}>
                                <td>
                                  <button
                                    disabled={isdataForRead}
                                    className="btn btn-danger btn-elevate"
                                    type="button"
                                    onClick={() => {
                                      remove(index);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                                {/* job vacancy selection */}
                                <td>
                                  <Field
                                    name={`details_applicant_work_experience[${index}].companyName`}
                                    component={Input}
                                    disabled={isdataForRead}
                                    placeholder="Enter company"
                                    autoComplete="off"
                                  />

                                  {errors.details_applicant_work_experience?.[
                                    index
                                  ]?.companyName &&
                                    touched.details_applicant_work_experience?.[
                                      index
                                    ]?.companyName && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_work_experience[
                                            index
                                          ]?.companyName
                                        }
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

                                  {errors.details_applicant_work_experience?.[
                                    index
                                  ]?.positionHeld &&
                                    touched.details_applicant_work_experience?.[
                                      index
                                    ]?.positionHeld && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_work_experience[
                                            index
                                          ].positionHeld
                                        }
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
                                      setFieldValue(
                                        `details_applicant_work_experience[${index}].countryId`,
                                        selectedCountryId
                                      );
                                      setFieldValue(
                                        `details_applicant_work_experience[${index}].cityId`,
                                        null
                                      ); // Reset city on country change
                                    }}
                                    value={
                                      dashboard?.allCountry?.find(
                                        (x) =>
                                          x.value ===
                                          values
                                            .details_applicant_work_experience[
                                            index
                                          ]?.countryId
                                      ) || null
                                    }
                                    options={dashboard?.allCountry || []}
                                    getOptionLabel={(x) => x.label} // optional: customize label rendering
                                    getOptionValue={(x) => x.value} // optional: customize value extraction
                                    placeholder="Select Status"
                                  />
                                  {errors.details_applicant_work_experience?.[
                                    index
                                  ]?.countryId &&
                                    touched.details_applicant_work_experience?.[
                                      index
                                    ]?.countryId && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_work_experience[
                                            index
                                          ].countryId
                                        }
                                      </div>
                                    )}
                                </td>

                                {/* city  */}
                                <td>
                                  <SearchSelect
                                    name={`details_applicant_work_experience[${index}].cityId`}
                                    isDisabled={
                                      isdataForRead ||
                                      !values.details_applicant_work_experience[
                                        index
                                      ]?.countryId
                                    }
                                    onChange={(e) => {
                                      setFieldValue(
                                        `details_applicant_work_experience[${index}].cityId`,
                                        e.value || null
                                      );
                                    }}
                                    value={
                                      filteredCities(
                                        values
                                          .details_applicant_work_experience[
                                          index
                                        ]?.countryId
                                      ).find(
                                        (option) =>
                                          option.value ===
                                          values
                                            .details_applicant_work_experience[
                                            index
                                          ]?.cityId
                                      ) || null
                                    }
                                    options={filteredCities(
                                      values.details_applicant_work_experience[
                                        index
                                      ]?.countryId
                                    )}
                                  />

                                  {errors.details_applicant_work_experience?.[
                                    index
                                  ]?.cityId &&
                                    touched.details_applicant_work_experience?.[
                                      index
                                    ]?.cityId && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_work_experience[
                                            index
                                          ].cityId
                                        }
                                      </div>
                                    )}
                                </td>

                                {/* start date  */}
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    style={{ width: "130px" }}
                                    placeholderText="Select Date"
                                    selected={
                                      values
                                        ?.details_applicant_work_experience?.[
                                        index
                                      ]?.startDate
                                        ? new Date(
                                          values.details_applicant_work_experience[
                                            index
                                          ].startDate
                                        )
                                        : null
                                    }
                                    onChange={(date) => {
                                      const selectedDate = formatDates(
                                        date,
                                        "yyyy-MM-dd"
                                      ); // or use date.toISOString().split('T')[0]
                                      setFieldValue(
                                        `details_applicant_work_experience[${index}].startDate`,
                                        selectedDate
                                      );
                                    }}
                                    dateFormat="dd-MMM-yyyy"
                                    name={`details_applicant_work_experience[${index}].startDate`}
                                    autoComplete="off"
                                    disabled={isdataForRead}
                                    minDate={
                                      values?.dateOfBirth
                                        ? new Date(values.dateOfBirth)
                                        : null
                                    }
                                    maxDate={new Date()} // optional: restrict future dates
                                    showPopperArrow={false}
                                  />

                                  {errors.details_applicant_work_experience?.[
                                    index
                                  ]?.startDate &&
                                    touched.details_applicant_work_experience?.[
                                      index
                                    ]?.startDate && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_work_experience[
                                            index
                                          ].startDate
                                        }
                                      </div>
                                    )}
                                </td>

                                {/* end date  */}
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    style={{ width: "130px" }}
                                    placeholderText="Select Date"
                                    selected={
                                      values
                                        ?.details_applicant_work_experience?.[
                                        index
                                      ]?.endDate
                                        ? new Date(
                                          values.details_applicant_work_experience[
                                            index
                                          ].endDate
                                        )
                                        : null
                                    }
                                    onChange={(date) => {
                                      const selectedDate = formatDates(
                                        date,
                                        "yyyy-MM-dd"
                                      ); // or use date.toISOString().split('T')[0]
                                      setFieldValue(
                                        `details_applicant_work_experience[${index}].endDate`,
                                        selectedDate
                                      );
                                    }}
                                    dateFormat="dd-MMM-yyyy"
                                    name={`details_applicant_work_experience[${index}].endDate`}
                                    autoComplete="off"
                                    disabled={isdataForRead}
                                    minDate={
                                      values?.dateOfBirth
                                        ? new Date(values.dateOfBirth)
                                        : null
                                    }
                                    maxDate={new Date()} // optional: restrict future dates
                                    showPopperArrow={false}
                                  />

                                  {errors.details_applicant_work_experience?.[
                                    index
                                  ]?.endDate &&
                                    touched.details_applicant_work_experience?.[
                                      index
                                    ]?.endDate && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_work_experience[
                                            index
                                          ].endDate
                                        }
                                      </div>
                                    )}
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>

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
                        + Add Detail
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>

              {typeof errors.details_applicant_work_experience === "string" && (
                <div className="text-danger">
                  {errors.details_applicant_work_experience}
                </div>
              )}

              {/* Details Academic Info */}

              <FieldArray name="details_applicant_academic_info">
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
                    <h3>Academic Info</h3>
                    <table className="table table-head-custom table-vertical-center  table-hover">
                      <thead>
                        <tr
                          style={{ backgroundColor: "#4d5f7a", color: "#fff" }}
                        >
                          <th>Action</th>

                          <td className="col-2">Institution</td>
                          <td className="col-2">Degree</td>
                          <td className="col-2">Country</td>
                          <td className="col-2">City</td>
                          <td className="">CGPA</td>
                          <td className="col-2">Start Date</td>
                          <td className="col-2">End Date</td>
                        </tr>
                      </thead>
                      <tbody>
                        {values?.details_applicant_academic_info &&
                          values?.details_applicant_academic_info?.length > 0 &&
                          values?.details_applicant_academic_info?.map(
                            (detail, index) => (
                              <tr key={index}>
                                <td>
                                  <button
                                    disabled={isdataForRead}
                                    className="btn btn-danger btn-elevate"
                                    type="button"
                                    onClick={() => {
                                      remove(index);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                                {/* job vacancy selection */}

                                {/* institution */}

                                <td>
                                  <SearchSelect
                                    name={`details_applicant_academic_info[${index}].institutionId`}
                                    className="form-control"
                                    style={{ width: "130px" }}
                                    isDisabled={isdataForRead}
                                    value={
                                      dashboard?.allInstitution?.find(
                                        (x) =>
                                          x.value ===
                                          values
                                            .details_applicant_academic_info[
                                            index
                                          ]?.institutionId
                                      ) || null
                                    }
                                    onChange={(e) => {
                                      setFieldValue(
                                        `details_applicant_academic_info[${index}].institutionId`,
                                        e?.value
                                      );
                                    }}
                                    options={dashboard.allInstitution || []}
                                    getOptionLabel={(x) => x.label} // optional: customize label rendering
                                    getOptionValue={(x) => x.value} // optional: customize value extraction
                                    placeholder="Select Status"
                                  />

                                  {errors.details_applicant_academic_info?.[
                                    index
                                  ]?.institutionId &&
                                    touched.details_applicant_academic_info?.[
                                      index
                                    ]?.institutionId && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_academic_info[
                                            index
                                          ].institutionId
                                        }
                                      </div>
                                    )}
                                </td>

                                {/* degree */}

                                <td>
                                  <SearchSelect
                                    name={`details_applicant_academic_info[${index}].degreeId`}
                                    className="form-control"
                                    style={{ width: "130px" }}
                                    isDisabled={isdataForRead}
                                    value={
                                      dashboard?.allDegreeTitle?.find(
                                        (x) =>
                                          x.value ===
                                          values
                                            .details_applicant_academic_info[
                                            index
                                          ]?.degreeId
                                      ) || null
                                    }
                                    onChange={(e) => {
                                      setFieldValue(
                                        `details_applicant_academic_info[${index}].degreeId`,
                                        e?.value
                                      );
                                    }}
                                    options={dashboard?.allDegreeTitle || []}
                                    getOptionLabel={(x) => x.label} // optional: customize label rendering
                                    getOptionValue={(x) => x.value} // optional: customize value extraction
                                    placeholder="Select Status"
                                  />

                                  {errors.details_applicant_academic_info?.[
                                    index
                                  ]?.degreeId &&
                                    touched.details_applicant_academic_info?.[
                                      index
                                    ]?.degreeId && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_academic_info[
                                            index
                                          ].degreeId
                                        }
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
                                      setFieldValue(
                                        `details_applicant_academic_info[${index}].countryId`,
                                        selectedCountryId
                                      );
                                      setFieldValue(
                                        `details_applicant_academic_info[${index}].cityId`,
                                        null
                                      ); // Reset city on country change
                                    }}
                                    value={
                                      dashboard?.allCountry?.find(
                                        (x) =>
                                          x.value ===
                                          values
                                            .details_applicant_academic_info[
                                            index
                                          ]?.countryId
                                      ) || null
                                    }
                                    options={dashboard?.allCountry || []}
                                    getOptionLabel={(x) => x.label} // optional: customize label rendering
                                    getOptionValue={(x) => x.value} // optional: customize value extraction
                                    placeholder="Select Status"
                                  />
                                  {errors.details_applicant_academic_info?.[
                                    index
                                  ]?.countryId &&
                                    touched.details_applicant_academic_info?.[
                                      index
                                    ]?.countryId && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_academic_info[
                                            index
                                          ].countryId
                                        }
                                      </div>
                                    )}
                                </td>

                                {/* city  */}
                                <td>
                                  <SearchSelect
                                    name={`details_applicant_academic_info[${index}].cityId`}
                                    isDisabled={
                                      isdataForRead ||
                                      !values.details_applicant_academic_info[
                                        index
                                      ]?.countryId
                                    }
                                    onChange={(e) => {
                                      setFieldValue(
                                        `details_applicant_academic_info[${index}].cityId`,
                                        e.value || null
                                      );
                                    }}
                                    value={
                                      filteredCities(
                                        values.details_applicant_academic_info[
                                          index
                                        ]?.countryId
                                      ).find(
                                        (option) =>
                                          option.value ===
                                          values
                                            .details_applicant_academic_info[
                                            index
                                          ]?.cityId
                                      ) || null
                                    }
                                    options={filteredCities(
                                      values.details_applicant_academic_info[
                                        index
                                      ]?.countryId
                                    )}
                                  />

                                  {errors.details_applicant_academic_info?.[
                                    index
                                  ]?.cityId &&
                                    touched.details_applicant_academic_info?.[
                                      index
                                    ]?.cityId && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_academic_info[
                                            index
                                          ].cityId
                                        }
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

                                  {errors.details_applicant_academic_info?.[
                                    index
                                  ]?.gpa &&
                                    touched.details_applicant_academic_info?.[
                                      index
                                    ]?.gpa && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_academic_info[
                                            index
                                          ]?.gpa
                                        }
                                      </div>
                                    )}
                                </td>

                                {/* start date  */}
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    style={{ width: "130px" }}
                                    placeholderText="Select Date"
                                    selected={
                                      values?.details_applicant_academic_info?.[
                                        index
                                      ]?.startDate
                                        ? new Date(
                                          values.details_applicant_academic_info[
                                            index
                                          ].startDate
                                        )
                                        : null
                                    }
                                    onChange={(date) => {
                                      const selectedDate = formatDates(
                                        date,
                                        "yyyy-MM-dd"
                                      ); // or use date.toISOString().split('T')[0]
                                      setFieldValue(
                                        `details_applicant_academic_info[${index}].startDate`,
                                        selectedDate
                                      );
                                    }}
                                    dateFormat="dd-MMM-yyyy"
                                    name={`details_applicant_academic_info[${index}].startDate`}
                                    autoComplete="off"
                                    disabled={isdataForRead}
                                    minDate={
                                      values?.dateOfBirth
                                        ? new Date(values.dateOfBirth)
                                        : null
                                    }
                                    maxDate={new Date()} // optional: restrict future dates
                                    showPopperArrow={false}
                                  />

                                  {errors.details_applicant_academic_info?.[
                                    index
                                  ]?.startDate &&
                                    touched.details_applicant_academic_info?.[
                                      index
                                    ]?.startDate && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_academic_info[
                                            index
                                          ].startDate
                                        }
                                      </div>
                                    )}
                                </td>

                                {/* end date  */}
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    style={{ width: "130px" }}
                                    placeholderText="Select Date"
                                    selected={
                                      values?.details_applicant_academic_info?.[
                                        index
                                      ]?.endDate
                                        ? new Date(
                                          values.details_applicant_academic_info[
                                            index
                                          ].endDate
                                        )
                                        : null
                                    }
                                    onChange={(date) => {
                                      const selectedDate = formatDates(
                                        date,
                                        "yyyy-MM-dd"
                                      ); // or use date.toISOString().split('T')[0]

                                      setFieldValue(
                                        `details_applicant_academic_info[${index}].endDate`,
                                        selectedDate
                                      );
                                    }}
                                    dateFormat="dd-MMM-yyyy"
                                    name={`details_applicant_academic_info[${index}].endDate`}
                                    autoComplete="off"
                                    disabled={isdataForRead}
                                    minDate={
                                      values?.dateOfBirth
                                        ? new Date(values.dateOfBirth)
                                        : null
                                    }
                                    maxDate={new Date()} // optional: restrict future dates
                                    showPopperArrow={false}
                                  />

                                  {errors.details_applicant_academic_info?.[
                                    index
                                  ]?.endDate &&
                                    touched.details_applicant_academic_info?.[
                                      index
                                    ]?.endDate && (
                                      <div className="text-danger">
                                        {
                                          errors
                                            .details_applicant_academic_info[
                                            index
                                          ].endDate
                                        }
                                      </div>
                                    )}
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>

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
                        + Add Detail
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>

              {typeof errors.details_applicant_academic_info === "string" && (
                <div className="text-danger">
                  {errors.details_applicant_academic_info}
                </div>
              )}
              {/* Details Skills  */}

              <FieldArray name="details_applicant_skills">
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
                    <h3>Skills</h3>
                    <table className="table table-head-custom table-vertical-center  table-hover">
                      <thead>
                        <tr
                          style={{ backgroundColor: "#4d5f7a", color: "#fff" }}
                        >
                          <th>Action</th>

                          <td className="col-2"> Skill</td>
                          <td className="col-3">Description</td>

                          <td className="col-2">Rating</td>
                          <td className="col-2">Start Date</td>
                          <td className="col-2">End Date</td>
                        </tr>
                      </thead>
                      <tbody>
                        {values?.details_applicant_skills &&
                          values?.details_applicant_skills?.length > 0 &&
                          values?.details_applicant_skills?.map(
                            (detail, index) => (
                              <tr key={index}>
                                <td>
                                  <button
                                    disabled={isdataForRead || !!values.details_applicant_skills?.[index]?.jobVacancyId}
                                    className="btn btn-danger btn-elevate"
                                    type="button"
                                    onClick={() => {
                                      remove(index);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>

                                {/* skill */}

                                <td>
                                  <Field
                                    name={`details_applicant_skills[${index}].skill`}
                                    component={Input}
                                    disabled={isdataForRead || !!values.details_applicant_skills?.[index]?.jobVacancyId}
                                    placeholder="Enter skill"
                                    autoComplete="off"
                                  />

                                  {errors.details_applicant_skills?.[index]
                                    ?.skill &&
                                    touched.details_applicant_skills?.[index]
                                      ?.skill && (
                                      <div className="text-danger">
                                        {
                                          errors.details_applicant_skills[index]
                                            ?.skill
                                        }
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
                                    onChange={(e) => {
                                      setFieldValue(`details_applicant_skills[${index}].jobVacancyId`, values.details_applicant_skills?.[index]?.jobVacancyId)
                                      setFieldValue(`details_applicant_skills[${index}].description`, e.target.value)
                                    }}
                                  />

                                  {errors.details_applicant_skills?.[index]
                                    ?.description &&
                                    touched.details_applicant_skills?.[index]
                                      ?.description && (
                                      <div className="text-danger">
                                        {
                                          errors.details_applicant_skills[index]
                                            ?.description
                                        }
                                      </div>
                                    )}
                                </td>

                                {/* rating */}
                                <td>
                                  <SearchSelect
                                    name={`details_applicant_skills[${index}].ratingScale`}
                                    className="form-control"
                                    style={{ width: "130px" }}
                                    isDisabled={isdataForRead}
                                    value={
                                      ratingOptions?.find(
                                        (x) =>
                                          x.value ==
                                          values.details_applicant_skills[index]
                                            ?.ratingScale
                                      ) || null
                                    }
                                    onChange={(e) => {
                                      setFieldValue(
                                        `details_applicant_skills[${index}].ratingScale`,
                                        e?.value
                                      );
                                    }}
                                    options={ratingOptions || []}
                                    getOptionLabel={(x) => x.label} // optional: customize label rendering
                                    getOptionValue={(x) => x.value} // optional: customize value extraction
                                    placeholder="Select Status"
                                  />

                                  {errors.details_applicant_skills?.[index]
                                    ?.ratingScale &&
                                    touched.details_applicant_skills?.[index]
                                      ?.ratingScale && (
                                      <div className="text-danger">
                                        {
                                          errors.details_applicant_skills[index]
                                            .ratingScale
                                        }
                                      </div>
                                    )}
                                </td>

                                {/* start date  */}
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    style={{ width: "130px" }}
                                    placeholderText="Select Date"
                                    selected={
                                      values?.details_applicant_skills?.[index]
                                        ?.startDate
                                        ? new Date(
                                          values.details_applicant_skills[
                                            index
                                          ].startDate
                                        )
                                        : null
                                    }
                                    onChange={(date) => {
                                      const selectedDate = formatDates(
                                        date,
                                        "yyyy-MM-dd"
                                      ); // or use date.toISOString().split('T')[0]
                                      setFieldValue(
                                        `details_applicant_skills[${index}].startDate`,
                                        selectedDate
                                      );
                                    }}
                                    dateFormat="dd-MMM-yyyy"
                                    name={`details_applicant_skills[${index}].startDate`}
                                    autoComplete="off"
                                    disabled={isdataForRead}
                                    minDate={
                                      values?.dateOfBirth
                                        ? new Date(values.dateOfBirth)
                                        : null
                                    }
                                    maxDate={new Date()} // optional: restrict future dates
                                    showPopperArrow={false}
                                  />

                                  {errors.details_applicant_skills?.[index]
                                    ?.startDate &&
                                    touched.details_applicant_skills?.[index]
                                      ?.startDate && (
                                      <div className="text-danger">
                                        {
                                          errors.details_applicant_skills[index]
                                            .startDate
                                        }
                                      </div>
                                    )}
                                </td>

                                {/* end date  */}
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    style={{ width: "130px" }}
                                    placeholderText="Select Date"
                                    selected={
                                      values?.details_applicant_skills?.[index]
                                        ?.endDate
                                        ? new Date(
                                          values.details_applicant_skills[
                                            index
                                          ].endDate
                                        )
                                        : null
                                    }
                                    onChange={(date) => {
                                      const selectedDate = formatDates(
                                        date,
                                        "yyyy-MM-dd"
                                      ); // or use date.toISOString().split('T')[0]
                                      setFieldValue(
                                        `details_applicant_skills[${index}].endDate`,
                                        selectedDate
                                      );
                                    }}
                                    dateFormat="dd-MMM-yyyy"
                                    name={`details_applicant_skills[${index}].endDate`}
                                    autoComplete="off"
                                    disabled={isdataForRead}
                                    minDate={
                                      values?.dateOfBirth
                                        ? new Date(values.dateOfBirth)
                                        : null
                                    }
                                    maxDate={new Date()} // optional: restrict future dates
                                    showPopperArrow={false}
                                  />

                                  {errors.details_applicant_skills?.[index]
                                    ?.endDate &&
                                    touched.details_applicant_skills?.[index]
                                      ?.endDate && (
                                      <div className="text-danger">
                                        {
                                          errors.details_applicant_skills[index]
                                            .endDate
                                        }
                                      </div>
                                    )}
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>

                    {!isdataForRead && (
                      <button
                        type="button"
                        onClick={() => {
                          push({
                            skill: "",
                            description: "",
                            ratingScale: "",
                            startDate: "",
                            endDate: "",
                            jobVacancyId: "",
                          })
                          //  printSkills(values.details_applicant_vacancy)

                        }}

                        // onClick={() => {
                        //   if (!skillsAutoAdded && Array.isArray(allSkillNames) && allSkillNames.length > 0) {
                        //     allSkillNames.forEach((name) => {
                        //       const alreadyExists = values.details_applicant_skills.some(
                        //         (item) => item.skill === name
                        //       );

                        //       if (!alreadyExists) {
                        //         push({
                        //           skill: name,
                        //           description: "",
                        //           ratingScale: "",
                        //           startDate: "",
                        //           endDate: "",
                        //         });
                        //       }
                        //     });

                        //     setSkillsAutoAdded(true); // prevent repeating auto-add
                        //   } else {
                        //     // Just manually add empty row
                        //     push({
                        //       skill: "",
                        //       description: "",
                        //       ratingScale: "",
                        //       startDate: "",
                        //       endDate: "",
                        //     });
                        //   }
                        // }}


                        className="btn btn-primary btn-sm"
                      >
                        + Add Detail
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>

              {typeof errors.details_applicant_skills === "string" && (
                <div className="text-danger">
                  {errors.details_applicant_skills}
                </div>
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
