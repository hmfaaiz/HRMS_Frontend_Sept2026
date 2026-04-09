import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import {
  headerSortingClasses, NoRecordsFoundMessage,
  PleaseWaitMessage, sortCaret,
} from "../../../../../../_metronic/_helpers";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { format } from "date-fns";

export function WorkflowTable({ onHide, show }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const { workflowStatusList, actionsLoading } = useSelector(
    (state) => ({
      workflowStatusList: state?.reimbursement_claim_approval?.workflowStatusList,
      actionsLoading: state?.reimbursement_claim_approval?.actionsLoading,
    }),
    shallowEqual
  );

  const formUIProps = useMemo(() => ({
    workflowId: FormUIContext?.workflowId,
    currentData: FormUIContext?.currentData,
  }));

  const columns = [
    {
      dataField: "approvalAuthorityEmp.employeeCode",
      text: "Emp Code",
      style: { minWidth: "120px", maxWidth: "120px" },
    },
    {
      dataField: "approvalAuthorityEmp",
      text: "Name",
      style: { minWidth: "160px", maxWidth: "160px" },
      formatter: (cell) =>
        `${cell?.firstName || ""} ${cell?.middleName || ""} ${cell?.lastName || ""}`,
    },
    {
      dataField: "approvalAuthorityEmp.department.deptName",
      text: "Department",
      style: { minWidth: "160px", maxWidth: "160px" },
    },
    {
      dataField: "approvalAuthorityEmp.designation.formName",
      text: "Designation",
      style: { minWidth: "160px", maxWidth: "160px" },
    },
    {
      dataField: "approvalAuthorityEmp.employeeType.formName",
      text: "Employee Type",
      style: { minWidth: "160px", maxWidth: "160px" },
    },
    {
      dataField: "authorityStatus",
      text: "Status",
      style: { minWidth: "120px", maxWidth: "120px" },
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
      style: { minWidth: "160px", maxWidth: "160px" },
      formatter: (cell) =>
        cell ? format(new Date(cell), "dd-MMM-yyyy HH:mm:ss") : "",
    },
    {
      dataField: "authorityRemarks",
      text: "Remarks",
      style: { minWidth: "160px", maxWidth: "160px" },
    },
  ];

  useEffect(() => {
    dispatch(actions.fetchReimbursementWorkflow(formUIProps?.workflowId));
  }, [formUIProps.workflowId]);

  const parentData = formUIProps?.currentData?.parentData;
  const emp = formUIProps?.currentData?.requestBelongToEmp;

  return (
    <Modal
      size="lg"
      show={show}
      dialogClassName="modal-75vw"
      onHide={onHide}
      aria-labelledby="reimbursement-workflow-modal"
    >
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 className="font-bold mb-0 text-black">Reimbursement Claim Approval Flow</h5>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {formUIProps?.currentData && (
          <div className="w-full grid grid-cols-12 text-sm text-black gap-x-2 mb-3">
            {/* Employee Detail */}
            <div className="col-span-3 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">Employee Detail</h6>
              <div className="grid grid-cols-2 text-sm">
                <div className="font-medium">Employee Code</div>
                <div>{emp?.employeeCode || "N/A"}</div>

                <div className="font-medium">Name</div>
                <div>{emp?.firstName || ""} {emp?.middleName || ""} {emp?.lastName || ""}</div>

                <div className="font-medium">Department</div>
                <div>{emp?.department?.deptName || "N/A"}</div>

                <div className="font-medium">Designation</div>
                <div>{emp?.designation?.formName || "N/A"}</div>

                <div className="font-medium">Employee Type</div>
                <div>{emp?.employeeType?.formName || "N/A"}</div>
              </div>
            </div>

            {/* Claim Detail */}
            <div className="col-span-9 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">Reimbursement Claim</h6>
              <div className="grid grid-cols-4 text-sm gap-y-1">
                <div className="font-medium col-span-1">Reimbursement Type</div>
                <div className="col-span-3">
                  {parentData?.ReimbursementType?.formName || "N/A"}
                </div>

                <div className="font-medium col-span-1">Claim Date</div>
                <div className="col-span-3">
                  {parentData?.date
                    ? format(new Date(parentData.date), "dd-MMM-yyyy")
                    : "N/A"}
                </div>

                <div className="font-medium col-span-1">Amount</div>
                <div className="col-span-3">{parentData?.amount || "N/A"}</div>

                <div className="font-medium col-span-1">Details</div>
                <div className="col-span-3">{parentData?.details || "N/A"}</div>
              </div>
            </div>
          </div>
        )}

        <BootstrapTable
          noDataIndication={NoRecordsFoundMessage({ entities: workflowStatusList || [] })}
          wrapperClasses="table-responsive"
          bordered={false}
          classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
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
        <button type="button" onClick={onHide} className="btn btn-light">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}