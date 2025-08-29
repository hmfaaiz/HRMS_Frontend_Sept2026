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
export function LeaveBalanceTable({ onHide, show }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { leaveBalances, actionsLoading } = useSelector(
    (state) => ({
      leaveBalances: state?.LeaveWorkflowStatus?.leaveBalances,
      actionsLoading: state?.LeaveWorkflowStatus?.actionsLoading,
    }),
    shallowEqual
  );
  const formUIProps = useMemo(() => {
    return {
      leaveBalanceId: FormUIContext?.leaveBalanceId,
      leaveData: FormUIContext?.leaveData,
    };
  });
  const columns = [
    {
      dataField: "leaveTypeName",
      text: "Leave Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "yearName",
      text: "Year",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "allocatedCount",
      text: "Allocated Leave Count",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "availedCount",
      text: "Availed",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "carryForwardCount",
      text: "Carry Forward Leave Count",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "lateCount",
      text: "Late Count",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "encashmentCount",
      text: "Encashment Leaves Count",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "remainingCount",
      text: "Remaining",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
  ];
  useEffect(() => {
    dispatch(actions.fetchLeaveBalances(formUIProps?.leaveBalanceId));
  }, [formUIProps.leaveBalanceId]);

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
          Leave Balance
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overlay overlay-block cursor-default">
        {formUIProps?.leaveData && (
          <div className="row mb-4">
            <div className="col-3">
              Employee Code :{" "}
              <span className="font-weight-bold">
                {formUIProps?.leaveData?.requestBelongToEmp?.employeeCode}
              </span>
            </div>
            <div className="col-3">
              Name :{" "}
              <span className="font-weight-bold">
                {formUIProps?.leaveData?.requestBelongToEmp?.firstName}{" "}
                {formUIProps?.leaveData?.requestBelongToEmp?.middleName}{" "}
                {formUIProps?.leaveData?.requestBelongToEmp?.lastName}
              </span>
            </div>
            <div className="col-3">
              Department :{" "}
              <span className="font-weight-bold">
                {
                  formUIProps?.leaveData?.requestBelongToEmp?.department
                    ?.deptName
                }
              </span>
            </div>
            <div className="col-3">
              Designation :{" "}
              <span className="font-weight-bold">
                {
                  formUIProps?.leaveData?.requestBelongToEmp?.designation
                    ?.formName
                }
              </span>
            </div>
          </div>
        )}
        <BootstrapTable
          noDataIndication={NoRecordsFoundMessage({
            entities: leaveBalances || [],
          })}
          wrapperClasses="table-responsive"
          bordered={false}
          classes="table table-head-custom table-vertical-center overflow-hidden table-hover fixed-layout-table"
          bootstrap4
          remote
          keyField="Id"
          data={leaveBalances || []}
          columns={columns}
          //   onTableChange={getHandlerTableChange(
          //     FormUIProps.setQueryParamsLeaveApp
          //   )}
        >
          <PleaseWaitMessage entities={leaveBalances || []} />
          <NoRecordsFoundMessage entities={leaveBalances || []} />
        </BootstrapTable>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="submit"
          onClick={() => onHide()}
          className="btn btn-danger btn-elevate"
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
