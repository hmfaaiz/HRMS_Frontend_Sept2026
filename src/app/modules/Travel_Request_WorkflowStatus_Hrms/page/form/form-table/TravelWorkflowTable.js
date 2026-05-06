import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../../../_redux/formActions";
import { useFormUIContext } from "../../FormUIContext";
import {
  headerSortingClasses,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { format } from "date-fns";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { TravelRequestGrid } from "../../../../Travel_Request_Approval/page/form/form-travel-details-grid/travel-request-grid";

export function TravelWorkflowTable({ onHide, show }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const { workflowStatusList, actionsLoading, dashboard } = useSelector(
    (state) => ({
      workflowStatusList: state?.TravelRequestWorkflowAdmin?.workflowStatusList,
      actionsLoading: state?.TravelRequestWorkflowAdmin?.actionsLoading,
      dashboard: state.dashboard,
    }),
    shallowEqual,
  );

  const formUIProps = useMemo(() => {
    return {
      WorkflowId: FormUIContext?.WorkflowId,
      // travelData holds the full row from the main table (same shape as Portal's rowData)
      rowData: FormUIContext?.travelData,
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
      style: { minWidth: "160px", maxWidth: "160px" },
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy:HH:mm:ss") : "";
      },
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
    if (formUIProps?.WorkflowId) {
      dispatch(actions.fetchTravelWorkflow(formUIProps.WorkflowId));
    }
    dispatch(fetchAllFormsMenu(553, "allTravelTypeList"));
  }, [formUIProps.WorkflowId, dispatch]);

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
        {/* ── Summary Cards ────────────────────────────────────── */}
        {formUIProps?.rowData && (
          <div className="w-full grid grid-cols-12 text-sm text-black gap-x-2">
            {/* Employee Detail */}
            <div className="col-span-3 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">
                Employee Detail
              </h6>
              <div className="grid grid-cols-2 text-sm text-black">
                <div className="font-medium">Employee Code</div>
                <div>
                  {formUIProps?.rowData?.requestBelongToEmp?.employeeCode ||
                    "N/A"}
                </div>

                <div className="font-medium">Name</div>
                <div>
                  {formUIProps?.rowData?.requestBelongToEmp?.firstName || ""}{" "}
                  {formUIProps?.rowData?.requestBelongToEmp?.middleName || ""}{" "}
                  {formUIProps?.rowData?.requestBelongToEmp?.lastName || ""}
                </div>

                <div className="font-medium">Department</div>
                <div>
                  {formUIProps?.rowData?.requestBelongToEmp?.department
                    ?.deptName || "N/A"}
                </div>

                <div className="font-medium">Designation</div>
                <div>
                  {formUIProps?.rowData?.requestBelongToEmp?.designation
                    ?.formName || "N/A"}
                </div>

                <div className="font-medium">Employee Type</div>
                <div>
                  {formUIProps?.rowData?.requestBelongToEmp?.employeeType
                    ?.formName || "N/A"}
                </div>
              </div>
            </div>

            {/* Travel Request Details */}
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
                        {dashboard?.allTravelTypeList?.find(
                          (opt) =>
                            String(opt.value) ===
                            String(formUIProps?.rowData?.parentData?.travelTypeId),
                        )?.label ||
                          formUIProps?.rowData?.parentData?.travelType ||
                          "-"}
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">
                        Purpose of Travel
                      </div>
                      <div className="col-span-1">
                        {formUIProps?.rowData?.parentData?.purposeOfTravel ||
                          "-"}
                      </div>
                    </div>
                    {/* <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">Project Name</div>
                      <div className="col-span-1">
                        {formUIProps?.rowData?.parentData?.projectName || "-"}
                      </div>
                    </div> */}

                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">
                        Total Allowance Amount
                      </div>
                      <div className="col-span-1">
                        {formUIProps?.rowData?.parentData
                          ?.dailyAllowanceAmount || "-"}
                      </div>
                    </div>
                    {formUIProps?.rowData?.parentData?.advanceRequired && (
                      <div className="grid grid-cols-4">
                        <div className="font-medium col-span-1">
                          Advance Amount
                        </div>
                        <div className="col-span-1">
                          {Number(
                            formUIProps?.rowData?.parentData?.advanceAmount ||
                              0,
                          ).toLocaleString()}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">
                        Travel Remarks
                      </div>
                      <div className="col-span-1">
                        {formUIProps?.rowData?.parentData
                          ?.travelRequestRemarks || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Approval Flow Table ──────────────────────────────── */}
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

        {/* ── Travel Segment Grid ──────────────────────────────── */}
        {formUIProps?.rowData?.parentData?.Master && (
          <div className="mt-2 border-t">
            <h5 className="font-bold mb-0 text-black">
              Travel Request Details
            </h5>
            <TravelRequestGrid
              segments={formUIProps?.rowData?.parentData?.Master}
              employeeEntitlement={null}
            />
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button type="button" onClick={onHide} className="btn btn-light">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  ) ;
}
