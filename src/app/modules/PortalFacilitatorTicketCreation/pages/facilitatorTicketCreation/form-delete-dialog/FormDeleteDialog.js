import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormDeleteDialog({ id, show ,detailId,onHide}) {

  const [loading, setLoading] = useState(false);
  // Customers UI Context
  const usersUIContext = useFormUIContext();
  const usersUIProps = useMemo(() => {
    return {
      queryParams: usersUIContext.queryParams,
    };
  }, [usersUIContext]);

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
  // useEffect(() => {
  //   if (!id) {
  //     onHide();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [id]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteTimeLog = () => {
    // server request for deleting customer by id
    enableLoading();
    dispatch(actions.deleteTimeLog(id)).then(() => {
      onHide();
      // refresh list after deletion
      dispatch(actions.fetchAllFacilitatorTimeLogDetail(detailId));

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
          Delete Record
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && <label>Are you sure want to delete this record?</label>}
        {isLoading && <label>user is deactivating...</label>}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onHide} className="btn btn-light ">
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={deleteTimeLog}
            className="btn btn-danger btn-elevate"
          >
            Delete
        
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
