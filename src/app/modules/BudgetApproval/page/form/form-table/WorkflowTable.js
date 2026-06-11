import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../../../redux/formAction";
import { useFormUIContext } from "../../FormUIContext";
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
      workflowStatusList: state?.department_wise_budget_approval?.workflowStatusList,
      actionsLoading: state?.department_wise_budget_approval?.actionsLoading,
    }),
    shallowEqual
  );
  const formUIProps = useMemo(() => {
    return {
      workflowId: FormUIContext?.workflowId,
      currentData: FormUIContext?.currentData,
    };
  });

  console.log("formUIProps11111", formUIProps)
  const columns = [
    {
      dataField: "approvalAuthorityEmp.employeeCode", // Reference the parent object (department)
      text: "Emp Code", // Column heading
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
        return `${cell?.firstName} ${cell?.middleName} ${cell?.lastName}`;
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
        return cell ? format(new Date(cell), "dd-MMM-yyyy:HH:mm:ss") : "";
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
    dispatch(actions.fetchBudgetWorkflow(formUIProps?.workflowId));
  }, [formUIProps.workflowId]);
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
          <h5 className="font-bold mb-0 text-black">Budget Approval Flow</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="">
        {formUIProps?.currentData && (
          <div className="w-full grid grid-cols-12 text-sm text-black gap-x-2">
            <div className="col-span-3 bg-tsecondary p-2 rounded-lg">
              <h6 className="font-bold mb-0 text-primary my-2">
                Employee Detail
              </h6>
              <div className="grid grid-cols-2 text-sm text-black">
                <div className="font-medium">Employee Code</div>
                <div>
                  {formUIProps?.currentData?.requestBelongToEmp?.employeeCode ||
                    "N/A"}
                </div>

                <div className="font-medium">Name</div>
                <div>
                  {" "}
                  {formUIProps?.currentData?.requestBelongToEmp?.firstName ||
                    ""}{" "}
                  {formUIProps?.currentData?.requestBelongToEmp?.middleName ||
                    ""}{" "}
                  {formUIProps?.currentData?.requestBelongToEmp?.lastName || ""}
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
                    Budget Request
                  </h6>
                  <div className="text-sm text-black">

                        <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">
                        Buget Code

                      </div>
                      <div className="col-span-1">
                        {
                          formUIProps?.currentData?.parentData
                            ?.budgetCode

                        }
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">Budget Year</div>
                      <div className="col-span-2">
                        {formUIProps?.currentData?.parentData?.BudgetYear ? (() => {
                          const startDate = format(
                            new Date(formUIProps.currentData.parentData.BudgetYear.startDate),
                            "dd-MMM-yyyy"
                          );

                          const endDate = format(
                            new Date(formUIProps.currentData.parentData.BudgetYear.endDate),
                            "dd-MMM-yyyy"
                          );

                          const year = new Date(
                            formUIProps.currentData.parentData.BudgetYear.endDate
                          ).getFullYear();

                          return `Year - ${year} (${startDate} to ${endDate})`;
                        })() : ""}
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">Department</div>
                      <div className="col-span-1">
                        {formUIProps?.currentData?.parentData?.Department.deptName
                        }
                      </div>
                    </div>


                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">Subsidiary</div>
                      <div className="col-span-1">
                        {formUIProps?.currentData?.parentData?.Subsidiary?.name
                        }
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">
                        Designation
                      </div>
                      <div className="col-span-1">
                        {
                          formUIProps?.currentData?.parentData
                            ?.Designation.formName
                        }
                      </div>
                    </div>

                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">
                        Business Need

                      </div>
                      <div className="col-span-1">
                        {
                          formUIProps?.currentData?.parentData
                            ?.business_need

                        }
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">
                        Impact Of Position
                      </div>
                      <div className="col-span-1">
                        {
                          formUIProps?.currentData?.parentData
                            ?.impact_of_position
                        }
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">Expected Date Of Joining</div>
                      <div className="col-span-1">
                        {formUIProps?.currentData?.parentData?.expected_date_of_joining
                          ? format(
                            new Date(
                              formUIProps?.currentData?.parentData?.expected_date_of_joining
                            ),
                            "dd-MMM-yyyy"
                          )
                          : ""}
                      </div>
                    </div>


                    <div className="grid grid-cols-4">
                      <div className="font-medium col-span-1">Request Date</div>
                      <div className="col-span-1">
                        {formUIProps?.currentData?.parentData?.request_date
                          ? format(
                            new Date(
                              formUIProps?.currentData?.parentData?.request_date
                            ),
                            "dd-MMM-yyyy"
                          )
                          : ""}
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
