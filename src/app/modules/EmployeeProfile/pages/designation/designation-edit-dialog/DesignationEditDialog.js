import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { DesignationEditForm } from "./DesignationEditForm";
import { DesignationEditDialogHeader } from "./DesignationEditDialogHeader";

import * as actions from "../../../_redux/designationActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDesignationUIContext } from "../DesignationUIContext";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

export function DesignationEditDialog({
  id,
  show,
  onHide,
  userForRead,
  status,
}) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "EmployeeProfileEditDialog";
  const DesignationUIContext = useDesignationUIContext();

  const [activeKey, setActiveKey] = useState("0");

  useEffect(() => {
    setActiveKey("0"); // jab new user aaye to accordion open kar do
  }, [id, status]);
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

  useEffect(() => {
    dispatch(actions.fetchUser(id));

    // dispatch(actions.fetchUser(banksUIProps.queryParams))
  }, [id, dispatch]);

  const saveEmployeeProfile = async (
    user,
    image,
    contactList,
    workExperienceList,
    academicList,
    skillsList,
    incidentList,
    imagePolicy,
    isImageReq,employeeStatusLabel
  ) => {
    delete user?.all_report_to;
    delete user?.all_deligationId;

     if (!user?.dateOfConfirmation && user?.employeeTypeId == 148 &&  employeeStatusLabel == "Confirmed") {
       disbaleLoading();
      toast.error("Date of confirmation is required.", {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return
     }
       if (!user?.dateOfContractExpiry &&  user?.employeeTypeId == 147) {
       disbaleLoading();
      toast.error("Date of contract expiry is required.", {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return
     }


    if (user?.requireDeligation && !user?.deligationId) {
      disbaleLoading();
      toast.error("Deligation is required.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (imagePolicy && isImageReq) {
      disbaleLoading();

      toast.error("Profile image is required.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (!id) {
      const finalObject = { user };
      await dispatch(
        actions.createEmpProfile(
          {
            ...user,
            contactList,
            workExperienceList,
            academicList,
            skillsList,
            incidentList,
            profile_image: image,
          },
          disbaleLoading,
          onHide
        )
      );
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));
    } else {
      // const getUserStatus = userStatusTypes.find((item) => {
      //   return item.value === +user.status;
      // });

      const EmpProfileUpdatedFields = {
        Id: user.Id,
        subsidiaryId: user.subsidiaryId,
        designationId: user.designationId,
        gradeId: user.gradeId,
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
        reportTo: user.reportTo,
        dateOfJoining: user.dateOfJoining,
        dateOfConfirmation: user.dateOfConfirmation,
        dateOfConfirmationDue: user.dateOfConfirmationDue,
        dateOfConfirmationEnter: user.dateOfConfirmationEnter,
        dateOfContractExpiry: user.dateOfContractExpiry,
        defaultShiftId: user.defaultShiftId,
        attendanceType: user.attendanceType,
        dateOfBirth: user.dateOfBirth,
        dateOfRetirement: user.dateOfRetirement,
        dateOfRetirementOptional: user.dateOfRetirementOptional,
        salesRep: user.salesRep,
        supportRep: user.supportRep,
        sourceOfHire: user.sourceOfHire,
        lastReviewDate: user.lastReviewDate,
        nextReviewDate: user.nextReviewDate,
        laborCardNo: user.laborCardNo,
        drivingLicenseExpiry: user.drivingLicenseExpiry,
        emiratesId: user.emiratesId,
        emiratesNo: user.emiratesNo,
        passportExpiry: user.passportExpiry,
        nicExpiry: user.nicExpiry,
        deligation: user.deligation,
        personId: user.personId,
        routingCode: user.routingCode,
        contractTypeId: user.contractTypeId,
        cycleTypeId: user.cycleTypeId,
        requireDeligation: user.requireDeligation,
        employeeStatusId: user.employeeStatusId,
        approvedForPayroll: user.approvedForPayroll,
        deligationId: user?.deligationId,
        relation_name: user?.relation_name,
        hod: user?.hod,
      };

      await dispatch(
        actions.updateEmpProfile(
          EmpProfileUpdatedFields,
          contactList,
          workExperienceList,
          academicList,
          skillsList,
          incidentList,
          disbaleLoading,
          onHide
        )
      );
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));
    }
  };

  return (
    // <Modal
    //   size="xl"
    //   show={show}
    //   onHide={onHide}
    //   aria-labelledby="example-modal-sizes-title-lg"
    //   backdrop="static"
    // >

    <div className="w-full font-size-xs px-3 py-2 mt-2 bg-white rounded-lg overflow-y-auto">
      <h5 className="m-0 text-black font-bold text-base sm:text-lg py-1">
        Employee Profile
      </h5>
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
    </div>

    // </Modal>
  );
}
