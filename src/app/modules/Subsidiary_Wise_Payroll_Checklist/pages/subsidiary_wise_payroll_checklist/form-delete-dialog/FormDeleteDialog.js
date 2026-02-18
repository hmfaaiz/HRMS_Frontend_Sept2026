import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { useSubsidiaryPayrollUIContext } from "../FormUIContext";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
export function SubsidiaryPayrollDeleteDialog({ id, show, onHide ,subsidiaryId,
  payroll_groupId, }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { isLoading } = useSelector(
    (state) => ({
      isLoading: state.payroll_checklist?.actionsLoading || false,
    }),
    shallowEqual
  );

  const deleteRecord = () => {
  if (!subsidiaryId) return;

  setLoading(true);

  dispatch(
    actions.deletePayrollChecklistAction({
      subsidiaryId,
      payroll_groupId: payroll_groupId !== undefined ? payroll_groupId : null,
    })
  )
    .then(() => {
      setLoading(false);
      onHide();
    })
    .catch(() => setLoading(false));
};

  return (
    <Modal show={show} onHide={onHide} centered>
      {isLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title>Delete Record</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!loading && !isLoading && (
          <span>Are you sure you want to delete this record?</span>
        )}
        {(loading || isLoading) && <span>Deleting record...</span>}
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
