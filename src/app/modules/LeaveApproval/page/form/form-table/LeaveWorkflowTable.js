import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../../../redux/formAction";
import { useFormUIContext } from "../../FormUIContext";
import {
  headerSortingClasses,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
export function LeaveWorkflowTable({ onHide, show }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { workflowStatusList, actionsLoading } = useSelector(
    (state) => ({
      workflowStatusList: state?.leave_approval?.workflowStatusList,
      actionsLoading: state?.leave_approval?.actionsLoading,
    }),
    shallowEqual
  );
  const formUIProps = useMemo(() => {
    return {
      leaveWorkflowId: FormUIContext?.leaveWorkflowId,
      leaveData: FormUIContext?.leaveData,
    };
  });
  const columns = [
    {
      dataField: "approvalAuthorityEmp.employeeCode", // Reference the parent object (department)
      text: "Emp Code", // Column heading
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        maxWidth: "120px",
      },
    },
    {
      dataField: "approvalAuthorityEmp",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => {
        return `${cell?.firstName} ${cell?.middleName} ${cell?.lastName}`;
      },
    },
    {
      dataField: "approvalAuthorityEmp.department.deptName",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    {
      dataField: "approvalAuthorityEmp.designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    {
      dataField: "approvalAuthorityEmp.employeeType.formName",
      text: "Employee Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    {
      dataField: "authorityStatus",
      text: "Self status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => {
        let text = "";
        let style = {};

        if (cell === "P") {
          text = "Pending";
          style = { color: "green", fontWeight: "bold" };
        } else if (cell === "A") {
          text = "Approved";
          style = { color: "black", fontWeight: "bold" };
        } else if (cell === "R") {
          text = "Rejected";
          style = { color: "red", fontWeight: "bold" };
        }

        return <span style={style}>{text}</span>;
      },
    },
    {
      dataField: "processDate",
      text: "Process Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => {
        const date = new Date(cell);
        if (cell) {
          const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit", // optional
            hour12: false, // use 24-hour format; set to true for 12-hour with AM/PM
          };

          const formattedDateTime = date.toLocaleString("en-GB", options);
          return formattedDateTime;
        }
        return "";
      },
    },
    {
      dataField: "authorityRemarks",
      text: "Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
  ];
  useEffect(() => {
    dispatch(actions.fetchLeaveWorkflow(formUIProps?.leaveWorkflowId));
  }, [formUIProps.leaveWorkflowId]);

  return (
    <Modal
      size="lg"
      show={show}
      dialogClassName="modal-75vw"
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Leave Workflow
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overlay overlay-block cursor-default">
        {formUIProps?.leaveData && (
          <div className="row mb-4">
            <div className="col-3">
              Employee Code :{" "}
              <span className="font-weight-bold">
                {formUIProps?.leaveData?.requestBelongToEmp?.employeeCode}
              </span>
            </div>
            <div className="col-3">
              Name :{" "}
              <span className="font-weight-bold">
                {formUIProps?.leaveData?.requestBelongToEmp?.firstName}{" "}
                {formUIProps?.leaveData?.requestBelongToEmp?.middleName}{" "}
                {formUIProps?.leaveData?.requestBelongToEmp?.lastName}
              </span>
            </div>
            <div className="col-3">
              Department :{" "}
              <span className="font-weight-bold">
                {
                  formUIProps?.leaveData?.requestBelongToEmp?.department
                    ?.deptName
                }
              </span>
            </div>
            <div className="col-3">
              Designation :{" "}
              <span className="font-weight-bold">
                {
                  formUIProps?.leaveData?.requestBelongToEmp?.designation
                    ?.formName
                }
              </span>
            </div>
            <div className="col-3">
              Leave Type :{" "}
              <span className="font-weight-bold">
                {formUIProps?.leaveData?.parentData?.t_leave_type?.name}
              </span>
            </div>
            <div className="col-3">
              From Date :{" "}
              <span className="font-weight-bold">
                {formUIProps?.leaveData?.parentData?.from}
              </span>
            </div>
            <div className="col-3">
              To Date :{" "}
              <span className="font-weight-bold">
                {formUIProps?.leaveData?.parentData?.to}
              </span>
            </div>
            <div className="col-3">
              Days :{" "}
              <span className="font-weight-bold">
                {formUIProps?.leaveData?.parentData?.days}
              </span>
            </div>
            <div className="col-6">
              Reason :{" "}
              <span className="font-weight-bold">
                {formUIProps?.leaveData?.parentData?.remarks}
              </span>
            </div>
          </div>
        )}
        <BootstrapTable
          noDataIndication={NoRecordsFoundMessage({
            entities: workflowStatusList || [],
          })}
          wrapperClasses="table-responsive"
          bordered={false}
          classes="table table-head-custom table-vertical-center overflow-hidden table-hover fixed-layout-table"
          bootstrap4
          remote
          keyField="Id"
          data={workflowStatusList || []}
          columns={columns}
        >
          <PleaseWaitMessage entities={workflowStatusList || []} />
          <NoRecordsFoundMessage entities={workflowStatusList || []} />
        </BootstrapTable>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="submit"
          onClick={() => onHide()}
          className="btn btn-danger btn-elevate"
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
