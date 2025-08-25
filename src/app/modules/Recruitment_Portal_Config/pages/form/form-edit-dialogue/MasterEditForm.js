import { Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { themeColor } from "../FormUIHelper";
import {
  Checkbox,
  Input,
} from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";

const profilePercentageConfigFields = [
  {
    name: "portalConfig.profile_pic_perc",
    label: "Profile Picture %",
  },
  {
    name: "portalConfig.basic_info_perc",
    label: "Basic Information %",
  },
  {
    name: "portalConfig.personal_info_perc",
    label: "Personal Information %",
  },
  {
    name: "portalConfig.contact_info_perc",
    label: "Contact Information %",
  },
  {
    name: "portalConfig.general_info_perc",
    label: "General Information %",
  },
  {
    name: "portalConfig.academic_info_perc",
    label: "Academic Information %",
  },
  {
    name: "portalConfig.professional_info_perc",
    label: "Professional Information %",
  },
  {
    name: "portalConfig.skills_info_perc",
    label: "Skills Information %",
  },
  { name: "portalConfig.cv_upload_perc", label: "CV Upload %" },
];

const applicantProfileMandatoryField = [
  {
    label: "Title",
    name: "title",
    disabled: true,
  },
  {
    label: "First Name",
    name: "firstName",
    disabled: true,
  },
  {
    label: "Middle Name",
    disabled: false,
    name: "middleName",
  },
  {
    label: "Last Name",
    disabled: false,
    name: "lastName",
  },
  {
    label: "Date of Birth",
    disabled: false,
    name: "dateOfBirth",
  },
  {
    label: "NIC No",
    disabled: false,
    name: "nic_no",
  },
  {
    label: "Passport No",
    disabled: false,
    name: "passportNo",
  },
  {
    label: "Nationality",
    disabled: false,
    name: "nationality",
  },
  {
    label: "Gender",
    disabled: false,
    name: "gender",
  },
  {
    label: "Marital Status",
    disabled: false,
    name: "maritalStatus",
  },
  {
    label: "Religion",
    disabled: false,
    name: "religion",
  },
  {
    label: "Relation Name",
    disabled: false,
    name: "relation_name",
  },
  {
    label: "Country",
    disabled: false,
    name: "countryId",
  },
  {
    label: "City",
    disabled: false,
    name: "cityId",
  },
  {
    label: "Address",
    disabled: false,
    name: "address",
  },
  {
    label: "Phone (Cell)",
    disabled: false,
    name: "phone_cell",
  },
  {
    label: "Phone (Official)",
    disabled: false,
    name: "phone_official",
  },
  {
    label: "Email (Personal)",
    disabled: false,
    name: "email_personal",
  },
  {
    label: "Applicant Can Join",
    disabled: false,
    name: "applicantCanJoin",
  },
  {
    label: "Current Designation",
    disabled: false,
    name: "currentDesignation",
  },
  {
    label: "Current Salary",
    disabled: false,
    name: "current_salary",
  },
  {
    label: "Expected Salary",
    disabled: false,
    name: "expected_salary",
  },
  {
    label: "Other Information",
    disabled: false,
    name: "otherInformation",
  },
  {
    label: "Profile Picture",
    disabled: false,
    name: "profile_image",
  },
  {
    label: "Upload CV",
    disabled: false,
    name: "file",
  },
  {
    label: "Academic Information",
    disabled: false,
    name: "academic_info",
  },
  {
    label: "Experience Information",
    disabled: false,
    name: "experience_info",
  },
  {
    label: "Skills Information",
    disabled: false,
    name: "skills_info",
  },
];

const JobDetailVisibleInfoField = [
  // {
  //   label: "Job Title",
  //   disabled: false,
  //   name: "job_title",
  // },
  // {
  //   label: "Job Publishing Date",
  //   disabled: false,
  //   name: "job_publishing_date",
  // },
  // {
  //   label: "Job Summary",
  //   disabled: false,
  //   name: "job_summary",
  // },
  {
    label: "Subsidiary",
    disabled: false,
    name: "subsidiary",
  },
  {
    label: "Department",
    disabled: false,
    name: "department",
  },
  // {
  //   label: "Job Code",
  //   disabled: false,
  //   name: "job_code",
  // },
  {
    label: "Grade",
    disabled: false,
    name: "grade",
  },
  {
    label: "Country",
    disabled: false,
    name: "country",
  },
  {
    label: "City",
    disabled: false,
    name: "city",
  },
  // {
  //   label: "Location",
  //   disabled: false,
  //   name: "location",
  // },
  {
    label: "Employee Type",
    disabled: false,
    name: "employee_type",
  },
  {
    label: "Employee Status",
    disabled: false,
    name: "employee_status",
  },
  {
    label: "Report To",
    disabled: false,
    name: "report_to",
  },
  // {
  //   label: "Job Posting Date To",
  //   disabled: false,
  //   name: "jobPostingDateTo",
  // },
  {
    label: "No of Vacancies",
    disabled: false,
    name: "no_of_vacancies",
  },
  {
    label: "Hiring Person",
    disabled: false,
    name: "hiring_person",
  },
  {
    label: "Job Preferences",
    disabled: false,
    name: "job_prefrences",
  },
  {
    label: "Desired Date of Appointment",
    disabled: false,
    name: "desire_date_of_apointment",
  },
  // {
  //   label: "Appointment Type",
  //   disabled: false,
  //   name: "appointment_type",
  // },
  {
    label: "Priority",
    disabled: false,
    name: "priority",
  },
  {
    label: "Comments",
    disabled: false,
    name: "comments",
  },
  {
    label: "Preferred Age Range",
    disabled: false,
    name: "preferred_age_range",
  },
  {
    label: "Preferred Qualification",
    disabled: false,
    name: "preferred_qualification",
  },
  {
    label: "Preferred Shift",
    disabled: false,
    name: "preferred_shift",
  },
  {
    label: "Preferred Gender",
    disabled: false,
    name: "preferred_gender",
  },
  {
    label: "Preferred Job Skills",
    disabled: false,
    name: "preferred_job_skills",
  },
  {
    label: "Preferred Job Industry",
    disabled: false,
    name: "preferred_job_industry",
  },
  // {
  //   label: "Work Experience Range",
  //   disabled: false,
  //   name: "work_experience_range",
  // },
  {
    label: "Work Experience Detail",
    disabled: false,
    name: "work_experience_detail",
  },
  {
    label: "Salary Range",
    disabled: false,
    name: "salary_range",
  },
  {
    label: "Incentive Package",
    disabled: false,
    name: "incentive_package",
  },
  {
    label: "Other Benefits",
    disabled: false,
    name: "other_benefits",
  },
];

const MasterEditForm = ({ initialValues, loading, dispatch, companyId }) => {
  const [totalProfileConfigPerc, setTotalProfileConfigPerc] = useState(0);

  // Calculate total %
  const calculateTotalProfileConfigPerc = (portalConfig) => {
    const total =
      Number(portalConfig?.profile_pic_perc || 0) +
      Number(portalConfig?.basic_info_perc || 0) +
      Number(portalConfig?.personal_info_perc || 0) +
      Number(portalConfig?.contact_info_perc || 0) +
      Number(portalConfig?.general_info_perc || 0) +
      Number(portalConfig?.academic_info_perc || 0) +
      Number(portalConfig?.professional_info_perc || 0) +
      Number(portalConfig?.skills_info_perc || 0) +
      Number(portalConfig?.cv_upload_perc || 0);

    setTotalProfileConfigPerc(Number(total)); // always store as number
  };

  useEffect(() => {
    calculateTotalProfileConfigPerc(initialValues?.portalConfig);
  }, [initialValues?.portalConfig]);

  // Reusable handler for all % fields
  const handlePercChange = (field, value, portalConfig, setFieldValue) => {
    let numericValue = value === "" ? 0 : Number(value);

    // Clamp value between 0–100
    if (numericValue < 0) numericValue = 0;
    if (numericValue > 100) numericValue = 100;

    setFieldValue(field, numericValue);

    // Recalculate total with updated value
    calculateTotalProfileConfigPerc({
      ...portalConfig,
      [field.split(".")[1]]: numericValue,
    });
  };


  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={(values) => {
        dispatch(actions.updatePortalConfig(values));
      }}
    >
      {({ handleSubmit, values, setFieldValue }) => (
        <Form className="form form-label-right">
          <fieldset disabled={loading}>
            {/* Theme color selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h6 className="font-bold mb-0 text-primary my-2">
                  Theme Color
                </h6>
                <label className="ml-2 text-sm font-medium">
                  {!values?.portalConfig?.color_name ? (
                    <label className="invalid-feedback">
                      Please select a theme color
                    </label>
                  ) : null}
                </label>
              </div>
              <p className="m-0 underline font-size-xs text-black">
                <a target="_blank" href={`${process.env.REACT_APP_PORTAL_URL + companyId}`}>
                  Go to Portal
                </a>
              </p>
            </div>
            <div className="grid grid-cols-12 gap-x-3 gap-y-1">
              <div className="col-span-8 flex gap-4">
                {themeColor.map((el, ind) => (
                  <div key={ind}>
                    <button
                      style={{ backgroundColor: el.primary_color }}
                      className={
                        values?.portalConfig?.color_name === el.color_name
                          ? `w-12 h-12 rounded-md border-4 border-solid border-gray-800`
                          : `w-12 h-12 rounded-md border-none`
                      }
                      type="button"
                      onClick={() => {
                        setFieldValue("portalConfig.color_name", el.color_name);
                        setFieldValue(
                          "portalConfig.primary_color",
                          el.primary_color
                        );
                        setFieldValue(
                          "portalConfig.secondary_color",
                          el.secondary_color
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr />

            {/* Profile Percentage Configuration */}
            <div className="flex items-center">
              <h6 className="font-bold mb-0 text-primary my-1">
                Profile Percentage Configuration
              </h6>
              <label className="ml-2 text-sm font-medium">
                {totalProfileConfigPerc > 100 ? (
                  <label className="invalid-feedback">
                    Sum of overall percentages should be equal to 100%
                  </label>
                ) : totalProfileConfigPerc < 100 ? (
                  <label className="invalid-feedback">
                    Sum of overall percentages should be equal to 100%
                  </label>
                ) : null}
              </label>
            </div>
            <div className="grid grid-cols-9 gap-x-3 gap-y-1">
              {profilePercentageConfigFields.map((fieldConfig) => (
                <div key={fieldConfig.name}>
                  <Field name={fieldConfig.name}>
                    {({ field, form }) => (
                      <Input
                        field={field}
                        form={form}
                        type="number"
                        min="0"
                        max="100"
                        label={fieldConfig.label} // Change this line
                        autoComplete="off"
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          handlePercChange(
                            fieldConfig.name, // Also change this for consistency
                            val,
                            values.portalConfig,
                            setFieldValue
                          );
                        }}
                      />
                    )}
                  </Field>
                </div>
              ))}
            </div>

            <hr />

            {/* Applicant Profile - Mandatory Fields */}
            <h6 className="font-bold mb-0 text-primary my-2">
              Applicant Profile - Mandatory Fields
            </h6>
            <div className="grid grid-cols-10 gap-x-3 gap-y-1">
              {applicantProfileMandatoryField?.map((fieldConfig) => (
                <div key={fieldConfig?.name}>
                  <Checkbox
                    isSelected={values?.applicantFormConfig?.[fieldConfig.name]}
                    disabled={fieldConfig?.disabled}
                    onChange={(e) => {
                      setFieldValue(
                        `applicantFormConfig.${fieldConfig?.name}`,
                        e?.target?.checked
                      );
                    }}
                    children={fieldConfig?.label}
                  />
                </div>
              ))}
            </div>

            <hr />

            {/* Job Detail - Visible Information */}
            <h6 className="font-bold mb-0 text-primary my-2">
              Job Detail - Visible Information
            </h6>
            <div className="grid grid-cols-10 gap-x-3 gap-y-1">
              {JobDetailVisibleInfoField?.map((fieldConfig) => (
                <div key={fieldConfig?.name}>
                  <Checkbox
                    isSelected={values?.jobDetailConfig?.[fieldConfig.name]}
                    disabled={fieldConfig?.disabled}
                    onChange={(e) => {
                      setFieldValue(
                        `jobDetailConfig.${fieldConfig?.name}`,
                        e?.target?.checked
                      );
                    }}
                    children={fieldConfig?.label}
                  />
                </div>
              ))}
            </div>

            {/* Submit form   */}
            <hr />
            <div className="text-right">
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
                disabled={
                  totalProfileConfigPerc !== 100 ||
                  loading ||
                  !values?.portalConfig?.color_name
                }
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
};

export default MasterEditForm;
