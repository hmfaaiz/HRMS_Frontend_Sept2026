import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/formAction";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { FormEditDialogHeader } from "./FormDialogHeader";
import MasterEditForm from "./MasterEditForm";

export function FormEditDialog({ id, show, onHide, isUserForRead }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      selectedJob: FormUIContext?.selectedJob,
      selectedApplicant: FormUIContext?.selectedApplicant,
      applicantVacancyId: FormUIContext?.applicantVacancyId,
    };
  }, [FormUIContext]);

  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const { userForEdit, actionsLoading  , entities} = useSelector(
    (state) => ({
      userForEdit: state.interview_schedule.userForEdit,
      entities: state.interview_schedule.entities,
      actionsLoading: state.interview_schedule.actionsLoading,
    }),
    shallowEqual
  );


  useEffect(() => {
    if (id) {
      dispatch(actions.fetchInterview(id));
    }
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
      await dispatch(actions.updateInterview(data, disbaleLoading, onHide));
      await dispatch(
        actions.fetchInterviewList({
          ...formUIProps.queryParams,
          applicantVacancyId: formUIProps?.applicantVacancyId,
          applicantId: formUIProps?.selectedApplicant,
        })
      );
    }
  };

  return (
    <Modal
      size="lg"
      dialogClassName="modal-70vw"
      aria-labelledby="example-modal-sizes-title-lg"
      show={show && formUIProps?.selectedJob && formUIProps?.selectedApplicant}
      onHide={onHide}
    >
      <FormEditDialogHeader id={id} isUserForRead={isUserForRead} />
      <MasterEditForm
        saveForm={saveForm}
        data={id ? userForEdit : formUIProps.initUser}
        onHide={onHide}
        isUserForRead={isUserForRead}
        actionsLoading={actionsLoading}
        loading={loading}
        minDate={entities?.length > 0 ? entities[0].interview_date : ""}
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
