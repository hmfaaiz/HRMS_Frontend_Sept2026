import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";



export function FormEditDialog({ id, show, onHide, dataForRead, status }) {

  const [loading, setLoading] = useState(false);

  const FormUIContext = useFormUIContext();

  const [activeKey, setActiveKey] = useState("0");

  useEffect(() => {

    setActiveKey("0"); // jab new user aaye to accordion open kar do

  }, [id, status]);

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
    dispatch(actions.fetchSeparationById(id));

  }, [id, dispatch]);


  const saveForm = async (formData) => {

    delete formData.employeetatus
    delete formData.all_report_to




    if (!formData.Id) {



      dispatch(actions.createSeparation(formData, disbaleLoading, onHide, formUIProps.queryParams));
      dispatch(actions.fetchSeparation(formUIProps.queryParams));



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
      };




      await dispatch(actions.updateSeparation(formUpdatedFields, disbaleLoading, onHide));

      await dispatch(actions.fetchSeparation(usersUIProps.queryParams));
    }
  };
console.log("dataForEdit1111",dataForEdit)
  return (


    <div className="mt-3 bg-white">
      <FormEditDialogHeader id={id} isdataForRead={dataForRead} />
      <FormEditForm
        saveForm={saveForm}
        formData={dataForEdit || formUIProps.initUser}
        onHide={onHide}
        isdataForRead={dataForRead}
        enableLoading={enableLoading}
        loading={loading}
        disbaleLoading={disbaleLoading}
        setemployeeId={formUIProps.setemployeeId}
        setPanelMode={formUIProps.setPanelMode}
        panelMode={formUIProps.panelMode}

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
