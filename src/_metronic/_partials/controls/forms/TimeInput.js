import React from "react";
import { FieldFeedbackLabel } from "./FieldFeedbackLabel";

const getFieldCSSClasses = (touched, errors) => {
  const classes = ["form-control"];
  if (touched && errors) classes.push("is-invalid");
  if (touched && !errors) classes.push("is-valid");
  return classes.join(" ");
};

// 0900 -> 09:00
const formatWithColon = (value) => {
  const cleaned = value.replace(/\D/g, "").slice(0, 4); // keep digits only
  if (cleaned.length <= 2) return cleaned;
  return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
};

// 09:00 -> 0900
const removeColon = (value) => value.replace(":", "");

export function TimeInput({
  field,
  form: { touched, errors, setFieldValue },
  label,
  withFeedbackLabel = true,
  customFeedbackLabel,
  onChange, // external onChange
  ...props
}) {
  const handleChange = (e) => {
    const input = e.target.value;
    const formatted = formatWithColon(input);
    const rawValue = removeColon(formatted);

    // Set Formik value
    setFieldValue(field.name, rawValue);

    // Call external onChange if passed
    if (typeof onChange === "function") {
      const customEvent = {
        ...e,
        target: {
          ...e.target,
          name: field.name,
          value: rawValue, // send raw 0930 here
        },
      };
      onChange(customEvent);
    }
  };

  const displayValue = formatWithColon(field.value || "");

  return (
    <>
      {label && <label>{label}</label>}
      <input
        type="text"
        inputMode="numeric"
        maxLength={5}
        className={getFieldCSSClasses(touched[field.name], errors[field.name])}
        value={displayValue}
        onChange={handleChange}
        onBlur={field.onBlur}
        name={field.name}
        autoComplete="off"
        placeholder="HH:MM"
        {...props}
      />
      {withFeedbackLabel && (
        <FieldFeedbackLabel
          error={errors[field.name]}
          touched={touched[field.name]}
          label={label}
          customFeedbackLabel={customFeedbackLabel}
        />
      )}
    </>
  );
}
