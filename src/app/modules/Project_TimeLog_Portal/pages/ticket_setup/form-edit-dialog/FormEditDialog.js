import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { FormEditForm } from "./FormEdit";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import { Modal } from "react-bootstrap";

export function FormEditDialog({ Id }) {
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();
  const { queryParams, initVal, employeeId, setId } = formUIContext || {};

  const { dataForEdit = {}, actionsLoading = false } = useSelector(
    (state) => state.project_timelog_portal || {},
    shallowEqual,
  );

  // Fetch customer by ID when editing or viewing
  useEffect(() => {
    if (Id) dispatch(actions.fetchTimeLog(Id));
  }, [Id]);

  // Save customer (create or update)
  const saveForm = async (payload, resetForm) => {
    if (!Id) {
      await dispatch(actions.createTimeLog({ ...payload, employeeId })).then(
        async () => {
          await dispatch(actions.fetchTimeLogs(queryParams));
          resetForm(initVal);
          setId("");
        },
      );
    } else {
      await dispatch(actions.updateTimeLog({ ...payload, employeeId })).then(
        async () => {
          await dispatch(actions.fetchTimeLogs(queryParams));
          resetForm(initVal);
          setId("");
        },
      );
    }
  };

  return (
    <>
      <Modal.Title className="m-0">
        {Id ? "Edit Time Log" : "Create Time Log"}
      </Modal.Title>
      <FormEditForm
        dataForEdit={Id ? dataForEdit : initVal}
        saveForm={saveForm}
        actionsLoading={actionsLoading}
        initialValues={initVal}
        setId={setId}
      />
    </>
  );
}
