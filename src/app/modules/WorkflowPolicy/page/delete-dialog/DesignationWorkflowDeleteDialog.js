import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../redux/formaction";
import { useFormUIContext } from "../FormUIContext";
import { useParams } from "react-router-dom";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
export function DesignationWorkflowDeleteDialog({ show, onHide }) {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  // Customers UI Context
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParamsDesig: formUIContext.queryParamsDesig,
    };
  }, [formUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.customers.actionsLoading }),
    shallowEqual
  );

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (!id) {
      onHide();
    }
  }, [id]);

  const deleteEvent = () => {
    enableLoading();
    dispatch(actions.deleteRecord(id, disableLoading, onHide, "DWP")).then(
      () => {
        onHide();
        dispatch(actions.fetchAllRecord(formUIProps.queryParamsDesig, "DWP"));
        disableLoading();
      }
    );
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
          Delete Record
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && <label>Are you sure want to delete this record?</label>}
        {isLoading && (
          <label>Designation Workflow policy is deactivating...</label>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={deleteEvent}
            className="btn btn-danger btn-elevate"
          >
            Delete
            {loading && (
              <span className="ml-3 mr-3 spinner spinner-white"></span>
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
