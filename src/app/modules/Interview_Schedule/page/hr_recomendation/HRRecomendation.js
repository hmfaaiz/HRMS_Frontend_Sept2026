import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchAllFormsMenu } from "../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../_redux/formAction";
import { Accordion, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import { Field, Formik } from "formik";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../_metronic/_partials/controls";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../utils/constants";
import { RichTextInput } from "../../../../../_metronic/_partials/controls/forms/RichTextInput";
import he from "he";

const validationSchema = Yup.object().shape({
  applicationStatusId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  hr_remarks: Yup.string().required(VALIDATION_MESSAGES.required),
  locationId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  monthlySalary: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  appointmentTypeId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  jobPreferencesId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  dateOfJoining: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export default function HRRecomendation() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      selectedApplicant: FormUIContext?.selectedApplicant,
      applicantVacancyId: FormUIContext?.applicantVacancyId,
      selectedJob: FormUIContext?.selectedJob,
      setApplicantDetail: FormUIContext?.setApplicantDetail,
      setSelectedApplicant: FormUIContext?.setSelectedApplicant,
      setApplicantVacancyId: FormUIContext?.setApplicantVacancyId,
      applicantDetail: FormUIContext?.applicantDetail,
      queryParams: FormUIContext?.queryParams,
    };
  });

  console.log("formUIProps", formUIProps.applicantDetail);
  const { applicantStatusList, dashboard } = useSelector((state) => {
    return {
      applicantStatusList: state?.interview_schedule?.applicantStatusList,
      dashboard: state?.dashboard,
    };
  }, shallowEqual);

  const handleSubmitHRRecommendation = async (values) => {
    setLoading(true);
    await dispatch(
      actions?.updateApplicantStatus({
        ...values,
        applicantId: formUIProps.selectedApplicant,
        applicantVacancyId: formUIProps.applicantVacancyId,
      })
    ).then(() => {
      dispatch(
        actions.fetchInterviewList({
          ...formUIProps?.queryParams,
          applicantVacancyId: formUIProps?.applicantVacancyId,
          applicantId: formUIProps?.selectedApplicant,
        })
      );
      formUIProps.setSelectedApplicant(null);
      formUIProps.setApplicantVacancyId(null);
      formUIProps.setApplicantDetail(null);
      dispatch(actions.fetchApplicants(formUIProps?.selectedJob));
      setLoading(false);
    });
  };

  useEffect(() => {
    dispatch(fetchAllFormsMenu(409, "allEmpTypeChildMenus")); // For Appointment Type
    dispatch(fetchAllFormsMenu(275, "allEmployeeStatus")); // For Job Preferences
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus")); // For Location
  }, [dispatch]);

  return (
    <div className="col-12">
      <Accordion defaultActiveKey="">
        <Card>
          <Card.Header>
            <div className="accordion-header-btn ">
              <Accordion.Toggle eventKey="0" className="flex-between-center">
                HR Recommendations
                <KeyboardArrowDown />
              </Accordion.Toggle>
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            {formUIProps?.selectedApplicant ? (
              <Card.Body>
                <div
                  style={{
                    backgroundColor: "#E6F8FF",
                    borderRadius: "5px",
                    border: "none",
                  }}
                >
                  <Formik
                    enableReinitialize
                    initialValues={{
                      ...formUIProps.applicantDetail,
                      jobOfferLetter: he.decode(
                        formUIProps?.applicantDetail?.jobOfferLetter || ""
                      ),
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                      handleSubmitHRRecommendation(values);
                    }}
                  >
                    {({
                      handleSubmit,
                      errors,
                      touched,
                      values,
                      setFieldValue,
                    }) => (
                      <>
                        <Modal.Body className="overlay overlay-block cursor-default">
                          <Form className="form form-label-right">
                            <fieldset>
                              <div className="row mt-2">
                                <div className="col-12 col-md-4">
                                  <SearchSelect
                                    name="applicationStatusId"
                                    label={
                                      <span>
                                        Applicant Status{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </span>
                                    }
                                    onChange={(e) => {
                                      setFieldValue(
                                        "applicationStatusId",
                                        e.value || null
                                      );
                                    }}
                                    value={
                                      applicantStatusList?.find(
                                        (option) =>
                                          option.value ===
                                          values.applicationStatusId
                                      ) || null
                                    }
                                    options={applicantStatusList}
                                    error={errors.applicationStatusId}
                                    touched={touched.applicationStatusId}
                                  />
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-12 col-md-12">
                                  <label>
                                    <span>
                                      HR Remarks{" "}
                                      <span style={{ color: "red" }}>*</span>{" "}
                                    </span>
                                  </label>
                                  <Field
                                    name="hr_remarks"
                                    component={TextArea}
                                    placeholder="HR Remarks"
                                    type="text"
                                  />
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-12 col-md-4">
                                  <SearchSelect
                                    name="locationId"
                                    label={
                                      <span>
                                        Location{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </span>
                                    }
                                    onChange={(e) => {
                                      console.log(e);
                                      setFieldValue(
                                        "locationId",
                                        e.value || null
                                      );
                                    }}
                                    value={
                                      dashboard?.allLocationChildMenus?.find(
                                        (option) =>
                                          option.value === values.locationId
                                      ) || null
                                    }
                                    options={dashboard?.allLocationChildMenus}
                                    error={errors.locationId}
                                    touched={touched.locationId}
                                  />
                                </div>
                                <div className="col-12 col-md-4">
                                  <label>
                                    <span>
                                      Monthly Salary{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </span>
                                  </label>
                                  <Field
                                    name="monthlySalary"
                                    component={Input}
                                    placeholder="Monthly Salary"
                                    type="number"
                                  />
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-12 col-md-4">
                                  <SearchSelect
                                    name="appointmentTypeId"
                                    label={
                                      <span>
                                        Appointment Type{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </span>
                                    }
                                    onChange={(e) => {
                                      console.log(e);
                                      setFieldValue(
                                        "appointmentTypeId",
                                        e.value || null
                                      );
                                    }}
                                    value={
                                      dashboard?.allEmpTypeChildMenus?.find(
                                        (option) =>
                                          option.value ===
                                          values.appointmentTypeId
                                      ) || null
                                    }
                                    options={dashboard?.allEmpTypeChildMenus}
                                    error={errors.appointmentTypeId}
                                    touched={touched.appointmentTypeId}
                                  />
                                </div>
                                <div className="col-12 col-md-4">
                                  <SearchSelect
                                    name="jobPreferencesId"
                                    label={
                                      <span>
                                        Job Preferences{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </span>
                                    }
                                    onChange={(e) => {
                                      console.log(e);
                                      setFieldValue(
                                        "jobPreferencesId",
                                        e.value || null
                                      );
                                    }}
                                    value={
                                      dashboard?.allEmployeeStatus?.find(
                                        (option) =>
                                          option.value ===
                                          values.jobPreferencesId
                                      ) || null
                                    }
                                    options={dashboard?.allEmployeeStatus}
                                    error={errors.jobPreferencesId}
                                    touched={touched.jobPreferencesId}
                                  />
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-12 col-md-4">
                                  <label>
                                    <span>
                                      Date of Joining{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </span>
                                  </label>
                                  <Field
                                    name="dateOfJoining"
                                    component={DatePickerField}
                                    value={values?.dateOfJoining || ""}
                                    placeholder="Date of Joining"
                                    type="date"
                                  />
                                </div>
                                <div className="col-12 col-md-4">
                                  <label>
                                    <span>Probation Period</span>
                                  </label>
                                  <Field
                                    name="probationPeriod"
                                    component={Input}
                                    placeholder="Probation Period"
                                    type="number"
                                  />
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-12 col-md-12">
                                  <RichTextInput
                                    label="Offer Letter"
                                    name="jobOfferLetter"
                                    touched={touched?.jobOfferLetter}
                                    errors={errors?.jobOfferLetter}
                                    value={values?.jobOfferLetter || ""}
                                    onChange={(e) => {
                                      setFieldValue("jobOfferLetter", e);
                                    }}
                                  />
                                </div>
                              </div>
                            </fieldset>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
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
                          {/* )} */}
                        </Modal.Footer>
                      </>
                    )}
                  </Formik>
                </div>
              </Card.Body>
            ) : (
              <p className="text-center m-2">Please Select Applicant Profile</p> // Improved message for clarity
            )}
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}
