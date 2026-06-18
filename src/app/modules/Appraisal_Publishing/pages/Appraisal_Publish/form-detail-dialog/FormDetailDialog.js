import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormDetailDialog({ id, show, onHide }) {
  const usersUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const usersUIProps = useMemo(() => {
    return {
      setYearId: usersUIContext.setYearId,
      yearId: usersUIContext.yearId,
      appraisalCategoryId: usersUIContext.appraisalCategoryId,
      setAppraisalCategoryId: usersUIContext.setAppraisalCategoryId,
    };
  }, [usersUIContext]);

  // Redux state
  const { isLoading, question } = useSelector(
    (state) => ({
      isLoading: state.appraisal_publish.actionsLoading,
      question: state.appraisal_publish.appraisal_detail?.question || [],
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (!id) {
      onHide();
    } else {
      dispatch(
        actions.viewAppraisalDetail({
          Id: id,
          yearId: usersUIProps?.yearId,
          appraisalCategoryId: usersUIProps?.appraisalCategoryId,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Group questions by type (HR / General / Goal)
  const groupedData = useMemo(() => {
    const groups = {};
    question.forEach((q) => {
      if (!groups[q.type]) groups[q.type] = [];
      groups[q.type].push(q);
    });
    return groups;
  }, [question]);

  return (
    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      scrollable
    >
      {isLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Appraisal Detail
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="max-h-[70vh] overflow-auto scrollbar-fancy">
          {Object.keys(groupedData).length === 0 ? (
            <div className="text-center text-muted py-10">
              No questions found
            </div>
          ) : (
            Object.keys(groupedData).map((type, idx) => (
              <div key={idx} className="mb-4">
                <div className=" flex gap-3">
                  <h5
                    className={`text-primary mb-1 fw-bold border-bottom pb-1`}
                  >
                    {type}
                  </h5>
                  <span
                    className={`text-sm font-bold ${
                      groupedData[type]?.reduce(
                        (prev, curr) => prev + parseFloat(curr.weightage || 0),
                        0,
                      ) === 100
                        ? "text-approved"
                        : "text-rejected"
                    }`}
                  >
                    : Total Weightage:{" "}
                    {groupedData[type]?.reduce(
                      (prev, curr) => prev + parseFloat(curr.weightage || 0),
                      0,
                    )}
                  </span>
                </div>

                {groupedData[type].map((q, i) => (
                  <div
                    key={q.questionId + "_" + i}
                    className="card shadow-sm mb-1 border-light"
                  >
                    <div className="p-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="fw-bold mb-0 text-black">
                          {q.questionName}
                        </h6>
                        {q?.weightage ? (
                          <span className="text-xs font-bold ms-1">
                            {" "}
                            (Weightage : {q?.weightage})
                          </span>
                        ) : null}
                        <span className="badge badge-light-info text-uppercase">
                          {q.CompetencyName}
                        </span>
                      </div>
                      <p
                        className="text-black mb-1 text-xs"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {q.questionDescription}
                      </p>
                      <div>
                        <small
                          className={`fw-bold ${
                            q.isCommentRequired ? "text-danger" : "text-black"
                          }`}
                        >
                          Comment Required: {q.isCommentRequired ? "Yes" : "No"}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={() => {
              onHide();
              usersUIProps.setYearId(null);
              usersUIProps?.setAppraisalCategoryId(null);
            }}
            className="btn btn-primary btn-elevate"
          >
            Ok
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
