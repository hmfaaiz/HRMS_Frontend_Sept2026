
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";

import { Pagination } from "../../../../../../_metronic/_partials/controls";

import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";

import * as actions from "../../../_redux/redux-Actions";
import * as uiHelpers from "../FormUIHelpers";


const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const number = Number(value);

  return Number.isFinite(number) ? number.toFixed(2) : "";
};


export function LogtimeSummaryTable({ data, fromDate, toDate }) {
  const formUIContext = useTaskAssignmentTimelineUIContext();

  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);


  const { currentState } = useSelector(
    (state) => ({
      currentState: state.task_group_report,
    }),
    shallowEqual
  );


  const {
    summaryTotalCount,
    logTimeSummaryEntities,
    listLoading,
  } = currentState;

  console.log("logTimeSummaryEntities11111", logTimeSummaryEntities)
  const dispatch = useDispatch();


  // ---------------------------------------------------------
  // Pagination / Page Change API Call
  // ---------------------------------------------------------
  useEffect(() => {
    if (!FormUIProps.queryParams.isFiltered) return;

    dispatch(
      actions.fetchLogTimewSummaryData(
        FormUIProps.queryParams
      )
    );
  }, [
    FormUIProps.queryParams.pageSize,
    FormUIProps.queryParams.pageNumber,
    dispatch,
  ]);


  // ---------------------------------------------------------
  // Columns
  // ---------------------------------------------------------
  const columns = [
    {
      dataField: "employeeCode",
      text: "Employee Code",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        textAlign: "left",
      },
    },

    {
      dataField: "employeeName",
      text: "Employee Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        textAlign: "left",
        whiteSpace: "normal",
        overflowWrap: "anywhere",
      },
    },

    // {
    //   dataField: "designation",
    //   text: "Designation",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     textAlign: "left",
    //     whiteSpace: "normal",
    //     overflowWrap: "anywhere",
    //   },
    // },

    // {
    //   dataField: "department",
    //   text: "Department",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     textAlign: "left",
    //     whiteSpace: "normal",
    //     overflowWrap: "anywhere",
    //   },
    // },

    {
      dataField: "legalHours",
      text: "Legal Hours",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        textAlign: "right",
      },
      headerStyle: {
        textAlign: "center",
      },
      formatter: (cell) => formatNumber(cell),
    },

    {
      dataField: "loggedHoursBillable",
      text: "Logged Hours (Billable)",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        textAlign: "right",
      },
      headerStyle: {
        textAlign: "center",
      },
      formatter: (cell) => formatNumber(cell),
    },

    {
      dataField: "loggedHoursNonBillable",
      text: "Logged Hours (Non-Billable)",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        textAlign: "right",
         minWidth: "10px",
      },
      headerStyle: {
        textAlign: "center",
      },
      formatter: (cell) => formatNumber(cell),
    },

    {
      dataField: "idleHours",
      text: "Idle Hours",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        textAlign: "right",
      },
      headerStyle: {
        textAlign: "center",
      },
      formatter: (cell) => formatNumber(cell),
    },

    {
      dataField: "rating",
      text: "Rating",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        textAlign: "right",
      },
      headerStyle: {
        textAlign: "center",
      },
      formatter: (cell) =>
        cell !== undefined && cell !== null
          ? formatNumber(cell)
          : "0.00",
    },
  ];


  // ---------------------------------------------------------
  // Table Data
  // ---------------------------------------------------------
  const tableData = Array.isArray(logTimeSummaryEntities)
    ? logTimeSummaryEntities
    : [];


  // ---------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------
  const paginationOptions = {
    custom: true,
    totalSize: summaryTotalCount || 0,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: FormUIProps.queryParams.pageSize,
    page: FormUIProps.queryParams.pageNumber,
  };


  return (
    <PaginationProvider
      pagination={paginationFactory(paginationOptions)}
    >
      {({
        paginationProps,
        paginationTableProps,
      }) => (
        <div>
          <BootstrapTable
            responsive
            noDataIndication={() => "No records found"}
            wrapperClasses="table-responsive"
            bordered={false}
            classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
            bootstrap4
            keyField="employeeCode"
            data={tableData}
            columns={columns}
            remote
            defaultSorted={uiHelpers.defaultSorted}
            onTableChange={getHandlerTableChange(
              FormUIProps.setQueryParams
            )}
            {...paginationTableProps}
          >
            <PleaseWaitMessage
              entities={tableData}
            />

            <NoRecordsFoundMessage
              entities={tableData}
            />
          </BootstrapTable>

          {/* Pagination */}
          <Pagination
            isLoading={listLoading}
            paginationProps={paginationProps}
          />
        </div>
      )}
    </PaginationProvider>
  );
}


export default LogtimeSummaryTable;

