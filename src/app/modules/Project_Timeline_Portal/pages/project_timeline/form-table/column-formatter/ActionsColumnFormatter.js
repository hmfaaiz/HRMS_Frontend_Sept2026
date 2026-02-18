import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  CirclePlus,
  MessageSquareText,
} from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    newTicketButtonClick,
    openTicketActivity,
    isAccessForAdd,
    isAccessForTicketActivity,
  }
) {
  return (
    <div className="space-x-2">
      {/* Add Task / Add SubTask */}
      {isAccessForAdd &&
        
        (row?.ticketTypeId == 1 || row?.ticketTypeId == 3) && (
          <OverlayTrigger
            overlay={
              <Tooltip id={`add-task-${row.Id}`}>
                {row?.ticketTypeId == 1 ? "Add Task" : "Add Sub Task"}
              </Tooltip>
            }
          >
            <a
              className="cursor-pointer"
              onClick={() =>
                newTicketButtonClick(
                  `?projectId=${row?.projectId}&ticketTypeId=${
                    row?.ticketTypeId == 1 ? "3" : "5"
                  }&parentEpicId=${
                    row?.ticketTypeId == 1 ? row?.Id : row?.parentEpicId
                  }${row?.ticketTypeId == 3 ? `&parentTaskId=${row?.Id}` : ""}`
                )
              }
            >
              <CirclePlus className="w-4 h-4 text-black" />
            </a>
          </OverlayTrigger>
        )}

      {/* Ticket Activity */}
      {isAccessForTicketActivity && (
        <OverlayTrigger
          overlay={
            <Tooltip id={`ticket-activity-${row.Id}`}>Ticket Activity</Tooltip>
          }
        >
          <button
            type="button"
            onClick={() => {
              openTicketActivity(
                `?projectId=${row?.projectId}&ticketTypeId=${row?.ticketTypeId}&ticketId=${row?.Id}`
              );
            }}
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <MessageSquareText className="w-4 h-4 text-black cursor-pointer" />
          </button>
        </OverlayTrigger>
      )}
    </div>
  );
}

