import React, { useState, useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";

import { EmployeeSelect } from "./EmployeeSelect";

import * as actions from "../_redux/redux-Actions";

import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, show, onHide, dataForRead, status }) {
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [panelMode, setPanelMode] = useState(false);

  const FormUIContext = useFormUIContext();

  const usersUIProps = useMemo(
    () => ({ queryParams: FormUIContext.queryParams }),
    [FormUIContext]
  );

  const formUIProps = useMemo(
    () => ({
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
    }),
    [FormUIContext]
  );

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const dispatch = useDispatch();

  const { actionsLoading, dataForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.users.actionsLoading,
      dataForEdit: state.Employee_Profile_Workflow_Hrms.dataForEdit,
    }),
    shallowEqual
  );

  /* keep employeeId in sync — set from record when editing, clear when creating */
  useEffect(() => {
    if (dataForEdit?.employeeId) {
      setEmployeeId(dataForEdit.employeeId);
    } else if (!id) {
      // Add mode: dataForEdit is undefined, reset the employee selector
      setEmployeeId(null);
    }
  }, [dataForEdit, id]);

  useEffect(() => {
    dispatch(actions.fetchemployeeProfileWorkflowPortalById(id));
  }, [id, dispatch]);

  const saveForm = async (formData) => {
    if (!formData.Id) {
      await dispatch(
        actions.createemployeeProfileWorkflowPortal(formData, disableLoading, onHide)
      );
    } else {
      await dispatch(
        actions.updateemployeeProfileWorkflowPortal(formData, disableLoading, onHide)
      );
    }
    // Fetch latest data so table grid has populated fields (like employeeName)
    await dispatch(
      actions.fetchemployeeProfileWorkflowPortal(usersUIProps.queryParams)
    );
  };

  return (
    <div className="bg-white px-4 pb-4">
      <hr />

      {/* ── Employee Select row (styled like PreApproval) ── */}
      {/* <EmployeeSelect
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
        panelMode={panelMode}
        setPanelMode={setPanelMode}
        onCancel={onHide}
        isEditMode={!!id && status === "edit"}
        isViewMode={status === "read"}
        disabled={status === "read"}
      />

      <hr className="mt-3" /> */}

      {/* ── Transfer Form body ── */}
      <FormEditForm
        saveForm={saveForm}
        formData={dataForEdit || formUIProps.initUser}
        actionsLoading={actionsLoading}
        onHide={onHide}
        isdataForRead={dataForRead}
        enableLoading={enableLoading}
        loading={loading}
        employeeId={employeeId}
        panelMode={panelMode}
        status={status}
      />

    </div>
  );
}
