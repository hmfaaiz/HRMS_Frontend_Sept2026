import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";
import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const dispatch = useDispatch();
  const { userForEdit } = useSelector(
    (state) => ({
      userForEdit: state.t_tada_config?.userForEdit,
    }),
    shallowEqual,
  );

  useEffect(() => {
    dispatch(actions.fetchTadaConfig(id));
  }, [id, dispatch]);

  const saveForm = async (values) => {
    enableLoading();

    const {
      Id,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
      Grade,
      Designation,
      Company,
      Subsidiary,
      ModeOfTransports,
      ClassOfTravels,
      HotelEntitlements,
      PreApprovers,
      preApproverNames,
      ...rawValues
    } = values;

    const payload = {
      ...rawValues,
      id: rawValues.id || Id, // Ensure id is present and lowercase
      gradeId: rawValues.gradeId ? Number(rawValues.gradeId) : null,
      designationId: rawValues.designationId
        ? Number(rawValues.designationId)
        : null,
      subsidiaryId: rawValues.subsidiaryId
        ? Number(rawValues.subsidiaryId)
        : null,
      hotelEntitlementSelfAmount: Number(rawValues.hotelEntitlementSelfAmount) || 0,
      dailyAllowanceAmount: Number(rawValues.dailyAllowanceAmount) || 0,
      taxiFareAmount: Number(rawValues.taxiFareAmount) || 0,
      preApprover: Array.isArray(rawValues.preApprover)
        ? rawValues.preApprover.map(Number)
        : [],
      modeOfTransportId: Array.isArray(rawValues.modeOfTransportId)
        ? rawValues.modeOfTransportId.map(Number)
        : [],
      classOfTravelId: Array.isArray(rawValues.classOfTravelId)
        ? rawValues.classOfTravelId.map(Number)
        : [],
      hotelEntitlementId: Array.isArray(rawValues.hotelEntitlementId)
        ? rawValues.hotelEntitlementId.map(Number)
        : [],
    };

    if (!payload.id) {
      dispatch(actions.createTadaConfig(payload, disableLoading, onHide));
    } else {
      await dispatch(actions.updateTadaConfig(payload, disableLoading, onHide));
      await dispatch(actions.fetchTadaConfigs(formUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      backdrop="static"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps.initUser}
        onHide={onHide}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        disableLoading={disableLoading}
        id={id}
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
