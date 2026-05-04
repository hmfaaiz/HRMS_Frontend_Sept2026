import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../../../redux/redux-Actions";
import { useFormUIContext } from "../../FormUIContext";
import {
  headerSortingClasses,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { format } from "date-fns";
import { TravelRequestGrid } from "../form-travel-details-grid/travel-request-grid";

export function WorkflowTable({ onHide, show }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const {
    workflowStatusList,
    workflowRecord,
    actionsLoading,
    employeeEntitlement,
  } = useSelector(
    (state) => ({
      workflowStatusList: state?.travel_approval?.workflowStatusList,
      workflowRecord: state?.travel_approval?.workflowRecord,
      actionsLoading: state?.travel_approval?.actionsLoading,
      employeeEntitlement: state?.travel_approval?.employeeEntitlement,
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (show && formUIProps?.currentData) {
      // Fetch TADA config for the requester (person who made the request)
      const requesterId = formUIProps?.currentData?.requestBelongToEmpId;
      if (requesterId) {
        dispatch(actions.fetchTadaConfigByEmployeeId(requesterId));
      }
    }
  }, [show, formUIProps?.currentData?.requestBelongToEmpId, dispatch]);

  const formUIProps = useMemo(() => {
    return {
      workflowId: FormUIContext?.workflowId,
      currentData: FormUIContext?.currentData,
      parentRecordId: FormUIContext?.currentData?.parentRecordId,
    };
  }, [FormUIContext]);

  const columns = [
    {
      dataField: "approvalAuthorityEmp.employeeCode",
      text: "Emp Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        maxWidth: "120px",
      },
    },
    {
      dataField: "approvalAuthorityEmp",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => {
        return `${cell?.firstName || ""} ${cell?.middleName ||
          ""} ${cell?.lastName || ""}`;
      },
    },
    {
      dataField: "approvalAuthorityEmp.department.deptName",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    {
      dataField: "approvalAuthorityEmp.designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    {
      dataField: "approvalAuthorityEmp.employeeType.formName",
      text: "Employee Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    {
      dataField: "authorityStatus",
      text: "Self status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => {
        let text = "";
        let classname = "";
        if (cell === "P") {
          text = "Pending";
          classname = "text-pending font-bold";
        } else if (cell === "A") {
          text = "Approved";
          classname = "text-approved font-bold";
        } else if (cell === "R") {
          text = "Rejected";
          classname = "text-rejected font-bold";
        }
        return <span className={classname}>{text}</span>;
      },
    },
    {
      dataField: "processDate",
      text: "Process Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy:HH:mm:ss") : "-";
      },
    },
    {
      dataField: "authorityRemarks",
      text: "Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
  ];

  useEffect(() => {
    if (show && formUIProps.parentRecordId) {
      // Changed from workflowId to parentRecordId
      dispatch(actions.fetchTravelWorkflowStatus(formUIProps.parentRecordId)); // Send parentRecordId
    }
  }, [formUIProps.parentRecordId, show, dispatch]); // Changed dependency

  useEffect(() => {
    if (show && formUIProps?.currentData) {
      // Fetch TADA config for the requester (person who made the request)
      const requesterId = formUIProps?.currentData?.requestBelongToEmpId;
      if (requesterId) {
        dispatch(actions.fetchTadaConfigByEmployeeId(requesterId));
      }
    }
  }, [show, formUIProps?.currentData?.requestBelongToEmpId, dispatch]);

  return (
    <Modal
      size="lg"
      show={show}
      dialogClassName="modal-75vw"
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          <h5 className="font-bold mb-0 text-black">Travel Approval Flow</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="">
        {workflowRecord && (
          <div className="w-full grid grid-cols-12 text-sm text-black gap-x-2">
            <div className="col-span-3 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">
                Employee Detail
              </h6>
              <div className="grid grid-cols-2 text-sm text-black">
                <div className="font-medium">Employee Code</div>
                <div>{workflowRecord?.Employee?.employeeCode || "N/A"}</div>

                <div className="font-medium">Name</div>
                <div>
                  {workflowRecord?.Employee?.firstName || ""}{" "}
                  {workflowRecord?.Employee?.middleName || ""}{" "}
                  {workflowRecord?.Employee?.lastName || ""}
                </div>

                <div className="font-medium">Department</div>
                <div>
                  {formUIProps?.currentData?.requestBelongToEmp?.department
                    ?.deptName || "N/A"}
                </div>

                <div className="font-medium">Designation</div>
                <div>
                  {formUIProps?.currentData?.requestBelongToEmp?.designation
                    ?.formName || "N/A"}
                </div>

                <div className="font-medium">Employee Type</div>
                <div>
                  {formUIProps?.currentData?.requestBelongToEmp?.employeeType
                    ?.formName || "N/A"}
                </div>
              </div>
            </div>
            <div className="col-span-9 bg-tsecondary p-2 rounded-lg">
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <h6 className="font-bold mb-0 text-primary my-2">
                    Travel Request Details
                  </h6>
                  <div className="text-sm text-black">
                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">Travel Type</div>
                      <div className="col-span-1">
                        {workflowRecord?.TravelType?.formName ||
                          workflowRecord?.travelType ||
                          "-"}
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">
                        Purpose of Travel
                      </div>
                      <div className="col-span-1">
                        {workflowRecord?.purposeOfTravel || "-"}
                      </div>
                    </div>
                    {/* <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">Project Name</div>
                      <div className="col-span-1">
                        {workflowRecord?.projectName || "-"}
                      </div>
                    </div> */}

                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">
                        Total Allowance Amount
                      </div>
                      <div className="col-span-1">
                        {workflowRecord?.dailyAllowanceAmount || "-"}
                      </div>
                    </div>
                    {workflowRecord?.advanceRequired && (
                      <div className="grid grid-cols-4">
                        <div className="font-medium col-span-1">
                          Advance Amount
                        </div>
                        <div className="col-span-1">
                          {Number(
                            workflowRecord?.advanceAmount || 0,
                          ).toLocaleString()}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">
                        Taxi Fare per KM
                      </div>
                      <div className="col-span-1">
                        {employeeEntitlement?.taxiFareAmount
                          ? ` ${Number(
                              employeeEntitlement.taxiFareAmount,
                            ).toLocaleString()}`
                          : "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-2">
          <BootstrapTable
            noDataIndication={NoRecordsFoundMessage({
              entities: workflowStatusList || [],
            })}
            wrapperClasses="table-responsive"
            bordered={false}
            classes="table table-head-custom table-vertical-center overflow-hidden table-hover fixed-layout-table"
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

        {workflowRecord?.Master && (
          <div className="mt-2 border-t ">
            <h5 className="font-bold mb-0 text-black">
              Travel Request Details
            </h5>
            <TravelRequestGrid
              segments={workflowRecord.Master}
              employeeEntitlement={employeeEntitlement}
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          type="submit"
          onClick={() => onHide()}
          className="btn btn-light"
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
