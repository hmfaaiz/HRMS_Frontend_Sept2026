import React, { useMemo, useEffect, useState } from "react";
import { useFormUIContext } from "../../../../Travel_Request/pages/travel_request/FormUIContext";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { EmployeeSelect } from "../form-edit-dialog/EmployeeSelect";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";
import { getEmployeeProfileById } from "../../../../../../_metronic/redux/dashboardCrud";
import { FormEditForm } from "../../../../Travel_Request/pages/travel_request/form-edit-dialog/FormEditForm";
import { FormTable } from "../../../../Travel_Request/pages/travel_request/form-table/FormTable";
import { FormFilter } from "../../../../Travel_Request/pages/travel_request/form-filter/FormFilter";
import { CirclePlus, XCircle } from "lucide-react";
import * as actions from "../../../../Travel_Request/_redux/redux-Actions";

export function FormCardReq() {
  const FormUIContext = useFormUIContext();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [employeeError, setEmployeeError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRowData, setEditRowData] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [viewRowData, setViewRowData] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setIds: FormUIContext.setIds,
      employeeId: FormUIContext.employeeId,
      setEmployeeId: FormUIContext.setEmployeeId,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth?.userAccess?.preapproval_travel_request,
    }),
    shallowEqual,
  );

  const moduleName = CurrentModuleName();

  // In FormCard.jsx, add this to your useSelector
  const { employeeEntitlement } = useSelector(
    (state) => ({
      employeeEntitlement:
        state.t_preapproval_travel_request.employeeEntitlement,
    }),
    shallowEqual,
  );

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreatePreapprovalTravelRequest",
  );

  const dispatch = useDispatch();
  const { allEmployees } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees,
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (!allEmployees || !allEmployees.length) {
      dispatch(fetchAllActiveEmployees());
    }
  }, [dispatch, allEmployees]);

  // Fetch employee profile details when employeeId changes
  useEffect(() => {
    if (FormUIProps.employeeId) {
      setEmployeeError("");
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

  // Handle Add New button click - opens employee select form
  const handleAddNew = () => {
    setEmployeeError("");
    setIsEditMode(false);
    setEditRowData(null);
    setIsViewMode(false);
    setViewRowData(null);
    FormUIProps.setEmployeeId(null);
    FormUIProps.setPanelMode(false);
    FormUIProps.setUserForEdit({}); // Open form with empty object
  };

  // Handle Edit from table - opens approval card
  const handleEditFromTable = (row) => {
    setIsEditMode(true);
    setEditRowData(row);
    setIsViewMode(false);
    setViewRowData(null);
    setEmployeeError("");
    FormUIProps.setUserForEdit(row);
    FormUIProps.setEmployeeId(row.employeeId);
    FormUIProps.setPanelMode(false);
  };

  // Handle View from table - opens read-only form
  const handleViewFromTable = (row) => {
    setIsViewMode(true);
    setViewRowData(row);
    setIsEditMode(false);
    setEditRowData(null);
    setEmployeeError("");
    FormUIProps.setEmployeeId(row.employeeId);
    FormUIProps.setUserForEdit(null);
    FormUIProps.setPanelMode(false);
  };

  // Handle Cancel
  const handleCancel = () => {
    FormUIProps.setUserForEdit(null);
    FormUIProps.setEmployeeId(null);
    FormUIProps.setPanelMode(false);
    setEmployeeError("");
    setIsEditMode(false);
    setEditRowData(null);
    setIsViewMode(false);
    setViewRowData(null);
  };

  const saveForm = (values) => {
    enableLoading();
    if (!values.id) {
      dispatch(
        actions.createPreApprovalTravelRequest(
          values,
          disableLoading,
          handleCancel,
        ),
      );
    } else {
      dispatch(
        actions.updatePreApprovalTravelRequest(
          values,
          disableLoading,
          handleCancel,
        ),
      );
    }
  };

  return (
    <>
      {/* FormTable Card */}
      <TCard name={moduleName}>
        <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2 mb-6">
          <FormFilter />
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

        <FormTable
          onEditClick={handleEditFromTable}
          onViewClick={handleViewFromTable}
        />
      </TCard>

      {/* Employee Selection and Form Card - Only shown when add button triggers it */}
      {FormUIProps.userForEdit && !isEditMode && !isViewMode && (
        <div className="px-3 py-2 rounded-lg bg-white">
          <div className="mb-4">
            <EmployeeSelect
              employeeId={FormUIProps.employeeId}
              setEmployeeId={FormUIProps.setEmployeeId}
              panelMode={FormUIProps.panelMode}
              setPanelMode={FormUIProps.setPanelMode}
              onCancel={handleCancel}
              isEditMode={false}
              isViewMode={false}
              employeeEntitlement={employeeEntitlement}
            />
          </div>

          <EmployeeProfile
            employeeId={FormUIProps.employeeId}
            panelMode={FormUIProps.panelMode}
          />

          {FormUIProps.employeeId && (
            <>
              <br />
              <FormEditForm
                employeeId={FormUIProps.employeeId}
                employeeDetails={employeeDetails}
                onCancel={handleCancel}
                saveForm={saveForm}
                onHide={handleCancel}
                disableLoading={disableLoading}
              />
            </>
          )}
        </div>
      )}

      {/* Form - shown when edit button is clicked */}
      {isEditMode && editRowData && (
        <div className="px-3 py-2 rounded-lg bg-white  relative">
          <div className="mb-4">
            <EmployeeSelect
              employeeId={editRowData.employeeId}
              setEmployeeId={() => {}}
              panelMode={FormUIProps.panelMode}
              setPanelMode={FormUIProps.setPanelMode}
              onCancel={handleCancel}
              disabled={true}
              isEditMode={true}
              employeeEntitlement={employeeEntitlement}
            />
          </div>
          <EmployeeProfile
            employeeId={editRowData.employeeId}
            panelMode={FormUIProps.panelMode}
          />
          <br />
          <FormEditForm
            employeeId={editRowData.employeeId}
            employeeDetails={employeeDetails}
            onCancel={handleCancel}
            saveForm={saveForm}
            user={editRowData}
            isReadOnly={false}
          />
        </div>
      )}

      {/* View Card - Read-only form shown when Eye icon is clicked */}
      {isViewMode && viewRowData && (
        <div className="px-3 py-2 rounded-lg bg-white relative">
          <div className="mb-4">
            <EmployeeSelect
              employeeId={viewRowData.employeeId}
              setEmployeeId={() => {}}
              panelMode={FormUIProps.panelMode}
              setPanelMode={FormUIProps.setPanelMode}
              onCancel={handleCancel}
              disabled={true}
              isViewMode={true}
              employeeEntitlement={employeeEntitlement}
            />
          </div>
          <EmployeeProfile
            employeeId={viewRowData.employeeId}
            panelMode={FormUIProps.panelMode}
          />
          <br />
          <FormEditForm
            employeeId={viewRowData.employeeId}
            employeeDetails={employeeDetails}
            onCancel={handleCancel}
            user={viewRowData}
            isReadOnly={true}
          />
        </div>
      )}
    </>
  );
}
