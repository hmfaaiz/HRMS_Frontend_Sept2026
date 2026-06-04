import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  ModalProgressBar,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { fetchAppraisalFinalizationRating } from "../../../../Appraisal_Finalization/_redux/formActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

const consentValidationSchema = Yup.object().shape({
  consentComment: Yup.string()
    .trim()
    .required(VALIDATION_MESSAGES.required),
});

export function FormConsentDialog({ id, show, onHide }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);
  const { isLoading, appraisalFinalizedRating } = useSelector(
    (state) => ({
      isLoading: state.appraisal_finalization.actionsLoading,
      appraisalFinalizedRating:
        state?.appraisal_finalization?.appraisalFinalizedRating,
    }),
    shallowEqual,
  );

  // if !id we should close modal
  useEffect(() => {
    if (!id) {
      onHide();
    } else {
      dispatch(fetchAppraisalFinalizationRating(id));
    }
  }, [id]);

  const initialValues = {
    consentComment: "",
  };

  const handleSubmit = (values) => {
    setLoading(true);
    dispatch(
      actions.updateEvaluationConsent(
        {
          appraisalId: id,
          consentComment: values.consentComment,
        },
        onHide,
        setLoading,
      ),
    ).then(() => {
      dispatch(actions.fetchAppraisalEvaluation(formUIProps.queryParams));
    });
  };

  return (
    <Modal
      show={show}
      size="xl"
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/*begin::Loading*/}
      {(isLoading || loading) && <ModalProgressBar />}
      {/*end::Loading*/}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={consentValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, submitForm }) => (
          <>
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                View Rating And Send Consent
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div>
                <div className="flex justify-between items-center">
                  <h6 className="font-bold mb-0 text-primary">
                    Overall Assessment (Summary)
                  </h6>
                </div>
                <div className="w-full overflow-x-auto">
                  <div className="react-bootstrap-table table-responsive">
                    <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                      <thead>
                        <tr className="custom-table-header text-center">
                          <th className="text-left">Criteria</th>
                          <th className="text-left">Weightage</th>
                          <th>
                            <div className="flex flex-col">
                              Self Score
                              <span className="text-sm font-normal">
                                Rating | W.R
                              </span>
                            </div>
                          </th>
                          <th>
                            <div className="flex flex-col">
                              Manager Score
                              <span className="text-sm font-normal">
                                Rating | W.R
                              </span>
                            </div>
                          </th>
                          <th>
                            <div className="flex flex-col">
                              HR Score
                              <span className="text-sm font-normal">
                                Rating | W.R
                              </span>
                            </div>
                          </th>
                          <th>
                            <div className="flex flex-col">
                              Finalized Score
                              <span className="text-sm font-normal">
                                Rating | W.R
                              </span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong style={{ fontWeight: 700 }}>
                              HR Evaluation
                            </strong>
                          </td>
                          <td>{appraisalFinalizedRating?.hrWeight}%</td>
                          <td className="text-center">
                            {appraisalFinalizedRating?.hrSelfRating} |{" "}
                            {appraisalFinalizedRating?.hrSelfWeight}
                          </td>
                          <td className="text-center">
                            {appraisalFinalizedRating?.hrManagerRating} |{" "}
                            {appraisalFinalizedRating?.hrManagerWeight}
                          </td>
                          <td className="text-center">
                            {appraisalFinalizedRating?.hrHRRating} |{" "}
                            {appraisalFinalizedRating?.hrHRWeight}
                          </td>
                          <td className="text-center">
                            {appraisalFinalizedRating?.hrFinalize} |{" "}
                            {appraisalFinalizedRating?.hrFinalizeWeight}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong style={{ fontWeight: 700 }}>
                              General Evaluation
                            </strong>
                          </td>
                          <td>{appraisalFinalizedRating?.generalWeight}%</td>
                          <td className="text-center">
                            {appraisalFinalizedRating?.generalSelfRating} |{" "}
                            {appraisalFinalizedRating?.generalSelfWeight}
                          </td>
                          <td className="text-center">
                            {appraisalFinalizedRating?.generalManagerRating} |{" "}
                            {appraisalFinalizedRating?.generalManagerWeight}
                          </td>
                          <td className="text-center">
                            {appraisalFinalizedRating?.generalHRRating} |{" "}
                            {appraisalFinalizedRating?.generalHRWeight}
                          </td>
                          <td className="text-center">
                            {appraisalFinalizedRating?.generalFinalize} |{" "}
                            {appraisalFinalizedRating?.generalFinalizeWeight}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong style={{ fontWeight: 700 }}>
                              Goals & Objective
                            </strong>
                          </td>
                          <td>{appraisalFinalizedRating?.goalWeight}%</td>
                          <td className="text-center">
                            {appraisalFinalizedRating?.goalSelfRating} |{" "}
                            {appraisalFinalizedRating?.goalSelfWeight}
                          </td>
                          <td className="text-center">
                            {appraisalFinalizedRating?.goalManagerRating} |{" "}
                            {appraisalFinalizedRating?.goalManagerWeight}
                          </td>
                          <td className="text-center">
                            {appraisalFinalizedRating?.goalHRRating} |{" "}
                            {appraisalFinalizedRating?.goalHRWeight}
                          </td>
                          <td className="text-center">
                            {appraisalFinalizedRating?.goalFinalize} |{" "}
                            {appraisalFinalizedRating?.goalFinalizeWeight}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-tprimary">
                            <strong style={{ fontWeight: 700 }}>
                              Final Rating
                            </strong>
                          </td>
                          <td></td>
                          <td className="text-center"></td>
                          <td className="text-center"></td>
                          <td className="text-center"></td>
                          <td className="text-center font-semibold text-tprimary">
                            {appraisalFinalizedRating?.recommendedPoint}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Consent Form Section */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="font-bold mb-3 text-primary">Consent Form</h6>
                <Form>
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Comment <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="consentComment"
                      component={TextArea}
                      rows={4}
                      className="form-control"
                      placeholder="Please provide your consent comment here..."
                    />
                  </div>
                </Form>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={onHide}
                  className="btn btn-light btn-elevate"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={submitForm}
                  className="btn btn-primary btn-elevate ms-2"
                  disabled={loading}
                >
                  Submit
                  {loading && <span className="ml-3 spinner spinner-white" />}
                </button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </Modal>
  );
}
