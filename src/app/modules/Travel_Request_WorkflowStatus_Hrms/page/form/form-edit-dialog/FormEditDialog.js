import React, { useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import * as actions from "../../../_redux/formActions";
import { useFormUIContext } from "../../FormUIContext";
import { FormEditDialogHeader } from "./FormEditDialogHeader";

export function FormEditDialog({ id, onHide }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const dispatch = useDispatch();
  const { userForEdit } = useSelector(
    (state) => ({
      userForEdit: state.TravelRequestWorkflowAdmin?.userForEdit,
    }),
    shallowEqual,
  );

  const workflowId = userForEdit?.workflowId;

  useEffect(() => {
    if (id) {
      dispatch(actions.fetchTravelApprovalRequestWorkflow(id));
    }
  }, [id, dispatch]);

  const saveForm = async (values) => {
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
      Ids: [workflowId],
      request_status: values.request_status || "A",
      approved_status: values.isApproving ? 1 : 0,
      authorityRemarks:
        values.authorityRemarks || (values.isApproving ? "Approved" : ""),
      updatedData: {
        ...values,
        workflowId: workflowId,
        dailyAllowanceDay: values.dailyAllowanceDays,
        advanceAmount: values.advanceRequested ? values.advanceAmount : 0,
        travelSegments:
          values.travelSegments?.map((segment) => ({
            fromLocation: segment.fromLocation,
            toLocation: segment.toLocation,
            fromDate: formatLocalDate(segment.fromDate),
            toDate: formatLocalDate(segment.toDate),
            modeOfTravel: segment.modeOfTravel,
            classOfTravel: segment.classOfTravel,
            accommodationRequired: segment.accommodationRequired,
            hotelEntitlement: segment.hotelEntitlement,
            hotelEntitlementAmount: segment.hotelEntitlementAmount,
            selfEntitlement: segment.selfEntitlement,
            selfAmount: segment.selfAmount,
          })) || [],
      },
    };

    await dispatch(actions.handleTravelRequestApproval(payload));
    await dispatch(
      actions.fetchTravelApprovalApplication(FormUIContext.queryParams),
    );
    disableLoading();
    onHide();
  };

  if (!id) return null;

  return (
    <div className="px-3 py-4 rounded-lg bg-white mt-4 shadow-sm border">
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit}
        onCancel={onHide}
        onHide={onHide}
        isReadOnly={false}
        enableLoading={enableLoading}
        loading={loading}
        disableLoading={disableLoading}
        id={id}
        employeeId={userForEdit?.Employee?.Id}
      />
    </div>
  );
}
