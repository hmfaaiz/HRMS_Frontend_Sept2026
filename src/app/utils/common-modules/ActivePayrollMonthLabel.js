import React from 'react';
import { DateTimeFormats } from '../constants';
import { format } from 'date-fns';
import './form.css'


function ActivePayrollMonthLabel({month, year, startDate, endDate, formatValue = null, className = null }) {
  if (startDate && endDate) {
    const cssClass = className || "date-in-line";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateFormat = formatValue || DateTimeFormats.ActiveLabel;
    const monthYear = new Date(`${year}-${month}`).toLocaleString('en-us',{month:'short', year:'numeric'})
    return (
      <p className={cssClass}>{monthYear} {'(' + format(start, dateFormat)} - {format(end, dateFormat) + ')'}</p>
    )
  }
}

export default ActivePayrollMonthLabel



