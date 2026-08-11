import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

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

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      setIds: FormUIContext.setIds,
      employeeId: FormUIContext.employeeId,
      queryParams: FormUIContext.queryParams,
      isFileReq:FormUIContext.isFileReq,
      setIsFileReq:FormUIContext.setIsFileReq,
      readMode:FormUIContext.readMode,
      setReadMode:FormUIContext.setReadMode
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
    userForEdit: state.reimbursement_claim.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.reimbursement_claim.userForRead,
  }));


  useEffect(() => {
 
    dispatch(actions.fetchmoduledata(id));

    // dispatch(actions.fetchmoduledata(formUIProps .queryParams))
  }, [id, dispatch, show]);

  const saveForm = async (data,maxAmount, isFileReq, resetForm) => {
    // enableLoading();
console.log("data.file11111",data.file)
    if (maxAmount < data.amount) {
      disbaleLoading();
      toast.error("Amount exceeds the limit.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
 

    if (isFileReq && !data.file) {
      disbaleLoading();
      toast.error("Attachment is required.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
 
      return;
    }
    
    formUIProps.setIds("");

    if (!data.Id && data) {
      if (data.file && typeof data.file == "object") {
        //This is to check if file is uploaded or not. If uploaded then upload the file to server else just save form values

        actions.uploadFormDoc(data.file).then((res) => {
          data.file = res.data.filePath;
          dispatch(actions.createReimbursementClaim(data, disbaleLoading, resetForm));
        });
      } else {
     
        await dispatch(
          actions.createReimbursementClaim(data, disbaleLoading, resetForm)
        );
        await dispatch(actions.fetchReimbursementClaim(formUIProps));
      }
    } else {
     
      const formUpdatedFields = {
        Id: data.Id,
        reimbursement_typeId: data.reimbursement_typeId,
        employeeId: data.employeeId,
        details: data.details,
        date: data.date,
        amount: data.amount,
        file: data?.file || "",
        pay_in_payroll_forId: data.pay_in_payroll_forId || "",
        // pay_slip_refId: "",
        approved_status:data.approved_status || 0,
      };
      if (data.file && typeof data.file == "object") {
        //This is to check if file is uploaded or not. If uploaded then upload the file to server else just save form values
   

        actions.uploadImage(data.file).then((res) => {
          formUpdatedFields.file = res.data.filePath;
          dispatch(
            actions.updateReimbursementClaim(
              formUpdatedFields,
              disbaleLoading,
              resetForm
            )
          ).then(() => {
            dispatch(actions.fetchReimbursementClaim(formUIProps)); // Fetch the list after update
          });
        });

        // trigger()
      } else {
     
        await dispatch(
          actions.updateReimbursementClaim(
            formUpdatedFields,
            disbaleLoading,
            resetForm
          )
        );
        await dispatch(actions.fetchReimbursementClaim(formUIProps));
      }
    }
  };


  return (
    <>
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps.initUser}
        onHide={onHide}
        roles={roles}
        userStatusTypes={userStatusTypes}
        isUserForRead={formUIProps.readMode}
        enableLoading={enableLoading}
        loading={loading}
        setIds={formUIProps.setIds}
        isEdit={id ? true : false}
        isFileReq={formUIProps.isFileReq}
        setIsFileReq={formUIProps.setIsFileReq}
        employeeId={formUIProps.employeeId}
        disbaleLoading={disbaleLoading}
        formUIProps={formUIProps}
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
