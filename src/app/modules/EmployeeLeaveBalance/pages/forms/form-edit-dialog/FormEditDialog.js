import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";
import * as actions from "../../../_redux/formActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { FilterForm } from "./FilterForm";
import { fetchAllActiveEmployees, fetchAllFiscalYearData, fetchAllLeaveType, fetchAllLeaveTypeBySubsidiary } from "../../../../../../_metronic/redux/dashboardActions";

export function FormEditDialog() {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  //Get Form init state from Context file (FormUIContext.js)
  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      filters: FormUIContext.filters,
      setfilters: FormUIContext.setfilters
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

  const dispatch = useDispatch();

  //List data from states
  const {
    userForEdit,
    dashboard
  } = useSelector((state) => ({
    userForEdit: state.employee_leave_balance.userForEdit,
    dashboard: state.dashboard,
  }
  ));

  //Fetch Dropdowns data on load
  useEffect(() => {
    if (!dashboard?.allFiscalYears?.length)
      dispatch(fetchAllFiscalYearData("allFiscalYears"));
    if (!dashboard.allEmployees || !dashboard.allEmployees.length)
      dispatch(fetchAllActiveEmployees());
  }, [dispatch]);

  //Fetch record to edit on filters change
  useEffect(() => {
    dispatch(actions.fetchEditRecord(formUIProps.filters));
  }, [formUIProps.filters]);

  //Create record according to values from dialog
  const submitForm = (values) => {
    dispatch(actions.saveRecord({...formUIProps.filters, allocatedCount: values.allocatedCount}, disbaleLoading))
  }

  return (
    <>
      <FilterForm
        filters={formUIProps.filters}
        setfilters={formUIProps.setfilters}
        dropdownData={{
          allFiscalYears: dashboard?.allFiscalYears,
          allLeaveTypes: dashboard?.allLeaveTypes,
          allEmployees: dashboard?.allEmployees,
        }}
        dispatch={dispatch}
      />
      <MasterEditForm
        submitForm={submitForm}
        user={userForEdit || formUIProps.initUser}
        enableLoading={enableLoading}
        loading={loading}
        isUserForRead={Boolean(!(formUIProps.filters?.employeeId && formUIProps.filters?.leaveType && formUIProps.filters?.yearId) || userForEdit?.Id)}
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
