import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";

import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
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
    dataField: "departmentCount",
    text: "Department",
    sort: false,
    sortCaret,
    headerSortingClasses,
    formatter: (cell) => <span>{cell || 0}</span>,
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
  const employeeMap = {};

  entities.results.forEach((task) => {
    const empId = task.employeeId;
    if (!employeeMap[empId]) {
      employeeMap[empId] = {
        Id: empId,
        employeeId: empId,
        employeeName: task.employeeName,
        departmentSet: new Set(), // track distinct departments
        isApproved: task.isApproved,
        tasks: [task],
      };
    } else {
      employeeMap[empId].tasks.push(task);
    }
    if (task.department) {
      employeeMap[empId].departmentSet.add(task.department);
    }
  });

  return Object.values(employeeMap).map((emp) => ({
    ...emp,
    departmentCount: emp.departmentSet.size,
  }));
}, [entities]);

    const totalGroupedCount = groupedData.length;
    const paginationOptions = {
      custom: true,
      totalSize: entities?.totalResults || 0,
      sizePerPageList: uiHelpers.sizePerPageList,
      sizePerPage: formUIProps.queryParams.pageSize,
      page: formUIProps.queryParams.pageNumber,
};
  return (
    <div className="w-full overflow-x-auto scrollbar-fancy">
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => (
          <>
            <Pagination isLoading={listLoading} paginationProps={paginationProps}>
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
                {...paginationTableProps}  
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </Pagination>
          </>
        )}
      </PaginationProvider>
    </div>
  );
}