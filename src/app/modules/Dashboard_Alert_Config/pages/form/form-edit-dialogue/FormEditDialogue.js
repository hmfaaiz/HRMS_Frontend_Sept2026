import React from "react";
import MasterEditForm from "./MasterEditForm";
import { shallowEqual, useSelector, useDispatch } from "react-redux";

const FormEditDialogue = () => {
  const dispatch = useDispatch();
  /// get data and loading from redux
  const { data, loading , moduleRights } = useSelector(
    (state) => ({
      data: state.dashboard_alert_config?.data,
      loading: state.dashboard_alert_config?.loading,
      moduleRights: state.dashboard?.moduleRights,
    }),
    shallowEqual
  );
  return (
    <>
      <MasterEditForm
        initialValues={data}
        loading={loading}
        dispatch={dispatch}
        moduleRights={moduleRights}
      />
    </>
  );
};
export default FormEditDialogue;
