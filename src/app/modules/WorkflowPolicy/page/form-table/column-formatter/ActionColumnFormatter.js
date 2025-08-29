import React from "react";
import SVG from "react-inlinesvg";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { CirclePower, Copy, Eye, Minus, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditDialog,
    openDeleteDialog,
    openReadDialog,
    openActiveDialog,
    isAccessForEdit,
    isAccessForDelete,
    isAccessForCreatingMultiple,
    openDuplicateDialog,
  }
) {
  const isUserRead = false;
  return (
    <div className="space-x-2">
      {isAccessForCreatingMultiple && row?.designationId !== null && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {row.isActive && "Duplicate"}
            </Tooltip>
          }
        >
          {row.isActive && (
            <a
              title=""
              className=""
              onClick={() => openDuplicateDialog(row.Id)}
            >
              <Copy className="w-4 h-4 text-black cursor-pointer" />
            </a>
          )}
        </OverlayTrigger>
      )}
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
      >
        <a title="" className="" onClick={() => openReadDialog(row.Id)}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>
      {isAccessForEdit && row.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a title="" className="" onClick={() => openEditDialog(row.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {isAccessForDelete && row?.designationId !== null ? (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          <a
            title=""
            className=""
            onClick={() => openDeleteDialog(row.Id, row.isActive)}
          >
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      ) : (
        <a
          title=""
          className=""
          onClick={() => openActiveDialog(row.Id, row.isActive)}
        >
          <Minus className="w-4 h-4 text-black cursor-pointer" />
        </a>
      )}
    </div>
  );
}
