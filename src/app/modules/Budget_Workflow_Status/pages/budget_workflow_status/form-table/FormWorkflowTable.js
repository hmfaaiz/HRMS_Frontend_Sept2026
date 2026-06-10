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

export function WorkflowTable({ onHide, show }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const { workflowStatusList, actionsLoading } = useSelector(
    (state) => ({
      workflowStatusList: state?.budget_workflow_status?.workflowStatusList,
      actionsLoading:     state?.budget_workflow_status?.actionsLoading,
    }),
    shallowEqual
  );

  const formUIProps = useMemo(
    () => ({
      workflowId:  FormUIContext?.workflowId,
      currentData: FormUIContext?.currentData,
    }),
    [FormUIContext]
  );

  useEffect(() => {
    dispatch(actions.fetchBudgetWorkflowById(formUIProps?.workflowId));
  }, [formUIProps.workflowId, dispatch]);

  // ── Approval flow columns ──────────────────────────────────────────────────
  const approvalColumns = [
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
        `${cell?.firstName || ""} ${cell?.middleName || ""} ${cell?.lastName || ""}`.trim(),
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
      style: { minWidth: "100px", maxWidth: "100px" },
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

  const parentData = formUIProps?.currentData?.parentData;
  const emp        = formUIProps?.currentData?.requestBelongToEmp;

  const statusLabel = (s) =>
    s === "P" ? "Pending" : s === "A" ? "Approved" : s === "R" ? "Rejected" : "N/A";

  return (
    <Modal size="lg" show={show} dialogClassName="modal-75vw" onHide={onHide}>
      {actionsLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title>
          <h5 className="font-bold mb-0 text-black">
            Budget Workflow Approval Flow
          </h5>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {formUIProps?.currentData && (
          <div className="w-full grid grid-cols-12 text-sm text-black gap-x-2 mb-3">

            {/* Requester detail */}
            <div className="col-span-3 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">
                Requested By
              </h6>
              <div className="grid grid-cols-2 text-sm text-black gap-y-1">
                <div className="font-medium">Employee Code</div>
                <div>{emp?.employeeCode || "N/A"}</div>

                <div className="font-medium">Name</div>
                <div>
                  {emp?.firstName || ""} {emp?.middleName || ""}{" "}
                  {emp?.lastName || ""}
                </div>

                <div className="font-medium">Department</div>
                <div>{emp?.department?.deptName || "N/A"}</div>

                <div className="font-medium">Designation</div>
                <div>{emp?.designation?.formName || "N/A"}</div>

                <div className="font-medium">Employee Type</div>
                <div>{emp?.employeeType?.formName || "N/A"}</div>
              </div>
            </div>

            {/* Budget request detail */}
            <div className="col-span-9 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">
                Budget Request Detail
              </h6>
              <div className="grid grid-cols-2 text-sm text-black gap-y-1">

                <div className="font-medium">Subsidiary</div>
                <div>{parentData?.Subsidiary?.name || "N/A"}</div>

                <div className="font-medium">Department</div>
                <div>{parentData?.Department?.deptName || "N/A"}</div>

                <div className="font-medium">Designation</div>
                <div>{parentData?.Designation?.formName || "N/A"}</div>

                <div className="font-medium">Budgeted Strength</div>
                <div>{parentData?.budgeted_strength ?? "N/A"}</div>

                <div className="font-medium">Budgeted Salary</div>
                <div>
                  {parentData?.budgeted_salary != null
                    ? Number(parentData.budgeted_salary).toLocaleString()
                    : "N/A"}
                </div>

                <div className="font-medium">Request Date</div>
                <div>
                  {parentData?.request_date
                    ? format(new Date(parentData.request_date), "dd-MMM-yyyy")
                    : "N/A"}
                </div>

                <div className="font-medium">Expected Joining Date</div>
                <div>
                  {parentData?.expected_date_of_joining
                    ? format(new Date(parentData.expected_date_of_joining), "dd-MMM-yyyy")
                    : "N/A"}
                </div>

                <div className="font-medium">Business Need</div>
                <div>{parentData?.business_need || "N/A"}</div>

                <div className="font-medium">Impact of Position</div>
                <div>{parentData?.impact_of_position || "N/A"}</div>

                <div className="font-medium">Request Status</div>
                <div>{statusLabel(parentData?.request_status)}</div>

              </div>
            </div>
          </div>
        )}

        {/* Approval flow table */}
        <div className="mt-2">
          <h6 className="font-bold mb-0 text-primary my-2 ml-2">
            Approval Flow
          </h6>
          <BootstrapTable
            noDataIndication={NoRecordsFoundMessage({
              entities: workflowStatusList || [],
            })}
            wrapperClasses="table-responsive"
            bordered={false}
            classes="table table-head-custom table-vertical-center overflow-hidden table-hover fixed-layout-table ml-2"
            bootstrap4
            remote
            keyField="Id"
            data={workflowStatusList || []}
            columns={approvalColumns}
          >
            <PleaseWaitMessage entities={workflowStatusList || []} />
            <NoRecordsFoundMessage entities={workflowStatusList || []} />
          </BootstrapTable>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button type="button" onClick={onHide} className="btn btn-light">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}