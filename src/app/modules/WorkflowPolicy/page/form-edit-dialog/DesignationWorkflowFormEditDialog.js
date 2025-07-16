import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import {
  createRecord,
  fetchRecordById,
  updateRecord,
} from "../../redux/formaction";
import DesignationWorkflowEditForm from "../edit-form/DesignationWorkflowEditForm";
const DesignationWorkFlowFormEditDailog = ({ show, onHide, isUserForRead }) => {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [title, setTitle] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(fetchRecordById(id, "DWP"));
    const title = id
      ? "Edit Designation Workflow Policy"
      : "New Designation Workflow Policy";
    setTitle(title);
  }, [id]);
  const formUIProps = useMemo(() => {
    return {
      initValDesig: formUIContext.initValDesig,
      queryParamsDesig: formUIContext.queryParamsDesig,
    };
  }, [formUIContext]);
  const { dataForEdit, actionsLoading } = useSelector((state) => {
    return {
      dataForEdit: state?.workflow_policy?.dataForEdit,
      actionsLoading: state?.users?.actionsLoading,
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
        await dispatch(createRecord(val, disbaleLoading, "DWP", onHide()));
      } else {
        dispatch(updateRecord(val, disbaleLoading, "DWP", onHide()));
      }
    } catch (error) {
      console.error(error);
    } finally {
      // disbaleLoading();
    }
  };
  return (
    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {!isUserForRead ? title : "View Designation Workflow Policy"}
        </Modal.Title>
      </Modal.Header>
      <DesignationWorkflowEditForm
        data={dataForEdit || formUIProps?.initValDesig}
        loading={loading}
        onHide={onHide}
        isUserForRead={isUserForRead}
        handleSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default DesignationWorkFlowFormEditDailog;
