import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecordById,
  createRecord,
  updateRecord,
} from "../../../redux/reduxaction";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { EditForm } from "../edit-form/EditForm";
import { useFormUIContext } from "../../FormUIContext";
export const CompanyEditDialog = ({ show, onHide, isUserForRead }) => {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [title, setTitle] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(fetchRecordById(id));
    const title = id ? "Edit Company" : "New Company";
    setTitle(title);
  }, [id]);
  const formUIProps = useMemo(() => {
    return {
      initVal: formUIContext.initVal,
      queryParams: formUIContext.queryParams,
    };
  }, [formUIContext]);
  const { dataForEdit, actionsLoading } = useSelector((state) => {
    return {
      dataForEdit: state.company.dataForEdit,
      actionsLoading: state.users.actionsLoading,
    };
  }, []);

  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };
  const handleSubmit = async (val) => {
    try {
      enableLoading();
      if (!id) {
        await dispatch(createRecord(val, disbaleLoading));
      } else {
        dispatch(updateRecord(val, disbaleLoading));
      }
      onHide();
    } catch (error) {
      console.error(error);
    } finally {
      disbaleLoading();
    }
  };
  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {!isUserForRead ? title : "View Company"}
        </Modal.Title>
      </Modal.Header>
      <EditForm
        data={dataForEdit || formUIProps?.initVal}
        enableLoading={enableLoading}
        loading={loading}
        actionsLoading={actionsLoading}
        onHide={onHide}
        isUserForRead={isUserForRead}
        handleSubmit={handleSubmit}
      />
    </Modal>
  );
};
