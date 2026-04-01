import React, { useMemo, useEffect, useState } from "react";
import { useFormUIContext } from "../FormUIContext";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { EmployeeSelect } from "../form-edit-dialog/EmployeeSelect";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";
import { getEmployeeProfileById } from "../../../../../../_metronic/redux/dashboardCrud";
import { FormEditForm } from "../form-edit-dialog/FormEditForm";
import { FormTable } from "../form-table/FormTable";
import { ApprovalCard } from "../approval-card/ApprovalCard";
import { FormFilter } from "../form-filter/FormFilter";
import { CirclePlus } from "lucide-react";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [employeeError, setEmployeeError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRowData, setEditRowData] = useState(null);
  
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
    FormUIProps.setEmployeeId(null);
    FormUIProps.setPanelMode(false);
    FormUIProps.setUserForEdit({}); // Open form with empty object
  };

  // Handle Edit from table - opens approval card
  const handleEditFromTable = (row) => {
    setIsEditMode(true);
    setEditRowData(row);
    setEmployeeError("");
    FormUIProps.setUserForEdit(row);
  };

  // Handle Cancel
  const handleCancel = () => {
    FormUIProps.setUserForEdit(null);
    FormUIProps.setEmployeeId(null);
    FormUIProps.setPanelMode(false);
    setEmployeeError("");
    setIsEditMode(false);
    setEditRowData(null);
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

        <FormTable onEditClick={handleEditFromTable} />
      </TCard>

      {/* Employee Selection and Form Card - Only shown when add button triggers it */}
      {FormUIProps.userForEdit && !isEditMode && (
        <div className="px-3 py-2 rounded-lg bg-white mt-4">
          <div className="mb-4">
            <EmployeeSelect
              employeeId={FormUIProps.employeeId}
              setEmployeeId={FormUIProps.setEmployeeId}
              panelMode={FormUIProps.panelMode}
              setPanelMode={FormUIProps.setPanelMode}
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
              />
            </>
          )}

        </div>
      )}

      {/* Approval Card - Only shown when edit button is clicked */}
      {isEditMode && editRowData && (
        <div className="px-3 py-2 rounded-lg bg-white mt-4">
          <ApprovalCard
            userForEdit={editRowData}
            onCancel={handleCancel}
          />
        </div>
      )}
    </>
  );
}
