import React from "react";
import { useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

const getFieldCSSClasses = (touched, errors) => {
  const classes = ["form-control"];
  if (touched && errors) {
    classes.push("is-invalid");
  }
  if (touched && !errors) {
    classes.push("is-valid");
  }
  return classes.join(" ");
};

export function DatePickerField({ field, label, ...props }) {
  const { setFieldValue, errors, touched } = useFormikContext();

  return (
    <div>
      {label && <label className="mb-1 block">{label}</label>}

      {/* Wrap in a relative container so we can position icon */}
      <div style={{ position: "relative", width: "100%" }}>
        <DatePicker
          className={getFieldCSSClasses(
            touched[field.name],
            errors[field.name]
          )}
          selected={(field.value && new Date(field.value)) || null}
          onChange={(val) => setFieldValue(field.name, val)}
          {...props}
        />

        {/* Icon positioned on the right */}
        <div
          style={{
            position: "absolute",
            right: "5px",
            top: "40%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "#555",
          }}
        >
          <Calendar className="w-3 h-3 text-gray-800" />
        </div>
      </div>

      {/* Validation error */}
      {errors[field.name] && touched[field.name] && (
        <div style={{ color: "#F64E60", fontSize: "0.7rem" }}>
          {errors[field.name]}
        </div>
      )}
    </div>
  );
}
