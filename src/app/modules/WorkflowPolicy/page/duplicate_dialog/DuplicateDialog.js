import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../redux/formaction";
import { useFormUIContext } from "../FormUIContext";
import { useParams } from "react-router-dom";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
export function DuplicateDialog({ show, onHide }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [duplicateDetail, setDuplicateDetail] = useState("");
  // Customers UI Context
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
    };
  }, [formUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { isLoading, currentState } = useSelector(
    (state) => ({
      isLoading: state.customers.actionsLoading,
      currentState: state?.workflow_policy,
    }),
    shallowEqual
  );

  const { entities } = currentState;

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (!id) {
      onHide();
    } else {
      const currentRecord = entities?.find((el) => el.Id == id);
      setDuplicateDetail(
        currentRecord
          ? `Duplicate Role: ${currentRecord?.designation?.formName} of ${currentRecord?.workflowType?.formName}`
          : ""
      );
    }
  }, [id, currentState]);

  const handleClick = () => {
    enableLoading();
    dispatch(
      actions.createMultipleRecord(
        {
          id: id,
          designationsIds: [290, 291],
        },
        disableLoading,
        "DWP"
      )
    ).then(() => {
      onHide();
      dispatch(actions.fetchAllRecord(formUIProps.queryParams, "DWP"));
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
          Duplicate Record
          <h6>{duplicateDetail}</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && <span>Are you sure want to delete this record?</span>}
        {isLoading && <span>Workflow policy is deactivating...</span>}
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
            onClick={handleClick}
            className="btn btn-primary btn-elevate"
          >
            Save
            {loading && (
              <span className="ml-3 mr-3 spinner spinner-white"></span>
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
