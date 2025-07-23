import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { payrollData, setLeaveId, isAccessForEdit, isAccessForRead, setId }
) {
  //Function to check if the date doesn't lie before the payroll month date
  const checkPayrolMonth = (row, payroll) => {
    return (
      payroll &&
      payroll.startDate &&
      new Date(payroll.startDate).getTime() <= new Date(row.to).getTime()
    );
  };

  return (
    <>
      {isAccessForEdit && row.isActive && checkPayrolMonth(row, payrollData) && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">Edit Attendance Detail</Tooltip>
          }
        >
          <a
            title=""
            className="btn btn-icon edit-button"
            onClick={() => {
              setLeaveId(row.Id);
            }}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}

      {isAccessForRead && row.isActive && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">View Attendance Detail</Tooltip>
          }
        >
          <a
            title=""
            className="btn btn-icon view-button"
            onClick={() => {
              setId(row.Id);
            }}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/view.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}
    </>
  );
}
