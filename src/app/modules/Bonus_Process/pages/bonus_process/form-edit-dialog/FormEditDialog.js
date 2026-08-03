import React, { useState, useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, userForRead }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      setIds: FormUIContext.setIds,
    };
  }, [FormUIContext]);

  const enableLoading = () => setLoading(true);
  const disbaleLoading = () => setLoading(false);

  const dispatch = useDispatch();
  const { actionsLoading, userForEdit, isuserForRead } = useSelector(
    (state) => ({
      actionsLoading: state.users.actionsLoading,
      userForEdit: state.bonus_process.userForEdit,
      isuserForRead: state.bonus_process.userForRead,
    })
  );

  useEffect(() => {
    dispatch(actions.fetchmoduledata(id));
  }, [id, dispatch]);

  const saveForm = async (data, resetForm) => {
    formUIProps.setIds("");

    if (!data.Id && data) {
  await dispatch(
    actions.createBonusProcess(data, disbaleLoading, resetForm)
  ).then(async () => {
    let values = {
      SubsidiaryId: data?.subsidiaryId,
      PayrollGroupId: data?.payroll_groupId,
      BonusTypeId: data?.bonusTypeId,
      MonthId: data?.payroll_monthId,
      revert: false,
      finalize: false,
    };
    await dispatch(actions.checkBonus_EmployeesByIds({ data: values }));
    await dispatch(actions.fetchBonusProcess(formUIProps));
  });
} else {
      const formUpdatedFields = {
        Id: data.Id,
        payroll_groupId: data.payroll_groupId,
        bonusTypeId: data.bonusTypeId,
        payroll_monthId: data.payroll_monthId,
        subsidiaryId: data.subsidiaryId,
      };

      await dispatch(
        actions.updateBonusProcess(formUpdatedFields, disbaleLoading, resetForm)
      );
      await dispatch(actions.fetchBonusProcess(formUIProps));
    }
  };

  return (
    <>
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps.initUser}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        setIds={formUIProps.setIds}
        isEdit={id ? true : false}
        formUIProps={formUIProps}
        disbaleLoading={disbaleLoading}
      />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}