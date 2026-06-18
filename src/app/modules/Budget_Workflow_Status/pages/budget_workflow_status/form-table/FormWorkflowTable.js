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
            Manpower Budget Workflow Approval Flow
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
              <div className="text-sm text-black">
                {[
                  ["Employee Code", emp?.employeeCode],
                  ["Name", [emp?.firstName, emp?.middleName, emp?.lastName].filter(Boolean).join(" ")],
                  ["Department",    emp?.department?.deptName],
                  ["Designation",   emp?.designation?.formName],
                  ["Employee Type", emp?.employeeType?.formName],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                    <div style={{ minWidth: "110px", fontWeight: 600, whiteSpace: "nowrap" }}>{label}</div>
                    <div>{value || "N/A"}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget request detail */}
            <div className="col-span-9 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">
                Budget Request Detail
              </h6>
              <div style={{ display: "flex", gap: "16px" }} className="text-sm text-black">

                {/* Left column */}
                <div style={{ flex: 1 }}>
                  {[
                    ["Manpower Budget Code", parentData?.budgetCode],
                    ["Subsidiary",        parentData?.Subsidiary?.name],
                    ["Department",        parentData?.Department?.deptName],
                    ["Designation",       parentData?.Designation?.formName],
                    ["Budgeted Strength", parentData?.budgeted_strength],
                    ["Budgeted Salary",   parentData?.budgeted_salary != null
                        ? Number(parentData.budgeted_salary).toLocaleString()
                        : null],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <div
                        style={{
                          minWidth: "140px",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {label}
                      </div>
                      <div>{value ?? "N/A"}</div>
                    </div>
                  ))}
                </div>

                {/* Right column */}
                <div style={{ flex: 1 }}>
                  {[
                    [
                      "Request Date",
                      parentData?.request_date
                        ? format(
                            new Date(parentData.request_date),
                            "dd-MMM-yyyy",
                          )
                        : null,
                    ],
                    [
                      "Expected Joining Date",
                      parentData?.expected_date_of_joining
                        ? format(
                            new Date(parentData.expected_date_of_joining),
                            "dd-MMM-yyyy",
                          )
                        : null,
                    ],
                    ["Business Need", parentData?.business_need],
                    ["Impact of Position", parentData?.impact_of_position],
                    ["Request Status", statusLabel(parentData?.request_status)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <div
                        style={{
                          minWidth: "150px",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {label}
                      </div>
                      <div>{value ?? "N/A"}</div>
                    </div>
                  ))}
                </div>
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