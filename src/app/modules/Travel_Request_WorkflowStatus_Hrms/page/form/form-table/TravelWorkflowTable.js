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

export function TravelWorkflowTable({ onHide, show }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { workflowStatusList, actionsLoading } = useSelector(
    (state) => ({
      workflowStatusList: state?.TravelRequestWorkflowAdmin?.workflowStatusList,
      actionsLoading: state?.TravelRequestWorkflowAdmin?.actionsLoading,
    }),
    shallowEqual
  );
  const formUIProps = useMemo(() => {
    return {
      WorkflowId: FormUIContext?.WorkflowId,
      travelData: FormUIContext?.travelData,
      travelRequestId: FormUIContext?.travelRequestId,
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
    if (formUIProps?.WorkflowId) {
      dispatch(actions.fetchTravelWorkflow(formUIProps?.WorkflowId));
    }
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
        {formUIProps?.travelData && (
          <div className="w-full grid grid-cols-12 text-sm text-black gap-x-2">
            <div className="col-span-12 bg-tsecondary p-4 rounded-lg mb-4">
              <h6 className="font-bold mb-3 text-primary">Travel Request Detail</h6>
              <div className="grid grid-cols-12 gap-4">
                 <div className="col-span-3">
                    <p className="font-medium mb-1">Employee</p>
                    <p>{formUIProps?.travelData?.requestBelongToEmp?.firstName} {formUIProps?.travelData?.requestBelongToEmp?.lastName}</p>
                 </div>
                 <div className="col-span-3">
                    <p className="font-medium mb-1">Travel Type</p>
                    <p>{formUIProps?.travelData?.parentData?.t_travel_type?.name}</p>
                 </div>
                 <div className="col-span-3">
                    <p className="font-medium mb-1">Duration</p>
                    <p>{formUIProps?.travelData?.parentData?.totalTravelDays} Days</p>
                 </div>
                 <div className="col-span-3">
                    <p className="font-medium mb-1">Reason</p>
                    <p>{formUIProps?.travelData?.parentData?.remarks || "N/A"}</p>
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
            classes="table table-head-custom  table-vertical-center overflow-hidden table-hover fixed-layout-table"
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
          type="button"
          onClick={onHide}
          className="btn btn-light"
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
