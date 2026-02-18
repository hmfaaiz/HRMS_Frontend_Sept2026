import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useSubsidiaryPayrollUIContext } from "../FormUIContext";

export function SubsidiaryPayrollActiveDialog({ id, show, onHide }) {
  const [loading, setLoading] = useState(false);

  // UI Context
  const uiContext = useSubsidiaryPayrollUIContext();
  const uiProps = useMemo(() => {
    return {
      queryParams: uiContext.queryParams,
    };
  }, [uiContext]);

  // Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({
      isLoading:
        state.subsidiary_wise_payroll_checklist.actionsLoading,
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

    dispatch(
      actions.activateSubsidiaryPayrollChecklistAction(id)
    ).then(() => {
      onHide();

      // Refresh table
      dispatch(
        actions.fetchSubsidiaryPayrollChecklist(
          uiProps.queryParams
        )
      );

      disableLoading();
    });
  };

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="active-dialog-title">
      {isLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title id="active-dialog-title">
          Activate Payroll Checklist
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!isLoading && (
          <label>
            Are you sure you want to activate this payroll
            checklist?
          </label>
        )}
        {isLoading && (
          <label>Payroll checklist is being activated...</label>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          onClick={onHide}
          className="btn btn-light"
        >
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
      </Modal.Footer>
    </Modal>
  );
}
