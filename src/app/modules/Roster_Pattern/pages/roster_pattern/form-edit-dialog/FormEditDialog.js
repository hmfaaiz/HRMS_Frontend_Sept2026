import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";


export function FormEditDialog({ id, show, onHide, dataForRead }) {
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
    dataForEdit,
    roles,
    centers,
    userStatusTypes,
    isdataForRead,
  } = useSelector((state) => {
    console.log("state222", state); // Log the state for debugging purposes
  
    return {
      actionsLoading: state.users.actionsLoading,
      user: state.users, // You said 'change for users to receipt', so you can update accordingly
      dataForEdit: state.roster_pattern.dataForEdit,
      roles: state.users.roles,
      userStatusTypes: state.users.userStatusTypes,
      isdataForRead: state.roster_pattern.dataForRead,
    };
  }, shallowEqual);
  



  useEffect(() => {
    dispatch(actions.fetchAccrueGratuityConfig(id));

    // dispatch(actions.fetchAccrueGratuityConfig(formUIProps .queryParams))
  }, [id, dispatch,show]);


  const saveForm = async (data) => {

 

    if (!data.Id) {
 
    
      const finalObject = { data }
      dispatch(actions.createAccrueGratuityConfig(data, disbaleLoading, onHide));
      
      

    } else {

     


      const formUpdatedFields = {
        Id: data?.Id,
        subsidiaryId: data?.subsidiaryId,
        patternName: data?.patternName,
        patternCode: data?.patternCode,
        list:data?.list,
      };

      

     await dispatch(actions.updateAccrueGratuityConfig(formUpdatedFields, disbaleLoading, onHide));
     await dispatch(actions.fetchAccrueGratuityConfigs(usersUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isdataForRead={dataForRead} />
      <FormEditForm
        saveForm={saveForm}
        data={dataForEdit || formUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
        userStatusTypes={userStatusTypes}
        isdataForRead={dataForRead}
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
