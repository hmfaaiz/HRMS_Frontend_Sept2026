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
    user: state.users,
    userForEdit: state.task_configuration.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.task_configuration.userForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchTaskConfiguration(id));

  }, [id, dispatch]);


  const saveForm = async (data) => {



    if (!id) {

      dispatch(actions.createTaskConfig(data, disbaleLoading, onHide)).then(async () => {
        await dispatch(actions.fetchTaskConfigurations(formUIProps.queryParams));
      });



    } else {



      // user.number_of_days=
      const formUpdatedFields = {
        Id: data.Id,
        subsidiaryId: data.subsidiaryId,
        teamTicketApproverId: data.teamTicketApproverId,
        companyTaskApproverId: data.companyTaskApproverId,
        isAllowedToCreateTask: data.isAllowedToCreateTask,

      };



      await dispatch(actions.updateTaskConfig(formUpdatedFields, disbaleLoading, onHide)).then(async () => {
        await dispatch(actions.fetchTaskConfigurations(formUIProps.queryParams));
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
