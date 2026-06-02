import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";


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
    centers,
    userStatusTypes,
    isuserForRead,
  } = useSelector((state) => ({


    actionsLoading: state.users.actionsLoading,
    user: state.users, // change for users to receipt
    userForEdit: state.department_wise_budget.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.department_wise_budget.userForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchDepartmentWiseBudget(id));

    // dispatch(actions.fetchDepartmentWiseBudget(formUIProps .queryParams))
  }, [id, dispatch]);


  const saveForm = async (data) => {


    if (!id) {


      dispatch(actions.createPolicyforNewYearBudget(data, disbaleLoading, onHide)).then(async () => {
        await dispatch(actions.fetchDepartmentWiseBudgets(usersUIProps.queryParams));
      });



    } else {


      const formUpdatedFields = {
        Id: data.Id,
        subsidiaryId: data.subsidiaryId,
        departmentId: data.departmentId,
        fiscalYearId: data.fiscalYearId,
        budgeted_strength: data.budgeted_strength,
        budgeted_salary: data.budgeted_salary,

      };



      await dispatch(actions.updatePolicyforNewYearBudget(formUpdatedFields, disbaleLoading, onHide)).then(async () => {
        await dispatch(actions.fetchDepartmentWiseBudgets(usersUIProps.queryParams));
      });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        formData={userForEdit || formUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
        userStatusTypes={userStatusTypes}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}

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
