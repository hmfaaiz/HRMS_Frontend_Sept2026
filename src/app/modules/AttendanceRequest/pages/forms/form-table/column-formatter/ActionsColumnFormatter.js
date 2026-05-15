import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ClockFading } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openEditFormDialog,
    openDeleteFormDialog,
    isAccessForEdit,
    isAccessForDelete,
    openReadFormDialog,viewttendanceLogs
  }
) {
  const isUserRead = false;
  return (
    <>
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">View Logs</Tooltip>}>
 
          <span
              className={` cursor-pointer font-bold text-underline-hover`}
              onClick={() => viewttendanceLogs(row?.attDate)}
            >
              <ClockFading className=" w-4 h-4 pointer" />
            </span>
    
      </OverlayTrigger>
      {/* {isAccessForEdit && row.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a
            title=""
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            onClick={() => openEditFormDialog(row.Id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}

      {isAccessForDelete && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          {row.isActive && 
          (
            <a
              title=""
              className="btn btn-icon btn-light btn-hover-danger btn-sm mx-3"
              onClick={() => openDeleteFormDialog(row.Id, row.isActive)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/disable.svg")}
                  title=""
                />
              </span>
            </a>
          ) 
          
          }
        </OverlayTrigger>
      )} */}
    </>
  );
}
