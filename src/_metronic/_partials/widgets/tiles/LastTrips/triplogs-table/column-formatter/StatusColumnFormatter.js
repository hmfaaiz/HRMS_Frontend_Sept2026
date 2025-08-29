import React from "react";
import { getDate } from '../../../../../../utils/common'

export const StatusColumnFormatter = (cellContent, row) => (
  <span
    className={`label label-lg label-light-${
      row?.status?.toLowerCase() == "close" ? "danger" : "success"
    } label-inline`}
  >
    {row.status}
  </span>
);

export const DatetimeColumnFormatter = (cellContent, row) => (
  <span
    className={`badge badge-light-success  ${getDate(cellContent)}`}
  >
    {getDate(cellContent)}
  </span>
);
