import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { fetchAttLogsByDate } from "../../../../Dashboard/_redux/dashboardActions";
import { formatDates } from "../../../../../utils/common";

export function LogsDialog({ onHide, show }) {
  const dispatch = useDispatch();
  const { attDate } = useParams();

  const { dateWiseAttLogs } = useSelector(
    (state) => ({
      dateWiseAttLogs: state.dashboard.dateWiseAttLogs,
    }),
    shallowEqual
  );

  
  useEffect(() => {
    if (!attDate) {
      onHide?.();
      return;
    }

    dispatch(fetchAttLogsByDate({ attDate: formatDates(attDate, "dd-MMM-yyyy") }));
  }, [attDate, dispatch]);

  const getStatusLabel = (status) => {
    if (status === "01") return "Check In";
    if (status === "02") return "Check Out";
    return "Unknown";
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);

    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  return (
    <>
      <Modal size="lg" show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            <h4 className="font-bold mb-1">Attendance Time Logs</h4>
            <p className="text-sm text-gray-600 mb-0">
              Attendance Date: {dateWiseAttLogs?.targetDate}
              <br />
              {dateWiseAttLogs?.shiftRangeText}
            </p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="border p-3 rounded">
            <table className="table table-bordered text-center mb-0">
              <thead className="bg-light text-white">
                <tr>
                  <th>Status</th>
                  <th>Attendance Date</th>
                  <th>Time</th>
                  <th>Mode</th>
                </tr>
              </thead>

              <tbody>
                {dateWiseAttLogs?.attendanceDetail?.length > 0 ? (
                  dateWiseAttLogs?.attendanceDetail?.map((row) => {
                    const formatted = formatDateTime(row?.AttDateTesting);

                    return (
                      <tr key={row?.Id}>
                        <td>{getStatusLabel(row?.Status)}</td>
                        <td>{row?.AttDate}</td>
                        <td>{formatted?.time}</td>
                        <td>
                          {row?.MachineId === "Mobile_App"
                            ? "Mobile App"
                            : row?.MachineId === "Portal_Att"
                              ? "Employee Portal"
                              : "Attendance Machine"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="text-muted">
                      No Logs Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </>
  );
}