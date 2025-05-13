import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { DatePickerField, Input, TextArea } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,

  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";


const jobVacancyEditSchema = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  companyId: Yup.number().required(VALIDATION_MESSAGES.required),
  jobCode: Yup.string().required(VALIDATION_MESSAGES.required),
  jobDate: Yup.date().required(VALIDATION_MESSAGES.required),
  designationId: Yup.number().required(VALIDATION_MESSAGES.required),
  jobTitle: Yup.string().required(VALIDATION_MESSAGES.required),
  grade: Yup.string().required(VALIDATION_MESSAGES.required),
  locationId: Yup.number().required(VALIDATION_MESSAGES.required),
  jobPostingDateFrom: Yup.date().required(VALIDATION_MESSAGES.required),
  jobPostingDateTo: Yup.date().required(VALIDATION_MESSAGES.required),
  countryId: Yup.number().required(VALIDATION_MESSAGES.required),
  cityId: Yup.number().required(VALIDATION_MESSAGES.required),
  employeeTypeId: Yup.number().required(VALIDATION_MESSAGES.required),
  employeeStatusId: Yup.number().required(VALIDATION_MESSAGES.required),
  reportToDesignationId: Yup.number().required(VALIDATION_MESSAGES.required),
  relationshipWithReportTo: Yup.string().required(VALIDATION_MESSAGES.required),
  noOfPosition: Yup.number().required(VALIDATION_MESSAGES.required),
  hiringReason: Yup.string().required(VALIDATION_MESSAGES.required),
  hiringPreference: Yup.string().required(VALIDATION_MESSAGES.required),
  appointmentType: Yup.string().required(VALIDATION_MESSAGES.required),
  comment: Yup.string().required(VALIDATION_MESSAGES.required),
  jobPeriodStart: Yup.date().required(VALIDATION_MESSAGES.required),
  jobPeriodEnd: Yup.date().required(VALIDATION_MESSAGES.required),
  desireDateOfApp: Yup.date().required(VALIDATION_MESSAGES.required),
  priority: Yup.string().required(VALIDATION_MESSAGES.required),
  criticalDays: Yup.number().required(VALIDATION_MESSAGES.required),
  preferredAgeFrom: Yup.number().required(VALIDATION_MESSAGES.required),
  preferredAgeTo: Yup.number().required(VALIDATION_MESSAGES.required),
  preferredShiftId: Yup.number().required(VALIDATION_MESSAGES.required),
  preferredGenderId: Yup.number().required(VALIDATION_MESSAGES.required),
  preferredQualificationId: Yup.number().required(VALIDATION_MESSAGES.required),
  preferredJobSkillsId: Yup.number().required(VALIDATION_MESSAGES.required),
  preferredJobIndustryId: Yup.number().required(VALIDATION_MESSAGES.required),
  workExpFrom: Yup.number().required(VALIDATION_MESSAGES.required),
  workExpTo: Yup.number().required(VALIDATION_MESSAGES.required),
  workExpDetail: Yup.string().required(VALIDATION_MESSAGES.required),
  additionalReq: Yup.string().required(VALIDATION_MESSAGES.required),
  salaryRangeFrom: Yup.number().required(VALIDATION_MESSAGES.required),
  salaryRangeTo: Yup.number().required(VALIDATION_MESSAGES.required),
  incentivePackages: Yup.string().required(VALIDATION_MESSAGES.required),
  otherBenefits: Yup.string().required(VALIDATION_MESSAGES.required),
  jobSummary: Yup.string().required(VALIDATION_MESSAGES.required),
  isActive: Yup.boolean().required(VALIDATION_MESSAGES.required),
});


