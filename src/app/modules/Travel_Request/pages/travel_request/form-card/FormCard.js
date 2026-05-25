import React, { useMemo, useEffect, useState } from "react";
import { useFormUIContext } from "../FormUIContext";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";
import { getEmployeeProfileById } from "../../../../../../_metronic/redux/dashboardCrud";
import { FormEditForm } from "../form-edit-dialog/FormEditForm";
import { FormTable } from "../form-table/FormTable";
import { FormFilter } from "../form-filter/FormFilter";
import { CirclePlus } from "lucide-react";
import * as actions from "../../../_redux/redux-Actions";
import { WorkflowAuthortiesTable } from "../form-table/WorkflowAuthortiesTable";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isViewMode, setIsViewMode] = useState(false);
  const [viewRowData, setViewRowData] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    auth,
    employeeEntitlement,
    allEmployees,
    employeeId,
    travel,
  } = useSelector(
    (state) => ({
      auth: state.auth,
      employeeId: state?.auth?.user?.employeeIdMapping,
      employeeEntitlement: state.travel_request.employeeEntitlement,
      allEmployees: state.dashboard.allEmployees,
      travel: state?.auth?.userAccess["Payroll"],
    }),
    shallowEqual,
  );

  const loggedUser = auth?.user;
  const dispatch = useDispatch();

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const FormUIProps = useMemo(() => {
    return {
      panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
      userForEdit: FormUIContext.userForEdit,
      setUserForEdit: FormUIContext.setUserForEdit,
      setUserForRead: FormUIContext.setUserForRead,
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
      setIds: FormUIContext.setIds,
      employeeId: FormUIContext.employeeId,
      setEmployeeId: FormUIContext.setEmployeeId,
    };
  }, [FormUIContext]);

  // Force Self-Service: Set employeeId and update QueryParams
  useEffect(() => {
    const currentEmployeeId = loggedUser?.employeeIdMapping || loggedUser?.id;

    if (currentEmployeeId) {
      FormUIProps.setEmployeeId(currentEmployeeId);

      // Inject employeeId into queryParams to filter table for self only
      FormUIProps.setQueryParams((prev) => ({
        ...prev,
        employeeId: currentEmployeeId,
        filter: {
          ...prev.filter,
          employeeId: currentEmployeeId,
        },
      }));

      // Fetch TADA policy for warning message
      dispatch(actions.fetchTadaConfigByEmployeeId(currentEmployeeId));
    }
  }, [loggedUser, dispatch]);

  useEffect(() => {
    if (!allEmployees || !allEmployees.length) {
      dispatch(fetchAllActiveEmployees());
    }
  }, [dispatch, allEmployees]);

  // Fetch employee profile details when employeeId changes
  useEffect(() => {
    if (FormUIProps.employeeId) {
      getEmployeeProfileById(FormUIProps.employeeId)
        .then((res) => {
          if (res?.data?.data) {
            setEmployeeDetails(res.data.data);
          }
        })
        .catch(() => {
          setEmployeeDetails({});
        });
    } else {
      setEmployeeDetails({});
    }
  }, [FormUIProps.employeeId]);

  useEffect(() => {
    dispatch(actions.getEmployeeAuthorities(employeeId));
  }, [employeeId]);

  // Handle Add New button click
  const handleAddNew = () => {
    setIsViewMode(false);
    setViewRowData(null);
    FormUIProps.setPanelMode(false);
    FormUIProps.setUserForEdit({}); // Open form with empty object
  };

  // Handle View from table
  const handleViewFromTable = (row) => {
    setIsViewMode(true);
    setViewRowData(row);
    FormUIProps.setUserForEdit(null);
    FormUIProps.setPanelMode(false);
  };

  // Handle Cancel
  const handleCancel = () => {
    FormUIProps.setUserForEdit(null);
    FormUIProps.setPanelMode(false);
    setIsViewMode(false);
    setViewRowData(null);
  };

  const saveForm = (values) => {
    enableLoading();
    dispatch(actions.createTravelRequest(values, disableLoading, handleCancel));
  };

  const menuOptions = [
    {
      name: "Travel Request",
      link: "/travel_request/read-all-travel-request",
      isShow: travel?.some(
        (el) =>
          (el?.componentName === "TravelRequest" ||
            el?.slug === "read-all-travel-request") &&
          el?.isResourceShow,
      ),
    },
    {
      name: "Post Travel Request",
      link: "/post_travel_request/read-all-post-travel-request",
      isShow: travel?.some(
        (el) =>
          (el?.componentName === "ReadAllPostTravelRequest" ||
            el?.slug === "read-all-post-travel-request") &&
          el?.isResourceShow,
      ),
    },
    {
      name: "Approval",
      link: "/travel_request_approval/read-all-travel-request-approval",
      isShow: travel?.some(
        (el) =>
          (el?.componentName === "TravelRequestApproval" ||
            el?.componentName === "ReadAllTravelRequestApproval" ||
            el?.slug === "read-all-travel-request-approval") &&
          el?.isResourceShow,
      ),
    },
    {
      name: "Workflow Status",
      link:
        "/travel_request_workflow_status/read-all-travel-request-workflow-status",
      isShow: travel?.some(
        (el) =>
          (el?.componentName === "TravelRequestWorkflowStatus" ||
            el?.componentName === "ReadAllTravelRequestWorkflowStatus" ||
            el?.slug === "read-all-travel-request-workflow-status") &&
          el?.isResourceShow,
      ),
    },
  ];

  console.log("wow", travel)
  const hasPolicy = !!employeeEntitlement;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* Sidebar with Logged-in User Profile */}
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

      {/* Main Content Area */}
      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>

        {/* Table View - Always visible */}
        <div className="px-3 py-2 rounded-lg bg-white">
          <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2 mb-6">
            <FormFilter />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddNew}
              >
                <CirclePlus className="w-4 h-4 text-white mr-2" />
                Add
              </button>
            </div>
          </div>

          <FormTable onViewClick={handleViewFromTable} />
        </div>

        {/* Form - Add Mode */}
        {FormUIProps.userForEdit && !isViewMode && (
          <div className="px-3 py-2 rounded-lg bg-white  relative">
            {FormUIProps.employeeId && (
              <FormEditForm
                employeeId={FormUIProps.employeeId}
                employeeDetails={employeeDetails}
                onCancel={handleCancel}
                saveForm={saveForm}
                onHide={handleCancel}
                disableLoading={disableLoading}
              />
            )}
          </div>
        )}

        {/* Form - View Mode */}
        {isViewMode && viewRowData && (
          <div className="px-3 py-2 rounded-lg bg-white  relative">
            <FormEditForm
              employeeId={viewRowData.employeeId}
              employeeDetails={employeeDetails}
              onCancel={handleCancel}
              user={viewRowData}
              isReadOnly={true}
            />
          </div>
        )}

        {/* Workflow Authorities Card */}
        <WorkflowAuthortiesTable />
      </div>
    </div>
  );
}
