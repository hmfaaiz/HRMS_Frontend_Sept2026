import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../../../_redux/redux-Actions";
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

  const { workflowStatusList, actionsLoading } = useSelector(
    (state) => ({
      workflowStatusList: state?.reimbursement_claim_workflow_status?.workflowStatusList,
      actionsLoading: state?.reimbursement_claim_workflow_status?.actionsLoading,
    }),
    shallowEqual
  );

  const formUIProps = useMemo(() => {
    return {
      workflowId: FormUIContext?.workflowId,
      currentData: FormUIContext?.currentData,
    };
  }, [FormUIContext]);

  const columns = [
    {
      dataField: "approvalAuthorityEmp.employeeCode",
      text: "Emp Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
    },
    {
      dataField: "approvalAuthorityEmp",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "160px" },
      formatter: (cell) =>
        `${cell?.firstName || ""} ${cell?.middleName || ""} ${cell?.lastName || ""}`,
    },
    {
      dataField: "approvalAuthorityEmp.department.deptName",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "160px" },
    },
    {
      dataField: "approvalAuthorityEmp.designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "160px" },
    },
    {
      dataField: "approvalAuthorityEmp.employeeType.formName",
      text: "Employee Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "160px" },
    },
    {
      dataField: "authorityStatus",
      text: "Self Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: (cell) => {
        let text = "";
        let classname = "";
        if (cell === "P") { text = "Pending"; classname = "text-pending font-bold"; }
        else if (cell === "A") { text = "Approved"; classname = "text-approved font-bold"; }
        else if (cell === "R") { text = "Rejected"; classname = "text-rejected font-bold"; }
        return <span className={classname}>{text}</span>;
      },
    },
    {
      dataField: "processDate",
      text: "Process Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "160px" },
      formatter: (cell) =>
        cell ? format(new Date(cell), "dd-MMM-yyyy HH:mm:ss") : "",
    },
    {
      dataField: "authorityRemarks",
      text: "Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "160px" },
    },
  ];

  useEffect(() => {
    dispatch(actions.fetchReimbursementWorkflow(formUIProps?.workflowId));
  }, [formUIProps?.workflowId, dispatch]);

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
        <Modal.Title id="reimbursement-workflow-modal">
          <h5 className="font-bold mb-0 text-black">
            Reimbursement Approval Flow
          </h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formUIProps?.currentData && (
          <div className="w-full grid grid-cols-12 text-sm text-black gap-x-2 mb-4">

            {/* Employee Detail */}
            <div className="col-span-4 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">
                Employee Detail
              </h6>
              <div className="grid grid-cols-2 text-sm text-black gap-y-1">
                <div className="font-medium">Employee Code</div>
                <div>
                  {formUIProps?.currentData?.requestBelongToEmp?.employeeCode || "N/A"}
                </div>
                <div className="font-medium">Name</div>
                <div>
                  {formUIProps?.currentData?.requestBelongToEmp?.firstName || ""}{" "}
                  {formUIProps?.currentData?.requestBelongToEmp?.middleName || ""}{" "}
                  {formUIProps?.currentData?.requestBelongToEmp?.lastName || ""}
                </div>
                <div className="font-medium">Department</div>
                <div>
                  {formUIProps?.currentData?.requestBelongToEmp?.department?.deptName || "N/A"}
                </div>
                <div className="font-medium">Designation</div>
                <div>
                  {formUIProps?.currentData?.requestBelongToEmp?.designation?.formName || "N/A"}
                </div>
                <div className="font-medium">Employee Type</div>
                <div>
                  {formUIProps?.currentData?.requestBelongToEmp?.employeeType?.formName || "N/A"}
                </div>
              </div>
            </div>

            {/* Reimbursement Detail */}
            <div className="col-span-8 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">
                Reimbursement Claim
              </h6>
              <div className="grid grid-cols-4 gap-y-1 text-sm text-black">
                <div className="font-medium col-span-1">Claim Date</div>
                <div className="col-span-3">
                  {formUIProps?.currentData?.parentData?.date || ""}
                </div>

                <div className="font-medium col-span-1">Reimbursement Type</div>
                <div className="col-span-3">
                  {formUIProps?.currentData?.parentData?.ReimbursementType?.formName || "N/A"}
                </div>

                <div className="font-medium col-span-1">Amount</div>
                <div className="col-span-3">
                  {formUIProps?.currentData?.parentData?.amount || "N/A"}
                </div>

                <div className="font-medium col-span-1">Reimbursement Month</div>
                <div className="col-span-3">
                  {formUIProps?.currentData?.parentData?.PayInPayrollForId?.reportFormat || "N/A"}
                </div>

                <div className="font-medium col-span-1">Details</div>
                <div className="col-span-3">
                  {formUIProps?.currentData?.parentData?.details || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        <BootstrapTable
          noDataIndication={NoRecordsFoundMessage({
            entities: workflowStatusList || [],
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