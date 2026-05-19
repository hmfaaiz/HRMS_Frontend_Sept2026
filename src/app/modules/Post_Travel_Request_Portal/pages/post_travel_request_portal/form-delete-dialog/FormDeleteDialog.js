import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormDeleteDialog({ Id, show, onHide, onDeleteSuccess }) {
  const [loading, setLoading] = useState(false);

  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(
    () => ({ queryParams: formUIContext.queryParams }),
    [formUIContext],
  );

  const dispatch = useDispatch();

  const { actionsLoading } = useSelector(
    (state) => ({
      actionsLoading:
        state.post_travel_request_portal?.actionsLoading ||
        state.post_approval_travel_request?.actionsLoading ||
        false,
    }),
    shallowEqual,
  );

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  useEffect(() => {
    if (!Id) onHide();
  }, [Id, onHide]);

  const deleteRecord = () => {
    enableLoading();
    dispatch(actions.deletePostTravelRequestPortal(Id))
      .then(() => {
        disableLoading();
        onHide();
        dispatch(actions.fetchPostTravelRequestPortals(formUIProps.queryParams));
        if (onDeleteSuccess) onDeleteSuccess();
      })
      .catch((error) => {
        console.error("Error deleting record:", error);
        disableLoading();
      });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="delete-post-approval-modal"
    >
      {(actionsLoading || loading) && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title id="delete-post-approval-modal">
          Delete Post Travel Request
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!actionsLoading && !loading && (
          <label>Are you sure you want to delete this record?</label>
        )}
        {(actionsLoading || loading) && (
          <span>Deleting post travel request...</span>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          onClick={onHide}
          className="btn btn-light"
          disabled={loading || actionsLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={deleteRecord}
          className="btn btn-danger btn-elevate"
          disabled={loading || actionsLoading}
        >
          Delete
          {(loading || actionsLoading) && (
            <span className="ml-3 mr-3 spinner spinner-white"></span>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
}