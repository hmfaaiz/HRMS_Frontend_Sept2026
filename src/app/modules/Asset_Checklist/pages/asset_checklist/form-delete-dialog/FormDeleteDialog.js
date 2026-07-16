import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import { format } from "date-fns";

export function FormDeleteDialog({ assetCategoryId,
  assetRegisterId,
  dateOfInspection, status, show, onHide }) {

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
    (state) => ({ isLoading: state.customers.actionsLoading }),
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
    if (
      !assetCategoryId ||
      !assetRegisterId ||
      !dateOfInspection
    ) {
      onHide();
    }
  }, [assetCategoryId, assetRegisterId, dateOfInspection]);

  // looking for loading/dispatch
  useEffect(() => { }, [isLoading, dispatch]);

  const deleteAssetInspectionList = () => {
    // server request for deleting customer by id
    enableLoading();
    dispatch(actions.deleteAssetInspectionList({
      asset_categoryId: assetCategoryId,
      asset_registerId: assetRegisterId,
      date_of_inspection: format(
        new Date(dateOfInspection),
        "yyyy-MM-dd"
      )
    })).then(() => {
      onHide();
      // refresh list after deletion
      dispatch(actions.fetchAssetInspectionList(usersUIProps.queryParams));

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
        {isLoading && <label>user is deactivating...</label>}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light "
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={deleteAssetInspectionList}
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
