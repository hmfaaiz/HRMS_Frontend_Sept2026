import React, { useEffect, useState, useMemo } from "react";
import { Modal, Form } from "react-bootstrap";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  TextArea,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { useFormUIContext } from "../FormUIContext";

const validationSchema = Yup.object().shape({
  interview_remarks: Yup.string().trim().required(VALIDATION_MESSAGES.required),
  interview_recommendation: Yup.string().trim().required(VALIDATION_MESSAGES.required),
  recommendedApplicantStatusId: Yup.string().nullable().required(VALIDATION_MESSAGES.required),
});

export function RecommendationModal({ interviewId, show, onHide, isViewOnly }) {
  const [loading, setLoading] = useState(false);

  // ── FIX: capture isViewOnly locally when modal opens ──────────
  // Prevents the "glimpse" of submit mode during modal close animation
  const [localIsViewOnly, setLocalIsViewOnly] = useState(isViewOnly);

  useEffect(() => {
    if (show) {
      setLocalIsViewOnly(isViewOnly);
    }
  }, [show, isViewOnly]);

  const isReadOnly = localIsViewOnly;

  const dispatch = useDispatch();

  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => ({
    panelMode: formUIContext.panelMode,
    setPanelMode: formUIContext.setPanelMode,
    employeeId: formUIContext.employeeId,
    setEmployeeId: formUIContext.setEmployeeId,
  }), [formUIContext]);

  const { interviewForModal, statusOptions, actionsLoading } = useSelector(
    (state) => ({
      interviewForModal: state.interview_recommendations.interviewForModal,
      statusOptions: state.interview_recommendations.statusOptions,
      actionsLoading: state.interview_recommendations.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (interviewId && show) {
      dispatch(actions.fetchInterviewRecommendationById(interviewId));
      dispatch(actions.fetchRecommendationStatusOptions());
    }
  }, [interviewId, show]);

  useEffect(() => {
    if (!show) {
      dispatch(actions.clearInterviewForModal());
      formUIProps.setPanelMode(false);
    }
  }, [show]);

  const applicant = interviewForModal?.Applicant;

  useEffect(() => {
    if (applicant?.employeeId) {
      formUIProps.setEmployeeId(applicant.employeeId);
    }
  }, [applicant?.employeeId]);

  const existingRec = interviewForModal?.myRecommendation;

  const initialValues = {
    interview_remarks: existingRec?.interview_remarks || "",
    interview_recommendation: existingRec?.interview_recommendation || "",
    recommendedApplicantStatusId: existingRec?.recommendedApplicantStatusId || null,
  };

  const handleSubmit = (values) => {
    if (isReadOnly) return;
    setLoading(true);
    dispatch(
      actions.submitInterviewRecommendation(
        { ...values, interviewId },
        () => setLoading(false),
        onHide
      )
    );
  };

  return (
    <Modal
      size="lg"
      centered
      dialogClassName="recommendation-modal"
      show={show}
      onHide={onHide}
    >
      {actionsLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title className="text-black font-bold text-[1.25rem]">
          {isReadOnly ? "View Recommendation" : "Submit Recommendation"}
        </Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={!isReadOnly ? validationSchema : undefined}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, errors, touched, values, setFieldValue }) => (
          <>
            <Modal.Body className="p-0">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}

              <Form className="d-flex">

                {/* ── Side Panel — Applicant Profile ── */}
                <div
                  className={`flex-none w-64 bg-light p-3 border-end ${
                    formUIProps.panelMode ? "d-block" : "d-none"
                  }`}
                >
                  <EmployeeProfile
                    employeeId={formUIProps.employeeId}
                    panelMode={formUIProps.panelMode}
                  />
                </div>

                {/* ── Main Content ── */}
                <div className="flex-1 p-4">

                  {/* fieldset disables all native inputs in read mode */}
                  <fieldset disabled={isReadOnly}>

                    {/* Interview Remarks */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Interview Remarks{" "}
                        {!isReadOnly && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                      </label>
                      <Field
                        name="interview_remarks"
                        component={TextArea}
                        rows={3}
                        className="form-control"
                        placeholder="Enter interview remarks"
                      />
                      {errors.interview_remarks &&
                        touched.interview_remarks && (
                          <div
                            className="invalid-feedback d-block"
                            style={{ fontSize: "12px" }}
                          >
                            {/* {errors.interview_remarks} */}
                          </div>
                        )}
                    </div>

                    {/* Interview Recommendation */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Interview Recommendation{" "}
                        {!isReadOnly && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                      </label>
                      <Field
                        name="interview_recommendation"
                        component={TextArea}
                        rows={3}
                        className="form-control"
                        placeholder="Enter your recommendation"
                      />
                      {errors.interview_recommendation &&
                        touched.interview_recommendation && (
                          <div
                            className="invalid-feedback d-block"
                            style={{ fontSize: "12px" }}
                          >
                            {/* {errors.interview_recommendation} */}
                          </div>
                        )}
                    </div>

                    {/* Recommended Status */}
                    <div className="mb-3" style={{ maxWidth: "250px" }}>
                      <label className="form-label fw-bold">
                        Recommended Applicant Status{" "}
                        {!isReadOnly && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                      </label>
                      {/* isDisabled used because React Select ignores fieldset/disabled */}
                      <SearchSelect
                        name="recommendedApplicantStatusId"
                        isDisabled={isReadOnly}
                        onChange={(e) =>
                          !isReadOnly &&
                          setFieldValue(
                            "recommendedApplicantStatusId",
                            e?.value || null
                          )
                        }
                        value={
                          statusOptions?.find(
                            (opt) =>
                              opt.value === values.recommendedApplicantStatusId
                          ) || null
                        }
                        options={statusOptions}
                      />
                      {errors.recommendedApplicantStatusId &&
                        touched.recommendedApplicantStatusId && (
                          <div
                            className="invalid-feedback d-block"
                            style={{ fontSize: "9px" }}
                          >
                            {errors.recommendedApplicantStatusId}
                          </div>
                        )}
                    </div>

                  </fieldset>
                </div>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <button
                type="button"
                className="btn btn-light btn-elevate"
                onClick={onHide}
              >
                {isReadOnly ? "Close" : "Cancel"}
              </button>

              {!isReadOnly && (
                <button
                  type="button"
                  className="btn btn-primary btn-elevate"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Submit Recommendation
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white" />
                  )}
                </button>
              )}
            </Modal.Footer>
          </>
        )}
      </Formik>
    </Modal>
  );
}