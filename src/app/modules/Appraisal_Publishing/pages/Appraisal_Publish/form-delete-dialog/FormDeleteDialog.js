import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormDeleteDialog({ id, show, onHide }) {
  const [loading, setLoading] = useState(false);
  // Customers UI Context
  const usersUIContext = useFormUIContext();
  const usersUIProps = useMemo(() => {
    return {
      queryParams: usersUIContext.queryParams,
      yearId: usersUIContext.yearId,
      setYearId: usersUIContext.setYearId,
      appraisalCategoryId: usersUIContext.appraisalCategoryId,
      setAppraisalCategoryId: usersUIContext.setAppraisalCategoryId,
    };
  }, [usersUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.appraisal_publish.actionsLoading }),
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

  const deleteRecord = () => {
    // server request for deleting customer by id
    enableLoading();
    dispatch(
      actions.deleteAppraisalPublish({
        id,
        yearId: usersUIProps?.yearId,
        appraisalCategoryId: usersUIProps?.appraisalCategoryId,
      })
    ).then(() => {
      onHide();
      // refresh list after deletion
      usersUIProps.setYearId(null);
      usersUIProps.setAppraisalCategoryId(null);
      dispatch(actions.fetchAppraisalPublish(usersUIProps.queryParams));
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
        {!isLoading && <span>Are you sure want to delete this record?</span>}
        {isLoading && <span>user is deactivating...</span>}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={() => {
              onHide();
              usersUIProps.setYearId(null);
              usersUIProps?.setAppraisalCategoryId(null);
            }}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={deleteRecord}
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
