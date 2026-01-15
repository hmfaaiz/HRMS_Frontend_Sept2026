import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, LayoutList, Pencil, Reply, Trash2 } from "lucide-react";
import { fetchAllFacilitatorDetail } from "../../../../_redux/redux-Actions";
import { FormDeleteDialog } from "../../form-delete-dialog/FormDeleteDialog";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  { setId, setMasterId,
    openEditFormDialog,
    openDeleteFormDialog,
    openActiveFormDialog,
    openReadUserDialog,
    isAccessForEdit,
    isAccessForDelete,
    openReadFormDialog, setDetailId,
    isAccessForRead, setReadMode, setReceiveMode, receiveMode, openDetailGridData,
  }
) {
  const isUserRead = false;

  const dueDate = new Date(row.dueDate);
  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  let isOverdue = false;
  isOverdue = dueDate <= today;
  return (
    <div className="space-x-2">
 
      {isAccessForRead && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a onClick={() => {
            setReceiveMode(false);
            setReadMode(true);
            setId(row.Id);
          }}>
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}


      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Detail</Tooltip>}
      >
        <button
          type="button"
          onClick={() => {
            setReceiveMode(false);
            setReadMode(false);
            setId("");
            setMasterId(row.masterId);
            openDetailGridData(row.masterId)
          }}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <LayoutList className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </OverlayTrigger>

 
   
    </div>
  );
}
export function ResponseColumnFormatter(
  cellContent,
  row,
  rowIndex,

  { setId,
    isAccessForEdit,
    setReceiveMode, receiveMode, openDetailGridData, setMasterId, openTicketTimeLog, setReadMode,setDetailId ,openDetailTimeLog,
  }
) {
  const isUserRead = false;
  const dueDate = new Date(row.dueDate);
  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  let isOverdue = false;
  isOverdue = dueDate <= today;
  return (
    <div className="space-x-2">
      {/* {isOverdue && (
        <span style={{ color: "red", fontWeight: 600, marginLeft: "5px" }}>
          Over Due
        </span>
      )} */}


      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Response</Tooltip>}
      >
        <a onClick={() => {
          setReceiveMode(true);
          setId(row.Id);
        }}>
          <Reply className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>


      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Detail</Tooltip>}
      >
        <button
          type="button"
          onClick={() => {
            setReceiveMode(false);
            setReadMode(false);
            setId("");
            setMasterId(row.masterId);
            openDetailGridData(row.masterId)
          }}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <LayoutList className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </OverlayTrigger>


      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Detail Time Log</Tooltip>}
      >
        <button
          type="button"
          onClick={() => {
            setReceiveMode(false);
            setReadMode(false);
            setId("");
            setDetailId("");
            setMasterId(row.Id);
            openDetailTimeLog(row.Id)
          }}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <LayoutList className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </OverlayTrigger>

      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Time Log</Tooltip>}
      >
        <button
          type="button"
          onClick={() => {
            setReceiveMode(false);
            setReadMode(false);
            setId("");
            setDetailId("");
            setDetailId(row.Id)
            openTicketTimeLog(row.Id)
          }}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <LayoutList className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </OverlayTrigger>



    </div>
  );
}


export function TimeLogsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openDeleteHandler }
) {
  return (
    <div className="space-x-2">
    

        <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
      >
        <button
          type="button"
          onClick={() => {
            setReceiveMode(false);
            setReadMode(false);
            setId("");
            setDetailId("");
            setDetailId(row.detailId)
            openTicketTimeLog(row.Id)
          }}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <Pencil className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </OverlayTrigger>


      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
        <a onClick={() => openDeleteHandler(row.Id,row.detailId)}>
          <Trash2 className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>
    </div>
  );
}
