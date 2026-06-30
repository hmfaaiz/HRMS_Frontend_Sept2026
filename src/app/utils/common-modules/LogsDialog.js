import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { fetchAttLogsByDate } from "../../modules/Dashboard/_redux/dashboardActions";
import { LogIn, LogOut, OctagonAlert } from "lucide-react";
import { formatDates } from "../common";


export function LogsDialog({ onHide, show }) {
  const dispatch = useDispatch();
  const { attDate } = useParams();

  const { dateWiseAttLogs } = useSelector(
    (state) => ({
      dateWiseAttLogs: state.dashboard.dateWiseAttLogs,
    }),
    shallowEqual
  );
  // ......
  useEffect(() => {
    if (!attDate) {
      onHide?.();
      return;
    }

    dispatch(fetchAttLogsByDate({ attDate: formatDates(attDate, "dd-MMM-yyyy") }));
  }, [attDate, dispatch]);

  const getStatusLabel = (status) => {
    if (status === "01") return <><LogIn className="ml-2 w-5 h-5 text-green-500" /> Check In </>;
    if (status === "02") return <> <LogOut className="ml-2 w-5 h-5 text-red-500" />  Check Out </>;
    return <> <OctagonAlert className="ml-2 w-5 h-5 text-orange-500" /> Unknown</>;
  };

  const formatDateTime = (isoString) => {
  if (!isoString) return "-";

  const date = new Date(isoString);

  const time = [
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    String(date.getSeconds()).padStart(2, "0"),
  ].join(":");

  return {
    date: date.toLocaleDateString("en-GB"),
    time,
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
          <div className=""
            style={{
              backgroundColor: "#ffffff",
              height: "350px",
              padding: "10px",
              overflow: "scroll",
            }}
          >
            <table className="table table-bordered text-left mb-0 ">
              <thead className=" ">
                <tr>
                  <th>Status</th>
                  <th>Attendance Date</th>
                  <th>Time</th>
                  <th>Source</th>
                </tr>
              </thead>

              <tbody>
                {dateWiseAttLogs?.attendanceDetail?.length > 0 ? (
                  dateWiseAttLogs?.attendanceDetail?.map((row) => {
                    const formatted = formatDateTime(row?.AttDateTesting);

                    return (
                      <tr key={row?.Id}>
                        <td className="">{getStatusLabel(row?.Status)}</td>
                        <td className="">{row?.AttDate}</td>
                        <td>{formatted?.time?.split(":").slice(0, 2).join(":")}</td>
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