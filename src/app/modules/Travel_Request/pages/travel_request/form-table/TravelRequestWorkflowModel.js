import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../../../_redux/redux-Actions";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { format } from "date-fns";

export function TravelRequestWorkflowModal({ show, onHide, workflowId, rowData }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (workflowId) {
      dispatch(actions.fetchTravelRequestWorkflow(workflowId));
    }
  }, [workflowId, dispatch]);

  const { workflowStatusList, actionsLoading } = useSelector(
    (state) => ({
      workflowStatusList: state.travel_request.workflowStatusList || [],
      actionsLoading: state.travel_request.actionsLoading,
    }),
    shallowEqual,
  );

  const columns = [
    {
      dataField: "approvalAuthorityEmp.employeeCode",
      text: "Emp Code",
      style: { minWidth: "100px" },
    },
    {
      dataField: "approvalAuthorityEmp",
      text: "Name",
      style: { minWidth: "160px" },
      formatter: (cell) =>
        cell
          ? `${cell.firstName || ""} ${cell.middleName || ""} ${cell.lastName || ""}`.trim()
          : "—",
    },
    {
      dataField: "approvalAuthorityEmp.department.deptName",
      text: "Department",
      style: { minWidth: "160px" },
    },
    {
      dataField: "approvalAuthorityEmp.designation.formName",
      text: "Designation",
      style: { minWidth: "160px" },
    },
    {
      dataField: "authorityStatus",
      text: "Status",
      style: { minWidth: "100px" },
      formatter: (cell) => {
        const map = {
          P: { text: "Pending",  cls: "text-pending font-bold" },
          A: { text: "Approved", cls: "text-approved font-bold" },
          R: { text: "Rejected", cls: "text-rejected font-bold" },
        };
        const { text, cls } = map[cell] || { text: "—", cls: "" };
        return <span className={cls}>{text}</span>;
      },
    },
    {
      dataField: "processDate",
      text: "Process Date",
      style: { minWidth: "140px" },
      formatter: (cell) =>
        cell ? format(new Date(cell), "dd-MMM-yyyy") : "—",
    },
    {
      dataField: "authorityRemarks",
      text: "Remarks",
      style: { minWidth: "160px" },
      formatter: (cell) => cell || "—",
    },
  ];

  return (
    <Modal size="lg" show={show} dialogClassName="modal-75vw" onHide={onHide} centered>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 className="font-bold mb-0 text-black">Travel Request Workflow Status</h5>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Request Summary */}
        {rowData && (
          <div className="bg-tsecondary p-2 rounded-lg mb-3">
            <h6 className="font-bold text-primary my-2">Request Detail</h6>
            <div className="grid grid-cols-4 gap-y-1 text-sm">
              <div className="font-medium">Travel Type</div>
              <div>{rowData.TravelType?.formName || "—"}</div>

              <div className="font-medium">Purpose</div>
              <div>{rowData.purposeOfTravel || "—"}</div>

              <div className="font-medium">From Date</div>
              <div>
                {rowData.Master?.[0]?.fromDate
                  ? format(new Date(rowData.Master[0].fromDate), "dd-MMM-yyyy")
                  : "—"}
              </div>

              <div className="font-medium">To Date</div>
              <div>
                {(() => {
                  const segs = rowData.Master || [];
                  const last = segs[segs.length - 1];
                  return last?.toDate
                    ? format(new Date(last.toDate), "dd-MMM-yyyy")
                    : "—";
                })()}
              </div>

              <div className="font-medium">Status</div>
              <div>
                {rowData.request_status === "P" && (
                  <span className="text-pending font-bold">Pending (Portal)</span>
                )}
                {rowData.request_status === "A" && rowData.approved_status === 0 && (
                  <span className="text-pending font-bold">Pending (HRMS)</span>
                )}
                {rowData.request_status === "A" && rowData.approved_status === 1 && (
                  <span className="text-approved font-bold">Approved</span>
                )}
                {rowData.request_status === "R" && (
                  <span className="text-rejected font-bold">Rejected</span>
                )}
              </div>
            </div>
          </div>
        )}

        <h6 className="font-bold text-primary my-2">Approval Flow</h6>
        <BootstrapTable
          noDataIndication={NoRecordsFoundMessage({ entities: workflowStatusList })}
          wrapperClasses="table-responsive"
          bordered={false}
          classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
          bootstrap4
          remote
          keyField="Id"
          data={workflowStatusList}
          columns={columns}
        >
          <PleaseWaitMessage entities={workflowStatusList} />
          <NoRecordsFoundMessage entities={workflowStatusList} />
        </BootstrapTable>
      </Modal.Body>

      <Modal.Footer>
        <button type="button" onClick={onHide} className="btn btn-light">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}