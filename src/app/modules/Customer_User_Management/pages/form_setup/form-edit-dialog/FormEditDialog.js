import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { FormEditForm } from "./FormEdit";
import { FormEditDialogHeader } from "./FormEditDialogHeader";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();
  const { queryParams, initVal, customerId } = formUIContext || {};

  const [loading, setLoading] = useState(false);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const { dataForEdit = {}, actionsLoading = false } = useSelector(
    (state) => state.customer_user_management || {},
    shallowEqual,
  );

  // Fetch customer by ID when editing or viewing
  useEffect(() => {
    if (id) dispatch(actions.fetchCustomerUserMgt(id));
  }, [id, dispatch]);

  // Save customer (create or update)
  const saveForm = async (payload) => {
    enableLoading();
    if (!id) {
      await dispatch(
        actions.createCustomerUserMgt(
          { ...payload, customerId },
          disableLoading,
          onHide,
        ),
      );
      if (queryParams)
        await dispatch(
          actions.fetchCustomerUserMgts({
            ...queryParams,
            filter: { ...queryParams.filter, customerId },
          }),
        );
    } else {
      await dispatch(
        actions.updateCustomerUserMgt(payload, disableLoading, onHide),
      );
      if (queryParams)
        await dispatch(
          actions.fetchCustomerUserMgts({
            ...queryParams,
            filter: { ...queryParams.filter, customerId },
          }),
        );
    }
  };

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />

      <FormEditForm
        dataForEdit={id ? dataForEdit : initVal}
        id={id}
        saveForm={saveForm}
        actionsLoading={actionsLoading}
        onHide={onHide}
        isUserForRead={userForRead} // disables fields in view mode
        enableLoading={enableLoading}
        loading={loading}
      />
    </Modal>
  );
}
