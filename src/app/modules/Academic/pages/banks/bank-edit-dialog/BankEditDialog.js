import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { BankEditForm } from "./BankEditForm";
import { BankEditDialogHeader } from './BankEditDialogHeader'

import * as actions from "../../../_redux/bankActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBanksUIContext } from "../BanksUIContext";

export function BankEditDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "BankEditDialog";
  const banksUIContext = useBanksUIContext();


  const usersUIProps = useMemo(() => {
    return {
      queryParams: banksUIContext.queryParams,
    };
  }, [banksUIContext]);

  const [showChildModal, setShowChildModal] = useState(false);
  const handleChildModalClose = () => setShowChildModal(false);
  const handleChildModalShow = () => setShowChildModal(true);

  const banksUIProps = useMemo(() => {
    return {
      initUser: banksUIContext.initUser,
      queryParams: banksUIContext.queryParams,
    };
  }, [banksUIContext]);

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
    userForEdit: state.academic.userForEdit,
    roles: state.users.roles,
    centers: state.users.centers,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.academic.userForRead,
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

  const saveAcademic = async (user) => {

    if (!id) {
      console.log("academic edit dialog");
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
      await dispatch(actions.createAcademic(user, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));


    } else {
      // const getUserStatus = userStatusTypes.find((item) => {
      //   return item.value === +user.status;
      // });

      console.log("getUserStatus", user);

      // This object set for Edit Fields in DB
      const academicUpdatedFields = {
        Id: user.Id,
        gpa: user.gpa,
        employeeId: user.employeeId,
        institutionId: user.institutionId,
        degreeId: user.degreeId,
        countryId: user.countryId,
        cityId: user.cityId,
        statusId: user.statusId
      };

      console.log("acaedmic updated", academicUpdatedFields);
      await dispatch(actions.updatedAcademic(academicUpdatedFields, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <BankEditDialogHeader id={id} isUserForRead={userForRead} />
      <BankEditForm
        saveAcademic={saveAcademic}
        user={userForEdit || banksUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
        userStatusTypes={userStatusTypes}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
      />
      {<><button className="btn btn-light btn-elevate" type="button" onClick={handleChildModalShow}>
        Open Child Modal
      </button>

        <Modal show={showChildModal} onHide={handleChildModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Child Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>This is the child modal.</Modal.Body>
          <Modal.Footer></Modal.Footer>
          <button className="btn btn-light btn-elevate" type="button" onClick={handleChildModalClose}>
            Close Child Modal
          </button>
        </Modal></>}

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
