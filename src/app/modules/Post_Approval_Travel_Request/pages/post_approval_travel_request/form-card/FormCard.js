import React, { useMemo, useEffect, useState } from "react";
import { useFormUIContext } from "../FormUIContext";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
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

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth?.userAccess?.post_approval_travel_request,
    }),
    shallowEqual,
  );

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreatePostApprovalTravelRequest",
  );

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
        actions.createPostApprovalTravelRequest(
          values,
          disableLoading,
          handleCancel,
        ),
      );
    } else {
      dispatch(
        actions.updatePostApprovalTravelRequest(
          values,
          disableLoading,
          handleCancel,
        ),
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

  return (
    <>
      <TCard name={moduleName}>
        <div className="flex flex-col gap-2 mb-4">
          <FormFilter />
          <div className="flex justify-end items-center flex-wrap gap-2">
            <FormSearch />
            <div className="flex items-center gap-2">
              {accessUser && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddNew}
                >
                  <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                  Add
                </button>
              )}
            </div>
          </div>
        </div>

        <FormTable
          onEditClick={handleEditFromTable}
          onViewClick={handleViewFromTable}
        />
      </TCard>

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
    </>
  );
}
