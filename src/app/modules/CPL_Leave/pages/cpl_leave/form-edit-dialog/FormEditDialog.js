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


  const usersUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const formUIProps = useMemo(() => {
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
    centers,
    userStatusTypes,
    isuserForRead,
  } = useSelector((state) => ({


    actionsLoading: state.users.actionsLoading,
    user: state.users, // change for users to receipt
    userForEdit: state.cpl_leave.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.cpl_leave.userForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchAssetRegister(id));

    // dispatch(actions.fetchAssetRegister(formUIProps .queryParams))
  }, [id, dispatch]);


  const saveForm = async (formData) => {


    if (!formData.Id) {
      // Create
      dispatch(
        actions.createAssetRegister(
          formData,
          disbaleLoading,
          onHide,
          formUIProps.queryParams
        )
      );
    } else {
      // Update
      const formUpdatedFields = {
        Id: formData.Id,

        subsidiaryId: formData.subsidiaryId,
        gradeId: formData.gradeId,
        employeeTypeId: formData.employeeTypeId,

        // Business Days
        HalfDay_BusinessDay: formData.HalfDay_BusinessDay,
        FullDay_BusinessDay: formData.FullDay_BusinessDay,
        Onehalf_BusinessDay: formData.Onehalf_BusinessDay,
        Double_BusinessDay: formData.Double_BusinessDay,

        // Off Days
        HalfDay_OffDay: formData.HalfDay_OffDay,
        FullDay_OffDay: formData.FullDay_OffDay,
        Onehalf_OffDay: formData.Onehalf_OffDay,
        Double_OffDay: formData.Double_OffDay,

        // Holidays
        HalfDay_Holiday: formData.HalfDay_Holiday,
        FullDay_Holiday: formData.FullDay_Holiday,
        Onehalf_Holiday: formData.Onehalf_Holiday,
        Double_Holiday: formData.Double_Holiday,

        // Attendance Process
        isAttProcessExecuted: formData.isAttProcessExecuted,
        accumulateDays: formData.accumulateDays,
    


      };

      await dispatch(
        actions.updateAssetRegister(
          formUpdatedFields,
          disbaleLoading,
          onHide
        )
      );

      await dispatch(
        actions.fetchAssetRegisters(formUIProps.queryParams)
      );
    }
  };

  return (
    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        formData={userForEdit || formUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
        userStatusTypes={userStatusTypes}
        isUserForRead={userForRead}
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
