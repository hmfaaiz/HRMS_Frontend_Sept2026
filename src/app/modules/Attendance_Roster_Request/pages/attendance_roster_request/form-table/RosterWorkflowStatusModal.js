import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
} from "../../../../../../_metronic/_helpers";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { format } from "date-fns";

export function RosterWorkflowStatusModal({ show, onHide }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => ({
    workflowId: FormUIContext?.workflowId,
    currentData: FormUIContext?.currentData,
  }), [FormUIContext]);

  useEffect(() => {
    if (formUIProps?.workflowId) {
      dispatch(actions.fetchRosterWorkflowById(formUIProps.workflowId));
    }
  }, [formUIProps.workflowId, dispatch]);

  const { workflowStatusList, actionsLoading } = useSelector(
    (state) => ({
      workflowStatusList: state?.attendance_roster_request?.workflowStatusList || [],
      actionsLoading: state?.attendance_roster_request?.actionsLoading,
    }),
    shallowEqual
  );

  const row = formUIProps?.currentData;

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
        `${cell?.firstName || ""} ${cell?.middleName || ""} ${cell?.lastName || ""}`,
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
          P: { text: "Pending", cls: "text-pending font-bold" },
          A: { text: "Approved", cls: "text-approved font-bold" },
          R: { text: "Rejected", cls: "text-rejected font-bold" },
        };
        const { text, cls } = map[cell] || {};
        return <span className={cls}>{text}</span>;
      },
    },
    {
      dataField: "processDate",
      text: "Process Date",
      style: { minWidth: "160px" },
      formatter: (cell) =>
        cell ? format(new Date(cell), "dd-MMM-yyyy") : "",
    },
    {
      dataField: "authorityRemarks",
      text: "Remarks",
      style: { minWidth: "160px" },
    },
  ];

  return (
    <Modal size="lg" show={show} dialogClassName="modal-75vw" onHide={onHide}>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 className="font-bold mb-0 text-black">
            Roster Request Workflow Status
          </h5>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Request Summary */}
        {row && (
          <div className="col-span-12 bg-tsecondary p-2 rounded-lg mb-3">
            <h6 className="font-bold mb-0 text-primary my-2">Request Detail</h6>
            <div className="grid grid-cols-4 gap-y-1 text-sm">
              <div className="font-medium">From</div>
              <div>{row?.from ? format(new Date(row.from), "dd-MMM-yyyy") : "N/A"}</div>
              <div className="font-medium">To</div>
              <div>{row?.to ? format(new Date(row.to), "dd-MMM-yyyy") : "N/A"}</div>
              <div className="font-medium">Type</div>
              <div>{row?.isEnable_roster_via_shift ? "Via Shift" : "Via Pattern"}</div>
              <div className="font-medium">Shift / Pattern</div>
              <div>
                {row?.isEnable_roster_via_shift
                  ? row?.Shift?.name || "N/A"
                  : row?.Pattern?.patternName || "N/A"}
              </div>
              <div className="font-medium">Status</div>
              <div>
                {row?.request_status === "P" && <span className="text-pending font-bold">Pending</span>}
                {row?.request_status === "A" && <span className="text-approved font-bold">Approved</span>}
                {row?.request_status === "R" && <span className="text-rejected font-bold">Rejected</span>}
              </div>
              {row?.request_remarks && (
                <>
                  <div className="font-medium">Remarks</div>
                  <div>{row.request_remarks}</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Workflow Table */}
        <h6 className="font-bold mb-0 text-primary my-2">Approval Flow</h6>
        <BootstrapTable
          noDataIndication={NoRecordsFoundMessage({ entities: workflowStatusList })}
          wrapperClasses="table-responsive"
          bordered={false}
          classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
          bootstrap4
          remote
          keyField="Id"
          data={workflowStatusList || []}
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