import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CalendarCheck, Eye, MailPlus, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditFormDialog,
    openDeleteFormDialog,
    openReadFormDialog,
    openEmailFormDialog,
    isAccessForEdit,
    isAccessForView,
    isAccessForDelete,
    isAccessForEmail,
  }
) {
  const isUserRead = false;
  return (
    <div className="space-x-2">
      {isAccessForEmail && row.isActive && rowIndex === 0 && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Send Email</Tooltip>}
        >
          <a title="" className="" onClick={() => openEmailFormDialog(row.Id)}>
            {/* <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Communication/schedule.svg"
                )}
              />
            </span> */}
             <MailPlus className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForView && row.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a
            title=""
            className=""
            onClick={() => openReadFormDialog(row.Id, isUserRead)}
          >
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForEdit && row.isActive && rowIndex === 0 && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a title="" className="" onClick={() => openEditFormDialog(row.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForDelete && rowIndex === 0 && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          <a
            title=""
            onClick={() => openDeleteFormDialog(row.Id, row.isActive)}
          >
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