export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  const [diffInDate, setDiffInDate] = useState()
  useEffect(() => {
    if (!user.Id) {
      // dispatch(fetchAllFormsMenu(133, "allSubidiaryList")); // For All Subsidiaries
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(184, "allContractTypeList"));
    
      dispatch(fetchAllFormsMenu(87, "allReligionChildMenus"));


    }
  }, [dispatch, user.Id]);


  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.job_vacancy,
      userAccess: state?.auth?.userAccess["job_vacancy"],
    };
  }, shallowEqual);


  console.log("currentState111",currentState)
  const { userForEdit } = currentState;




  return (
    <Formik
      enableReinitialize={true}


      initialValues={user}
      validationSchema={jobVacancyEditSchema}
      onSubmit={(values) => {

        enableLoading();
        saveForm(values, diffInDate);
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
              <fieldset disabled={isUserForRead}>



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
                        name="name"
                        component={Input}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Job Date<span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={Input}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>

                  </div>


                </div>

                {/* Request For */}

                <div style={{ padding: "10px 0 40px 0px", marginBottom: "15px", marginTop: "15px", borderRadius: "5px", borderBottom: '2px solid rgb(194, 194, 194)' }}>
                  <h6>Request For</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Designation<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === values.subsidiaryId
                          ) || null
                        }

                        options={dashboard?.allSubsidiaryList}
                        // options={dashboard.allSubidiaryList.map(option => ({
                        //   label: `${option.label} (${option.value})`, // Adding the value to the label
                        //   value: option.value,
                        // }))}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Job Title<span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={Input}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Grade<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === values.subsidiaryId
                          ) || null
                        }

                        options={dashboard?.allSubsidiaryList}
                        // options={dashboard.allSubidiaryList.map(option => ({
                        //   label: `${option.label} (${option.value})`, // Adding the value to the label
                        //   value: option.value,
                        // }))}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      />
                    </div>





                    <div className="col-12 col-md-4 mt-3">
                      Subsidiary
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
                        name="subsidiaryId"
                        label={
                          <span>
                            Country<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === values.subsidiaryId
                          ) || null
                        }

                        options={dashboard?.allSubsidiaryList}
                        // options={dashboard.allSubidiaryList.map(option => ({
                        //   label: `${option.label} (${option.value})`, // Adding the value to the label
                        //   value: option.value,
                        // }))}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            City<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === values.subsidiaryId
                          ) || null
                        }

                        options={dashboard?.allSubsidiaryList}
                        // options={dashboard.allSubidiaryList.map(option => ({
                        //   label: `${option.label} (${option.value})`, // Adding the value to the label
                        //   value: option.value,
                        // }))}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      />
                    </div>





                    <div className="col-12 col-md-4 mt-3">
                      Location
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
                        name="subsidiaryId"
                        label={
                          <span>
                            Employee Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === values.subsidiaryId
                          ) || null
                        }

                        options={dashboard?.allSubsidiaryList}
                        // options={dashboard.allSubidiaryList.map(option => ({
                        //   label: `${option.label} (${option.value})`, // Adding the value to the label
                        //   value: option.value,
                        // }))}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Employee Status<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === values.subsidiaryId
                          ) || null
                        }

                        options={dashboard?.allSubsidiaryList}
                        // options={dashboard.allSubidiaryList.map(option => ({
                        //   label: `${option.label} (${option.value})`, // Adding the value to the label
                        //   value: option.value,
                        // }))}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      />
                    </div>




                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        Job Posting Date (From)  <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="from_date"
                        component={DatePickerField} // Custom component
                        dateFormat="dd/MM/yyyy"
                        placeholder="Select Date"
                        type="date"
                        onChange={(e) => {


                          setFieldValue("from_date", e);

                        }}
                      />
                    </div>


                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        Job Posting Date (To) <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="to_date"
                        component={DatePickerField}
                        dateFormat="dd/MM/yyyy"
                        placeholder="Select Date"

                        // type="date"
                        onChange={(e) => {
                          setFieldValue("to_date", e);

                        }}

                      // minDate={dateOfJoining} 
                      // disabled={userForEdit?.details[0]?.is_deducted }
                      />
                    </div>

                  </div>


                </div>




                {/* Position Detail */}

                <div style={{ padding: "10px 0 40px 0px", marginBottom: "15px", borderRadius: "5px", marginTop: "15px", borderBottom: '2px solid rgb(194, 194, 194)' }}>
                  <h6>Position Detail</h6>
                  <div className="form-group row col-12 col-md-12  p-0 m-0">

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Report To(Designation)<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === values.subsidiaryId
                          ) || null
                        }

                        options={dashboard?.allSubsidiaryList}
                        // options={dashboard.allSubidiaryList.map(option => ({
                        //   label: `${option.label} (${option.value})`, // Adding the value to the label
                        //   value: option.value,
                        // }))}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Key relationship with Report To<span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={Input}
                        placeholder="Enter Name"

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
                        name="name"
                        component={Input}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Hiring Reason<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
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

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Job Preference<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
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



                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Appointment Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
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

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Priority<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
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

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Critical (in Days)<span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={Input}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>


                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        Job Period Start <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="from_date"
                        component={DatePickerField} // Custom component
                        dateFormat="dd/MM/yyyy"
                        placeholder="Select Date"
                        type="date"
                        onChange={(e) => {


                          setFieldValue("from_date", e);

                        }}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        Job Period End <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="to_date"
                        component={DatePickerField}
                        dateFormat="dd/MM/yyyy"
                        placeholder="Select Date"

                        // type="date"
                        onChange={(e) => {
                          setFieldValue("to_date", e);

                        }}

                      // minDate={dateOfJoining} 
                      // disabled={userForEdit?.details[0]?.is_deducted }
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        Desire Date of Appointment <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="to_date"
                        component={DatePickerField}
                        dateFormat="dd/MM/yyyy"
                        placeholder="Select Date"

                        // type="date"
                        onChange={(e) => {
                          setFieldValue("to_date", e);

                        }}

                      // minDate={dateOfJoining} 
                      // disabled={userForEdit?.details[0]?.is_deducted }
                      />
                    </div>


                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>
                          Comments<span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={TextArea}
                        placeholder="Enter Name"

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
                          Preferred Age From <span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={Input}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Preferred Age To <span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={Input}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Job Preference<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
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




                    <div className="col-12 col-md-4 mt-3">
                      Preferred Shift
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
                      Preferred Gender
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
                      Preferred Job Skills
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
                        name="subsidiaryId"
                        label={
                          <span>
                            Preferred Job Industry<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
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

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Work Experience From <span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={Input}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Work Experience To <span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={Input}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>



                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>
                          Work Experience Detail<span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={TextArea}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>

                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>
                          Additional Requirement<span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={TextArea}
                        placeholder="Enter Name"

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
                        name="name"
                        component={Input}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Salary Range (Per Month) To <span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={Input}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>

                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>
                          Incentive Packages <span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={TextArea}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>

                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>
                          Other Benefits <span style={{ color: "red" }}>*</span>
                        </span>
                      </label>
                      <Field
                        name="name"
                        component={TextArea}
                        placeholder="Enter Name"

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
                        name="name"
                        component={TextArea}
                        placeholder="Enter Name"

                        type="text"

                      />
                    </div>

                  </div>


                </div>

        
              </fieldset>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {!isUserForRead ? (
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

            {!isUserForRead && (
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
