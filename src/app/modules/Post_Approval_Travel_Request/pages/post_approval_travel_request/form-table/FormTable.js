import React, { useMemo, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  getHandlerTableChange,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelper";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { formatNumberWithCommas } from "../../../../../utils/common";

export function FormTable({ onEditClick, onViewClick }) {
  const FormUIContext = useFormUIContext();
  const FormUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
      openDeleteFormDialog: FormUIContext.openDeleteFormDialog,
    };
  }, [FormUIContext]);

  const { currentState } = useSelector(
    (state) => ({
      currentState: state.post_approval_travel_request,
    }),
    shallowEqual,
  );

  const { entities, totalCount, listLoading } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchPostApprovalTravelRequests(FormUIProps.queryParams));
  }, [FormUIProps.queryParams, dispatch]);

  // ── Client-side search filter ──
  // Matches against employee name/code and travel reference (purpose of travel).
  const filteredEntities = useMemo(() => {
    const raw = entities || [];
    const q = (FormUIProps.queryParams?.searchQuery || "").trim().toLowerCase();
    if (!q) return raw;

    return raw.filter((row) => {
      const emp = row.Employee;
      const employeeStr = emp
        ? `${emp.employeeCode || ""} ${emp.firstName || ""} ${emp.lastName ||
            ""}`.toLowerCase()
        : "";
      const travelRef = (
        row.PreApprovalRequest?.purposeOfTravel || ""
      ).toLowerCase();

      return employeeStr.includes(q) || travelRef.includes(q);
    });
  }, [entities, FormUIProps.queryParams?.searchQuery]);

  const columns = [
    // ── Employee ──
    {
      dataField: "Employee",
      text: "Employee",
      sort: false,
      sortCaret: sortCaret,
      formatter: (cell) =>
        cell
          ? `${cell.employeeCode || ""}-${cell.firstName ||
              ""} ${cell.lastName || ""}`.trim()
          : "-",
      style: { minWidth: "180px" },
    },

    // ── Pre-Approval Reference ──
    {
      dataField: "PreApprovalRequest",
      text: "Travel Reference",
      sort: false,
      formatter: (cell) => cell?.purposeOfTravel || "-",
      style: { minWidth: "180px" },
    },

    {
      dataField: "totalDaAmount",
      text: "Total DA",
      sort: false,
      sortCaret: sortCaret,
      formatter: (cell) => formatNumberWithCommas(cell || 0),
      style: { minWidth: "120px" },
    },

    // ── Advance & Net ──
    {
      dataField: "advanceReceived",
      text: "Advance Received",
      sort: false,
      sortCaret: sortCaret,
      formatter: (cell) => formatNumberWithCommas(cell || 0),
      style: { minWidth: "145px" },
    },
    {
      dataField: "netPayableRecoverable",
      text: "Net Payable / Recoverable",
      sort: false,
      sortCaret: sortCaret,
      formatter: (cell) => {
        if (cell === null || cell === undefined || cell === "") return "-";
        const num = Number(cell);
        return (
          <span
            className={`font-bold ${num < 0 ? "text-danger" : "text-success"}`}
          >
            {formatNumberWithCommas(cell || 0)}
          </span>
        );
      },
      style: { minWidth: "185px" },
    },

    // ── Approval Status ──
    {
      dataField: "approved_status",
      text: "Status",
      sort: false,
      formatter: (cell) => {
        if (cell === 0) {
          return <span className="text-pending font-bold">Pending</span>;
        } else if (cell === 1) {
          return <span className="text-approved font-bold">Approved</span>;
        }
        return <span className={className}>{text}</span>;
      },
      style: { minWidth: "110px" },
    },

    // ── Actions ──
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "100px" },
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openReadFormDialog: (row) => {
          if (onViewClick) onViewClick(row);
        },
        openEditFormDialog: (row) => {
          if (onEditClick) onEditClick(row);
        },
        openDeleteFormDialog: FormUIProps.openDeleteFormDialog,
        openReportDownload: (id) =>
          dispatch(actions.fetchPostApprovalTravelRequestReport(id)),
      },
    },
  ];

  const paginationOptions = {
    custom: true,
    // Use filtered count so pagination reflects search results
    totalSize: filteredEntities.length,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: FormUIProps.queryParams.pageSize,
    page: FormUIProps.queryParams.pageNumber,
  };

  return (
    <div className="mt-5 mb-8 font-sans">
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
              onTableChange={getHandlerTableChange(FormUIProps.setQueryParams)}
              {...paginationTableProps}
            >
              <PleaseWaitMessage entities={filteredEntities} />
              <NoRecordsFoundMessage entities={filteredEntities} />
            </BootstrapTable>
          </Pagination>
        )}
      </PaginationProvider>
    </div>
  );
}
