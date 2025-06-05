import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import * as actions from "../../_redux/formAction";
import { useFormUIContext } from "../FormUIContext";

export function FormEmailDialog({ id, show, onHide }) {
  const [loading, setLoading] = useState(false);
  // Customers UI Context
  const FormUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      selectedApplicant: FormUIContext.selectedApplicant,
      applicantVacancyId: FormUIContext.applicantVacancyId,
    };
  }, [FormUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.interview_schedule.actionsLoading }),
    shallowEqual
  );

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  // if !id we should close modal
  useEffect(() => {
    if (!id) {
      onHide();
    }
  }, [id]);

  const sendEmail = async () => {
    enableLoading();
    const body = {
      applicantId: formUIProps?.selectedApplicant,
      applicantVacancyId: formUIProps?.applicantVacancyId,
      interviewId: id,
    };
    await dispatch(actions.sendInterviewEmail(body, disableLoading, onHide));
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Send Interview Email
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && <span>Are you sure want to send email?</span>}
        {isLoading && <span>Sending email...</span>}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={sendEmail}
            className="btn btn-primary btn-elevate"
          >
            Send Email
            {loading && (
              <span className="ml-3 mr-3 spinner spinner-white"></span>
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
