import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { useCustomerUIContext } from "../FormUIContext";

export function CustomerDeleteDialog({ id, show, onHide }) {
  const dispatch = useDispatch();
  const customerUIContext = useCustomerUIContext();

  const customerUIProps = useMemo(() => ({
    queryParams: customerUIContext.queryParams,
  }), [customerUIContext]);

  const { isLoading } = useSelector(
    (state) => ({
      isLoading: state.customer_setup?.actionsLoading,
    }),
    shallowEqual
  );

  const deleteCustomer = () => {
    dispatch(actions.deleteCustomer(id)).then(() => {
      onHide();
      dispatch(actions.fetchCustomers(customerUIProps.queryParams));
    });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Customer Delete</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading && (
          <div className="overlay-layer bg-transparent">
            <div className="spinner spinner-lg spinner-success" />
          </div>
        )}
        <span>Are you sure you want to permanently delete this customer?</span>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          onClick={onHide}
          className="btn btn-light btn-elevate"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={deleteCustomer}
          className="btn btn-danger btn-elevate"
          disabled={isLoading}
        >
          Delete
          {isLoading && <span className="ml-3 spinner spinner-white" />}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
