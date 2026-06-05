import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
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
import { useFormUIContext } from "../../FormUIContext";
import { ActionsColumnFormatter } from "./column-formatter/ActionCloumnFormatter";
import { format } from "date-fns";

export function FormTable() {
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
      currentState: state?.ResignationWorkflowStatus,
      user: state?.auth?.user,
    };
  }, shallowEqual);

  const { entities } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.fetchResignationApprovalApplication(
        FormUIProps.queryParams,
        user?.employeeIdMapping
      )
    );
  }, [FormUIProps.queryParams, dispatch]);

  // Table columns
  const columns = [
    {
      dataField: "authorityStatus",
      text: "Self status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "90px",
        maxWidth: "90px",
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
        minWidth: "100px",
        maxWidth: "100px",
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
      dataField: "requestBelongToEmp.employeeCode", // Reference the parent object (department)
      text: "Code", // Column heading
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
        maxWidth: "70px",
      },
    },
    {
      dataField: "requestBelongToEmp",
      text: "Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        maxWidth: "120px",
      },
      formatter: (cell) => {
        return `${cell?.firstName} ${cell?.middleName} ${cell?.lastName}`;
      },
    },
    {
      dataField: "parentData.resignationDate",
      text: "Resignation Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "80px",
        maxWidth: "80px",
      },
    },
    {
      dataField: "parentData.lastWorkingDate",
      text: "Last Working Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "80px",
        maxWidth: "80px",
      },
    },
    {
      dataField: "parentData.ExitType.formName",
      text: "Exit Type",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "80px",
        maxWidth: "80px",
      },
    },
    {
      dataField: "parentData.ExitReason.exitReason",
      text: "Exit Reason",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
        maxWidth: "100px",
      },
    },
    {
      dataField: "parentData.exitRemark",
      text: "Remarks",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
        maxWidth: "130px",
      },
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
  ];

  return (
    <div className="overflow-x-auto w-full scrollbar-fancy">
      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({ entities })}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
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
