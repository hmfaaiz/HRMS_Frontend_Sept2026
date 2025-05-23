import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";


export function FormEditDialog({ id, show, onHide, dataForRead }) {
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
    dataForEdit,
    roles,
    centers,
    userStatusTypes,
    isdataForRead,
  } = useSelector((state) => ({


    actionsLoading: state.users.actionsLoading,
    user: state.users, // change for users to receipt
    dataForEdit: state.applicant_profile.dataForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isdataForRead: state.applicant_profile.dataForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchApplicantProfileById(id));

    // dispatch(actions.fetchApplicantProfile(formUIProps .queryParams))
  }, [id, dispatch]);


  const saveForm = async (formData) => {



    if (!formData.Id) {
      if (formData?.file && typeof formData?.file === "object") {
        try {
          const uploadRes = await actions.uploadFile(formData.file);
          formData.file = uploadRes.data.filename;  // e.g. "1747978810103---Resume_CV_Format_Download-6-1-min.pdf"
        } catch (err) {
          console.error("File upload failed:", err);
          // Optionally return here or set a default file value
        }
      } else if (typeof formData?.file == "string") {
        formData.file = formData.file;
      }
      dispatch(actions.createApplicantProfile(formData, disbaleLoading, onHide));



    } else {




      const formUpdatedFields = {
        Id: formData.Id,
        subsidiaryId: formData.subsidiaryId,

        companyId: formData.companyId,
        applicantCode: formData.applicantCode,

        title: formData.title,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,

        dateOfBirth: formData.dateOfBirth,
        laborCardNo: formData.laborCardNo,
        passportNo: formData.passportNo,
        nic_no: formData.nic_no,

        maritalStatus: formData.maritalStatus,
        nationality: formData.nationality,
        gender: formData.gender,
        relation_name: formData.relation_name,
        religionId: formData.religionId,

        countryId: formData.countryId,
        cityId: formData.cityId,
        additional_summary: formData.additional_summary,
        phone_official: formData.phone_official,
        phone_cell: formData.phone_cell,
        email_personal: formData.email_personal,

        applicantCanJoin: formData.applicantCanJoin,
        lastDawnSalary: formData.lastDawnSalary,
        lastDawnSalaryCurrencyId: formData.lastDawnSalaryCurrencyId,
        lastDawnSalaryPayTypeId: formData.lastDawnSalaryPayTypeId,
        expectedSalaryRangeFrom: formData.expectedSalaryRangeFrom,
        expectedSalaryRangeTo: formData.expectedSalaryRangeTo,
        expectedSalaryCurrencyId: formData.expectedSalaryCurrencyId,
        expectedSalaryPayTypeId: formData.expectedSalaryPayTypeId,
        otherInformation: formData.otherInformation,
        currentDesignation: formData.currentDesignation,
        details_applicant_vacancy: formData.details_applicant_vacancy,
        details_applicant_work_experience: formData.details_applicant_work_experience,
        details_applicant_academic_info: formData?.details_applicant_academic_info,
        details_applicant_skills: formData?.details_applicant_skills,
        // email: formData.email,
        applicantStatusId: formData.applicantStatusId,
        applicantStatusReason: formData.applicantStatusReason,
        file: typeof formData.file === "string" ? formData.file : "", // fallback

      };

      if (formData?.file && typeof formData?.file === "object") {
        try {
          const uploadRes = await actions.uploadFile(formData.file);
          formUpdatedFields.file = uploadRes.data.filename;  // e.g. "1747978810103---Resume_CV_Format_Download-6-1-min.pdf"
        } catch (err) {
          console.error("File upload failed:", err);
          // Optionally return here or set a default file value
        }
      } else if (typeof formData?.file == "string") {
        formUpdatedFields.file = formData.file;
      }

      // ✅ Now call the update API after file is correctly set
      await dispatch(actions.updateApplicantProfile(formUpdatedFields, disbaleLoading, onHide));

      await dispatch(actions.fetchApplicantProfile(usersUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isdataForRead={dataForRead} />
      <FormEditForm
        saveForm={saveForm}
        formData={dataForEdit || formUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
        userStatusTypes={userStatusTypes}
        isdataForRead={dataForRead}
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
