import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { useSubsidiaryOnboardingUIContext } from "../FormUIContext";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function SubsidiaryOnboardingDeleteDialog({ id, status, show, onHide }) {
  const [loading, setLoading] = useState(false);

  // UI Context
  const uiContext = useSubsidiaryOnboardingUIContext();
  const uiProps = useMemo(() => ({
    queryParams: uiContext.queryParams,
  }), [uiContext.queryParams]);

  const dispatch = useDispatch();

  // Redux state
  const { isLoading } = useSelector(
    (state) => ({
      isLoading:
        state.onboarding_checklist?.actionsLoading ||
        state.onboarding_checklist?.actionsLoading ||
        false,
    }),
    shallowEqual
  );

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  // Close modal if id is null 
  useEffect(() => {
    if (!id) onHide();
  }, [id]);  // Only depend on id; onHide is a stable callback

  const deleteRecord = () => {
    if (!id) return;

    enableLoading();

    dispatch(actions.deleteSubsidiaryChecklistAction(id))
      .then(() => {
        disableLoading();
        onHide();
        // Refresh table after deletion
        dispatch(actions.fetchSubsidiaryChecklist(uiProps.queryParams));
      })
      .catch(() => {
        disableLoading();
      });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="delete-dialog-title"
      centered
    >
      {isLoading && <ModalProgressBar />}
      
      <Modal.Header closeButton>
        <Modal.Title id="delete-dialog-title">Delete Record</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!loading && !isLoading && (
          <span>Are you sure you want to delete this record?</span>
        )}
        {(loading || isLoading) && (
          <span>Deleting record...</span>
        )}
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
          onClick={deleteRecord}
          className="btn btn-danger"
          disabled={loading || isLoading}
        >
          Delete
          {(loading || isLoading) && (
            <span className="ml-2 spinner spinner-white"></span>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
}