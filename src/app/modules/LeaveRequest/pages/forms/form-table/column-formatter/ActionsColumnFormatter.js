import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Minus, RotateCcw } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    payrollData,
    editRecord,
    openDeleteFormDialog,
    isAccessForEdit,
    isAccessForDelete,
    isAccessForReApply,
  }
) {
  //Function to check if the date doesn't lie before the payroll month date
  const checkPayrolMonth = (row, payroll) => {
    return (
      payroll &&
      payroll.startDate &&
      new Date(payroll.startDate).getTime() <= new Date(row.from).getTime()
    );
  };

  return (
    <>
      {isAccessForEdit && row.isActive && row.request_status === "P" && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a
            title=""
            className="btn btn-icon edit-button"
            onClick={() => editRecord(row.Id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}
      {isAccessForReApply && row.request_status === "R" ? (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Re-apply</Tooltip>}
        >
          <a title="" className="" onClick={() => editRecord(row.Id)}>
            <RotateCcw className="w-4 h-4 " />
          </a>
        </OverlayTrigger>
      ) : (
        <span className="font-bold"><Minus className="w-4 h-4" /></span>
      )}

      {isAccessForDelete && checkPayrolMonth(row, payrollData) && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Delete</Tooltip>}
        >
          {row.isActive && (
            <a
              title=""
              className="btn btn-icon delete-button"
              onClick={() => openDeleteFormDialog(row.Id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/disable.svg")}
                  title=""
                />
              </span>
            </a>
          )}
        </OverlayTrigger>
      )}
    </>
  );
}
