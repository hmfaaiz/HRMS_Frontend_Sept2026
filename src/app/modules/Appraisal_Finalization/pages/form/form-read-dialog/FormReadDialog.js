import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/formActions";
import { decodeHtml } from "../../../../../utils/common";

export function FormReadDialog({ id, show, onHide }) {
  // Customers UI Context

  // Customers Redux state
  const dispatch = useDispatch();
  const { isLoading, appraisalFinalizedRating } = useSelector(
    (state) => ({
      isLoading: state.appraisal_finalization.actionsLoading,
      appraisalFinalizedRating:
        state?.appraisal_finalization?.appraisalFinalizedRating,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!id) {
      onHide();
    } else {
      dispatch(actions.fetchAppraisalFinalizationRating(id));
    }
  }, [id]);

  return (
    <Modal
      show={show}
      size="xl"
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          View Ratings (Appraisal Period Wise)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="py-2">
          <div className="grid grid-cols-2 text-sm gap-1">
            <p className="mb-0">
              <span className="font-semibold">Employee Code:</span>{" "}
              {appraisalFinalizedRating?.Employee?.employeeCode}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Employee Name:</span>{" "}
              {appraisalFinalizedRating?.Employee?.firstName}{" "}
              {appraisalFinalizedRating?.Employee?.middleName}{" "}
              {appraisalFinalizedRating?.Employee?.lastName}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Designation:</span>{" "}
              {appraisalFinalizedRating?.Employee?.designation?.formName}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Department:</span>{" "}
              {appraisalFinalizedRating?.Employee?.department?.deptName}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Manager:</span>{" "}
              {appraisalFinalizedRating?.Employee?.ReportTo?.firstName}{" "}
              {appraisalFinalizedRating?.Employee?.ReportTo?.middleName}{" "}
              {appraisalFinalizedRating?.Employee?.ReportTo?.lastName}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Manager Designation:</span>{" "}
              {
                appraisalFinalizedRating?.Employee?.ReportTo?.designation
                  ?.formName
              }
            </p>
          </div>
        </div>
        <hr />
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
                      <strong style={{ fontWeight: 700 }}>HR Evaluation</strong>
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
                      <strong style={{ fontWeight: 700 }}>Final Rating</strong>
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
        <hr />
        <div>
          <div className="flex justify-between items-center">
            <h6 className="font-bold mb-1 text-primary">Recommendation</h6>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="react-bootstrap-table table-responsive">
              <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                <tbody>
                  <tr>
                    <td>
                      <strong style={{ fontWeight: 700 }}>
                        Self Recommendation
                      </strong>
                    </td>
                    <td>
                      {appraisalFinalizedRating?.selfRecommendation || ""}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong style={{ fontWeight: 700 }}>
                        HR Recommendation
                      </strong>
                    </td>
                    <td>{appraisalFinalizedRating?.hrRecommendation || ""}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong style={{ fontWeight: 700 }}>
                        Manager Recommendation
                      </strong>
                    </td>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: decodeHtml(
                          appraisalFinalizedRating?.managerRecommendation
                        ),
                      }}
                    ></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <h6 className="font-bold mb-0 text-primary text-xs">
            Increment Suggested :{" "}
            {appraisalFinalizedRating?.recommendedIncrement}%
          </h6>
        </div>
        <hr />
        <div>
          <div className="flex justify-between items-center">
            <h6 className="font-bold mb-1 text-primary">
              Manager's Recommendation (After Rating Finalization)
            </h6>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="react-bootstrap-table table-responsive">
              <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                <tbody>
                  <tr>
                    <td>
                      <strong style={{ fontWeight: 700 }}>
                        Manager Recommendation after Finalization
                      </strong>
                    </td>
                    <td>
                      {" "}
                      {appraisalFinalizedRating?.managerRecomendationAfterFinalization ||
                        "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong style={{ fontWeight: 700 }}>
                        Additional Remarks
                      </strong>
                    </td>
                    <td>
                      {appraisalFinalizedRating?.additionalRemarks || "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <h6 className="font-bold mb-0 text-primary text-xs">
            Increment Percentage Recommended by Manager :{" "}
            {appraisalFinalizedRating?.incrementPercentageRecommendedByManager}%
          </h6>
          <h6 className="font-bold mb-0 text-primary text-xs">
            Promotion Recommended by Manager :{" "}
            {appraisalFinalizedRating?.promotionRecommendedByManager
              ? "Yes"
              : "No"}
          </h6>
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
        </div>
      </Modal.Footer>
    </Modal>
  );
}
