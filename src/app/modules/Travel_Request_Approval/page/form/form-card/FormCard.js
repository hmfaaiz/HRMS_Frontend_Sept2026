import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useFormUIContext } from "../../FormUIContext";
import * as action from "../../../redux/redux-Actions";
import { ApprovalFormTable } from "../form-table/ApprovalTable";
import { WorkflowTable } from "../form-table/WorkflowTable";
import { FormEditForm } from "../form-edit-dialog/FormEditForm";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";

export const FormCard = () => {
  const [loading, setLoading] = useState(false);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { listLoading, user, travel, userForEdit } = useSelector(
    (state) => ({
      listLoading: state?.travel_approval?.listLoading,
      user: state?.auth?.user,
      travel: state?.auth?.userAccess["Payroll"],
      userForEdit: state.travel_approval?.userForEdit,
    }),
    shallowEqual,
  );

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext?.queryParams,
      setQueryParams: FormUIContext?.setQueryParams,
      workflowId: FormUIContext?.workflowId,
      setWorkflowId: FormUIContext?.setWorkflowId,
      panelMode: FormUIContext?.panelMode,
      setPanelMode: FormUIContext?.setPanelMode,
      id: FormUIContext?.id,
      setId: FormUIContext?.setId,
      showWorkflow: FormUIContext?.showWorkflow,
      setShowWorkflow: FormUIContext?.setShowWorkflow,
      userForRead: FormUIContext?.userForRead,
      setUserForRead: FormUIContext?.setUserForRead,
    };
  }, [FormUIContext]);

  useEffect(() => {
    dispatch(
      action.fetchTravelApprovalRequests(
        formUIProps?.queryParams,
        user?.employeeIdMapping,
      ),
    );
  }, [formUIProps?.queryParams, user?.employeeIdMapping, dispatch]);

  useEffect(() => {
    if (formUIProps.panelMode && formUIProps.id) {
      dispatch(action.fetchTravelApprovalRequestWorkflow(formUIProps.id));
    }
  }, [formUIProps.panelMode, formUIProps.id, dispatch]);

  const handleCancel = () => {
    formUIProps.setPanelMode(false);
    formUIProps.setId(null);
    formUIProps.setUserForRead(false);
    formUIProps.setShowWorkflow(false);
  };

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

    const updatedData = {
      ...values,
      purposeOfTravel: values.purposeOfTravel,
      projectName: values.projectName,
      travelType: values.travelType,
      dailyAllowanceRate: values.dailyAllowanceRate,
      dailyAllowanceDay: values.dailyAllowanceDays,
      dailyAllowanceAmount: values.dailyAllowanceAmount,
      advanceRequired: values.advanceRequested,
      advanceAmount: values.advanceRequested ? values.advanceAmount : 0,
      advanceRemarks: values.advanceRequested ? values.advanceRemarks : "",
      travelRequestRemarks: values.travelRemarks,
      taxiFareAmount: values.taxiFareAmount || 0,
      otherAmount: values.otherAmount || 0,
      totalTravelBudget: values.totalTravelBudget || 0,
      travelDetails: (values.travelSegments || []).map((segment) => ({
        ...segment,
        fromLocationId: segment.fromLocation,
        toLocationId: segment.toLocation,
        fromDate: formatLocalDate(segment.fromDate),
        toDate: formatLocalDate(segment.toDate),
        modeOfTravelId: segment.modeOfTravel,
        classOfTravelId: segment.classOfTravel,
        accomodationRequired: segment.accommodationRequired,
        hotelEntitlementId: segment.hotelEntitlement || null,
        hotelEntitlementAmount: segment.hotelEntitlementAmount || 0,
        selfEntitlement: segment.selfEntitlement || false,
        selfAmount: segment.selfAmount || null,
      })),
    };

    const payload = {
      Ids: [values.workflowId],
      request_status: values.request_status,
      authorityRemarks:
        values.authorityRemarks ||
        (values.request_status === "A" ? "Approved" : ""),
      updatedData: updatedData,
    };

    await dispatch(action.handleTravelRequestApproval(payload));
    await dispatch(
      action.fetchTravelApprovalRequests(
        formUIProps?.queryParams,
        user?.employeeIdMapping,
      ),
    );
    disableLoading();
    handleCancel();
  };

  const menuOptions = [
    {
      name: "Request",
      link: "/travel_request/read-all-travel-request",
      isShow: travel?.find(
        (el) =>
          (el?.componentName === "ReadAllTravelRequest" ||
            el?.slug === "read-all-travel-request") &&
          el?.isResourceShow,
      ),
    },
    {
      name: "Workflow Status",
      link:
        "/travel_request_workflow_status/read-all-travel-request-workflow-status",
      isShow: travel?.find(
        (el) =>
          (el?.componentName === "TravelRequestWorkflowStatus" ||
            el?.componentName === "ReadAllTravelRequestWorkflowStatus" ||
            el?.slug === "read-all-travel-request-workflow-status") &&
          el?.isResourceShow,
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div>
      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>

        <div className="px-3 py-2 rounded-lg bg-white">
          <ApprovalFormTable />
        </div>

        {formUIProps.panelMode && (
          <div className="px-3 py-2 rounded-lg bg-white ">
            <FormEditForm
              user={userForEdit}
              id={formUIProps.id}
              saveForm={saveForm}
              enableLoading={enableLoading}
              loading={loading}
              disableLoading={disableLoading}
              onHide={handleCancel}
              onCancel={handleCancel}
              isReadOnly={formUIProps.userForRead}
            />
          </div>
        )}

        {formUIProps.showWorkflow && (
          <WorkflowTable
            onHide={() => {
              formUIProps.setShowWorkflow(false);
            }}
            show={formUIProps.showWorkflow}
          />
        )}
      </div>
    </div>
  );
};
