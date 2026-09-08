import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";

export function AttendanceTaskLog({ onHide, show,attDate  }) {
  const { taskLogs } = useSelector(
    (state) => ({
      taskLogs: state.dashboard.taskLogs,
    }),
    shallowEqual
  );

  const rows = Array.isArray(taskLogs) ? taskLogs : [];

  const formatTime = (time) => {
    if (!time) return "-";

    if (typeof time === "string") {
      return time.substring(0, 5);
    }

    return time;
  };

  const getBillableStatus = (isBillable) => {
    return isBillable ? "Yes" : "No";
  };
  const loggedDate = rows?.[0]?.loggedDate || attDate || "-";

  const columns = [
    {
      dataField: "ticketCode",
      text: "Ticket Code",
      sort: false,
      headerClasses: "text-nowrap",
      classes: "text-nowrap align-middle",
      formatter: (cell) => cell || "-",
    },

    {
      dataField: "ticketDescription",
      text: "Ticket Description",
      sort: false,
      headerClasses: "text-nowrap",
      classes: "align-middle",
      formatter: (cell) => {
        if (!cell) return "-";

        const words = cell.split(" ");
        const lines = [];
        let currentLine = "";

        words.forEach((word) => {
          if ((currentLine + " " + word).trim().length > 60) {
            lines.push(currentLine.trim());
            currentLine = word;
          } else {
            currentLine = `${currentLine} ${word}`.trim();
          }
        });

        if (currentLine) {
          lines.push(currentLine);
        }

        return (
          <>
            {lines.map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </>
        );
      },
    },
    {
      dataField: "workDescription",
      text: "Work Description",
      sort: false,
      headerClasses: "text-nowrap",
      classes: "align-middle",
      formatter: (cell) => {
        if (!cell) return "-";

        const words = cell.split(" ");
        const lines = [];
        let currentLine = "";

        words.forEach((word) => {
          if ((currentLine + " " + word).trim().length > 60) {
            lines.push(currentLine.trim());
            currentLine = word;
          } else {
            currentLine = `${currentLine} ${word}`.trim();
          }
        });

        if (currentLine) {
          lines.push(currentLine);
        }

        return (
          <>
            {lines.map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </>
        );
      },
    },
    // {
    //   dataField: "loggedDate",
    //   text: "Logged Date",
    //   sort: false,
    //   headerClasses: "text-nowrap",
    //   classes: "text-nowrap align-middle",
    //   formatter: (cell) => cell || "-",
    // },
    {
      dataField: "timeRangeFrom",
      text: "From Time",
      sort: false,
      headerClasses: "text-nowrap",
      classes: "text-nowrap align-middle",
      formatter: (cell) => formatTime(cell),
    },
    {
      dataField: "timeRangeTo",
      text: "To Time",
      sort: false,
      headerClasses: "text-nowrap",
      classes: "text-nowrap align-middle",
      formatter: (cell) => formatTime(cell),
    },
    {
      dataField: "noOfHours",
      text: "No Of Hours",
      sort: false,
      headerClasses: "text-nowrap",
      classes: "text-nowrap align-middle",
      formatter: (cell) => cell || "0.00",
    },
    {
      dataField: "isBillable",
      text: "Billable",
      sort: false,
      headerClasses: "text-nowrap",
      classes: "text-nowrap align-middle",
      formatter: (cell) => getBillableStatus(cell),
    },
  ];

  const tableData = rows.map((row) => ({
    ...row,
    ticketCode: row?.MasterDetailTimeLog?.ticketCode || "-",
    ticketDescription:
      row?.MasterDetailTimeLog?.ticketDescription || "-",
    ticketStatus:
      row?.MasterDetailTimeLog?.ticketStatus || "-",
    loggedBy: row?.LoggedByProfile?.fullName || "-",
  }));

  return (
    <>
      <Modal size="xl" show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title className="font-weight-bold">
            Time Logs  <small className="ml-2 text-muted font-weight-normal">
    ({loggedDate})
  </small>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">
          {rows.length > 0 ? (
            <div className="table-responsive">
              <BootstrapTable
                bootstrap4
                bordered={false}
                hover
                condensed
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"
                keyField="detailId"
                data={tableData}
                columns={columns}
              />
            </div>
          ) : (
            <div className="text-center text-muted py-5">
              No Work Logs Found
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
}