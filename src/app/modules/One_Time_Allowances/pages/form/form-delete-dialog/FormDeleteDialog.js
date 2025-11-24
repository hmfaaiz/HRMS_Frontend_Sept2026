import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/formActions";
import { useFromUIContext } from "../FormUIContext";

export function BankDeleteDialog({ id, status, show, onHide }) {
  const [loading, setLoading] = useState(false);
  // Customers UI Context
  const formUIContext = useFromUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
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

  // if !id we should close modal
  useEffect(() => {
    if (!id) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteRecord = () => {
    enableLoading();
    dispatch(actions.deleteOneTimeAllowance(id)).then(() => {
      onHide();
      dispatch(actions.fetchAllOneTimeAllowance(formUIProps.queryParams));
      disableLoading();
    });
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
          Record Deletion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && <label>Are you sure to delete this record?</label>}
        {isLoading && <label>record is deleting...</label>}
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
            onClick={deleteRecord}
            className="btn btn-danger"
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
