import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormPublishDialog({ id, show, onHide }) {
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

  const publishRecord = () => {
    // server request for deleting customer by id
    enableLoading();
    dispatch(
      actions.publishAppraisal({
        Id: id,
        yearId: usersUIProps.yearId,
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
          Publish Appraisal Record
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && <span>Are you sure want to publish this record?</span>}
        {isLoading && <span>appraisal is publishing...</span>}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              onHide();
              usersUIProps.setYearId(null);
            }}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={publishRecord}
            disabled={isLoading}
            className="btn btn-primary btn-elevate"
          >
            Publish
            {isLoading && (
              <span className="ml-3 mr-3 spinner spinner-white"></span>
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
