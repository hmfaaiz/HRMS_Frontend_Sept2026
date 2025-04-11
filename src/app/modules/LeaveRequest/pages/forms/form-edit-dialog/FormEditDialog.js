import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'
import * as actions from "../../../_redux/formActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, employeeId }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  //Get values and function from context that is initiated from FormUIContext.js
  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      setId: FormUIContext.setId,
    };
  }, [FormUIContext]);

  //Start loading function
  const enableLoading = () => {
    setLoading(true);
  };

  //Stop loading function
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();

  //Get data from leave application state
  const {
    userForEdit,
    payrollData
  } = useSelector((state) => ({
    userForEdit: state.leave_application.userForEdit,
    payrollData: state.leave_application.payrollData
  }
  ));

  //Fetch record to edit when an Id is selected from table
  useEffect(() => {
    dispatch(actions.fetchEditRecord(id));
      
  }, [id, dispatch]);
  

  //Create or Update record on form submit. First if file or image is available then will be uploaded then data is saved in db
  const submitForm = (values, resetForm) => {
    if (values.file && typeof values.file == 'object') { //This is to check if file is uploaded or not. If uploaded then upload the file to server else just save form values
      actions.uploadImage(values.file)
      .then((res) => {
        dispatch(actions.saveRecord({ ...values, file: res.data.filename }, employeeId, disbaleLoading, resetForm));
      })
    }
    else {
      dispatch(actions.saveRecord(values, employeeId, disbaleLoading, resetForm));
    }
  }

  return (
    <>
      <FormEditDialogHeader />
      <MasterEditForm
        submitForm={submitForm}
        user={userForEdit || formUIProps.initUser}
        enableLoading={enableLoading}
        loading={loading}
        employeeId={employeeId}
        isEdit={id ? true : false}
        setId={formUIProps.setId}
        payrollData={payrollData}
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
