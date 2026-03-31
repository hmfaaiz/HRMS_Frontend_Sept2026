import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { fetchAllFacilitatorDetail } from "../../../../FacilitatorTicketCreation/_redux/redux-Actions";
import { DetailTable } from "../form-table/DetailTable";

export function DetailData({ detailId, show, onHide }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.facilitator_ticket_creation?.listLoading }),
    shallowEqual
  );

  useEffect(() => {
    if (!detailId) {
      onHide();
      return;
    }
    setLoading(true);
    dispatch(fetchAllFacilitatorDetail(detailId)).then(() => setLoading(false));
  }, [detailId]);

  return (
    <Modal
      show={show}
      size="xl"
      onHide={onHide}
      aria-labelledby="task-assignment-detail-modal"
    >
      {(loading || isLoading) && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="task-assignment-detail-modal">
          Ticket Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DetailTable />
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onHide} className="btn btn-light">
            Cancel
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}