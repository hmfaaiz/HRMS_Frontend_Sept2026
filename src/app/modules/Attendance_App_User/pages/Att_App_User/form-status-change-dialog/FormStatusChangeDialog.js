import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormStatusChangeDialog({ id, show, onHide }) {
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
  const { isLoading, userForEdit } = useSelector(
    (state) => ({
      isLoading: state.att_app_user.actionsLoading,
      userForEdit: state.att_app_user.userForEdit,
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
    } else {
      dispatch(actions.fetchAttAppUserById(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateRecord = () => {
    // server request for deleting customer by id
    enableLoading();
    dispatch(actions.updateAttAppUser(id , disableLoading , onHide)).then(() => {
      onHide();
      // refresh list after deletion
      dispatch(actions.fetchAttAppUser(usersUIProps.queryParams));
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
          {!userForEdit?.deactiveFlag ? "De Active User" : "Active User"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>
            Are you sure want to{" "}
            {!userForEdit?.deactiveFlag ? "de activate" : "activate"} this user?
          </span>
        )}
        {isLoading && (
          <span>
            user is {!userForEdit?.deactiveFlag ? "deactivating" : "activating"}
            ...
          </span>
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
            onClick={updateRecord}
            className={
              !userForEdit?.deactiveFlag
                ? "btn btn-danger btn-elevate"
                : "btn btn-primary btn-elevate"
            }
          >
            {!userForEdit?.deactiveFlag ? "De Active" : "Active"}
            {loading && (
              <span className="ml-3 mr-3 spinner spinner-white"></span>
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
