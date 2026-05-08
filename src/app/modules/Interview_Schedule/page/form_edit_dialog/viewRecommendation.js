import React from "react";
import { Modal, Form } from "react-bootstrap";

export function ViewRecommendationInlineModal({
  show,
  onHide,
  data,
  statusOptions,
}) {
  const interviewer = data?.interviewer;

  if (!interviewer) return null;

  const getName = () => {
    if (!interviewer?.employee) return "N/A";
    return [
      interviewer.employee.title,
      interviewer.employee.firstName,
      interviewer.employee.middleName,
      interviewer.employee.lastName,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const statusLabel =
    statusOptions?.find(
      (s) => s.value === interviewer?.recommendedApplicantStatusId
    )?.label ||
    interviewer?.RecommendedApplicantStatus?.formName ||
    "N/A";

  return (
    <Modal size="lg" centered show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="text-black font-bold text-[1.25rem]">
          View Recommendation
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        <Form className="d-flex flex-column">
          {/* Main Content */}
          <div className="flex-1 p-4">

            {/* Fields — view only */}
            <div className="space-y-4">

              {/* Interview Remarks */}
              <div>
                <label className="form-label fw-bold">Interview Remarks</label>
                <textarea
                  className="form-control"
                  rows={4}
                  disabled
                  value={interviewer?.interview_remarks || ""}
                  readOnly
                />
                {!interviewer?.interview_remarks && (
                  <div className="text-muted small mt-1">No remarks submitted</div>
                )}
              </div>

              {/* Interview Recommendation */}
              <div>
                <label className="form-label fw-bold">
                  Interview Recommendation
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  disabled
                  value={interviewer?.interview_recommendation || ""}
                  readOnly
                />
                {!interviewer?.interview_recommendation && (
                  <div className="text-muted small mt-1">
                    No recommendation submitted
                  </div>
                )}
              </div>

              {/* Recommended Status */}
              <div>
                <label className="form-label fw-bold">
                  Recommended Applicant Status
                </label>
                <input
                  className="form-control"
                  disabled
                  value={
                    interviewer?.recommendedApplicantStatusId
                      ? statusLabel
                      : "Not selected"
                  }
                  readOnly
                />
              </div>

            </div>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <button type="button" className="btn btn-primary btn-elevate" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}