import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";
import * as actions from "../../../redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../../FormUIContext";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const dispatch = useDispatch();
  const { userForEdit, workflowRecord } = useSelector(
    (state) => ({
      userForEdit: state.travel_approval?.userForEdit,
      workflowRecord: state.travel_approval?.workflowRecord,
    }),

    shallowEqual,
  );

  const workflowId = userForEdit?.workflowId; // This should be 584

  console.log("🔍 workflowRecord:", workflowRecord);
  console.log("🔍 Workflow ID to send:", workflowId);

  useEffect(() => {
    dispatch(actions.fetchTravelApprovalRequestWorkflow(id));
  }, [id, dispatch]);

  const saveForm = async (values) => {
    console.log("🚀 Submitting with ID:", id);

    enableLoading();

    const formatLocalDate = (dateObj) => {
      if (!dateObj) return null;
      const d = new Date(dateObj);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const payload = {
      Ids: [id], // Use the prop 'id' directly as it is the WorkflowStatus ID
      request_status: values.request_status || "A",
      approved_status: values.isApproving ? 1 : 0,
      authorityRemarks:
        values.authorityRemarks || (values.isApproving ? "Approved" : ""),
      updatedData: {
        ...values,
        isAccessToUpdate: values.isAccessToUpdate,
        parentRecordId: values.parentRecordId || values.Id,
        workflowId: id,
        dailyAllowanceDay: values.dailyAllowanceDays, // Map back to original name
        advanceAmount: values.advanceRequested ? values.advanceAmount : 0,
        travelSegments:
          values.travelSegments?.map((segment) => ({
            childMasterId: segment.childMasterId,
            fromLocationId: segment.fromLocation,
            toLocationId: segment.toLocation,
            fromDate: formatLocalDate(segment.fromDate),
            toDate: formatLocalDate(segment.toDate),
            modeOfTravelId: segment.modeOfTravel,
            classOfTravelId: segment.classOfTravel,
            accomodationRequired: segment.accommodationRequired,
            hotelEntitlementId: segment.hotelEntitlement,
            hotelEntitlementAmount: segment.hotelEntitlementAmount,
            selfEntitlement: segment.selfEntitlement,
            selfAmount: segment.selfAmount,
          })) || [],
      },
    };

    console.log("📦 FINAL PAYLOAD TO SEND:", payload);

    await dispatch(actions.handleTravelRequestApproval(payload));
    await dispatch(
      actions.fetchTravelApprovalRequests(formUIProps.queryParams),
    );
    disableLoading();
    onHide();
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      backdrop="static"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps.initUser}
        onHide={onHide}
        isReadOnly={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        disableLoading={disableLoading}
        id={id}
        employeeId={user?.employeeId}
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
