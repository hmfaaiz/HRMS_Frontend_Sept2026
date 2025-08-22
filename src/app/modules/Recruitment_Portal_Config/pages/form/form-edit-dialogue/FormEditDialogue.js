import React from "react";
import MasterEditForm from "./MasterEditForm";
import { shallowEqual, useSelector, useDispatch } from "react-redux";

const FormEditDialogue = () => {
  const dispatch = useDispatch();
  /// get data and loading from redux
  const { data, loading , companyId } = useSelector(
    (state) => ({
      data: state.recruitment_portal_config?.data,
      loading: state.recruitment_portal_config?.loading,
      companyId: state.auth?.user?.companyId,
    }),
    shallowEqual
  );
  return (
    <>
      <MasterEditForm
        initialValues={data}
        loading={loading}
        dispatch={dispatch}
        companyId={companyId}
      />
    </>
  );
};
export default FormEditDialogue;
