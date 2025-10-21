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
    userForEdit: state.policy.userForEdit,
    roles: state.users.roles,
    centers: state.users.centers,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.policy.userForRead,
  }));



  useEffect(() => {
    dispatch(actions.fetchUser(id));
  }, [id, dispatch]);


  const saveEmpPolicy = async (user) => {

    if (!id) {
  
    
      const finalObject = { user }
     await dispatch(actions.createPolicy(user, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));
    } else {

   
      const policyUpdatedFields = {
        Id: user.Id,
        code: user.code,
        subsidiaryId: user.subsidiaryId,
        currencyId: user.currencyId,
        isEmployeeCodeGenerationAuto: user.isEmployeeCodeGenerationAuto,
        retirementAgeMale: user.retirementAgeMale,
        retirementAgeFemale: user.retirementAgeFemale,
        minimumAge: user.minimumAge,
        maximumAge: user.maximumAge,
        pictureSizeLimit: user.pictureSizeLimit,
        pictureFilesSupport: user.pictureFilesSupport,
        documentSizeLimit: user.documentSizeLimit,
        documentFilesSupport: user.documentFilesSupport,
        empPictureIsMandatory: user.empPictureIsMandatory,
        probationPolicyInMonth: user.probationPolicyInMonth,
        contractualPolicyInMonth: user.contractualPolicyInMonth,
        codePrefix:user.codePrefix,
        salaryMethod:user.salaryMethod,
       
      };


     await dispatch(actions.updatePolicy(policyUpdatedFields, disbaleLoading, onHide));
     await dispatch(actions.fetchUsers(usersUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
        backdrop="static"
    >
      <DesignationEditDialogHeader id={id} isUserForRead={userForRead} />
      <DesignationEditForm
        saveEmpPolicy={saveEmpPolicy}
        user={userForEdit || banksUIProps.initUser}
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
