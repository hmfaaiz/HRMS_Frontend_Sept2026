import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../redux/reduxaction";
import { useFormUIContext } from "../../FormUIContext";
import { useParams } from "react-router-dom";
export function CompanyDeleteDialog({ show, onHide }) {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  // Customers UI Context
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
    };
  }, [formUIContext]);

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

  useEffect(() => {
    if (!id) {
      onHide();
    }
  }, [id]);

  const deleteBank = () => {
    enableLoading();
    dispatch(actions.deleteRecord(id, disableLoading, onHide)).then(() => {
      onHide();
      dispatch(actions.fetchAllRecord(formUIProps.queryParams));
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
        {isLoading && <label>company is deactivating...</label>}
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
            onClick={deleteBank}
            className="btn btn-danger"
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
