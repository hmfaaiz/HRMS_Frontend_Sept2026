import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

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
      setIds: FormUIContext.setIds,
      employeeId: FormUIContext.employeeId,
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

    userStatusTypes,
    isuserForRead,
  } = useSelector((state) => ({
    actionsLoading: state.users.actionsLoading,
    user: state.users, // change for users to receipt
    userForEdit: state.payroll_process.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.payroll_process.userForRead,
  }));


  useEffect(() => {
 
    dispatch(actions.fetchmoduledata(id));

    // dispatch(actions.fetchmoduledata(formUIProps .queryParams))
  }, [id, dispatch, show]);

  const saveForm = async (data, resetForm) => {
    // enableLoading();
   
    formUIProps.setIds("");

    if (!data.Id && data) {
        await dispatch(
          actions.createPayrollProcess(data, disbaleLoading, resetForm)
        ).then(async ()=>{
                let values = {
                  SubsidiaryId: data?.subsidiaryId,
                  PayrollGroupId: data?.payroll_groupId,
                  MonthId: data?.payroll_monthId,
                  revert : false,
                  finalize : false,
                };
                await dispatch(actions.checkPayroll_EmployeesByIds({ data : values }));
        });
        // await dispatch(actions.fetchPayrollProcess(formUIProps));
      }
     else {
     
      const formUpdatedFields = {
        Id: data.Id,
        payroll_groupId: data.payroll_groupId,
        payroll_monthId: data.payroll_monthId,
        subsidiaryId: data.subsidiaryId,
   
      };
     
     
        await dispatch(
          actions.updatePayrollProcess(
            formUpdatedFields,
            disbaleLoading,
            resetForm
          )
        );
        await dispatch(actions.fetchPayrollProcess(formUIProps));
      }
    
  };


  return (
    <>
      {/* <FormEditDialogHeader id={id} isUserForRead={userForRead} /> */}
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps.initUser}
        onHide={onHide}
        roles={roles}
        userStatusTypes={userStatusTypes}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        setIds={formUIProps.setIds}
        isEdit={id ? true : false}
        formUIProps={formUIProps}
       disbaleLoading ={disbaleLoading}
     
      />
      <ToastContainer
        position="top-right"
        autoClose={2000}
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
