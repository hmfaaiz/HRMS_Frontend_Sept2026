import React, { useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { FormFilter } from "../form-filter/FormFilter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useFormUIContext } from "../../FormUIContext";
import * as action from "../../../_redux/redux-Action";
import { TravelWorkflowStatusTable } from "../form-table/TravelWorkflowStatusTable";
import { TravelWorkflowTable } from "../form-table/TravelWorkflowTable";
import { set } from "date-fns";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
export const FormCard = () => {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { listLoading, user, tada } = useSelector(
    (state) => ({
      listLoading: state?.TravelRequestWorkflowStatus?.listLoading,
      user: state?.auth?.user,
      tada: state?.auth?.userAccess["Payroll"],
    }),
    shallowEqual,
  );

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext?.queryParams,
      setQueryParams: FormUIContext?.setQueryParams,
      workflowId: FormUIContext?.workflowId,
      setWorkflowId: FormUIContext?.setWorkflowId,
      setRowData: FormUIContext?.setRowData,
    };
  });
  const menuOptions = [
    {
      name: "Request",
      link: "/travel_request/read-all-travel-request",
      isShow: tada?.find(
        (el) =>
          (el?.componentName === "TravelRequest" ||
            el?.componentName === "ReadAllTravelRequest" ||
            el?.slug === "read-all-travel-request") &&
          el?.isResourceShow,
      ),
    },
    {
      name: "Approval",
      link: "/travel_request_approval/read-all-travel-request-approval",
      isShow: tada?.find(
        (el) =>
          (el?.componentName === "TravelRequestApproval" ||
            el?.componentName === "ReadAllTravelRequestApproval" ||
            el?.slug === "read-all-travel-request-approval") &&
          el?.isResourceShow,
      ),
    },
  ];

  useEffect(() => {
    dispatch(
      action.fetchTravelWorkflowStatus(
        formUIProps?.queryParams,
        user?.employeeIdMapping,
      ),
    );
  }, [formUIProps?.queryParams]);

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
          <FormFilter
            loading={listLoading}
            queryParams={formUIProps.queryParams}
          />
          <TravelWorkflowStatusTable />
        </div>

        {formUIProps.workflowId && (
          <TravelWorkflowTable
            onHide={() => {
              formUIProps.setWorkflowId(null);
              formUIProps.setRowData(null);
            }}
            show={formUIProps.workflowId !== null}
          />
        )}
      </div>
    </div>
  );
};
