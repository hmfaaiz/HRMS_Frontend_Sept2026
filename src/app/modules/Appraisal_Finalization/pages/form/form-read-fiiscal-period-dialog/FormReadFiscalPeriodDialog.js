import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/formActions";
import { decodeHtml } from "../../../../../utils/common";

export function FormReadFiscalPeriodDialog({ id, show, onHide }) {
  // Customers UI Context

  // Customers Redux state
  const dispatch = useDispatch();
  const { isLoading, fiscalFinalizedRating } = useSelector(
    (state) => ({
      isLoading: state.appraisal_finalization.actionsLoading,
      fiscalFinalizedRating:
        state?.appraisal_finalization?.fiscalFinalizedRating,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!id) {
      onHide();
    } else {
      dispatch(actions.fetchAppraisalFinalizationRatingOfFiscalPeriod(id));
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
          View Ratings (Fiscal Year Wise)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="py-2">
          <div className="grid grid-cols-2 text-sm gap-1">
            <p className="mb-0">
              <span className="font-semibold">Employee Code:</span>{" "}
              {fiscalFinalizedRating?.[0]?.employeeCode}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Employee Name:</span>{" "}
              {fiscalFinalizedRating?.[0]?.employeeName}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Designation:</span>{" "}
              {fiscalFinalizedRating?.[0]?.designation}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Department:</span>{" "}
              {fiscalFinalizedRating?.[0]?.department}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Manager:</span>{" "}
              {fiscalFinalizedRating?.[0]?.managerName}{" "}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Manager Designation:</span>{" "}
              {fiscalFinalizedRating?.[0]?.managerDesignation}{" "}
            </p>
          </div>
        </div>
        <hr />
        {fiscalFinalizedRating?.length > 0 &&
          fiscalFinalizedRating?.map((el, ind) => {
            return (
              <div>
                <div className="flex justify-between items-center">
                  <h6 className="font-bold mb-0 text-primary">
                    Overall Assessment (Summary) [{el?.appraisalPeriod}]
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
                          <td>{el?.hrWeight}%</td>
                          <td className="text-center">
                            {el?.hrSelfRating} | {el?.hrSelfWeight}
                          </td>
                          <td className="text-center">
                            {el?.hrManagerRating} | {el?.hrManagerWeight}
                          </td>
                          <td className="text-center">
                            {el?.hrHRRating} | {el?.hrHRWeight}
                          </td>
                          <td className="text-center">
                            {el?.hrFinalize} | {el?.hrFinalizeWeight}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong style={{ fontWeight: 700 }}>
                              General Evaluation
                            </strong>
                          </td>
                          <td>{el?.generalWeight}%</td>
                          <td className="text-center">
                            {el?.generalSelfRating} | {el?.generalSelfWeight}
                          </td>
                          <td className="text-center">
                            {el?.generalManagerRating} |{" "}
                            {el?.generalManagerWeight}
                          </td>
                          <td className="text-center">
                            {el?.generalHRRating} | {el?.generalHRWeight}
                          </td>
                          <td className="text-center">
                            {el?.generalFinalize} | {el?.generalFinalizeWeight}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong style={{ fontWeight: 700 }}>
                              Goals & Objective
                            </strong>
                          </td>
                          <td>{el?.goalWeight}%</td>
                          <td className="text-center">
                            {el?.goalSelfRating} | {el?.goalSelfWeight}
                          </td>
                          <td className="text-center">
                            {el?.goalManagerRating} | {el?.goalManagerWeight}
                          </td>
                          <td className="text-center">
                            {el?.goalHRRating} | {el?.goalHRWeight}
                          </td>
                          <td className="text-center">
                            {el?.goalFinalize} | {el?.goalFinalizeWeight}
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
                            {el?.recommendedPoint}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
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
