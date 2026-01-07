import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Reply, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  { setId,
    openEditFormDialog,
    openDeleteFormDialog,
    openActiveFormDialog,
    openReadUserDialog,
    isAccessForEdit,
    isAccessForDelete,
    openReadFormDialog,
    isAccessForRead, setReadMode, setReceiveMode, receiveMode,
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
      {/* {isAccessForEdit && (
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
      )} */}

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

  { setId,

    isAccessForEdit,
    setReceiveMode, receiveMode,
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



    </div>
  );
}
