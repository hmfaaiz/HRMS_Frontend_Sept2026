import React, { useMemo, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { useFormUIContext } from "../FormUIContext";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  getHandlerTableChange,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";

import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";

export function FormTable({ onEditClick, onViewClick }) {
  const FormUIContext = useFormUIContext();
  const FormUIProps = useMemo(() => {
    return {
      employeeId: FormUIContext.employeeId,
      setUserForEdit: FormUIContext.setUserForEdit,
      setPanelMode: FormUIContext.setPanelMode,
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      openDeleteFormDialog: FormUIContext.openDeleteFormDialog,
    };
  }, [FormUIContext]);

  const { currentState, dashboard } = useSelector(
    (state) => ({
      currentState: state.t_preapproval_travel_request,
      dashboard: state.dashboard,
    }),
    shallowEqual,
  );

  const { entities, totalCount, listLoading } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchPreApprovalTravelRequests(FormUIProps.queryParams));
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
  }, [FormUIProps.queryParams, dispatch]);

  const columns = [
    {
      dataField: "Employee",
      text: "Employee",
      sort: false,
      sortCaret: sortCaret,
      formatter: (cell) => {
        return cell
          ? `${cell.employeeCode}-${cell.firstName} ${cell.lastName}`
          : "-";
      },
      style: { minWidth: "180px" },
    },
    {
      dataField: "purposeOfTravel",
      text: "Purpose of Travel",
      sort: false,
      sortCaret: sortCaret,
      style: { minWidth: "180px" },
    },
    {
      dataField: "travelType",
      text: "Travel Type",
      sort: false,
      sortCaret: sortCaret,
      style: { minWidth: "140px" },
    },
    {
      dataField: "projectName",
      text: "Project Name",
      sort: false,
      sortCaret: sortCaret,
      style: { minWidth: "160px" },
    },
    {
      dataField: "firstFromLocation",
      text: "From Location",
      isDummyField: true,
      formatter: (cell, row) => {
        const seg = row.Master?.[0];
        if (!seg || !seg.fromLocationId) return "-";
        const loc = dashboard?.allLocationChildMenus?.find(
          (l) => String(l.value) === String(seg.fromLocationId),
        );
        return loc ? loc.label : seg.fromLocationId;
      },
      style: { minWidth: "140px" },
    },
    {
      dataField: "lastToLocation",
      text: "To Location",
      isDummyField: true,
      formatter: (cell, row) => {
        const segments = row.Master || [];
        const seg = segments[segments.length - 1];
        if (!seg || !seg.toLocationId) return "-";
        const loc = dashboard?.allLocationChildMenus?.find(
          (l) => String(l.value) === String(seg.toLocationId),
        );
        return loc ? loc.label : seg.toLocationId;
      },
      style: { minWidth: "140px" },
    },
    {
      dataField: "firstFromDate",
      text: "From Date",
      isDummyField: true,
      formatter: (cell, row) => {
        const seg = row.Master?.[0];
        if (!seg || !seg.fromDate) return "-";
        const d = new Date(seg.fromDate);
        return `${String(d.getDate()).padStart(2, "0")}-${d.toLocaleString(
          "default",
          {
            month: "short",
          },
        )}-${d.getFullYear()}`;
      },
      style: { minWidth: "120px" },
    },
    {
      dataField: "lastToDate",
      text: "To Date",
      isDummyField: true,
      formatter: (cell, row) => {
        const segments = row.Master || [];
        const seg = segments[segments.length - 1];
        if (!seg || !seg.toDate) return "-";
        const d = new Date(seg.toDate);
        return `${String(d.getDate()).padStart(2, "0")}-${d.toLocaleString(
          "default",
          {
            month: "short",
          },
        )}-${d.getFullYear()}`;
      },
      style: { minWidth: "120px" },
    },
    {
      dataField: "request_status",
      text: "Status",
      formatter: (cell, row) => {
        let text = "";
        let className = "";
        if (cell === "P") {
          text = "Pending (Portal)";
          className = "text-pending font-bold";
        } else if (cell === "A" && row?.approved_status === 0) {
          text = "Pending (HRMS)";
          className = "text-pending font-bold";
        } else if (cell === "A") {
          if (row?.isLoanContinuing) {
            className = "text-approved font-bold";
            text = "Active";
          } else {
            className = "text-primary font-bold";
            text = "Completed";
          }
        } else if (cell === "R") {
          text = "Rejected";
          className = "text-rejected font-bold";
        }
        return <span className={className}>{text}</span>;
      },
      style: { minWidth: "120px" },
    },
    {
      dataField: "advanceAmount",
      text: "Advance Amount",
      formatter: (cell, row) => {
        if (!row.advanceRequired) return "-";
        if (cell === null || cell === undefined) return "-";
        return Number(cell).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
      sort: false,
      sortCaret: sortCaret,
      style: { minWidth: "150px" },
    },
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
          if (onViewClick) {
            onViewClick(row);
          } else {
            FormUIProps.setUserForEdit(row);
            FormUIProps.setPanelMode(true);
          }
        },
        openEditFormDialog: (row) => {
          if (onEditClick) {
            onEditClick(row);
          } else {
            FormUIProps.setUserForEdit(row);
            FormUIProps.setPanelMode(true);
          }
        },
        openDeleteFormDialog: FormUIProps.openDeleteFormDialog,
      },
    },
  ];

  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
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
              data={entities || []}
              columns={columns}
              onTableChange={getHandlerTableChange(FormUIProps.setQueryParams)}
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
