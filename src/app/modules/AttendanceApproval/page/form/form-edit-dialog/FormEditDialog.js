import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";
import * as actions from "../../../redux/formAction";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../../FormUIContext";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import ActivePayrollMonthLabel from "../../../../../utils/common-modules/ActivePayrollMonthLabel";

export function FormEditDialog({ onHide, show }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();
  const { Id } = useParams();

  useEffect(() => {
    if (!Id) {
      onHide();
      return;
    }
    dispatch(actions.getAttendanceRequestData(Id, onHide));
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
  const { userForEdit, user } = useSelector(
    (state) => ({
      userForEdit: state.attendance_approval.attDetail,
      user: state?.auth?.user,
    }),
    shallowEqual,
  );

  //Create or Upadate record according to values from dialog
  const submitForm = async (values) => {
    try {
      await dispatch(
        actions.updateAttendanceRequestData(
          { ...values },
          disbaleLoading,
          onHide,
        ),
      );
      dispatch(
        actions.fetchAttendanceApprovalApplication(
          formUIProps.queryParams,
          user?.employeeIdMapping,
        ),
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
          <Modal.Title
            style={{ width: "100%" }}
            id="example-modal-sizes-title-lg"
          >
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <h5 className="font-bold mb-0 max-lg:text-sm text-black">
                Update Attendance Request
              </h5>
              
            </div>
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
