import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
import { EmployeeOnboardingActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { useEmployeeOnboardingUIContext } from "../FormUIContext";

export function FormTable() {
  const formUIContext = useEmployeeOnboardingUIContext();

  const formUIProps = useMemo(
    () => ({
      ids: formUIContext.selectedIds,
      setIds: formUIContext.setSelectedIds,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditFormDialog: formUIContext.openEditFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      openReadFormDialog: formUIContext.openReadFormDialog,
    }),
    [formUIContext],
  );

  const { currentState, userAccess } = useSelector(
    (state) => ({
      currentState: state.employee_onboarding_checklist,
      userAccess: state?.auth?.userAccess["employee_onboarding_checklist"],
    }),
    shallowEqual,
  );

  const { totalCount, entities, listLoading } = currentState || {};

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);
    dispatch(actions.fetchEmployeeOnboardingChecklist(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateEmployeeOnboardingChecklist",
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteEmployeeOnboardingChecklist",
  );

  const columns = [
    // {
    //   dataField: "employeeCode",
    //   text: "Employee Code",
    //   sort: false,
    //   sortCaret,
    //   headerSortingClasses,
    //   style: { minWidth: "100px" },
    // },
    {
      dataField: "employeeName",
      text: "Employee",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
    },
    {
      dataField: "department",
      text: "department",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
    },
 
    {
      dataField: "isApproved", 
      text: "Approved",
      sort: false,
      sortCaret,
      headerSortingClasses,
      formatter: (cell) => {
        if (cell == 1) return <span>Yes</span>;
        if (cell == 0) return <span>No</span>;
        return <span>-</span>;
      },
      style: { minWidth: "80px" },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: EmployeeOnboardingActionsColumnFormatter,
      formatExtraData: {
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIContext.openDeleteFormDialog,  
        openReadFormDialog: formUIProps.openReadFormDialog,
        isAccessForEdit: isAccessForEdit?.isAccess ?? false,
        isAccessForDelete: isAccessForDelete?.isAccess ?? false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "100px" },
    },
  ];

  const groupedData = useMemo(() => {
    if (!entities?.results) return [];

    // Group tasks by employeeId
    const employeeMap = {};
    entities.results.forEach((task) => {
      const empId = task.employeeId;
      if (!employeeMap[empId]) {
        employeeMap[empId] = {
          Id: empId,
          employeeId: empId, 
          employeeName: task.employeeName,
          department: task.department,
          // optional: aggregate taskStatus ( 'Completed', 'Not Completed', etc.)
          taskStatus: task.taskStatus,
          isApproved: task.isApproved,  // Added: Include isApproved from backend
          tasks: [task], // keep tasks array for edit/view
        };
      } else {
        employeeMap[empId].tasks.push(task);
      }
    });

    return Object.values(employeeMap);
  }, [entities]);

  return (
    <div className="w-full overflow-x-auto">
      <BootstrapTable
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        remote
        keyField="Id"
        data={groupedData}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
        onTableChange={getHandlerTableChange(formUIProps.setQueryParams)}
      >
        <PleaseWaitMessage entities={entities} />
        <NoRecordsFoundMessage entities={entities} />
      </BootstrapTable>
    </div>
  );
}