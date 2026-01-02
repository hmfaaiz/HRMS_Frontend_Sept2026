import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { uploadFile } from "../../../../Dashboard/_redux/dashboardActions";


export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "FormEditDialog";
  const FormUIContext = useFormUIContext();
console.log("id11111",id)

  const usersUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      employeeId: FormUIContext.employeeId,
      queryParams: FormUIContext.queryParams,
      isFileReq: FormUIContext.isFileReq,
      setIsFileReq: FormUIContext.setIsFileReq,
      readMode: FormUIContext.readMode,
      setReceiveMode: FormUIContext.setReceiveMode,
      receiveMode: FormUIContext.receiveMode,
      setReadMode: FormUIContext.setReadMode,
      setId: FormUIContext.setId,
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
    userForEdit: state.facilitator_ticket_creation.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.facilitator_ticket_creation.userForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchEmployeeDoc(id));
  }, [id, dispatch, show]);


  const saveForm = async (formData,clearForm) => {
console.log("formData11111",formData)
    formData.noOfHours=parseFloat(formData.noOfHours)

 formUIProps.setId("");

    if (!formData.Id) {
     
      if (formData?.file && typeof formData?.file === "object") {
        try {
          const uploadRes = await uploadFile(formData.file);
          formData.file = uploadRes.data.filename;
        } catch (err) {
          console.error("File upload failed:", err);
          // Optionally return here or set a default file value
        }
      } else if (typeof formData?.file == "string") {
        formData.file = formData.file;
      }



      dispatch(actions.createEmployeeDoc(formData, disbaleLoading,clearForm));
      dispatch(actions.fetchEmployeeDocs(formUIProps.queryParams));
     


    } else {






      const formUpdatedFields = {
        Id: formData.Id,
        assignTo: formData.assignTo,
        priorityLevelId: formData.priorityLevelId,
        ticketDescription: formData.ticketDescription,
        ticketTypeId: formData.ticketTypeId,
        dueDate: formData.dueDate,
        ticketDate: formData.ticketDate,
        timeRangeFrom: formData.timeRangeFrom,
        timeRangeTo: formData.timeRangeTo,
        noOfHours: formData.noOfHours,
        file: formData.file,
        remarks: formData.remarks,



      };


      if (formData?.file && typeof formData?.file === "object") {
        try {
          const uploadRes = await uploadFile(formData.file);
          formUpdatedFields.file = uploadRes.data.filename;  // e.g. "1747978810103---Resume_CV_Format_Download-6-1-min.pdf"
        } catch (err) {
          console.error("File upload failed:", err);
          // Optionally return here or set a default file value
        }
      } else if (typeof formData?.file == "string") {
        formUpdatedFields.file = formData.file;
      }

      await dispatch(actions.updateEmployeeDoc(formUpdatedFields, disbaleLoading, clearForm));

      await dispatch(actions.fetchEmployeeDocs(usersUIProps.queryParams));
    }






  };

  return (

    <>

      <FormEditForm
        saveForm={saveForm}
        formData={userForEdit || formUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
        userStatusTypes={userStatusTypes}
        isUserForRead={formUIProps.readMode}
        enableLoading={enableLoading}
        loading={loading}
        setId={formUIProps.setId}
        setReadMode={formUIProps.setReadMode}
        setReceiveMode={formUIProps.setReceiveMode}
        receiveMode={formUIProps.receiveMode}

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
    </>

  );
}
