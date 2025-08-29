import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { DesignationEditForm } from "./DesignationEditForm";
import { DesignationEditDialogHeader } from './DesignationEditDialogHeader'

import * as actions from "../../../_redux/designationActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDesignationUIContext } from "../DesignationUIContext";

export function ContactEditDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "EmployeeProfileEditDialog";
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
    userForEdit: state.profile.userForEdit,
    roles: state.users.roles,
    centers: state.users.centers,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.profile.userForRead,
  
  }));

  // useEffect(() => {
  //   if (actionsLoading) {
  //     onHide();
  //   }
  // }, [actionsLoading === true]);



  useEffect(() => {
    dispatch(actions.fetchUser(id));

    // dispatch(actions.fetchUser(banksUIProps.queryParams))
  }, [id, dispatch]);

  // useEffect(() => {

  //   if (actionsLoading === false) {

  //     disbaleLoading();
  //   }
  // }, [actionsLoading]);
  

  const saveEmployeeProfile = (user, image,contactList,workExperienceList) => {

    if (!id) {

   
      const finalObject = { user }
      dispatch(actions.createEmpProfile({...user, profile_image: image,contactList,workExperienceList}, disbaleLoading, onHide));

    } else {
      // const getUserStatus = userStatusTypes.find((item) => {
      //   return item.value === +user.status;
      // });

   

      const EmpProfileUpdatedFields = {
        Id: user.Id,
        designationId: user.designationId,
        subsidiaryId: user.subsidiaryId,
        title: user.title,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        employeeCode: user.employeeCode,
        profile_image: image,
        nic_no: user.nic_no,
        passportNo: user.passportNo,
        maritalStatus: user.maritalStatus,
        gender: user.gender,
        nationality: user.nationality,
        email_official: user.email_official,
        email_personal: user.email_personal,
        phone_home: user.phone_home,
        phone_official: user.phone_official,
        phone_cell: user.phone_cell,
        professional_summary: user.professional_summary,
        additional_summary: user.additional_summary,
        status: user.status,
        departmentId: user.departmentId,
        teamId: user.teamId,
        payrollGroupId: user.payrollGroupId,
        regionId: user.regionId,
        religionId: user.religionId,
        employeeTypeId: user.employeeTypeId,
        locationId: user.locationId,
        countryId: user.countryId,
        cityId: user.cityId,
        dateOfJoining: user.dateOfJoining,
        dateOfConfirmation: user.dateOfConfirmation,
        dateOfConfirmationDue: user.dateOfConfirmationDue,
        dateOfConfirmationEnter: user.dateOfConfirmationEnter,
        dateOfContractExpiry: user.dateOfContractExpiry,
        defaultShiftId: user.defaultShiftId,
        attendanceType: user.attendanceType,
        dateOfBirth: user.dateOfBirth,
        dateOfRetirement: user.dateOfRetirement
      };

   
      dispatch(actions.updateEmpProfile(EmpProfileUpdatedFields,contactList, disbaleLoading, onHide));
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
        saveEmployeeProfile={saveEmployeeProfile}
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
