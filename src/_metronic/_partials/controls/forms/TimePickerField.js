import React from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { DateObject } from "react-multi-date-picker";

export const TimePickerField = ({
  label,
  value,
  onChange,
  name,
  disabled,
  onBlur,
  errors,
  touched,
}) => {
  // Convert "hh:mm A" string to a DateObject
  const parseTimeStringToDateObject = (timeStr) => {
    if (!timeStr) return null;
    try {
      // Split "09:50 AM" into ["09:50", "AM"]
      const [time, period] = timeStr.split(" ");
      const [hours, minutes] = time.split(":");

      // Convert to 24-hour format for DateObject
      let hours24 = parseInt(hours, 10);
      if (period === "PM" && hours24 !== 12) {
        hours24 += 12;
      } else if (period === "AM" && hours24 === 12) {
        hours24 = 0;
      }

      // Create a Date with today's date + selected time
      const date = new Date();
      date.setHours(hours24, parseInt(minutes, 10), 0, 0);

      return new DateObject(date);
    } catch (error) {
      console.error("Failed to parse time:", error);
      return null;
    }
  };

  return (
    <div className="form-group mb-0">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}
      <div>
        <DatePicker
          disableDayPicker
          value={parseTimeStringToDateObject(value)}
          format="hh:mm A"
          onChange={(date) => {
            onChange(date ? date.format("hh:mm A") : "");
            if (onBlur) onBlur();
          }}
          plugins={[<TimePicker hideSeconds position="bottom" />]}
          disabled={disabled}
          inputClass="form-control"
        />
        {errors && touched ? (
          <div className="form-feedBack">{errors}</div>
        ) : null}
      </div>
    </div>
  );
};
