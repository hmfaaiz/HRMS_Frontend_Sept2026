import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormDeleteDialog({ id, status, show, onHide }) {
  const [loading, setLoading] = useState(false);

  const usersUIContext = useFormUIContext();
  const usersUIProps = useMemo(() => {
    return {
      queryParams: usersUIContext.queryParams,
    };
  }, [usersUIContext]);

  const dispatch = useDispatch();

  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.interview_questionnaire.actionsLoading }),
    shallowEqual
  );

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  useEffect(() => {
    if (!id) {
      onHide();
    }
  }, [id]);

  useEffect(() => {}, [isLoading, dispatch]);

  const deleteInterviewQuestionnaire = () => {
    enableLoading();
    dispatch(actions.deleteInterviewQuestionnaire(id)).then(() => {
      onHide();
      dispatch(actions.fetchInterviewQuestionnaires(usersUIProps.queryParams));
      disableLoading();
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {isLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Delete Record
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!isLoading && (
          <label>Are you sure you want to delete this record?</label>
        )}
        {isLoading && <label>Record is being deleted...</label>}
      </Modal.Body>

      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={deleteInterviewQuestionnaire}
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