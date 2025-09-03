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
import WorkflowEditForm from "../edit-form/WorkflowEditForm";
const WorkFlowFormEditDailog = ({ show, onHide, isUserForRead }) => {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [title, setTitle] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(fetchRecordById(id, "WP"));
    const title = id ? "Edit Workflow Policy" : "New Workflow Policy";
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
        await dispatch(createRecord(val, disbaleLoading, "WP" , onHide));
      } else {
        dispatch(updateRecord(val, disbaleLoading, "WP" , onHide));
      }
      // onHide();
    } catch (error) {
      console.error(error);
    } finally {
      disbaleLoading();
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
          {!isUserForRead ? title : "View Workflow Policy"}
        </Modal.Title>
      </Modal.Header>
      <WorkflowEditForm
        data={dataForEdit || formUIProps?.initVal}
        loading={loading}
        onHide={onHide}
        isUserForRead={isUserForRead}
        handleSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default WorkFlowFormEditDailog;
