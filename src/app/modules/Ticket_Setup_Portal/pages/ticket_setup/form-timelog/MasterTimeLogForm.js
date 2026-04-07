import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { TimeLogForm } from "./TimeLogForm";
import { formatDates } from "../../../../../utils/common";
import * as actions from "../../../_redux/redux-Actions";
export function MasterTimeLogForm({ id, show, onHide }) {
  // Customers Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.ticket_setup_portal.actionsLoading }),
    shallowEqual,
  );

  // if !id we should close modal
  useEffect(() => {
    if (!id) {
      onHide();
    }
  }, [id]);

  const handleSubmit = (val) => {
    const payload = {
      ...val,
      loggedDate: val?.loggedDate
        ? formatDates(val?.loggedDate, "dd-MMM-yyyy")
        : null,
    };
    dispatch(actions.ticketTimeLog(payload, onHide));
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
          Time Logging
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TimeLogForm saveForm={handleSubmit} ticketId={id} />
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onHide} className="btn btn-light ">
            Cancel
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
