import React, { useMemo , useEffect} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import * as actions from "../../../redux/formAction";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../../FormUIHelper";
import { useFormUIContext } from "../../FormUIContext";
import { ActionsColumnFormatter } from "./column-formatter/ActionCloumnFormatter";
import { format } from "date-fns";
import { formatTime } from "../../../../../utils/common";

export function ApprovalFormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();
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
  useEffect(() => {
    dispatch(actions.fetchAllApprovalApplication(FormUIProps.queryParams));
  }, [FormUIProps.queryParams, dispatch]);
  const { currentState } = useSelector((state) => {
    return {
      currentState: state.job_requestion_workflow_admin,
    };
  }, shallowEqual);

  const { entities } = currentState;

  // Table columns
  const columns = [
    {
      dataField: "authorityStatus",
      text: "Self status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
        maxWidth: "60px",
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
    {
      dataField: "parentData.request_status",
      text: "Request status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
        maxWidth: "60px",
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

    {
      dataField: "requestBelongToEmp", // Reference the parent object (department)
      text: "Employee", // Column heading
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        maxWidth: "120px",
      },
      formatter: (cell) => {
        return (
          <span
            className="line-clamp-1"
            title={`{cell?.employeeCode} - {cell?.firstName} {cell?.middleName}
            {cell?.lastName}`}
          >
            {cell?.employeeCode} - {cell?.firstName} {cell?.middleName}
            {cell?.lastName}
          </span>
        );
      },
    },
    {
      dataField: "requestBelongToEmp.department.deptName",
      text: "Department",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    {
      dataField: "parentData",
      text: "Job Code / Job Title",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
        maxWidth: "130px",
      },
      formatter: (cell) => (
        <span
          title={`${cell.jobCode}-${cell.jobTitle}`}
          className="line-clamp-1"
        >
          {cell.jobCode}-{cell.jobTitle}
        </span>
      ),
    },
    {
      dataField: "parentData.dateOfRequest",
      text: "Request Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "90px",
        maxWidth: "90px",
      },
    },
    {
      dataField: "parentData.desireDateOfApp",
      text: "Desire Date Of Appointment",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "90px",
        maxWidth: "90px",
      },
    },
    // {
    //   dataField: "parentData.Department.deptName",
    //   text: "Department",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "130px",
    //     maxWidth: "130px",
    //   },
    //   formatter: (cell) => (
    //     <span title={cell} className="line-clamp-1">
    //       {cell}
    //     </span>
    //   ),
    // },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setWorkflowId: FormUIProps.setWorkflowId,
        setCurrentData: FormUIProps?.setCurrentData,
      },

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
    <div className="overflow-x-auto w-full">
      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({ entities })}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        selectRow={{
          mode: "checkbox",
          clickToSelect: false,
          style: { backgroundColor: "#ecbd8b" },
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
      >
        <PleaseWaitMessage entities={entities} />
        <NoRecordsFoundMessage entities={entities} />
      </BootstrapTable>
    </div>
  );
}
