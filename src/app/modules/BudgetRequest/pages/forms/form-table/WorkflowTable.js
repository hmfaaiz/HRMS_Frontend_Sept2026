import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../../../_redux/formActions";
import { useFormUIContext } from "../FormUIContext";
import {
  headerSortingClasses,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { format } from "date-fns";

export function WorkflowTable({ onHide, show }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => ({
    workflowId: FormUIContext?.workflowId,
    currentData: FormUIContext?.currentData,
  }), [FormUIContext]);

  useEffect(() => {
    if (formUIProps?.workflowId) {
      dispatch(actions.fetchWorkflowStatusByLeaveId(formUIProps.workflowId));
    }
  }, [formUIProps.workflowId, dispatch]);

  const { workflowStatusList, actionsLoading } = useSelector(
    (state) => ({
      workflowStatusList: state?.leave_request?.workflowStatusList || [],
      actionsLoading: state?.leave_request?.actionsLoading,
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
          P: { text: "Pending",  cls: "text-pending font-bold"  },
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
        cell ? format(new Date(cell), "dd-MMM-yyyy HH:mm:ss") : "",
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
            Leave Request Workflow Status
          </h5>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Leave Summary */}
        {row && (
          <div className="w-full grid grid-cols-12 text-sm text-black gap-x-2 mb-3">
            <div className="col-span-12 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">
                Leave Request Detail
              </h6>
              <div className="grid grid-cols-4 gap-y-1 text-sm">
                <div className="font-medium">Leave Type</div>
                <div>{row?.t_leave_type?.name || "N/A"}</div>

                <div className="font-medium">From</div>
                <div>
                  {row?.from
                    ? format(new Date(row.from), "dd-MMM-yyyy")
                    : "N/A"}
                </div>

                <div className="font-medium">To</div>
                <div>
                  {row?.to
                    ? format(new Date(row.to), "dd-MMM-yyyy")
                    : "N/A"}
                </div>

                <div className="font-medium">Days</div>
                <div>{row?.days || "N/A"}</div>

                <div className="font-medium">Reason</div>
                <div>{row?.remarks || "N/A"}</div>

                <div className="font-medium">Request Status</div>
                <div>
                  {row?.request_status === "P" ? "Pending"
                    : row?.request_status === "A" ? "Approved"
                    : row?.request_status === "R" ? "Rejected"
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Table */}
        <BootstrapTable
          noDataIndication={NoRecordsFoundMessage({
            entities: workflowStatusList,
          })}
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