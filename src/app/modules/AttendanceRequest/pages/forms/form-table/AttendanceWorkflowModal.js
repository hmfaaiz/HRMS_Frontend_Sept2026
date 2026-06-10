import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../../../_redux/formActions";
import { useFormUIContext } from "../FormUIContext";
import { NoRecordsFoundMessage, PleaseWaitMessage, sortCaret, headerSortingClasses } from "../../../../../../_metronic/_helpers";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { format } from "date-fns";
import { formatTime } from "../../../../../utils/common";

export function AttendanceWorkflowModal({ show, onHide }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => ({
    workflowId:  FormUIContext?.workflowId,
    currentData: FormUIContext?.currentData,
  }), [FormUIContext]);

  useEffect(() => {
    if (formUIProps?.workflowId) {
      dispatch(actions.fetchAttendanceWorkflowById(formUIProps.workflowId));
    }
  }, [formUIProps.workflowId, dispatch]);

  const { workflowStatusList, workflowParentData, workflowRequestData, actionsLoading } = useSelector(
    (state) => ({
      workflowStatusList:  state?.attendance_request?.workflowStatusList  || [],
      workflowParentData:  state?.attendance_request?.workflowParentData  || null,
      workflowRequestData: state?.attendance_request?.workflowRequestData || null,
      actionsLoading:      state?.attendance_request?.actionsLoading,
    }),
    shallowEqual
  );

  // parentData: from API if loaded, else fall back to the clicked row
  const parentData  = workflowParentData  || formUIProps?.currentData;
  const requestData = workflowRequestData || null;

  const columns = [
    {
      dataField: "approvalAuthorityEmp.employeeCode",
      text: "Emp Code",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "120px" },
    },
    {
      dataField: "approvalAuthorityEmp",
      text: "Name",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (cell) =>
        `${cell?.firstName || ""} ${cell?.middleName || ""} ${cell?.lastName || ""}`,
    },
    {
      dataField: "approvalAuthorityEmp.department.deptName",
      text: "Department",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "160px" },
    },
    {
      dataField: "approvalAuthorityEmp.designation.formName",
      text: "Designation",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "160px" },
    },
    {
      dataField: "authorityStatus",
      text: "Status",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "120px" },
      formatter: (cell) => {
        const map = {
          P: { text: "Pending",  cls: "text-pending font-bold" },
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
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (cell) =>
        cell ? format(new Date(cell), "dd-MMM-yyyy HH:mm:ss") : "",
    },
    {
      dataField: "authorityRemarks",
      text: "Remarks",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "160px" },
    },
  ];

  return (
    <Modal size="lg" show={show} dialogClassName="modal-75vw" onHide={onHide}>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 className="font-bold mb-0 text-black">Attendance Request Workflow Status</h5>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="w-full grid grid-cols-12 text-sm text-black gap-x-2 mb-3">

          {/* Current Status */}
          <div className="col-span-6 bg-tsecondary p-2 rounded-lg">
            <h6 className="font-bold mb-0 text-primary my-2">Current Status</h6>
            <div className="grid grid-cols-2 gap-y-1 text-sm text-black">
              <div className="font-medium">Attendance Date</div>
              <div>
                {parentData?.attDate
                  ? format(new Date(parentData.attDate), "dd-MMM-yyyy")
                  : "N/A"}
              </div>

              <div className="font-medium">Time In</div>
              <div>{formatTime(parentData?.timeIn)}</div>

              <div className="font-medium">Time Out</div>
              <div>{formatTime(parentData?.timeOut)}</div>

              <div className="font-medium">Late Arrival</div>
              <div>{parentData?.isLateComing ? "Yes" : "No"}</div>

              <div className="font-medium">Early Departure</div>
              <div>{parentData?.isEarlyGoing ? "Yes" : "No"}</div>

              <div className="font-medium">Half Day</div>
              <div>{parentData?.isHalfDay ? "Yes" : "No"}</div>

              <div className="font-medium">Request Status</div>
              <div>
                {parentData?.request_status === "P" && <span className="text-pending font-bold">Pending</span>}
                {parentData?.request_status === "A" && <span className="text-approved font-bold">Approved</span>}
                {parentData?.request_status === "R" && <span className="text-rejected font-bold">Rejected</span>}
              </div>
            </div>
          </div>

          {/* Request to Update */}
          <div className="col-span-6 bg-tsecondary p-2 rounded-lg">
            <h6 className="font-bold mb-0 text-primary my-2">Request to Update</h6>
            {requestData ? (
              <div className="grid grid-cols-2 gap-y-1 text-sm text-black">
                <div className="font-medium">Attendance Date</div>
                <div>
                  {requestData?.attDate
                    ? format(new Date(requestData.attDate), "dd-MMM-yyyy")
                    : "N/A"}
                </div>

                <div className="font-medium">Time In</div>
                <div>{formatTime(requestData?.timeIn)}</div>

                <div className="font-medium">Time Out</div>
                <div>{formatTime(requestData?.timeOut)}</div>

                <div className="font-medium">Late Arrival</div>
                <div>{requestData?.isLateComing ? "Yes" : "No"}</div>

                <div className="font-medium">Early Departure</div>
                <div>{requestData?.isEarlyGoing ? "Yes" : "No"}</div>

                <div className="font-medium">Half Day</div>
                <div>{requestData?.isHalfDay ? "Yes" : "No"}</div>

                {requestData?.request_remarks && (
                  <>
                    <div className="font-medium">Reason</div>
                    <div>{requestData.request_remarks}</div>
                  </>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-400">
                No request data available.
              </span>
            )}
          </div>
        </div>

        {/* Approval Flow Table */}
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