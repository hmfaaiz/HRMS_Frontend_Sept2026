import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { fetchAllComapnyData } from "../../../../../../_metronic/redux/dashboardActions";


export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "FormEditDialog";
  const FormUIContext = useFormUIContext();
  const [initUser, setInitUser] = useState(FormUIContext.initUser);

  const usersUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);
  const { dashboard } = useSelector((state) => state);
  const { currentUser } = useSelector((state) => {
    return {

      currentUser: state.auth.user,

    };
  }, shallowEqual);
  // const { dashboard } = useSelector((state) => state);
  useEffect(() => {

    dispatch(fetchAllComapnyData("allCompanyList"))

  }, [dispatch]);

  useEffect(() => {

    if (dashboard?.allCompanyList.length == 0) {
     
      const updatedUser = {
        ...FormUIContext.initUser, // Assuming you have initUser in FormUIContext
        companyId: currentUser.companyId,
      };

      // Set updated user in your context or wherever needed
      setInitUser(updatedUser); // If you're directly mutating, or set in state/context
    }
  }, [currentUser]);

  const formUIProps = useMemo(() => {
    return {
      initUser: initUser,
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
    userForEdit: state.UserModule.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.UserModule.userForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchUserForEdit(id));

    dispatch(actions.fetchRoles());
    // dispatch(actions.fetchUser(formUIProps .queryParams))
  }, [id, dispatch]);


  const saveForm = async (user) => {



    if (!id) {

      dispatch(actions.createUser(user, disbaleLoading, onHide));



    } else {



      // user.number_of_days=


      const formUpdatedFields = {
        Id: user.Id,
        subsidiaryId: user.subsidiaryId,
        employeeIdMapping: user.employeeIdMapping,
        deactiveflag: user.deactiveflag,
        roleId: user.roleId,
        allowUserCreation: user.allowUserCreation,
        password: user.password,
        email: user.email,
        supervisedbyId: user.supervisedbyId,







      };


      await dispatch(actions.updateUser(formUpdatedFields, disbaleLoading, onHide));
      await dispatch(actions.fetchUser(usersUIProps.queryParams));
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
        user={userForEdit || formUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
        userStatusTypes={userStatusTypes}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        id={id}
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
