import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/formActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { fetchAllFormsMenu, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";

export function FormEditDialog({ id, show, onHide, userForRead, isEdit }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const enableLoading = () => {
    setLoading(true);
  };
  const disableLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const {
    userForEdit,
    dashboard
  } = useSelector((state) => ({
    userForEdit: state.leave_management_configuration.userForEdit,
    dashboard: state.dashboard
  }
  ));

  //If Id is present (In Edit case) then fetch data for edit. Also fetch all dropdown data if not present in state
  useEffect(() => {
    dispatch(actions.fetchEditRecord(id ? { Id: id } : null));
    // if (!dashboard?.allEmployeeGradeList || !dashboard?.allEmployeeGradeList?.length)
    //   dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList"));
    // if (!dashboard?.allEmpTypeChildMenus || !dashboard?.allEmpTypeChildMenus?.length)
    //   dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus"));
    if (!dashboard?.allSubsidiaryList?.length)
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));

    if (!dashboard?.allGenderList || !dashboard?.allGenderList?.length)
      dispatch(fetchAllFormsMenu(187, "allGenderList", 'All'));
    if (!dashboard?.allAllocationTypList || !dashboard?.allAllocationTypList?.length)
      dispatch(fetchAllFormsMenu(557, "allAllocationTypList", 'All'));
    if (!dashboard?.allLeaveStatus || !dashboard?.allLeaveStatus?.length)
      dispatch(fetchAllFormsMenu(191, "allLeaveStatus", 'All'));
    if (!dashboard?.allMaritalStatus || !dashboard?.allMaritalStatus?.length)
      dispatch(fetchAllFormsMenu(190, "allMaritalStatus", 'All'));
    if (!dashboard?.allEntitlementEvents || !dashboard?.allEntitlementEvents?.length)
      dispatch(fetchAllFormsMenu(270, "allEntitlementEvents", 'All'));
  }, [id, dispatch, show]);

  //Create or Update record according to values from dialog
  const submitForm = (values) => {
    dispatch(actions.saveRecord(values, disableLoading, onHide))
  }

  return (
    <Modal
      // size="xl"
      size="lg"
      dialogClassName="modal-75vw"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <MasterEditForm
        submitForm={submitForm}
        user={userForEdit || formUIProps.initUser}
        initUser={formUIProps.initUser}
        onHide={onHide}
        isUserForRead={userForRead}
        isEdit={isEdit}
        enableLoading={enableLoading}
        loading={loading}
        dispatch={dispatch}
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
