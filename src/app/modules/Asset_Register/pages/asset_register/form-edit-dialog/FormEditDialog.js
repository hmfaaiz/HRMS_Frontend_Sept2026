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
    userForEdit: state.asset_register.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.asset_register.userForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchAssetRegister(id));

    // dispatch(actions.fetchAssetRegister(formUIProps .queryParams))
  }, [id, dispatch]);


  const saveForm = async (formData) => {

    console.log("formdata11111",formData?.file);
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
      asset_no: formData.asset_no,
      registration_no: formData.registration_no,
      asset_modelId: formData.asset_modelId,
      locationId: formData.locationId,
      current_conditionId: formData.current_conditionId,
      asset_categoryId: formData.asset_categoryId,
      asset_year: formData.asset_year,
      date_of_acquisition: formData.date_of_acquisition,
      date_of_expiry: formData.date_of_expiry,
      description: formData.description,
      color: formData.color,

      purchase_price: formData.purchase_price,
      current_price: formData.current_price,
      remarks: formData.remarks,
      cityId: formData.cityId,
      countryId: formData.countryId,
      file: formData?.file,
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
      size="lg"
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
