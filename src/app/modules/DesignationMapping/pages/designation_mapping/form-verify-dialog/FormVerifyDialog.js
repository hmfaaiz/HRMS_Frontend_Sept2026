import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormVerifyDialog({ id, status, show, onHide }) {
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
  const { actionsLoading, userForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.email_config.actionsLoading,
      userForEdit: state.email_config.userForEdit,
    }),
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
    dispatch(actions.fetchEmailConfig(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleVerify = () => {
    // server request for deleting customer by id
    enableLoading();
    dispatch(actions.verifyEmailConfig(id)).then(() => {
      onHide();
      // refresh list after verification
      dispatch(actions.fetchEmailConfigs(usersUIProps.queryParams));

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
      {actionsLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Verify Email Configuration
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!actionsLoading && (
          <label>
            {" "}
            This process will send a verification email to{" "}
            <b>"{userForEdit?.test_email}"</b> defined in configuration.
          </label>
        )}
        {!actionsLoading && (
          <label>Are you sure want to verify this record?</label>
        )}
        {actionsLoading && <label>Email configuration is verifying...</label>}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onHide} className="btn btn-light ">
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={handleVerify}
            disabled={actionsLoading}
            className="btn btn-primary btn-elevate"
          >
            Verify
            {loading && (
              <span className="ml-3 mr-3 spinner spinner-white"></span>
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
