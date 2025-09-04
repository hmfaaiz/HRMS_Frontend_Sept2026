import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormSendEmailDialog({ id, status, show, onHide }) {

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
    (state) => ({ isLoading: state.holidays.actionsLoading }),
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
  useEffect(() => { }, [isLoading, dispatch]);

  const sendEmail = () => {
    enableLoading();
    dispatch(actions.sendHolidayEmail(id)).then(() => {
      onHide();
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
          Send Holiday Email
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && <label>Are you sure want to send holiday email?</label>}
        {isLoading && <label>sending...</label>}
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
            onClick={sendEmail}
            className="btn btn-primary btn-elevate"
            disabled={loading}
          >
            Send Email
            {loading && (
              <span className="ml-3 mr-3 spinner spinner-white"></span>
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
