import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, FolderClock, LayoutList, Pencil, Trash2 } from "lucide-react";
export function FormColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openDetailTimeLog, openDetailGridData, showTicketDetails }
) {
  return (
    <div className="space-x-2">

      {/* {!showTicketDetails && (
        <OverlayTrigger
          overlay={<Tooltip id={`detail-${row.Id}`}>Detail</Tooltip>}
        >
          <button
            type="button"
            onClick={() => openDetailGridData(row.Id)}
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <LayoutList className="w-4 h-4 text-black cursor-pointer" />
          </button>
        </OverlayTrigger>
      )} */}

      <OverlayTrigger
        overlay={<Tooltip id={`timelog-${row.Id}`}>Detail Time Log</Tooltip>}
      >
        <button
          type="button"
          onClick={() => {
            const detailId = row.Id;
            if (detailId) {
              openDetailTimeLog(detailId);
            }
          }}
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <FolderClock className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </OverlayTrigger>

    </div>
  );
}

export function TimeLogsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openDeleteHandler, setReceiveMode, setReadMode, setId, setDetailId, openEditHandler }
) {
  return (
    <div className="space-x-2">

         <OverlayTrigger
        overlay={<Tooltip id="products-vieew-tooltip">View</Tooltip>}
      >
        <button
          type="button"
          onClick={() => {
            openEditHandler(row.Id, row.detailId);
          }}

          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </OverlayTrigger>


{/* {row?.MasterDetailTimeLog?.ticketStatus != 0 && (
  <>

   <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
      >
        <button
          type="button"
          onClick={() => {
            openEditHandler(row.Id, row.detailId);
          }}

          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <Pencil className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </OverlayTrigger>





      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
        <a onClick={() => openDeleteHandler(row.Id, row.detailId)}>
          <Trash2 className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>
  </>

        )
} */}
     
    </div>
  );
}