import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { useCustomerUIContext } from "../FormUIContext";

export function CustomerActivateDialog({ id, isActive, show, onHide }) {
  const dispatch = useDispatch();
  const customerUIContext = useCustomerUIContext();

  const customerUIProps = useMemo(() => {
    return {
      queryParams: customerUIContext.queryParams,
    };
  }, [customerUIContext]);

  const { isLoading } = useSelector(
    (state) => ({
      isLoading: state.customer_setup?.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (!id) {
      onHide();
    }
  }, [id, onHide]);

  const activateCustomer = () => {
    dispatch(actions.activateCustomer(id)).then(() => {
      onHide();
      dispatch(actions.fetchCustomers(customerUIProps.queryParams));
    });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Activate Customer</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading && (
          <div className="overlay-layer bg-transparent">
            <div className="spinner spinner-lg spinner-success" />
          </div>
        )}
        <span>Are you sure you want to activate this customer?</span>
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
          onClick={activateCustomer}
          className="btn btn-success btn-elevate"
          disabled={isLoading}
        >
          Activate
          {isLoading && <span className="ml-3 spinner spinner-white" />}
        </button>
      </Modal.Footer>
    </Modal>
  );
}