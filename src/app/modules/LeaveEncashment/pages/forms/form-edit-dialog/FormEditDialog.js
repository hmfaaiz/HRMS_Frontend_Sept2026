import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'
import * as actions from "../../../_redux/formActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, employeeId, yearId }) {
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

  //Get data from leave encashment state
  const {
    userForEdit,
  } = useSelector((state) => ({
    userForEdit: state.leave_encashment.userForEdit,
    payrollData: state.leave_encashment.payrollData
  }
  ));

  //Fetch record to edit when an Id is selected from table
  useEffect(() => {
    dispatch(actions.fetchEditRecord(id));

  }, [id, dispatch]);


  //Create or Update record on form submit. First if file or image is available then will be uploaded then data is saved in db
  const submitForm = (values, resetForm) => {
    dispatch(actions.saveRecord(values, employeeId, yearId, disbaleLoading, resetForm));
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
        yearId={yearId}
        setId={formUIProps.setId}
        readOnly={id ? true : false}
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
