import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { DesignationEditForm } from "./DesignationEditForm";
import { DesignationEditDialogHeader } from './DesignationEditDialogHeader'

import * as actions from "../../../_redux/designationActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDesignationUIContext } from "../DesignationUIContext";

export function DesignationEditDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "ReligionEditDialog";
  const DesignationUIContext = useDesignationUIContext();

 
  const usersUIProps = useMemo(() => {
    return {
      queryParams: DesignationUIContext.queryParams,
    };
  }, [DesignationUIContext]);

  const banksUIProps = useMemo(() => {
    return {
      initUser: DesignationUIContext.initUser,
      queryParams: DesignationUIContext.queryParams,
    };
  }, [DesignationUIContext]);

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
    userForEdit: state.designation.userForEdit,
    roles: state.users.roles,
    centers: state.users.centers,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.designation.userForRead,
  }));

  // useEffect(() => {
  //   if (actionsLoading) {
  //     onHide();
  //   }
  // }, [actionsLoading === true]);

  //console.log("action", action);

  useEffect(() => {
    dispatch(actions.fetchUser(id));

    // dispatch(actions.fetchUser(banksUIProps.queryParams))
  }, [id, dispatch]);

  // useEffect(() => {
  //   console.log("UseEffect call");
  //   if (actionsLoading === false) {
  //     console.log("UseEffect call inside function");
  //     disbaleLoading();
  //   }
  // }, [actionsLoading]);
  //console.log("userForEdit", userForEdit);

  const saveReligion = (user) => {

    if (!id) {
      console.log("relegion save");
      console.log(user);

      // const getUserStatus = userStatusTypes.filter((item) => {
      //   return item.value === +user.status;
      // });
      // //console.log("getUserStatus", getUserStatus);
      // const { status = getUserStatus[0].label, ...rest } = user;
      // const finalObject = {
      //   status: getUserStatus[0].label,
      //   ...rest,
      // };
      const finalObject = { user }
      dispatch(actions.createDesignation(user, disbaleLoading, onHide));
      
      

    } else {
      // const getUserStatus = userStatusTypes.find((item) => {
      //   return item.value === +user.status;
      // });
     
      console.log("getUserStatus", user);

      const religionUpdatedFields = {
        Id: user.Id,
        designationName: user.designationName,
        designationCode: user.designationCode
      };

      console.log("desUpdatedFields", religionUpdatedFields);
      dispatch(actions.updateDesignation(religionUpdatedFields, disbaleLoading, onHide));
      dispatch(actions.fetchUsers(usersUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <DesignationEditDialogHeader id={id} isUserForRead={userForRead} />
      <DesignationEditForm
        saveReligion={saveReligion}
        user={userForEdit || banksUIProps.initUser}
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
