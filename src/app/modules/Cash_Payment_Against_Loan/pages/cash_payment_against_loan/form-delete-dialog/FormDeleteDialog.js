import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormDeleteDialog({ id, show, onHide }) {
  const [loading, setLoading] = useState(false);

  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(
    () => ({
      queryParams: formUIContext.queryParams,
      employeeId:  formUIContext.employeeId,
      resetAll:    formUIContext.resetAll,
    }),
    [formUIContext]
  );

  const dispatch = useDispatch();

  const userForEdit = useSelector(
    (state) => state.cash_payment_against_loan?.userForEdit ?? null
  );

  const actionsLoading = useSelector(
    (state) => state.cash_payment_against_loan?.actionsLoading ?? false
  );

  useEffect(() => {
    if (!id) onHide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const deleteRecord = () => {
    setLoading(true);

    const employeeId = userForEdit?.employeeId || formUIProps.employeeId || null;
    const loanTypeId = userForEdit?.loan_typeId || null;

    dispatch(actions.deleteLoanCashPayment(id)).then(() => {
      // Re-fetch outstanding balance to reflect the reversal
      if (employeeId && loanTypeId) {
        dispatch(actions.fetchLoanOutstanding(employeeId, loanTypeId));
      }

      if (employeeId) {
        dispatch(
          actions.fetchLoanCashPayments({
            ...formUIProps.queryParams,
            employeeId,
          })
        );
      }

      dispatch(actions.clearUserForEdit());
      setLoading(false);
      onHide();
    });
  };

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="delete-modal-title" centered>
      {actionsLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title id="delete-modal-title">Delete Record</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!actionsLoading && <span>Are you sure you want to delete this payment record?</span>}
        {actionsLoading  && <span>Deleting record...</span>}
      </Modal.Body>

      <Modal.Footer>
        <button type="button" onClick={onHide} className="btn btn-light btn-elevate">
          Cancel
        </button>
        <button
          type="button"
          onClick={deleteRecord}
          className="btn btn-danger btn-elevate"
          disabled={loading}
        >
          Delete Record
          {loading && <span className="ml-3 mr-3 spinner spinner-white" />}
        </button>
      </Modal.Footer>
    </Modal>
  );
}