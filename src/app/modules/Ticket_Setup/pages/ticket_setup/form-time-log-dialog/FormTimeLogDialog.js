import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import BootstrapTable from "react-bootstrap-table-next";
import {
  headerSortingClasses,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";

export function FormTimeLogDialog({ id, show, onHide }) {
  // Customers Redux state
  const dispatch = useDispatch();
  const { isLoading, logDetail } = useSelector(
    (state) => ({
      isLoading: state.ticket_setup.actionsLoading,
      logDetail: state.ticket_setup.logDetail,
    }),
    shallowEqual,
  );

  // if !id we should close modal
  useEffect(() => {
    if (!id) {
      onHide();
    }
    if (id) {
      dispatch(actions.fetchTimeLogDetail(id));
    }
  }, [id]);

  const columns = [
    {
      dataField: "Employee",
      text: "Employee",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
      formatter: (cell) =>
        cell
          ? `${cell?.employeeCode}-${cell?.firstName} ${cell?.middleName} ${cell?.lastName}`
          : "",
    },
    {
      dataField: "loggedDate",
      text: "Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },
    {
      dataField: "timeRangeFrom",
      text: "From Time",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },
    {
      dataField: "timeRangeTo",
      text: "To Time",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },
    {
      dataField: "noOfHours",
      text: "No Of Hours",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },

    {
      dataField: "isBillable",
      text: "Billable",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
      formatter: (cell) => {
        // Handle 0/1 values
        if (cell == true) return "Yes";
        if (cell == false) return "No";
        return ""; // fallback if null/undefined
      },
    },
  ];

  return (
    <Modal
      show={show}
      size="xl"
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {logDetail?.ticket?.ticketCode || ""}-
          {logDetail?.ticket?.ticketDescription || ""} Time Logs
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BootstrapTable
          wrapperClasses="table-responsive"
          bordered={false}
          classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
          bootstrap4
          remote
          keyField="Id"
          data={logDetail?.timeLogs || []}
          columns={columns}
        >
          <PleaseWaitMessage entities={logDetail?.timeLogs} />
          <NoRecordsFoundMessage entities={logDetail?.timeLogs} />
        </BootstrapTable>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onHide} className="btn btn-light ">
            Cancel
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
