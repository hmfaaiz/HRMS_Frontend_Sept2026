import React, { useMemo, useEffect, useState } from "react";
import { useFormUIContext } from "../FormUIContext";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import { EmployeeSelect } from "../form-edit-dialog/EmployeeSelect";
import { FormEditForm } from "../form-edit-dialog/FormEditForm";
import { FormTable } from "../form-table/FormTable";
import { FormFilter, FormSearch } from "../form-filter/FormFilter";
import { CirclePlus } from "lucide-react";
import * as actions from "../../../_redux/redux-Actions";
import TravelProfile from "../form-edit-dialog/TravelProfile";
import { getEmployeeProfileById } from "../../../../../../_metronic/redux/dashboardCrud";

export function FormCard({ onRegisterReset }) {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const moduleName = CurrentModuleName();

  const [showForm, setShowForm] = useState(false);
  const [panelMode, setPanelMode] = useState(false);
  const [travelPanelMode, setTravelPanelMode] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editRowData, setEditRowData] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [viewRowData, setViewRowData] = useState(null);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const FormUIProps = useMemo(
    () => ({
      queryParams: FormUIContext.queryParams,
      employeeId: FormUIContext.employeeId,
      setEmployeeId: FormUIContext.setEmployeeId,
      travelRequestId: FormUIContext.travelRequestId,
      setTravelRequestId: FormUIContext.setTravelRequestId,
      openDeleteFormDialog: FormUIContext.openDeleteFormDialog,
    }),
    [FormUIContext],
  );

  const { userAccess, payrollAccess } = useSelector(
    (state) => ({
      userAccess:
        state.auth?.userAccess?.post_travel_request ||
        state.auth?.userAccess?.post_approval_travel_request,
      payrollAccess: state.auth?.userAccess["Travel"] || [],
    }),
    shallowEqual,
  );

  const accessUser = userAccess?.find(
    (item) =>
      item.componentName === "CreatePostTravelRequestPortal");


  useEffect(() => {
    dispatch(actions.fetchApprovedTravelRequestsByEmployee());
  }, [dispatch]);

  useEffect(() => {
    if (FormUIProps.employeeId) {
      getEmployeeProfileById(FormUIProps.employeeId)
        .then((res) => {
          if (res?.data?.data) setEmployeeDetails(res.data.data);
        })
        .catch(() => setEmployeeDetails({}));
    } else {
      setEmployeeDetails({});
    }
  }, [FormUIProps.employeeId]);

  const resetAllState = () => {
    FormUIProps.setEmployeeId(null);
    FormUIProps.setTravelRequestId(null);
    setPanelMode(false);
    setTravelPanelMode(false);
    setShowForm(false);
    setIsEditMode(false);
    setEditRowData(null);
    setIsViewMode(false);
    setViewRowData(null);
    setEmployeeDetails({});
    dispatch(actions.clearSelectedTravelRequest());
  };

  useEffect(() => {
    if (onRegisterReset) onRegisterReset(resetAllState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddNew = () => {
    resetAllState();
    setShowForm(true);
  };

  const handleCancel = () => {
    resetAllState();
  };

  const handleEditFromTable = (row) => {
    resetAllState();
    setIsEditMode(true);
    setEditRowData(row);
    FormUIProps.setEmployeeId(row.employeeId);
    FormUIProps.setTravelRequestId(row.preApprovalTravelRequestId);
    setShowForm(true);
    dispatch(actions.setSelectedTravelRequest(row.PreApprovalRequest || null));
  };

  const handleViewFromTable = (row) => {
    resetAllState();
    setIsViewMode(true);
    setViewRowData(row);
    FormUIProps.setEmployeeId(row.employeeId);
    FormUIProps.setTravelRequestId(row.preApprovalTravelRequestId);
    setShowForm(true);
    dispatch(actions.setSelectedTravelRequest(row.PreApprovalRequest || null));
  };

  const saveForm = (values) => {
    enableLoading();
    if (!values.id) {
      dispatch(
        actions.createPostTravelRequestPortal(values, disableLoading, handleCancel),
      );
    } else {
      dispatch(
        actions.updatePostTravelRequestPortal(values, disableLoading, handleCancel),
      );
    }
  };

  const activeEmployeeId = isEditMode
    ? editRowData?.employeeId
    : isViewMode
      ? viewRowData?.employeeId
      : FormUIProps.employeeId;

  const activeTravelRequestId = isEditMode
    ? editRowData?.preApprovalTravelRequestId
    : isViewMode
      ? viewRowData?.preApprovalTravelRequestId
      : FormUIProps.travelRequestId;

  const activeUser = isEditMode ? editRowData : isViewMode ? viewRowData : null;

  const showMainForm = showForm && activeEmployeeId && activeTravelRequestId;


  const menuOptions = [
    {
      name: "Travel Request",
      link: "/travel_request/read-all-travel-request",
      isShow: payrollAccess?.some(
        (el) =>
          (el?.componentName === "TravelRequest" ||
            el?.slug === "read-all-travel-request") &&
          el?.isResourceShow,
      ),
    },
    {
      name: "Approval",
      link: "/travel_request_approval/read-all-travel-request-approval",
      isShow: payrollAccess?.some(
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
      isShow: payrollAccess?.some(
        (el) =>
          (el?.componentName === "TravelRequestWorkflowStatus" ||
            el?.componentName === "ReadAllTravelRequestWorkflowStatus" ||
            el?.slug === "read-all-travel-request-workflow-status") &&
          el?.isResourceShow,
      ),
    },
   
  ];
  // const menuOptions = [
  //   {
  //     name: "Travel Request",
  //     link: "/travel_request/read-all-travel-request",
  //     isShow: payrollAccess?.some(
  //       (el) =>
  //         (el?.componentName === "TravelRequest" ||
  //           el?.slug === "read-all-travel-request") &&
  //         el?.isResourceShow,
  //     ),
  //   },
  //   // {
  //   //   name: "Post Travel Request",
  //   //   link: "/post_travel_request/read-all-post-travel-request",
  //   //   isShow: payrollAccess?.some(
  //   //     (el) =>
  //   //       (el?.componentName === "ReadAllPostTravelRequest" ||
  //   //         el?.slug === "read-all-post-travel-request") &&
  //   //       el?.isResourceShow,
  //   //   ),
  //   // },
  // ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* Sidebar with Logged-in User Profile */}
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={moduleName}
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
            name={moduleName}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>

        <div className="px-3 py-4 rounded-lg bg-white">
          <div className="flex justify-between items-end flex-wrap gap-2 mb-4">
            <h6 className="text-primary font-bold mb-0">
              Post Travel Request History
            </h6>
          </div>
          <div className="flex justify-between items-end flex-wrap gap-2 mb-6">
            <FormFilter />
            <div className="flex items-center gap-2">
              <FormSearch />
              {accessUser && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddNew}
                >
                  <CirclePlus className="w-4 h-4 text-white mr-2" />
                  Add
                </button>
              )}
            </div>
          </div>

          <FormTable
            onEditClick={handleEditFromTable}
            onViewClick={handleViewFromTable}
          />
        </div>

        {showForm && (
          <div className="px-3 py-4 rounded-lg bg-white mt-4">
            <div className="mb-4">
              <EmployeeSelect
                employeeId={activeEmployeeId}
                setEmployeeId={FormUIProps.setEmployeeId}
                travelRequestId={activeTravelRequestId}
                setTravelRequestId={FormUIProps.setTravelRequestId}
                panelMode={panelMode}
                setPanelMode={setPanelMode}
                travelPanelMode={travelPanelMode}
                setTravelPanelMode={setTravelPanelMode}
                onCancel={handleCancel}
                disabled={isEditMode || isViewMode}
                isEditMode={isEditMode}
                isViewMode={isViewMode}
              />
            </div>

            {travelPanelMode && activeEmployeeId && activeTravelRequestId && (
              <div className="mb-4">
                <TravelProfile
                  employeeId={activeEmployeeId}
                  travelRequestId={activeTravelRequestId}
                />
              </div>
            )}

            {showMainForm && (
              <FormEditForm
                employeeId={activeEmployeeId}
                travelRequestId={activeTravelRequestId}
                employeeDetails={employeeDetails}
                onCancel={handleCancel}
                saveForm={saveForm}
                user={activeUser}
                isReadOnly={isViewMode}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}