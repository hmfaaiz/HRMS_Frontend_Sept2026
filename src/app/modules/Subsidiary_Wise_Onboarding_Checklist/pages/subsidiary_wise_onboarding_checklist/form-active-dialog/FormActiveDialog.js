import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useSubsidiaryOnboardingUIContext } from "../FormUIContext";

export function SubsidiaryOnboardingActiveDialog({ id, show, onHide }) {
  const [loading, setLoading] = useState(false);

  // UI Context
  const uiContext = useSubsidiaryOnboardingUIContext();
  const uiProps = useMemo(() => {
    return {
      queryParams: uiContext.queryParams,
    };
  }, [uiContext]);

  // Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({
      isLoading: state.subsidiary_wise_onboarding_checklist.actionsLoading,
    }),
    shallowEqual
  );

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  // Close modal if no id
  useEffect(() => {
    if (!id) {
      onHide();
    }
  }, [id, onHide]);

  const activateRecord = () => {
    enableLoading();
    // You'll need to create this action in your redux-Actions file
    dispatch(actions.activateSubsidiaryChecklistAction(id)).then(() => {
      onHide();
      // Refresh table after activation
      dispatch(
        actions.fetchSubsidiaryChecklist(uiProps.queryParams)
      );
      disableLoading();
    });
  };

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="active-dialog-title">
      {/* Loading Bar */}
      {isLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title id="active-dialog-title">Activate Record</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!isLoading && <label>Are you sure you want to activate this record?</label>}
        {isLoading && <label>Record is being activated...</label>}
      </Modal.Body>

      <Modal.Footer>
        <div>
          <button type="button" onClick={onHide} className="btn btn-light">
            Cancel
          </button>
          <button
            type="button"
            onClick={activateRecord}
            className="btn btn-success btn-elevate"
          >
            Activate
            {loading && (
              <span className="ml-3 mr-3 spinner spinner-white"></span>
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}