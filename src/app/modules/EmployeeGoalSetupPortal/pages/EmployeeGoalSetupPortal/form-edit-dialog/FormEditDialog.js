import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";


export function FormEditDialog({ show,employeeId,appraisalPeriodId, onHide, dataForRead }) {
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
        panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
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
   
  
    return {
      actionsLoading: state.users.actionsLoading,
      dataForEdit: state.employee_goal_setup_portal.dataForEdit,
      isdataForRead: state.employee_goal_setup_portal.dataForRead,
    };
  }, shallowEqual);
  



  useEffect(() => {
  
   dispatch(actions.fetchExitTypeExitReasonDataForEdit({employeeId, appraisalPeriodId}));
 
 

    // dispatch(actions.fetchExitTypeExitReasonDataForEdit(formUIProps .queryParams))
  }, [employeeId,appraisalPeriodId, dispatch,show]);


  const saveForm = async (data) => {

 

    if (!data.dataIsExist) {
 
    
      const finalObject = { data }
      await dispatch(actions.createExitTypeExitReason(data, disbaleLoading, onHide));
      await dispatch(actions.fetchExitTypeExitReason(usersUIProps.queryParams));
      

    } else {

     


      const formUpdatedFields = {
        employeeId: data?.employeeId,
        appraisalPeriodId: data?.appraisalPeriodId,
        list:data?.list,
      };

      

     await dispatch(actions.updateExitTypeExitReason(formUpdatedFields, disbaleLoading, onHide));
     await dispatch(actions.fetchExitTypeExitReason(usersUIProps.queryParams));
    }
  };

  return (
    <Modal
       size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader employeeId={employeeId} isdataForRead={dataForRead} />
      <FormEditForm
        setPanelMode={formUIProps.setPanelMode}
        panelMode={formUIProps.panelMode}
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
