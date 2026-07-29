import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";
import { fetchAttLogsByDate } from "../../../../Dashboard/_redux/dashboardActions";
import { formatDates } from "../../../../../utils/common";

export function FormEditDialog({ onHide, userForRead }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      setfilters: FormUIContext.setfilters,
      filters: FormUIContext.filters,
      panelMode:FormUIContext.panelMode,
      setPanelMode:FormUIContext.setPanelMode,
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
    userForEdit,
    dashboard,
  } = useSelector((state) => ({
    userForEdit: state.cpl_approval.userForEdit,
    dashboard: state.dashboard,
  }
  ), shallowEqual);

  //Fetch record to edit on dialog load
  useEffect(() => {
    if (!dashboard.allEmployees || !dashboard.allEmployees.length)
      dispatch(fetchAllActiveEmployees());
  }, [dispatch]);

  //Create or Update record according to values from dialog
  const submitForm = (values) => {
    dispatch(actions.saveRecord(values, disbaleLoading, formUIProps.initUser))
  }

  useEffect(() => {
    dispatch(actions.fetchRecordByFilters(formUIProps.filters))
    if(formUIProps.filters.employeeId && formUIProps.filters.attDateIn ){
      dispatch(fetchAttLogsByDate({employeeId:formUIProps.filters.employeeId, attDate:formatDates(formUIProps.filters.attDateIn, "dd-MMM-yyyy")   }));
    }
   
  }, [formUIProps.filters, dispatch])

  useEffect(() => {
    dispatch(actions.getPayrollMonth(formUIProps?.filters?.employeeId));
  
  }, [formUIProps?.filters?.employeeId])
  
  return (
    <>
      <MasterEditForm
        submitForm={submitForm}
        user={{ ...formUIProps.initUser, ...userForEdit}}
        onHide={onHide}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        setfilters={formUIProps.setfilters}
        panelMode={formUIProps.panelMode}
        setPanelMode={formUIProps.setPanelMode}
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
