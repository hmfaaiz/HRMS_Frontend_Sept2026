import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";


export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "FormEditDialog";
  const FormUIContext = useFormUIContext();


  // const usersUIProps = useMemo(() => {
  //   return {
  //     queryParams: FormUIContext.queryParams,
  //   };
  // }, [FormUIContext]);

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      fetchSubsidiaryId: FormUIContext.fetchSubsidiaryId,
      fetchTaxSetupId: FormUIContext.fetchTaxSetupId,
    };
  }, [FormUIContext]);

  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const {
    actionsLoading,
    user,
    userForEdit,
    roles,
    centers,
    userStatusTypes,
    isuserForRead,
  } = useSelector((state) => ({


    actionsLoading: state.users.actionsLoading,
    user: state.users, // change for users to receipt
    userForEdit: state.tax_slab.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.tax_slab.userForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchIncomeTaxSlab(id));

    // dispatch(actions.fetchIncomeTaxSlab(formUIProps .queryParams))
  }, [id, dispatch]);


  const saveForm = async (user) => {
   

    if (!id) {

      user.subsidiaryId = formUIProps?.fetchSubsidiaryId
      user.taxSetupId = (formUIProps?.fetchTaxSetupId?.isActive) ? formUIProps?.fetchTaxSetupId?.value : null
  
      const finalObject = { user }
      await dispatch(actions.createIncomeTaxSlab(user, disbaleLoading, onHide));

      await dispatch(actions?.fetchIncomeTaxSlabs(formUIProps?.queryParams));

    } else {




      const formUpdatedFields = {
        Id: user?.Id,
        from_amount: user?.from_amount,
        to_amount: user?.to_amount,
        percentage: user?.percentage,
        fixed_amount: user?.fixed_amount,
        subsidiaryId: user?.subsidiaryId,
        taxSetupId: user?.taxSetupId
      };



      await dispatch(actions?.updateIncomeTaxSlab(formUpdatedFields, disbaleLoading, onHide));
      await dispatch(actions?.fetchIncomeTaxSlabs(formUIProps?.queryParams));

    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
  
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
        userStatusTypes={userStatusTypes}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Modal>
  );
}
