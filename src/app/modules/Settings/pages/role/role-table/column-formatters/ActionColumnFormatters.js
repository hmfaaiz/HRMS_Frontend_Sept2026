import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openEditUserDialog, openDeleteRoleDialog, openRoleAccessPage }
) {
  return (
    <div>

<OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Role Access</Tooltip>}
      >
        <a
          className="btn btn-icon  btn-hover-primary btn-sm mx-3 view-button"
          onClick={() => openRoleAccessPage(row.id)}
        >
          {/* <span className="svg-icon svg-icon-md svg-icon-primary">Rights</span> */}
          <span className="svg-icon svg-icon-md svg-icon-primary">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/Communication/view.svg")}
            />
          </span>
        </a>
      </OverlayTrigger>
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Edit Role</Tooltip>}
      >
        <a
          className="btn btn-icon edit-button"
          onClick={() => openEditUserDialog(row.id)}
        >
          <span className="svg-icon svg-icon-md svg-icon-primary">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
            />
          </span>
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
