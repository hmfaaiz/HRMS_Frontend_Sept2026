import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { RosterRequestFormEditForm } from "./RosterRequestFormEditForm";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext, initUser } from "../FormUIContext";

export function FormEditDialog({ id, employeeId }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => ({
    ids:         FormUIContext.ids,
    setIds:      FormUIContext.setIds,
    initUser:    FormUIContext.initUser,
    queryParams: FormUIContext.queryParams,
    employeeId:  FormUIContext.employeeId,
  }), [FormUIContext]);

  const dispatch = useDispatch();

  const { userForEdit } = useSelector((state) => ({
    userForEdit: state.attendance_roster_request.userForEdit,
  }), shallowEqual);

  useEffect(() => {
    dispatch(actions.fetchEditRecord(id));
  }, [id, dispatch]);

  const enableLoading  = () => setLoading(true);
  const disbaleLoading = () => setLoading(false);

  const saveForm = async (values, resetForm) => {
    enableLoading();
    dispatch(
      actions.saveRecord(
        values,
        id,
        disbaleLoading,
        () => {
          resetForm();
          formUIProps.setIds("");
        },
        { ...formUIProps.queryParams, employeeId: formUIProps.employeeId }
      )
    );
  };

  return (
    <div className="px-3 py-2 w-full bg-white rounded-lg">
      <RosterRequestFormEditForm
        saveForm={saveForm}
        user={userForEdit || initUser}
        enableLoading={enableLoading}
        disbaleLoading={disbaleLoading}
        loading={loading}
        setIds={formUIProps.setIds}
        isEdit={!!id}
        employeeId={employeeId}
      />
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}