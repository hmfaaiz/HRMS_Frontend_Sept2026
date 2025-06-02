import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/formAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { FormEditDialogHeader } from "./FormDialogHeader";
import MasterEditForm from "./MasterEditForm";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [loading, setLoading] = useState(false);
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
      selectedJob: FormUIContext?.selectedJob,
      selectedApplicant: FormUIContext?.selectedApplicant,
      applicantVacancyId: FormUIContext?.applicantVacancyId,
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
  } = useSelector(
    (state) => ({
      actionsLoading: state.users.actionsLoading,
      user: state.users, // change for users to receipt
      userForEdit: state.interview_schedule.userForEdit,
      roles: state.users.roles,
      userStatusTypes: state.users.userStatusTypes,
      isuserForRead: state.interview_schedule.userForRead,
    }),
    shallowEqual
  );

  useEffect(() => {
    // dispatch(actions.fetchHoliday(id));
    // dispatch(actions.fetchHoliday(formUIProps .queryParams))
  }, [id, dispatch]);

  const saveForm = async (data) => {
    if (!id) {
      let payload = {
        ...data,
        jobVacancyId: formUIProps.selectedJob,
        applicantId: formUIProps.selectedApplicant,
        applicantVacancyId: formUIProps?.applicantVacancyId,
      };
      dispatch(actions.createInterview(payload, disbaleLoading, onHide));
    } else {
      // user.number_of_days=
      const formUpdatedFields = {
        Id: user.Id,
        subsidiaryId: user.subsidiaryId,
        name: user.name,
        religionId: user.religionId,
        from_date: user.from_date,
        to_date: user.to_date,
        // number_of_days: diffInDate,
        holiday_typeId: user.holiday_typeId,
      };

      //  await dispatch(actions.updateHoliday(formUpdatedFields, disbaleLoading, onHide));
      //  await dispatch(actions.fetchHolidays(usersUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="xl"
      show={show && formUIProps?.selectedJob && formUIProps?.selectedApplicant}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <MasterEditForm
        saveForm={saveForm}
        data={userForEdit || formUIProps.initUser}
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
