import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
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
import { ActionsColumnFormatter } from "../form-table/column-formatter/ActionsColumnFormatter";

export function ApprovalFormTable() {
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
      currentState: state.job_requestion_workflow_status,
      user: state?.auth?.user,
    };
  }, shallowEqual);

  const { entities } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?.employeeIdMapping) return;
    dispatch(
      actions.fetchAllApplication(
        FormUIProps.queryParams,
        user?.employeeIdMapping,
      ),
    );
  }, [FormUIProps.queryParams, dispatch, user?.employeeIdMapping]);
  const columns = [
    {
      dataField: "authorityStatus",
      text: "Self Status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "90px", maxWidth: "90px" },
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
      text: "Request Status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "90px", maxWidth: "90px" },
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
    {
      dataField: "parentData.Department.deptName",
      text: "Department",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
        maxWidth: "130px",
      },
      formatter: (cell) => (
        <span title={cell} className="line-clamp-1">
          {cell}
        </span>
      ),
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

      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "170px",
      },
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <BootstrapTable
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        keyField="Id"
        data={entities === null ? [] : entities}
        columns={columns}
        // noDataIndication={NoRecordsFoundMessage({ entities })}
        // remote
        // defaultSorted={uiHelpers.defaultSorted}
        // onTableChange={getHandlerTableChange(FormUIProps.setQueryParams)}
      >
        <PleaseWaitMessage entities={entities} />
        <NoRecordsFoundMessage entities={entities} />
      </BootstrapTable>
    </div>
  );
}
