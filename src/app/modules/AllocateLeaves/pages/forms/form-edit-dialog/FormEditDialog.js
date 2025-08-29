import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";
import * as actions from "../../../_redux/formActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { fetchAllFiscalYearData, fetchAllFormsMenu, fetchAllLeaveType, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { fetchPolicyData } from "../../../_redux/formActions";

export function FormEditDialog({ onHide, userForRead }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  //Get Form init state from Context file (FormUIContext.js)
  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
    };
  }, [FormUIContext]);

  //Start Loading
  const enableLoading = () => {
    setLoading(true);
  };

  //End Loading
  const disbaleLoading = () => {
    setLoading(false);
  };


  //List data from states
  const {
    userForEdit,
    dashboard,
    allocate_leaves,
    userAccess
  } = useSelector((state) => ({
    userForEdit: state.allocate_leaves.userForEdit,
    dashboard: state.dashboard,
    allocate_leaves: state.allocate_leaves,
    userAccess: state.auth.userAccess.Allocate_Leaves,
  }
  ));

  //Check if access to create or update Allocate Leaves
  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateAllocateLeaves" || item.componentName == "UpdateAllocateLeaves"
  )


  const dispatch = useDispatch();

  //Fetch All dropdowns data from server if not available in state
  useEffect(() => {
    if (!dashboard?.allCycleTypeList?.length)
      dispatch(fetchAllFormsMenu(205, "allCycleTypeList"));
    if (!dashboard?.allSubsidiaryList?.length)
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    if (!dashboard?.allFiscalYears?.length)
      dispatch(fetchAllFiscalYearData("allFiscalYears"));
    if (!allocate_leaves?.allPolicyType.length)
      dispatch(fetchPolicyData());
  }, [dispatch]);


  //Get Old data from server thorugh filters
  const getOldData = (filters) => {
    dispatch(actions.fetchAllocateLeaves(filters))
  }


  //Create or Update record according to values from dialog
  const submitForm = (values) => {
    dispatch(actions.saveRecord(values, disbaleLoading, onHide))
  }

  return (
    <>
      <MasterEditForm
        submitForm={submitForm}
        user={userForEdit || formUIProps.initUser}
        onHide={onHide}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        dropdownData={{
          allCycleTypeList: dashboard?.allCycleTypeList,
          allSubsidiaryList: dashboard?.allSubsidiaryList,
          allFiscalYears: dashboard?.allFiscalYears,
          allLeaveTypes: dashboard?.allLeaveTypes,
          allPolicyType: allocate_leaves?.allPolicyType,
        }}
        getOldData={getOldData}
        accessUser={accessUser}
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
    </>

  );
}
