import React, { useState, useEffect, useMemo } from "react";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";


export function FormEditDialog({ id, show, onHide, userForRead, revisedDate,setRevisedDate ,setemployeeId}) {

  const [loading, setLoading] = useState(false);

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
      ids: FormUIContext.ids,
      employeeId: FormUIContext.employeeId,
      queryParams: FormUIContext.queryParams,
    
   
  
      openDeleteFormDialog: FormUIContext.openDeleteFormDialog,
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
    dataForRead, userAccess,dataForEdit,
  } = useSelector((state) => ({

    userForEdit: state.emp_salary_revision.userForEdit,
    dataForEdit: state.emp_salary_revision.dataForEdit,
    dataForRead: state.emp_salary_revision.dataForRead,
    userAccess: state?.auth?.userAccess["emp_salary_revision"],
  }));

  const isAccessForCreate = userAccess?.find(
    (item) => item.componentName === "CreateEmployeeSalaryRevision"
  );

  // useEffect(() => {
  //   // dispatch(actions.fetchmoduledata(id));
  //   dispatch(actions.fetchEmpForSalaryRevision());

  //   // dispatch(actions.fetchmoduledata(formUIProps .queryParams))
  // }, []);


  useEffect(() => {
    // dispatch(actions.fetchmoduledata(id));
    if (formUIProps?.employeeId) {
   
      dispatch(actions.fetchAllPrevSalaryRevByEmpId({
        ...usersUIProps.queryParams,
        employeeId: formUIProps?.employeeId
      }));

    }


    // dispatch(actions.fetchmoduledata(formUIProps .queryParams))
  }, [userForEdit?.employeeId, formUIProps.queryParams, dispatch,userForEdit]);

  const saveForm = async (data, defMapEarningDeductionList) => {

    if (data.revisedDate === null || data.revisedDate === undefined) {
      toast.error("Please select a salary revision date");
      return;
    }

    const updatedData = {
      ...data, forEdit: formUIProps?.ids || "",
      EmpSalEarDeducChild: defMapEarningDeductionList,
    };

   
    await dispatch(actions.createEmpSalaryRev(updatedData,disbaleLoading,onHide));

     dispatch(actions.fetchAllPrevSalaryRevByEmpId({
        ...usersUIProps.queryParams,
        employeeId: formUIProps?.employeeId
      }));

      // setemployeeId(null);

    //  if (userForEdit?.employeeId) {
    //    
    //   dispatch(actions.fetchAllPrevSalaryRevByEmpId({
    //     ...usersUIProps.queryParams,
    //     employeeId: userForEdit?.employeeId
    //   }));

    // }

    // await  dispatch(fetchCurrentEmpSalary(0));
  }

  useEffect(()=>{
    setRevisedDate(userForEdit?.revisedDate)
  })

  return (
    <>
      <FormEditDialogHeader id={id} dataForRead={dataForRead} />
      <FormEditForm
        saveForm={saveForm}
        data={userForEdit || formUIProps.initUser}
        onHide={onHide}


        dataForRead={dataForRead}
        enableLoading={enableLoading}
        loading={loading}
        setIds={formUIProps.setIds}
        isEdit={id ? true : false}
        dataForEdit={dataForEdit}
  
        disbaleLoading={disbaleLoading}
        formUIProps={formUIProps}
        revisedDate={revisedDate}
        isAccessForCreate={isAccessForCreate}
        setRevisedDate={setRevisedDate}
        setemployeeId={setemployeeId}
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
};
