import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { UserEditForm } from "./UsersEditForm";
import { UserEditDialogHeader } from "./UserEditDialogHeader";
import { useUsersUIContext } from "../UsersUIContext";
import * as actions from "../../../_redux/usersActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function UsersEditDialog({ id, show, onHide, userForRead, isPasswordHide }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "UserEditDialog";
  const usersUIContext = useUsersUIContext();
  const usersUIProps = useMemo(() => {
    return {
      initUser: usersUIContext.initUser,
      queryParams: usersUIContext.queryParams,
    };
  }, [usersUIContext]);

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
    userForEdit: state.users.userForEdit,
    roles: state.users.roles,
    centers: state.users.centers,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.users.userForRead,
  }));

  // useEffect(() => {
  //   if (actionsLoading) {
  //     onHide();
  //   }
  // }, [actionsLoading === true]);

  //console.log("action", action);

  useEffect(() => {
    dispatch(actions.fetchUser(id));

    // dispatch(actions.fetchUser(usersUIProps.queryParams))
  }, [id, dispatch]);

  // useEffect(() => {
  //   console.log("UseEffect call");
  //   if (actionsLoading === false) {
  //     console.log("UseEffect call inside function");
  //     disbaleLoading();
  //   }
  // }, [actionsLoading]);
  //console.log("userForEdit", userForEdit);

  const saveUser = (user) => {
    if (!id) {
      const getUserStatus = userStatusTypes.filter((item) => {
        return item.value === +user.status;
      });
      console.log("getUserStatus", getUserStatus);
      const { status = getUserStatus[0].label, ...rest } = user;
      const finalObject = {
        status: getUserStatus[0].label,
        ...rest,
      };
      dispatch(actions.createUser(finalObject, disbaleLoading, onHide));
    } else {
      const getUserStatus = userStatusTypes.find((item) => {
        return item.value === +user.status;
      });

      console.log("getUserStatus", getUserStatus);

      const userUpdatedFields = {
        id: user.id,
        email: user.email,
        phNo: user.phNo,
        cnic: user.cnic,
        // password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,

        status: getUserStatus?.label,
        countryId: user.countryId,
        cityId: user.cityId,

      };

      // console.log("userUpdatedFields", userUpdatedFields);
      dispatch(actions.updateUser(userUpdatedFields, disbaleLoading, onHide));
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <UserEditDialogHeader id={id} isUserForRead={userForRead} />
      <UserEditForm
        isPasswordHide={isPasswordHide || false}
        saveUser={saveUser}
        user={userForEdit || usersUIProps.initUser}
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
