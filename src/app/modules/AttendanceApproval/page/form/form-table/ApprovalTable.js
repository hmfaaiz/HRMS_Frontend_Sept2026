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
import { formatTime } from "../../../../../utils/common";

export function ApprovalFormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext?.queryParams,
      setQueryParams: formUIContext?.setQueryParams,
      setIds: formUIContext?.setIds,
      setCurrentData: formUIContext?.setCurrentData,
      setWorkflowId: formUIContext?.setWorkflowId,
      Ids: formUIContext?.Ids,
    };
  }, [formUIContext]);

  const { currentState, user } = useSelector((state) => {
    return {
      currentState: state.attendance_approval,
      user: state?.auth?.user,
    };
  }, shallowEqual);

  const { entities } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.fetchAttendanceApprovalApplication(
        FormUIProps.queryParams,
        user?.employeeIdMapping
      )
    );
  }, [FormUIProps.queryParams, dispatch]);

  // Table columns
  const columns = [
    {
      dataField: "authorityStatus",
      text: "Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "140px",
        maxWidth: "140px",
      },
      formatter: (cell) => {
        let text = "";
        let classname = "";

        if (cell === "P") {
          text = "Pending";
          classname = "text-pending font-bold";
        } else if (cell === "A") {
          text = "Approved";
          classname = "text-approved font-bold";
        } else if (cell === "R") {
          text = "Rejected";
          classname = "text-rejected font-bold";
        }

        return <span className={classname}>{text}</span>;
      },
    },
    // {
    //   dataField: "parentData.request_status",
    //   text: "Request status",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "140px",
    //     maxWidth: "140px",
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
    
    {
      dataField: "requestBelongToEmp.employeeCode", // Reference the parent object (department)
      text: "Code", // Column heading
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        maxWidth: "120px",
      },
    },
    {
      dataField: "requestBelongToEmp",
      text: "Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "190px",
        maxWidth: "190px",
      },
      formatter: (cell) => {
        return `${cell?.firstName} ${cell?.middleName} ${cell?.lastName}`;
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
      dataField: "parentData.attDate",
      text: "Att Date",
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
      dataField: "parentData.timeIn",
      text: "Time In",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
        maxWidth: "130px",
      },
      formatter: (cell) => formatTime(cell),
    },
    {
      dataField: "parentData.timeOut",
      text: "Time Out",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
        maxWidth: "130px",
      },
      formatter: (cell) => formatTime(cell),
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setWorkflowId: FormUIProps.setWorkflowId,
        setCurrentData: FormUIProps?.setCurrentData,
      },
      headerClasses: "text-right",
      style: {
        minWidth: "100px",
      },
    },
    // {
    //   dataField: "parentData.isLateComing",
    //   text: "Late Arrival",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "120px",
    //     maxWidth: "120px",
    //   },
    //   formatter: (cell, row) => {
    //     return <span>{cell ? "Yes" : "No"}</span>;
    //   },
    // },
    // {
    //   dataField: "parentData.isHalfDay",
    //   text: "Half Day",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "120px",
    //     maxWidth: "120px",
    //   },
    //   formatter: (cell, row) => {
    //     return <span>{cell ? "Yes" : "No"}</span>;
    //   },
    // },
    // {
    //   dataField: "parentData.comments",
    //   text: "Reason",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "250px",
    //     maxWidth: "250px",
    //   },
    // },
  ];

  return (
    // <Card.Body
    //   style={{ backgroundColor: "#ffffff" }}
    //   className="overlay overlay-block cursor-default"
    // >
    <div className="mt-2 w-full overflow-x-auto">
      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({ entities })}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        selectRow={{
          mode: "checkbox",
          clickToSelect: false,
          style: { backgroundColor: "#E6F8FF" },
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
        // data={entities === null ? [] : entities}
        data={Array.isArray(entities) ? entities : []}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
        // onTableChange={getHandlerTableChange(FormUIProps.setQueryParams)}
      >
        <PleaseWaitMessage entities={entities} />
        <NoRecordsFoundMessage entities={entities} />
      </BootstrapTable>
    </div>
  );
}
