import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'
import {  useLocation } from "react-router-dom";
import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";



export function FormEditDialog({ id, show, onHide, dataForRead, status }) {
    const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [employeeId , setemployeeId] = useState(null)
  const FormUIContext = useFormUIContext();

  const [activeKey, setActiveKey] = useState("0");

useEffect(() => {
  if (status === "new") {  
    const queryParams = new URLSearchParams(location?.search);
    const encodedEmpId = queryParams.get("Id");
    const decodedEmpId = encodedEmpId ? atob(encodedEmpId) : "";
    if (decodedEmpId) {
      setemployeeId(decodedEmpId);
      // Clear URL parameter without page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }
  setActiveKey("0");
}, [id, status, location?.search]); 

  const usersUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      setemployeeId: FormUIContext.setemployeeId,
      setPanelMode: FormUIContext.setPanelMode,
      panelMode: FormUIContext.panelMode,
      setAttSumPanelMode: FormUIContext.setAttSumPanelMode,
      attSumPanelMode: FormUIContext.attSumPanelMode,
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
    dataForEdit,
    isdataForRead,
  } = useSelector((state) => ({


    actionsLoading: state.users.actionsLoading,
    dataForEdit: state.final_settlement.dataForEdit,
    isdataForRead: state.final_settlement.dataForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchFinalSettlementById(id));

  }, [id, dispatch]);


  const saveForm = async (formData) => {

    delete formData.employeetatus
    delete formData.all_report_to




    if (!formData.Id) {



      dispatch(actions.createFinalSettlement(formData, disbaleLoading, onHide, formUIProps.queryParams));
      dispatch(actions.fetchFinalSettlement(formUIProps.queryParams));



    } else {




      const formUpdatedFields = {
        Id: formData.Id,
        employeeId: formData.employeeId,
        paidDays: formData.paidDays,

        earning_list: formData.earning_list,
        deduction_list: formData.deduction_list,

        otherPayment: formData.otherPayment,
        otherPaymentRemarks: formData.otherPaymentRemarks,

        otherDeduction: formData.otherDeduction,
        oherDeductionRemarks: formData.oherDeductionRemarks, // same typo as in initUser

        totalEarnings: formData.totalEarnings,
        totalDeduction: formData.totalDeduction,
        netSalary: formData.netSalary,

        loanBalance: formData.loanBalance,
        gratuityAmount: formData.gratuityAmount,

        totalPFAmount: formData.totalPFAmount,
        pf_employer_amount: formData.pf_employer_amount,
        pf_employee_amount: formData.pf_employee_amount,

        exitClearence: formData.exitClearence,
        hrRemarks: formData.hrRemarks,
        settlementFinalized: formData.settlementFinalized,
        netFinalSettlementAmount: formData.netFinalSettlementAmount,
      };




      await dispatch(actions.updateFinalSettlement(formUpdatedFields, disbaleLoading, onHide));

      await dispatch(actions.fetchFinalSettlement(usersUIProps.queryParams));
    }
  };

const initialFormData = useMemo(() => {
  // If we have dataForEdit from API, use that
  if (dataForEdit && Object.keys(dataForEdit).length > 0) {
    return dataForEdit;
  }
  
  if (status === "new" && employeeId) {
    return {
      ...formUIProps.initUser,
      employeeId: Number(employeeId)
    };
  }
  
  // Default case
  return formUIProps.initUser;
}, [status, dataForEdit, employeeId, formUIProps.initUser]); // 


  return (


    <div className="mt-3 bg-white">
      <FormEditDialogHeader id={id} isdataForRead={dataForRead} />
      <FormEditForm
        saveForm={saveForm}
      formData={initialFormData}  
        onHide={onHide}
        isdataForRead={dataForRead}
        enableLoading={enableLoading}
        loading={loading}
        disbaleLoading={disbaleLoading}
        setemployeeId={formUIProps.setemployeeId}
        setPanelMode={formUIProps.setPanelMode}
        panelMode={formUIProps.panelMode}
        setAttSumPanelMode={formUIProps.setAttSumPanelMode}
        attSumPanelMode={formUIProps.attSumPanelMode}

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
    </div>
    // </Modal> */}
  );
}
