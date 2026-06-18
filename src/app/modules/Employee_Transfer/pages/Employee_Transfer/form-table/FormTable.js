import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { downloadEmployeeTransferReport } from "../../../_redux/redux-Actions";
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
import { format } from "date-fns";
import { ApplicantsDetailTable } from "./ApplicantDetailTable";

export function FormTable({ showApplicantDetails }) {
  const formUIContext = useFormUIContext();
  const [expandedRows, setExpandedRows] = useState([]);

  const formUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
      setIds: formUIContext.setIds,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditFormDialog: formUIContext.openEditFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      openActiveFormDialog: formUIContext.openActiveFormDialog,
      openReadFormDialog: formUIContext.openReadFormDialog,
      openPostingFormDialog: formUIContext.openPostingFormDialog,
      openHoldFormDialog: formUIContext.openHoldFormDialog,
      openCloseFormDialog: formUIContext.openCloseFormDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.employee_transfer,
      userAccess: state?.auth?.userAccess["employee_transfer"] || [],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading, reportPdfLoading } = currentState || {};
  // DEBUG
  console.log("[Employee Transfer FormTable] userAccess:", userAccess);

  const dispatch = useDispatch();

  // Collapse all expanded rows when filters change
  useEffect(() => {
    setExpandedRows([]);
  }, [formUIProps.queryParams]);

  useEffect(() => {
    if (!showApplicantDetails) {
      setExpandedRows([]);
    }
  }, [showApplicantDetails]);

  useEffect(() => {
    formUIProps.setIds([]);

    dispatch(actions.fetchEmployeeTransfer(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadEmployeeTransfer"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateEmployeeTransfer";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteEmployeeTransfer"
  );

  // Posting

  const isAccessForPost = userAccess?.find(
    (item) => item.componentName === "PostEmployeeTransfer"
  );
  const isAccessForHold = userAccess?.find(
    (item) => item.componentName === "HoldEmployeeTransfer"
  );
  const isAccessForClose = userAccess?.find(
    (item) => item.componentName === "CloseEmployeeTransfer"
  );
  const isAccessForReport = userAccess?.find(
    (item) => item.componentName === "ReportEmployeeTransfer"
  );
  // Table columns

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Vacancy not posted";
      case 1:
        return "Currently Posted";
      case 2:
        return "On Hold";
      case 3:
        return "Closed / Expired Jobsed";
      default:
        return "----";
    }
  };

  const vacancyStatusOptions = [
    { value: null, label: "All" },
    { value: 0, label: "Vacancy not posted" },
    { value: 1, label: "Currently Posted" },
    { value: 2, label: "On Hold" },
    { value: 3, label: "Closed / Expired Job" },
  ];

  // ── Expand row handlers ──
  const handleExpand = (row, isExpand) => {
    setExpandedRows((prev) =>
      isExpand
        ? prev.includes(row.Id) ? prev : [...prev, row.Id]
        : prev.filter((id) => id !== row.Id)
    );
  };

  // Expand row config: only active when showApplicantDetails is true
  const expandRow = showApplicantDetails
    ? {
      renderer: (row) => <ApplicantsDetailTable row={row} />,
      expanded: expandedRows,
      expandByColumnOnly: true,
      onExpand: handleExpand,
      showExpandColumn: true,
      expandColumnPosition: "left",
      expandHeaderColumnRenderer: () => null,
      expandColumnRenderer: ({ expanded }) => (
        <button
          type="button"
          title={expanded ? "Collapse applicants" : "View applicants"}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "2px 4px", display: "inline-flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <span
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 22, height: 22, borderRadius: "50%",
              background: expanded ? "#3699FF" : "#e2eaf5",
              color: expanded ? "#fff" : "#4a5568",
              fontSize: 10, fontWeight: 700,
              transition: "background 0.2s, transform 0.2s",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            ▶
          </span>
        </button>
      ),
    }
    : {
      renderer: () => null,
      showExpandColumn: false,
      expandByColumnOnly: true,
    };


  const latestRequests = useMemo(() => {
    if (!entities || !entities.length) return {};
    const map = {};
    entities.forEach(entity => {
      if (!map[entity.employeeId]) {
        map[entity.employeeId] = entity.Id;
      } else if (entity.Id > map[entity.employeeId]) {
        map[entity.employeeId] = entity.Id;
      }
    });
    return map;
  }, [entities]);

  const columns = [
    {
      dataField: "employeeName",
      text: "Employee",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
      },
      formatter: (cell, row) => {
        // Access from employeeProfile nested object
        if (row.employeeProfile) {
          const { firstName, lastName, employeeCode } = row.employeeProfile;
          return employeeCode && firstName && lastName
            ? `${employeeCode}-${firstName} ${lastName}`
            : "-";
        }
        // Fallback to top-level fields if available
        return row.employeeCode && row.employeeName
          ? `${row.employeeCode}-${row.employeeName}`
          : "-";
      },
    },
    {
      dataField: "Dept",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
      },
      formatter: (cell, row) => {
        // Access from employeeProfile.department
        if (row.employeeProfile && row.employeeProfile.department) {
          return row.employeeProfile.department.deptName || "-";
        }
        // Fallback to top-level fields
        return row.departmentName || "-";
      },
    },
    {
      dataField: "Designation",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
      },
      formatter: (cell, row) => {
        // Access from employeeProfile.designation
        if (row.employeeProfile && row.employeeProfile.designation) {
          return row.employeeProfile.designation.formName || "-";
        }
        // Fallback to top-level fields
        return row.designationName || "-";
      },
    },

    {
      dataField: "transferType",
      text: "Transfer Type",
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
      formatter: (cell) => {
        return cell ? "Temporary" : "Permanent";
      },
    },

    {
      dataField: "transferFromDate",
      text: "From Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "";
      },
    },
    {
      dataField: "transferToDate",
      text: "To Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "-";
      },
      textAlign: "center",
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        openActiveFormDialog: formUIProps.openActiveFormDialog,
        openReadFormDialog: formUIProps.openReadFormDialog,
        isAccessForView: isAccessForView ? isAccessForView.isAccess : false,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForReport: isAccessForReport ? isAccessForReport.isAccess : false,
        isAccessForDelete: isAccessForDelete ? isAccessForDelete.isAccess : false,
        reportPdfLoading,
        downloadEmployeeTransferReport,
        dispatch,
        latestRequests,
      },

      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "170px",
      },
    },
  ];

  //Table pagination properties
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
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                bootstrap4
                remote
                keyField="Id"
                data={entities === null ? [] : entities}
                columns={columns}
                expandRow={expandRow}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  formUIProps.setQueryParams
                )}
                // selectRow={getSelectRow({
                //   entities,

                // })}
                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </div>
  );
}

