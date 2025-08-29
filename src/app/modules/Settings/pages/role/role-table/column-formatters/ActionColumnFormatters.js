import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil } from "lucide-react";
export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openEditUserDialog, openDeleteRoleDialog, openRoleAccessPage }
) {
  return (
    <div className="space-x-2">
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Role Access</Tooltip>}
      >
        <a className="" onClick={() => openRoleAccessPage(row.id)}>
          {/* <span className="svg-icon svg-icon-md svg-icon-primary">Rights</span> */}
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Edit Role</Tooltip>}
      >
        <a className="" onClick={() => openEditUserDialog(row.id)}>
          <Pencil className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>
      {/* <a
        title="Edit Role"
        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
        onClick={() => openEditUserDialog(row.id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
          />
        </span>
      </a> */}
      <> </>
      {/* <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Delete Role</Tooltip>}
      >
        <a
          className="btn btn-icon delete-button"
          onClick={() => openDeleteRoleDialog(row.id)}
        >
          <span className="svg-icon svg-icon-md svg-icon-danger">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/General/disable.svg")}
              title=""
            />
          </span>
        </a>
      </OverlayTrigger> */}
      <> </>
    </div>
  );
}
