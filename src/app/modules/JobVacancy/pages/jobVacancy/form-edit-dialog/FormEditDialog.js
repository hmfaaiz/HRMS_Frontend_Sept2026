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
    dataForEdit: state.job_vacancy.dataForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isdataForRead: state.job_vacancy.dataForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchJobVacancyById(id));

    // dispatch(actions.fetchJobVacancy(formUIProps .queryParams))
  }, [id, dispatch]);


  const saveForm = async (formData, diffInDate) => {



    if (!id) {

      dispatch(actions.createJobVacancy(formData, disbaleLoading, onHide));



    } else {



      // user.number_of_days=
     const formUpdatedFields = {
  Id: formData.Id,
  subsidiaryId: formData.subsidiaryId,
  companyId: formData.companyId,
  jobCode: formData.jobCode,
  jobDate: formData.jobDate,
  designationId: formData.designationId,
  jobTitle: formData.jobTitle,
  gradeId: formData.gradeId,
  locationId: formData.locationId,
  jobPostingDateFrom: formData.jobPostingDateFrom,
  jobPostingDateTo: formData.jobPostingDateTo,
  countryId: formData.countryId,
  cityId: formData.cityId,
  employeeTypeId: formData.employeeTypeId,
  employeeStatusId: formData.employeeStatusId,
  departmentId:formData.departmentId,
  reportToDesignationId: formData.reportToDesignationId,
  relationshipWithReportTo: formData.relationshipWithReportTo,
  noOfPosition: formData.noOfPosition,
  hiringReasonId: formData.hiringReasonId,
  jobPreferenceId: formData.jobPreferenceId,
  appointmentTypeId: formData.appointmentTypeId,
  comment: formData.comment,
  jobPeriodStart: formData.jobPeriodStart,
  jobPeriodEnd: formData.jobPeriodEnd,
  desireDateOfApp: formData.desireDateOfApp,
  priorityTypeId: formData.priorityTypeId,
  criticalDays: formData.criticalDays,
  preferredAgeFrom: formData.preferredAgeFrom,
  preferredAgeTo: formData.preferredAgeTo,
  preferredShiftId: formData.preferredShiftId,
  preferredGenderId: formData.preferredGenderId,
  preferredQualificationId: formData.preferredQualificationId,
  preferredJobSkillsId: formData.preferredJobSkillsId,
  preferredJobIndustryId: formData.preferredJobIndustryId,
  workExpFrom: formData.workExpFrom,
  workExpTo: formData.workExpTo,
  workExpDetail: formData.workExpDetail,
  additionalReq: formData.additionalReq,
  salaryRangeFrom: formData.salaryRangeFrom,
  salaryRangeTo: formData.salaryRangeTo,
  incentivePackages: formData.incentivePackages,
  otherBenefits: formData.otherBenefits,
  jobSummary: formData.jobSummary,

};



      await dispatch(actions.updateJobVacancy(formUpdatedFields, disbaleLoading, onHide));
      await dispatch(actions.fetchJobVacancy(usersUIProps.queryParams));
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
