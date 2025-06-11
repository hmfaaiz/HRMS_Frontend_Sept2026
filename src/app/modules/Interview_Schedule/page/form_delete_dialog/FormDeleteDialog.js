import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import * as actions from "../../_redux/formAction";
import { useFormUIContext } from "../FormUIContext";

export function FormDeleteDialog({ id, show, onHide }) {
  const [loading, setLoading] = useState(false);
  // Customers UI Context
  const usersUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: usersUIContext.queryParams,
      selectedJob: usersUIContext.selectedJob,
      selectedApplicant: usersUIContext.selectedApplicant,
    };
  }, [usersUIContext]);

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
  }, [id, formUIProps?.applicantVacancyId, formUIProps?.selectedApplicant]);

  const deleteInterview = async () => {
    enableLoading();
    await dispatch(actions.deleteInterview(id, disableLoading, onHide));
    await dispatch(
      actions.fetchInterviewList({
        ...formUIProps.queryParams,
        applicantVacancyId: formUIProps?.applicantVacancyId,
        applicantId: formUIProps?.selectedApplicant,
      })
    );
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
          Delete Record
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && <span>Are you sure want to delete this record?</span>}
        {isLoading && <span>user is deactivating...</span>}
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
            onClick={deleteInterview}
            className="btn btn-primary btn-elevate"
          >
            Delete Record
            {loading && (
              <span className="ml-3 mr-3 spinner spinner-white"></span>
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
