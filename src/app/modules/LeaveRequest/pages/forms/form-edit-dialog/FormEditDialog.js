import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";
import * as actions from "../../../_redux/formActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({
  id,
  employeeId,
  empAuthorityList,
  currentLevel,
  initUser,
}) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  //Get values and function from context that is initiated from FormUIContext.js
  const formUIProps = useMemo(() => {
    return {
      setId: FormUIContext.setId,
      queryParamsLeaveApp: FormUIContext.queryParamsLeaveApp,
      employeeId: FormUIContext.employeeId,
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
  const { userForEdit, payrollData } = useSelector((state) => ({
    userForEdit: state.leave_request.userForEdit,
    payrollData: state.leave_request.payrollData,
  }));

  //Fetch record to edit when an Id is selected from table
  useEffect(() => {
    dispatch(actions.fetchEditRecord(id));
  }, [id, dispatch]);

  //Create or Update record on form submit. First if file or image is available then will be uploaded then data is saved in db
  const submitForm = (values, resetForm) => {
    if (values.file && typeof values.file == "object") {
      actions.uploadImage(values.file).then((res) => {
        dispatch(
          actions.saveRecord(
            {
              ...values,
              file: res.data.filename,
              authortiesList: empAuthorityList,
            },
            formUIProps.employeeId?.value,
            disbaleLoading,
            resetForm
          )
        ).then((e) => {
          dispatch(
            actions.fetchLeaveApplication(
              formUIProps.queryParamsLeaveApp,
              formUIProps.employeeId?.value
            )
          );
        });
      });
    } else {
      dispatch(
        actions.saveRecord(
          { ...values, authortiesList: empAuthorityList },
          formUIProps.employeeId?.value,
          disbaleLoading,
          resetForm
        )
      ).then((e) => {
        dispatch(
          actions.fetchLeaveApplication(
            formUIProps.queryParamsLeaveApp,
            formUIProps.employeeId?.value
          )
        );
      });
    }
  };
  return (
    <>
      {/* <FormEditDialogHeader /> */}
      <div className="px-3 py-2 w-full bg-white rounded-lg ">
        <MasterEditForm
          submitForm={submitForm}
          user={userForEdit || initUser}
          empAuthorityList={empAuthorityList}
          enableLoading={enableLoading}
          loading={loading}
          employeeId={formUIProps?.employeeId}
          currentLevel={currentLevel}
          isEdit={id ? true : false}
          isReaply={
            !id ? false : userForEdit?.request_status !== "R" ? true : false
          }
          setId={formUIProps.setId}
          payrollData={payrollData}
        />
      </div>
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
    </>
  );
}
