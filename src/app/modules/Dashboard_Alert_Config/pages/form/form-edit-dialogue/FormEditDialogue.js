import React from "react";
import MasterEditForm from "./MasterEditForm";
import { shallowEqual, useSelector, useDispatch } from "react-redux";

const FormEditDialogue = () => {
  const dispatch = useDispatch();
  /// get data and loading from redux
  const { data, loading } = useSelector(
    (state) => ({
      data: state.dashboard_alert_config?.data,
      loading: state.dashboard_alert_config?.loading,
    }),
    shallowEqual
  );
  return (
    <>
      <MasterEditForm
        initialValues={data}
        loading={loading}
        dispatch={dispatch}
      />
    </>
  );
};
export default FormEditDialogue;
