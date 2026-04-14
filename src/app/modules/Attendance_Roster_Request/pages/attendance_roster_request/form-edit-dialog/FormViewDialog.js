import React from "react";
import { Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {
  headerSortingClasses,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import { format } from "date-fns";

export function FormViewDialog({ show, onHide, record }) {
  if (!record) return null;

  const details = record?.t_attendance_roster_request_details || [];

  const columns = [
    {
      dataField: "employee.employeeCode",
      text: "Emp Code",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
    },
    {
      dataField: "employee",
      text: "Name",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "180px" },
      formatter: (cell) =>
        cell ? `${cell.firstName || ""} ${cell.lastName || ""}` : "—",
    },
    {
      dataField: "employee.department",
      text: "Department",
      style: { minWidth: "140px", maxWidth: "160px" },
      formatter: (cell, row) => row?.employee?.department?.deptName || "N/A",
    },
    {
      dataField: "employee.designation",
      text: "Designation",
      style: { minWidth: "140px", maxWidth: "160px" },
      formatter: (cell, row) => row?.employee?.designation?.formName || "N/A",
    },
    {
      dataField: "employee.employeeType",
      text: "Employee Type",
      style: { minWidth: "120px", maxWidth: "140px" },
      formatter: (cell, row) => row?.employee?.employeeType?.formName || "N/A",
    },
  ];

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      dialogClassName="modal-75vw"
      aria-labelledby="roster-request-view-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="roster-request-view-modal">
          <h5 className="font-bold mb-0 text-black">Roster Request Details</h5>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="w-full grid grid-cols-12 text-sm text-black gap-x-2 mb-4">
          {/* Requested By */}
          <div className="col-span-4 bg-tsecondary p-2 rounded-lg">
            <h6 className="font-bold mb-0 text-primary my-2">Requested By</h6>
            <div className="grid grid-cols-2 text-sm text-black gap-y-1">
              <div className="font-medium">Employee Code</div>
              <div>{record?.RequestedByEmp?.employeeCode || "N/A"}</div>

              <div className="font-medium">Name</div>
              <div>
                {record?.RequestedByEmp
                  ? `${record.RequestedByEmp.firstName} ${record.RequestedByEmp.lastName}`
                  : "N/A"}
              </div>

              <div className="font-medium">Department</div>
              <div>{record?.RequestedByEmp?.department?.deptName || "N/A"}</div>

              <div className="font-medium">Designation</div>
              <div>
                {record?.RequestedByEmp?.designation?.formName || "N/A"}
              </div>

              <div className="font-medium">Employee Type</div>
              <div>
                {record?.RequestedByEmp?.employeeType?.formName || "N/A"}
              </div>
            </div>
          </div>

          {/* Roster Detail */}
          <div className="col-span-8 bg-tsecondary p-2 rounded-lg">
            <h6 className="font-bold mb-0 text-primary my-2">Roster Detail</h6>
            <div className="grid grid-cols-4 gap-y-1 text-sm text-black">
              <div className="font-medium col-span-1">From</div>
              <div className="col-span-3">
                {record?.from
                  ? format(new Date(record.from), "dd-MMM-yyyy")
                  : "N/A"}
              </div>

              <div className="font-medium col-span-1">To</div>
              <div className="col-span-3">
                {record?.to
                  ? format(new Date(record.to), "dd-MMM-yyyy")
                  : "N/A"}
              </div>

              <div className="font-medium col-span-1">Type</div>
              <div className="col-span-3">
                {record?.isEnable_roster_via_shift
                  ? "Via Shift"
                  : "Via Pattern"}
              </div>

              <div className="font-medium col-span-1">Shift / Pattern</div>
              <div className="col-span-3">
                {record?.isEnable_roster_via_shift
                  ? record?.Shift?.name || "N/A"
                  : record?.Pattern?.patternName || "N/A"}
              </div>

              {record?.offDay_1 && (
                <>
                  <div className="font-medium col-span-1">Off Day 1</div>
                  <div className="col-span-3">{record.offDay_1}</div>
                </>
              )}

              {record?.offDay_2 && (
                <>
                  <div className="font-medium col-span-1">Off Day 2</div>
                  <div className="col-span-3">{record.offDay_2}</div>
                </>
              )}

              <div className="font-medium col-span-1">Status</div>
              <div className="col-span-3">
                {record?.request_status === "P" && (
                  <span className="text-pending font-bold">Pending</span>
                )}
                {record?.request_status === "A" && (
                  <span className="text-approved font-bold">Approved</span>
                )}
                {record?.request_status === "R" && (
                  <span className="text-rejected font-bold">Rejected</span>
                )}
              </div>

              {record?.request_remarks && (
                <>
                  <div className="font-medium col-span-1">Remarks</div>
                  <div className="col-span-3">{record.request_remarks}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <h6 className="font-bold mb-0 text-primary my-2">
          Employees ({details.length})
        </h6>
        <BootstrapTable
          noDataIndication={NoRecordsFoundMessage({ entities: details })}
          wrapperClasses="table-responsive"
          bordered={false}
          classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
          bootstrap4
          remote
          keyField="Id"
          data={details}
          columns={columns}
        >
          <PleaseWaitMessage entities={details} />
          <NoRecordsFoundMessage entities={details} />
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
