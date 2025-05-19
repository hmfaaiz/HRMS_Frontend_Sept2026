import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";

import * as actions from "../../../_redux/formActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";

export function FormEditDialog({ onHide, show }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();
  const { Id } = useParams();

  useEffect(() => {
    if (!Id) {
      onHide();
      return;
    }
    dispatch(actions.fetchEditRecord(Id));
  }, [Id]);

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      employeeId: FormUIContext?.employeeId,
    };
  }, [FormUIContext]);

  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const { userForEdit, empAuthorityList } = useSelector(
    (state) => ({
      userForEdit: state.attendance_request.userForEdit,
      empAuthorityList: state.attendance_request?.empAuthorityList,
    }),
    shallowEqual
  );

  //Create or Upadate record according to values from dialog
  const submitForm = async (values) => {
    try {
      await dispatch(
        actions.saveRecord(
          { ...values, authortiesList: empAuthorityList },
          disbaleLoading,
          onHide
        )
      );
      dispatch(actions.fetchAttendance(formUIProps.queryParams));
      dispatch(
        actions.fetchAttendanceSheetConsolidated(
          formUIProps.queryParams?.filter
        )
      );
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  return (
    <>
      <Modal
        size="lg"
        show={show}
        onHide={onHide}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        {/* {actionsLoading && <ModalProgressBar />} */}
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Create Attendance Request
          </Modal.Title>
        </Modal.Header>
        <MasterEditForm
          submitForm={submitForm}
          user={{ ...userForEdit }}
          onHide={onHide}
          show={show}
          enableLoading={enableLoading}
          employeeId={formUIProps?.employeeId}
          loading={loading}
        />
      </Modal>
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
    </>
  );
}
