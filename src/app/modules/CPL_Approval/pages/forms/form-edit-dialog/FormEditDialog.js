import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

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


  useEffect(() => {
    dispatch(actions.getPayrollMonth(formUIProps?.filters?.employeeId));
  
  }, [formUIProps?.filters?.employeeId])
  
  return (
    <>
      <MasterEditForm
      
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
