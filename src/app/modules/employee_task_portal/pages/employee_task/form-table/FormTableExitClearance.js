import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelper";
import { useFormUIContext } from "../FormUIContext";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { FormFilterExitClearance } from "../form-filter/FormFilterExitClearance";

export function FormTableExitClearance({ openTaskModal, openViewModal }) {
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      exitClearanceFilter: formUIContext.exitClearanceFilter,
    };
  }, [formUIContext]);

  const dispatch = useDispatch();

  const { totalCount, entities, listLoading } = useSelector(
    (state) => ({
      totalCount: state.employee_task_portal.exitClearanceTotalCount,
      entities: state.employee_task_portal.exitClearanceEntities,
      listLoading: state.employee_task_portal.listLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(
      actions.fetchExitClearanceTasks({
        ...formUIProps.queryParams,
        filter: formUIProps.exitClearanceFilter,
      })
    );
  }, [formUIProps.queryParams, formUIProps.exitClearanceFilter, dispatch]);

  const filteredEntities = useMemo(() => {
    if (!entities) return [];
    return entities;
  }, [entities]);

  const columns = [
    {
      dataField: "EmployeeProfile.employeeCode",
      text: "Employee Code",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "110px" },
      formatter: (cell) => cell || "N/A",
    },
    {
      dataField: "EmployeeProfile",
      text: "Employee Name",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
      formatter: (cell) => cell ? `${cell.firstName || ''} ${cell.lastName || ''}`.trim() : "N/A",
    },
    {
      dataField: "EmployeeProfile.designation.formName",
      text: "Designation",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "140px" },
      formatter: (cell) => cell || "N/A",
    },
    {
      dataField: "DepartmentDetail.deptName",
      text: "Department",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "140px" },
      formatter: (cell) => cell || "N/A",
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openTaskModal: (id) => openTaskModal(id, "exit_clearance"),
        openViewModal: (id) => openViewModal(id, "exit_clearance")
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "80px" },
    },
  ];

  const paginationOptions = {
    custom: true,
    totalSize: filteredEntities.length,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-fancy">
      <h6 className="font-bold my-2 text-primary">
        Exit Clearance</h6>

      <FormFilterExitClearance />
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => (
          <Pagination isLoading={listLoading} paginationProps={paginationProps}>
            <BootstrapTable
              wrapperClasses="table-responsive"
              bordered={false}
              classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
              bootstrap4
              remote
              keyField="Id"
              data={filteredEntities}
              columns={columns}
              defaultSorted={uiHelpers.defaultSorted}
              onTableChange={getHandlerTableChange(formUIProps.setQueryParams)}
              {...paginationTableProps}
            >
              <PleaseWaitMessage entities={entities} />
              <NoRecordsFoundMessage
                entities={entities}
                message="No tasks found."
              />
            </BootstrapTable>
          </Pagination>
        )}
      </PaginationProvider>
    </div>
  );
}
