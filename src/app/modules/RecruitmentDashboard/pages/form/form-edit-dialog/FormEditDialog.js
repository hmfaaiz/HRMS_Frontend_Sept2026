import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";


export function FormEditDialog({ id,jobId, show, dataForRead, onHide }) {
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
    dataForEdit,
    isdataForRead,
  } = useSelector((state) => {

    return {
      actionsLoading: state.users.actionsLoading,
      dataForEdit: state.recruitment_dashboard.dataForEdit,
      isdataForRead: state.recruitment_dashboard.dataForRead,
    };
  });




  useEffect(() => {
    if (id,jobId) {

      dispatch(actions.FetchRecruitmentDashboardDetail(formUIProps.queryParams,id,jobId));
    }
  }, [id,jobId,formUIProps.queryParams, dispatch]);



  return (
    <Modal
      size="lg"
      dialogClassName="modal-75vw"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isdataForRead={dataForRead} />
      {/* <FormEditForm
        onHide={onHide}

        enableLoading={enableLoading}
        loading={loading}

      /> */}

      <Modal.Body className="p-4"> {/* Apply padding here */}
        <FormEditForm
          onHide={onHide}
          enableLoading={enableLoading}
          loading={loading}
        />
      </Modal.Body>
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
