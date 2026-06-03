import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../redux/formAction";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../../FormUIHelper";
// import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../../FormUIContext";
import { Card } from "react-bootstrap";
import { ActionsColumnFormatter } from "./column-formatter/ActionCloumnFormatter";
import { format } from "date-fns";

export function LeaveApprovalFormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext?.queryParams,
      setQueryParams: formUIContext?.setQueryParams,
      setLeaveBalanceId: formUIContext?.setLeaveBalanceId,
      setLeaveWorkflowId: formUIContext?.setLeaveWorkflowId,
      setLeaveData: formUIContext?.setLeaveData,
      setIds: formUIContext?.setIds,
      Ids: formUIContext?.Ids,
    };
  }, [formUIContext]);

  const { currentState, user , leaveBalances } = useSelector((state) => {
    return {
      currentState: state.leave_approval,
      user: state?.auth?.user,
      leaveBalances: state?.leave_approval?.leaveBalances,
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.fetchLeaveApprovalApplication(
        FormUIProps.queryParams,
        user?.employeeIdMapping
      )
    );
  }, [FormUIProps.queryParams, dispatch]);

  // Table columns
  const columns = [
    {
      dataField: "authorityStatus",
      text: "status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "90px",
        maxWidth: "90px",
      },
      formatter: (cell) => {
        let text = "";
        let className = "";

        if (cell === "P") {
          text = "Pending";
          className = "text-pending font-bold";
        } else if (cell === "A") {
          text = "Approved";
          className = "text-approved font-bold";
        } else if (cell === "R") {
          text = "Rejected";
          className = "text-rejected font-bold";
        }

        return <span className={className}>{text}</span>;
      },
    },
    // {
    //   dataField: "parentData.request_status",
    //   text: "Request status",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "90px",
    //     maxWidth: "90px",
    //   },
    //   formatter: (cell) => {
    //     let text = "";
    //     let style = {};

    //     if (cell === "P") {
    //       text = "Pending";
    //       style = { color: "green", fontWeight: "bold" };
    //     } else if (cell === "A") {
    //       text = "Approved";
    //       style = { color: "black", fontWeight: "bold" };
    //     } else if (cell === "R") {
    //       text = "Rejected";
    //       style = { color: "red", fontWeight: "bold" };
    //     }

    //     return <span style={style}>{text}</span>;
    //   },
    // },
    // {
    //   dataField: "requestBelongToEmp.employeeCode", // Reference the parent object (department)
    //   text: "Code", // Column heading
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "120px",
    //     maxWidth: "120px",
    //   },
    // },
    // {
    //   dataField: "requestBelongToEmp",
    //   text: "Name",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "190px",
    //     maxWidth: "190px",
    //   },
    //   formatter: (cell) => {
    //     return `${cell?.firstName} ${cell?.middleName} ${cell?.lastName}`;
    //   },
    // },
     {
          dataField: "requestBelongToEmp",
          text: "Employee",
          sort: true,
          sortCaret, headerSortingClasses,
          style: { minWidth: "200px", maxWidth: "200px" },
          formatter: (cell) => {
            const code = cell?.employeeCode || "";
            const name = `${cell?.firstName || ""} ${cell?.middleName ? cell.middleName + " " : ""}${cell?.lastName || ""}`.trim();
            return code && name ? `${code} - ${name}` : code || name || "";
          },
        },
    // {
    //   dataField: "requestBelongToEmp.department.deptName",
    //   text: "Department",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //     maxWidth: "160px",
    //   },
    // },
    // {
    //   dataField: "requestBelongToEmp.designation.formName",
    //   text: "Designation",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //     maxWidth: "160px",
    //   },
    // },
    {
      dataField: "parentData.t_leave_type.name",
      text: "Leave Type",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
        maxWidth: "130px",
      },
    },
    {
      dataField: "parentData.from",
      text: "From",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
        maxWidth: "130px",
      },
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "";
      },
    },
    {
      dataField: "parentData.to",
      text: "To",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
        maxWidth: "130px",
      },
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "";
      },
    },
    {
      dataField: "parentData.days",
      text: "Days",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
        maxWidth: "100px",
      },
    },
    {
      dataField: "action",
      text: "Action",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setLeaveBalanceId: FormUIProps.setLeaveBalanceId,
        setLeaveWorkflowId: FormUIProps.setLeaveWorkflowId,
        setLeaveData: FormUIProps?.setLeaveData,
      },
      headerClasses: "text-right",
      style: {
        minWidth: "100px",
      },
    },
    // {
    //   dataField: "parentData.remarks",
    //   text: "Reason",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "250px",
    //     maxWidth: "250px",
    //   },
    // },
    // {
    //   dataField: "parentData.file",
    //   text: "Attachments",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "120px",
    //     maxWidth: "120px",
    //   },
    //   formatter: (cell, row) => {
    //     return <span>{cell !== null ? "Yes" : "No"}</span>;
    //   },
    // },
  ];

  //Table pagination properties
  // const paginationOptions = {
  //   custom: true,
  //   totalSize: totalCount,
  //   sizePerPageList: uiHelpers.sizePerPageList,
  //   sizePerPage: FormUIProps.queryParams.pageSize,
  //   page: FormUIProps.queryParams.pageNumber,
  // };

  return (
    <div className="w-full overflow-x-auto mt-4">
      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({ entities })}
        style={{ width: "100%", overflow: "auto" }}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        selectRow={{
          mode: "checkbox",
          clickToSelect: false,
          style: { backgroundColor: "#e6f8ff" },
          selected: FormUIProps.Ids, // make sure it's an array of Ids
          selectable: (row) => row?.authorityStatus === "P",
          selectionRenderer: ({ mode, checked, disabled }) => (
            <input type="checkbox" checked={checked} disabled={disabled} />
          ),
          onSelect: (row, isSelect) => {
            if (row.authorityStatus !== "P") return false;

            if (isSelect) {
              FormUIProps.setIds((prev) => [...prev, row.Id]);
            } else {
              FormUIProps.setIds((prev) => prev.filter((id) => id !== row.Id));
            }
          },
          onSelectAll: (isSelect, rows) => {
            const selectableRows = rows.filter(
              (r) => r.authorityStatus === "P"
            );

            if (isSelect) {
              FormUIProps.setIds(selectableRows.map((r) => r.Id));
            } else {
              FormUIProps.setIds([]);
            }
          },
        }}
        // remote
        keyField="Id"
        data={entities === null ? [] : entities}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
        // onTableChange={getHandlerTableChange(FormUIProps.setQueryParams)}
        // selectRow={getSelectRow({
        //   entities,

        // })}
        // {...paginationTableProps}
      >
        <PleaseWaitMessage entities={entities} />
        <NoRecordsFoundMessage entities={entities} />
      </BootstrapTable>
    </div>
  );
}
