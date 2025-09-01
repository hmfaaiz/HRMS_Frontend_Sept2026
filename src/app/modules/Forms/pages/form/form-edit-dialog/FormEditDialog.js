import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/formActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "FormEditDialog";
  const formUIContext = useFormUIContext();

 
  const FormUIProps = useMemo(() => {
    return {
      initUser: formUIContext.initUser,
      queryParams: formUIContext.queryParams,
    };
  }, [formUIContext]);

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
    userForEdit: state.form.userForEdit,
    roles: state.users.roles,
    centers: state.users.centers,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.form.userForRead,
  }));

  // useEffect(() => {
  //   if (actionsLoading) {
  //     onHide();
  //   }
  // }, [actionsLoading === true]);



  useEffect(() => {
    dispatch(actions.fetchUser(id));

    // dispatch(actions.fetchUser(FormUIProps.queryParams))
  }, [id, dispatch]);

  // useEffect(() => {

  //   if (actionsLoading === false) {

  //     disbaleLoading();
  //   }
  // }, [actionsLoading]);


  const saveReligion = async (user) => {

    if (!id) {
  


      // const getUserStatus = userStatusTypes.filter((item) => {
      //   return item.value === +user.status;
      // });

      // const { status = getUserStatus[0].label, ...rest } = user;
      // const finalObject = {
      //   status: getUserStatus[0].label,
      //   ...rest,
      // };
      const finalObject = { user }
     await dispatch(actions.createform(user, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(FormUIProps.queryParams));
      

    } else {
      // const getUserStatus = userStatusTypes.find((item) => {
      //   return item.value === +user.status;
      // });
     


      const formUpdatedFields = {
        Id: user.Id,
        formName: user.formName,
        formCode: user.formCode,
        isActive:user.isActive,
        moduleType:user?.moduleType,
      };


      await dispatch(actions.updateForm(formUpdatedFields, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(FormUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="md"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveReligion={saveReligion}
        user={userForEdit || FormUIProps.initUser}
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
