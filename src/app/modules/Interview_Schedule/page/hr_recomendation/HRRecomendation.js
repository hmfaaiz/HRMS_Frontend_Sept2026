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
import { CircleMinus, CirclePlus } from "lucide-react";
import { AmountInput } from "../../../../../_metronic/_partials/controls/forms/AmountInput";
import { formatDates } from "../../../../utils/common";

export default function HRRecomendation() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();
  const [showSection, setShowSection] = useState(false);
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

  const { applicantStatusList, dashboard, entities } = useSelector((state) => {
    return {
      applicantStatusList: state?.interview_schedule?.applicantStatusList,
      entities: state?.interview_schedule?.entities,
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
    dispatch(fetchAllFormsMenu(442, "allJobPreferenceList")); // For Job Preferences
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus")); // For Location
  }, [dispatch]);

  const finalizeForHiringValue = applicantStatusList?.find(
    (s) => s.label === "Finalized for Hiring"
  )?.value;

  console.log(
    "finalizeForHiringValuefinalizeForHiringValue",
    finalizeForHiringValue
  );
  const validationSchema = Yup.object().shape({
    applicationStatusId: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    hr_remarks: Yup.string().required(VALIDATION_MESSAGES.required),

    locationId: Yup.string()
      .nullable()
      .when("applicationStatusId", {
        is: (val) => val == finalizeForHiringValue,
        then: Yup.string().required(VALIDATION_MESSAGES.required),
        otherwise: Yup.string().nullable(),
      }),

    monthlySalary: Yup.string()
      .nullable()
      .when("applicationStatusId", {
        is: (val) => val == finalizeForHiringValue,
        then: Yup.string().required(VALIDATION_MESSAGES.required),
        otherwise: Yup.string().nullable(),
      }),

    appointmentTypeId: Yup.string()
      .nullable()
      .when("applicationStatusId", {
        is: (val) => val == finalizeForHiringValue,
        then: Yup.string().required(VALIDATION_MESSAGES.required),
        otherwise: Yup.string().nullable(),
      }),

    jobPreferencesId: Yup.string()
      .nullable()
      .when("applicationStatusId", {
        is: (val) => val == finalizeForHiringValue,
        then: Yup.string().required(VALIDATION_MESSAGES.required),
        otherwise: Yup.string().nullable(),
      }),

    dateOfJoining: Yup.string()
      .nullable()
      .when("applicationStatusId", {
        is: (val) => val == finalizeForHiringValue,
        then: Yup.string().required(VALIDATION_MESSAGES.required),
        otherwise: Yup.string().nullable(),
      }),

    probationPeriod: Yup.number()
      .nullable()
      .when("applicationStatusId", {
        is: (val) => val == finalizeForHiringValue,
        then: Yup.number()
          .required("Probation period is required")
          .oneOf(
            [1, 2, 3, 4, 5, 6],
            "Probation period must be between 1 to 6 months"
          ),
        otherwise: Yup.number().nullable(),
      }),
  });

  return (
    <div>
      <div className="">
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={() => setShowSection(!showSection)}
            className="btn btn-primary btn-sm mt-1 text-right"
          >
            {showSection ? (
              <CircleMinus className="h-4 w-4 mr-1" />
            ) : (
              <CirclePlus className="h-4 w-4 mr-1" />
            )}
            HR Recommendations
          </button>
        </div>
        {showSection && (
          <>
            {formUIProps?.selectedApplicant ? (
              <>
                <div>
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
                      const payload = {
                        ...values,
                        dateOfJoining: values.dateOfJoining
                          ? formatDates(values.dateOfJoining, "dd-MMM-yyyy")
                          : null,
                      };

                      handleSubmitHRRecommendation(payload);
                    }}
                  >
                    {({
                      handleSubmit,
                      errors,
                      touched,
                      values,
                      setFieldValue,
                      setFieldTouched,
                    }) => (
                      <>
                        <Modal.Body className="overlay overlay-block cursor-default">
                          <Form className="form form-label-right">
                            <fieldset>
                              <div className="grid lg:grid-cols-4 gap-x-3 gap-y-1 mt-1">
                                <div className="">
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
                                <div className="">
                                  <SearchSelect
                                    name="locationId"
                                    label={
                                      <span>
                                        Location{" "}
                                        {finalizeForHiringValue ==
                                          values.applicationStatusId && (
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        )}
                                      </span>
                                    }
                                    onChange={(e) => {
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
                                {/* <div className="">
                                  <label>
                                    <span>
                                      Monthly Salary{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </span>
                                  </label>
                                  <Field
                                    component={AmountInput}
                                    name="monthlySalary"
                                    // // value={values.monthlySalary}
                                    // placeholder="Monthly Salary"
                                    // type="number"
                                    // amountFormat={true}
                                    as="input"
                                    className="form-control"
                                    //  onChange={(e)=>{

                                    // }}
                                  />
                                </div> */}
                                <div className="">
                                  <AmountInput
                                    field={{
                                      name: `monthlySalary`,
                                      value: values?.monthlySalary,
                                    }}
                                    form={{
                                      touched,
                                      errors,
                                      setFieldValue,
                                      setFieldTouched,
                                    }}
                                    placeholder="Enter salary"
                                    label={
                                      <span>
                                        Monthly Salary
                                        {finalizeForHiringValue ==
                                          values.applicationStatusId && (
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        )}
                                      </span>
                                    }
                                  />
                                </div>
                                <div className="">
                                  <SearchSelect
                                    name="appointmentTypeId"
                                    label={
                                      <span>
                                        Appointment Type{" "}
                                        {finalizeForHiringValue ==
                                          values.applicationStatusId && (
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        )}
                                      </span>
                                    }
                                    onChange={(e) => {
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
                              </div>

                              <div className="grid lg:grid-cols-4 gap-x-3 gap-y-1 mt-1">
                                <div className="">
                                  <SearchSelect
                                    name="jobPreferencesId"
                                    label={
                                      <span>
                                        Job Preferences{" "}
                                        {finalizeForHiringValue ==
                                          values.applicationStatusId && (
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        )}
                                      </span>
                                    }
                                    onChange={(e) => {
                                      setFieldValue(
                                        "jobPreferencesId",
                                        e.value || null
                                      );
                                    }}
                                    value={
                                      dashboard?.allJobPreferenceList?.find(
                                        (option) =>
                                          option.value ===
                                          values.jobPreferencesId
                                      ) || null
                                    }
                                    options={dashboard?.allJobPreferenceList}
                                    error={errors.jobPreferencesId}
                                    touched={touched.jobPreferencesId}
                                  />
                                </div>

                                <div className="">
                                  <label>
                                    <span>
                                      Date of Joining{" "}
                                      {finalizeForHiringValue ==
                                        values.applicationStatusId && (
                                        <span style={{ color: "red" }}>*</span>
                                      )}
                                    </span>
                                  </label>
                                  <Field
                                    name="dateOfJoining"
                                    component={DatePickerField}
                                    dateFormat="dd-MMM-yyyy"
                                    value={values?.dateOfJoining || ""}
                                    placeholder="Date of Joining"
                                    type="date"
                                    minDate={
                                      entities?.length > 0
                                        ? new Date(entities[0].interview_date)
                                        : ""
                                    }
                                  />
                                </div>

                                <div className="">
                                  <label>
                                    Probation Period{" "}
                                    {finalizeForHiringValue ===
                                      values.applicationStatusId && (
                                      <span style={{ color: "red" }}>*</span>
                                    )}
                                  </label>
                                  <Field
                                    name="probationPeriod"
                                    component={Input}
                                    placeholder="Probation Period"
                                    type="number"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-1">
                                <div className="">
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

                              <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-1">
                                <div className="">
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
              </>
            ) : (
              <p className="text-center m-2">Please Select Applicant Profile</p> // Improved message for clarity
            )}
          </>
        )}
      </div>
    </div>
  );
}
