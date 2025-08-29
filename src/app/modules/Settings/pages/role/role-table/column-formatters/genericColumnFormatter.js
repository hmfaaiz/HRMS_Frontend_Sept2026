import React from "react";
import { getDate } from '../../../../../../utils/common'

export const DatetimeColumnFormatter = (cellContent, row) => (
    <span
        className={`badge badge-light-success  ${getDate(cellContent)}`}
    >
        {getDate(cellContent)}
    </span>
);