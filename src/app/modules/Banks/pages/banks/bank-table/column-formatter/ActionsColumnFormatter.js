import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CirclePower, Eye, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditBankDialog,
    openDeleteBankDialog,
    openActiveBankDialog,
    openReadUserDialog,
    isAccessForEdit,
    isAccessForDelete,
    openReadBankDialog,
  }
) {
  const isUserRead = false;
  return (
    <div className="space-x-2">
      <OverlayTrigger  
        overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
      >
        <a
          title=""
          className=""
          onClick={() => openReadBankDialog(row.Id, isUserRead)}
        >
          <Eye className="w-4 h-4 text-black cursor-pointer" />
          {/* <span className="svg-icon svg-icon-md svg-icon-primary">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/Communication/view.svg")}
            />
          </span> */}
        </a>
      </OverlayTrigger>
      {isAccessForEdit && row.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a
            title=""
            className=""
            onClick={() => openEditBankDialog(row.Id)}
          >
            {/* <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span> */}
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      <> </>

      {isAccessForDelete && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          {row.isActive ? (
            <a
              title=""
              className=""
              onClick={() => openDeleteBankDialog(row.Id, row.isActive)}
            >
              {/* <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/disable.svg")}
                  title=""
                />
              </span> */}
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </a>
          ) : (
            <a
              title=""
              className=""
              onClick={() => openActiveBankDialog(row.Id, row.isActive)}
            >
              <CirclePower className="w-4 h-4 text-black cursor-pointer" />
            </a>
          )}
        </OverlayTrigger>
      )}
    </div>
  );
}
