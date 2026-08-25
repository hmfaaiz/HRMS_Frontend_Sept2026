import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ClockFading, Eye, FolderClock } from "lucide-react";
import { formatDates } from "../../../../../../utils/common";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { viewttendanceLogs, viewTaskLogs, setWorkflowId, setCurrentData, showTaskColumns,setSelectedAttDate,
    hasTaskHours, dispatch,
    fetchAttendanceTaskLogs,
    setShowTaskLogsModal, }
) {
  return (
    <div className="d-flex justify-end gap-2">

      {(row?.request_status === "P" || row?.request_status === "A" || row?.request_status === "R") && (
        <OverlayTrigger overlay={<Tooltip id="att-workflow-tooltip">View Workflow</Tooltip>}>
          <span
            className="cursor-pointer ml-2"
            onClick={() => {
              setWorkflowId(row.Id);
              setCurrentData(row);
            }}
          >
            <Eye className="w-4 h-4 text-black cursor-pointer"/>
          </span>
        </OverlayTrigger>
      )}
      <OverlayTrigger overlay={<Tooltip id="att-logs-tooltip">View Logs</Tooltip>}>
        <span className="cursor-pointer mt-2" onClick={() => viewttendanceLogs(row?.attDate)}>
          <ClockFading className="w-4 h-4 text-black cursor-pointer"/>
        </span>
      </OverlayTrigger>


      {showTaskColumns && (
        <OverlayTrigger
          overlay={
            <Tooltip id={`products-edit-tooltip-${row?.employeeCode}`}>
              Detail Time Log
            </Tooltip>
          }
        >
          <button
            type="button"
            className="btn p-0 ml-1"
            onClick={() => {
               const attDate = formatDates(row?.attDate, "dd-MMM-yyyy");
              
              setSelectedAttDate(attDate);
              dispatch(
                fetchAttendanceTaskLogs(
                  row?.employeeId,
                  row?.attDate
                )
              );


              setShowTaskLogsModal(true);
            }}
          >
            <FolderClock className="w-4 h-4 text-black cursor-pointer" />
          </button>
        </OverlayTrigger>
      )}


    </div>
  );
}