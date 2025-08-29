import React from "react";
import { getDate } from "../../../../../app/utils/common";

export default DatetimeColumnFormatter = (cellContent, row) => {
  return (
    <span className={`badge badge-light-success  ${getDate(cellContent)}`}>
      {getDate(cellContent)}
    </span>
  );
};
