// pages/Bonus_Policy/form-delete-dialog/FormDeleteDialog.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormDeleteDialog({ id, status, show, onHide }) {
  const [loading, setLoading] = useState(false);
  const bonusPolicyUIContext = useFormUIContext();
  const bonusPolicyUIProps = useMemo(() => {
    return {
      queryParams: bonusPolicyUIContext.queryParams,
    };
  }, [bonusPolicyUIContext]);

  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.bonus_policy.actionsLoading }),
    shallowEqual
  );

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  useEffect(() => {
    if (!id) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const deleteRecord = () => {
    enableLoading();
    dispatch(actions.deleteBonusPolicy(id)).then(() => {
      onHide();
      dispatch(actions.fetchBonusPolicy(bonusPolicyUIProps.queryParams));
      disableLoading();
    });
  };

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="example-modal-sizes-title-lg">
      {isLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">Delete Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && <span>Are you sure want to delete this record?</span>}
        {isLoading && <span>Bonus policy is deactivating...</span>}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onHide} className="btn btn-light btn-elevate">
            Cancel
          </button>{" "}
          <button type="button" onClick={deleteRecord} className="btn btn-danger btn-elevate">
            Delete
            {loading && <span className="ml-3 mr-3 spinner spinner-white"></span>}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}