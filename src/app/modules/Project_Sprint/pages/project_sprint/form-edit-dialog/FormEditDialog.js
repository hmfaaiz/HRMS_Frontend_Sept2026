import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { FormEditForm } from "./FormEdit";
import { FormEditDialogHeader } from "./FormEditDialogHeader";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import { toast } from "react-toastify";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();
  const { queryParams, initVal } = formUIContext || {};

  const [loading, setLoading] = useState(false);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const { dataForEdit = {}, actionsLoading = false } = useSelector(
    (state) => state.project_sprint || {},
    shallowEqual,
  );

  // Fetch customer by ID when editing or viewing
  useEffect(() => {
    if (id) dispatch(actions.fetchProjectSprint(id));
  }, [id, dispatch]);

  // Save customer (create or update)
  const saveForm = async (payload) => {
    enableLoading();
    if (!id) {
      if (!queryParams?.filter?.projectId) {
        toast.error("Project is not selected");
        onHide();
        return;
      }
      await dispatch(
        actions.createProjectSprint(
          { ...payload, projectId: queryParams?.filter?.projectId },
          disableLoading,
          onHide,
        ),
      );
    } else {
      await dispatch(
        actions.updateProjectSprint(payload, disableLoading, onHide),
      );
    }
  };

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />

      <FormEditForm
        dataForEdit={id ? dataForEdit : initVal}
        saveForm={saveForm}
        id={id}
        projectId={queryParams?.filter?.projectId}
        actionsLoading={actionsLoading}
        onHide={onHide}
        isUserForRead={userForRead} // disables fields in view mode
        enableLoading={enableLoading}
        loading={loading}
      />
    </Modal>
  );
}
