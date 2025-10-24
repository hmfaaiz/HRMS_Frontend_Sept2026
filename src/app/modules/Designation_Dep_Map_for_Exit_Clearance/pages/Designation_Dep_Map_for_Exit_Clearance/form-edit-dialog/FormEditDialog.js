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

 console.log("aaaaaa111111111")
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
   
  console.log("designation_dep_map_for_exit_clearance1111111",state)
    return {
      actionsLoading: state.users.actionsLoading,
      dataForEdit: state.designation_dep_map_for_exit_clearance.dataForEdit,
      isdataForRead: state.designation_dep_map_for_exit_clearance.dataForRead,
    };
  }, shallowEqual);
  



  useEffect(() => {
    dispatch(actions.fetchDesignationDepMapForExitClearanceDataForEdit(id));

    // dispatch(actions.fetchDesignationDepMapForExitClearanceDataForEdit(formUIProps .queryParams))
  }, [id, dispatch,show]);


  const saveForm = async (data) => {

 

    if (!data.dataIsExist) {
 
    
      const finalObject = { data }
      await dispatch(actions.createDesignationDepMapForExitClearance(data, disbaleLoading, onHide));
      await dispatch(actions.fetchDesignationDepMapForExitClearance(usersUIProps.queryParams));
      

    } else {

     


      const formUpdatedFields = {
        Id: data?.designationId,
        list:data?.list,
      };

      

     await dispatch(actions.updateDesignationDepMapForExitClearance(formUpdatedFields, disbaleLoading, onHide));
     await dispatch(actions.fetchDesignationDepMapForExitClearance(usersUIProps.queryParams));
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
