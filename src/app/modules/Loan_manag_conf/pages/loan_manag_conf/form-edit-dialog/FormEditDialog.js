

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

 
    userStatusTypes,
    isuserForRead,
  } = useSelector((state) => ({
   
   
    actionsLoading: state.users.actionsLoading,
    user: state.users, // change for users to receipt
    userForEdit: state.loan_management_configuration
    .userForEdit,
  
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.loan_management_configuration
    .userForRead,
  }));
 

 
 
  useEffect(() => {
   
    dispatch(actions.fetchLoanManagConfig(id));
 
    // dispatch(actions.fetchLoanManagConfig(formUIProps .queryParams))
  }, [id, dispatch,show]);
 
 
  const saveForm = async (user) => {


       if (user.details=="") {
      toast.error("Detail is incomplete.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return

    }
 
 
    if (!user.Id) {
 
 
      const finalObject = { user }
      dispatch(actions.createLoanManagConfig(user, disbaleLoading, onHide));
     
     
 
    } else {
 
     
 
 
      const formUpdatedFields = {
        Id: user.Id,
        subsidiaryId: user.subsidiaryId,
        accountId: user.accountId,
    
        emp_loan_account: user.emp_loan_account,
        installment_deduction_percentage: user.installment_deduction_percentage,
        installment_deduction_basis_type: user.installment_deduction_basis_type,
        details: user.details
        // loan_type: user.loan_type,
        // max_loan_amount: user.max_loan_amount,
        // salary_count: user.salary_count,
      };

  
 
     await dispatch(actions.updateLoanManagConfig(formUpdatedFields, disbaleLoading, onHide));
     await dispatch(actions.fetchLoanManagConfigs(usersUIProps.queryParams));
    }
  };
 
  return (
    <Modal
      size="lg"
      // style={{ maxWidth: '90%' }} // Customize width here
    dialogClassName="modal-75vw"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
        backdrop="static"
    >
      <FormEditDialogHeader   id={id} isUserForRead={userForRead} />
      
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps .initUser}
        onHide={onHide}

        userStatusTypes={userStatusTypes}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        disableLoading={disbaleLoading}
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
 