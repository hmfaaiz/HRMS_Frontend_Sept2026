import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useEmployeeOnboardingUIContext } from "../FormUIContext";

export function FormDeleteDialog({ Id, show, onHide }) {
  const [loading, setLoading] = useState(false);

  // UI Context
  const formUIContext = useEmployeeOnboardingUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
    };
  }, [formUIContext]);

  // Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.employee_onboarding_checklist?.actionsLoading || false }),
    shallowEqual
  );

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  // Close modal if no ID
  useEffect(() => {
    if (!Id) {
      onHide();
    }
  }, [Id, onHide]);

  const deleteEmployeeChecklist = () => {
    enableLoading();
    dispatch(actions.deleteEmployeeChecklist(Id))
      .then(() => {
        disableLoading();
        onHide();
        // Refresh list after deletion
        dispatch(actions.fetchEmployeeOnboardingChecklist(formUIProps.queryParams));
      })
      .catch((error) => {
        console.error("Error deleting checklist:", error);
        disableLoading();
      });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="delete-checklist-modal"
    >
      {isLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title id="delete-checklist-modal">
          Delete Employee Onboarding Checklist
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!isLoading && !loading && (
  <label>Are you sure want to delete this record?</label>
)}

        {(isLoading || loading) && <span>Deleting employee onboarding checklist...</span>}
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          onClick={onHide}
          className="btn btn-light"
          disabled={loading || isLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={deleteEmployeeChecklist}
          className="btn btn-danger btn-elevate"
          disabled={loading || isLoading}
        >
          Delete
          {(loading || isLoading) && (
            <span className="ml-3 mr-3 spinner spinner-white"></span>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
