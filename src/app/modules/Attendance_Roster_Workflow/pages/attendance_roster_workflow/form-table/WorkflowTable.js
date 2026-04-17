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
      workflowStatusList:
        state?.attendance_roster_workflow_status?.workflowStatusList,
      actionsLoading:
        state?.attendance_roster_workflow_status?.actionsLoading,
    }),
    shallowEqual
  );

  const formUIProps = useMemo(
    () => ({
      workflowId: FormUIContext?.workflowId,
      currentData: FormUIContext?.currentData,
    }),
    [FormUIContext]
  );

  useEffect(() => {
    dispatch(actions.fetchRosterWorkflowById(formUIProps?.workflowId));
  }, [formUIProps.workflowId, dispatch]);

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
      text: "Self Status",
      style: { minWidth: "120px", maxWidth: "120px" },
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
  const emp = formUIProps?.currentData?.requestBelongToEmp;
  const requestDetails =
    parentData?.t_attendance_roster_request_details || [];

  return (
    <Modal size="lg" show={show} dialogClassName="modal-75vw" onHide={onHide}>
      {actionsLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title>
          <h5 className="font-bold mb-0 text-black">
            Attendance Roster Approval Flow
          </h5>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {formUIProps?.currentData && (
          <div className="w-full grid grid-cols-12 text-sm text-black gap-x-2 mb-3">

            {/* Employee Detail */}
            <div className="col-span-3 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">
                Employee Detail
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

            {/* Roster Detail */}
            <div className="col-span-9 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">
                Attendance Roster Request
              </h6>
              <div className="text-sm text-black">
                <div className="grid grid-cols-4">
                  <div className="font-medium col-span-1">From Date</div>
                  <div className="col-span-3">
                    {parentData?.from
                      ? format(new Date(parentData.from), "dd-MMM-yyyy")
                      : "N/A"}
                  </div>
                </div>

                <div className="grid grid-cols-4">
                  <div className="font-medium col-span-1">To Date</div>
                  <div className="col-span-3">
                    {parentData?.to
                      ? format(new Date(parentData.to), "dd-MMM-yyyy")
                      : "N/A"}
                  </div>
                </div>

                <div className="grid grid-cols-4">
                  <div className="font-medium col-span-1">Roster Via</div>
                  <div className="col-span-3">
                    {parentData?.isEnable_roster_via_shift
                      ? "Shift"
                      : "Pattern"}
                  </div>
                </div>

                <div className="grid grid-cols-4">
                  <div className="font-medium col-span-1">
                    Shift / Pattern
                  </div>
                  <div className="col-span-3">
                    {parentData?.Shift?.name ||
                      parentData?.Pattern?.patternName ||
                      "N/A"}
                  </div>
                </div>

                <div className="grid grid-cols-4">
                  <div className="font-medium col-span-1">Off Day 1</div>
                  <div className="col-span-3">
                    {parentData?.offDay_1 || "N/A"}
                  </div>
                </div>

                <div className="grid grid-cols-4">
                  <div className="font-medium col-span-1">Off Day 2</div>
                  <div className="col-span-3">
                    {parentData?.offDay_2 || "N/A"}
                  </div>
                </div>

                <div className="grid grid-cols-4">
                  <div className="font-medium col-span-1">
                    Request Status
                  </div>
                  <div className="col-span-3">
                    {parentData?.request_status === "P"
                      ? "Pending"
                      : parentData?.request_status === "A"
                      ? "Approved"
                      : parentData?.request_status === "R"
                      ? "Rejected"
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {requestDetails.length > 0 && (
          <div className="w-full text-sm text-black mb-3">
            <div className=" p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">
                Employees in Request
              </h6>

              <div className="w-full overflow-x-auto">
                <BootstrapTable
                  noDataIndication={NoRecordsFoundMessage({
                    entities: requestDetails,
                  })}
                  wrapperClasses="table-responsive"
                  bordered={false}
                  classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                  bootstrap4
                  keyField="Id"
                  data={requestDetails}
                  columns={[
                    {
                      dataField: "employee.employeeCode",
                      text: "Code",
                      style: { minWidth: "120px" },
                    },
                    {
                      dataField: "employee",
                      text: "Name",
                      style: { minWidth: "160px" },
                      formatter: (cell) =>
                        `${cell?.firstName || ""} ${cell?.middleName || ""} ${cell?.lastName || ""}`,
                    },
                    {
                      dataField: "employee.department.deptName",
                      text: "Department",
                    },
                    {
                      dataField: "employee.designation.formName",
                      text: "Designation",
                    },
                    {
                      dataField: "employee.employeeType.formName",
                      text: "Employee Type",
                    },
                  ]}
                >
                  <PleaseWaitMessage entities={requestDetails} />
                  <NoRecordsFoundMessage entities={requestDetails} />
                </BootstrapTable>
              </div>
            </div>
          </div>
        )}

        {/* Approval Flow */}
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
            columns={columns}
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