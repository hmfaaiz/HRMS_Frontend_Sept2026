import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {setId,
    openEditFormDialog,
    openDeleteFormDialog,
    openActiveFormDialog,
    openReadUserDialog,
    isAccessForEdit,
    isAccessForDelete,
    openReadFormDialog,
    isAccessForRead,setReadMode, setReceiveMode,receiveMode,
  }
) {
  const isUserRead = false;
  return (
    <div className="space-x-2">
      {isAccessForRead && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a onClick={() =>   {
             setReceiveMode(false);
                  setReadMode(true);
              setId(row.Id);}}>
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForEdit && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a onClick={() =>   {
             setReceiveMode(false);
                  setReadMode(false);
              setId(row.Id);}}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* {isAccessForDelete && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          {
            <a onClick={() => openDeleteFormDialog(row.Id, row.isActive)}>
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </a>
          }
        </OverlayTrigger>
      )} */}
    </div>
  );
}
export function ResponseColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {setId,

    isAccessForEdit,
 setReceiveMode,receiveMode,
  }
) {
  const isUserRead = false;
  return (
    <div className="space-x-2">
  
    
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Response</Tooltip>}
        >
          <a onClick={() =>   {
                  setReceiveMode(true);
              setId(row.Id);}}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
    

   
    </div>
  );
}
