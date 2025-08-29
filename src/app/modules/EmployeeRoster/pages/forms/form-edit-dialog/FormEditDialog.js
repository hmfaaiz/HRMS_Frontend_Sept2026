import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";

import * as actions from "../../../_redux/formActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { fetchAllEmployeeShifts, fetchAllRosterPattern, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";

export function FormEditDialog() {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      id: FormUIContext.id,
      setId: FormUIContext.setId,
      setQueryParams: FormUIContext.setQueryParams,
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
    dashboard,
    userForEdit,
  } = useSelector((state) => ({
    dashboard: state.dashboard,
    userForEdit: state.employee_roster.userForEdit,
  }
  ));

  //Fetch record to edit on load and on change in Id
  useEffect(() => {
    dispatch(actions.fetchEditRecord(formUIProps.id));

    if (!dashboard.allEmployeeShifts || !dashboard.allEmployeeShifts.length)
      dispatch(fetchAllEmployeeShifts('allEmployeeShifts'));
    if (!dashboard?.allSubsidiaryList?.length)
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    if (!dashboard?.allRosterPatternList?.length)
      dispatch(fetchAllRosterPattern("allRosterPatternList"))
  }, [formUIProps.id, dispatch]);

  //Create or Update record according to values from dialog
  const submitForm = (values, resetForm) => {

    dispatch(actions.saveRecord(values, formUIProps.id, disbaleLoading, resetForm))
  }

  return (
    <>
      <MasterEditForm
        submitForm={submitForm}
        user={userForEdit || formUIProps.initUser}
        isEdit={formUIProps.id ? true : false}
        enableLoading={enableLoading}
        loading={loading}
        setId={formUIProps.setId}
        dispatch={dispatch}
        setQueryParams={formUIProps.setQueryParams}
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
