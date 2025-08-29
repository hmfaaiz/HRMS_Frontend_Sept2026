

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
 
 
  const usersUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);
 
  const formUIProps  = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
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
 
    userStatusTypes,
    isuserForRead,
  } = useSelector((state) => ({
   
   
    actionsLoading: state.users.actionsLoading,
    user: state.users, // change for users to receipt
    userForEdit: state.reimbursement_configuration
    .userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.reimbursement_configuration
    .userForRead,
  }));
 

 
 
  useEffect(() => {
    
    dispatch(actions.fetchReimbursementConfig(id));
 
    // dispatch(actions.fetchReimbursementConfig(formUIProps .queryParams))
  }, [id, dispatch,show]);
 
 
  const saveForm = async (user) => {
 
   


    //    if (user.policies=="" ) {
    //   toast.error("Detail is incomplete.", {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    //   return

    // }
 
 
    if (!user.Id) {
 
 
      const finalObject = { user }
      dispatch(actions.createReimbursementConfig(user, disbaleLoading, onHide));
     
     
 
    } else {
 
     

 
      const formUpdatedFields = {
        Id: user.Id,
        subsidiaryId: user.subsidiaryId,
        payroll_groupId: user.payroll_groupId,
        cycle_typeId: user.cycle_typeId,
        policies: user.policies,
        accounts: user.accounts

      };

  
 
     await dispatch(actions.updateReimbursementConfig(formUpdatedFields, disbaleLoading, onHide));
     await dispatch(actions.fetchReimbursementConfigs(usersUIProps.queryParams));
    }
  };
 
  return (
    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      backdrop="static"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps .initUser}
        onHide={onHide}
        roles={roles}
        userStatusTypes={userStatusTypes}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        disableLoading={disbaleLoading}
        id={id}
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
 