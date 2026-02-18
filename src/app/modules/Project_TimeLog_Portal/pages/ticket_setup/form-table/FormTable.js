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
import * as uiHelpers from "../FormUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";

export function FormTable() {
  // Customer UI Context
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      Id: formUIContext.Id,
      setId: formUIContext.setId,
      queryParams: formUIContext.queryParams,
      employeeId: formUIContext.employeeId,
      setQueryParams: formUIContext.setQueryParams,
      openDeleteDialog: formUIContext.openDeleteDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector(
    (state) => ({
      currentState: state.project_timelog_portal,
      userAccess: state?.auth?.userAccess["time_logging_portal"],
    }),
    shallowEqual,
  );

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!formUIProps?.employeeId) return;
    dispatch(
      actions.fetchTimeLogs({
        ...formUIProps.queryParams,
        filter: {
          ...formUIProps.queryParams?.filter,
          employeeId: formUIProps?.employeeId,
        },
      }),
    );
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateTimeLog",
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteTimeLog",
  );

  // Table columns
  const columns = [
    {
      dataField: "Project.name",
      text: "Project",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
    },
    {
      dataField: "Ticket.name",
      text: "Ticket Number",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
      formatter: (cell) =>
        cell && cell.length > 45 ? cell.slice(0, 40) + "..." : cell,
    },
    {
      dataField: "loggedDate",
      text: "Log Date",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },
    {
      dataField: "timeRangeFrom",
      text: "Start Time",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "50px" },
    },
    {
      dataField: "timeRangeTo",
      text: "End Time",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "50px" },
    },
    {
      dataField: "noOfHours",
      text: "No. of Hours",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "50px" },
    },
    {
      dataField: "isBillable",
      text: "Billable",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "50px" },
      formatter: (cell) => (cell ? "Yes" : "No"),
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openDeleteDialog: formUIProps.openDeleteDialog,
        setId: formUIProps?.setId,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "170px" },
    },
  ];

  // Pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  return (
    <div className="w-full overflow-x-auto">
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
              data={entities || []}
              columns={columns}
              defaultSorted={uiHelpers.defaultSorted}
              onTableChange={getHandlerTableChange(formUIProps.setQueryParams)}
              {...paginationTableProps}
            >
              <PleaseWaitMessage entities={entities} />
              <NoRecordsFoundMessage entities={entities} />
            </BootstrapTable>
          </Pagination>
        )}
      </PaginationProvider>
    </div>
  );
}
