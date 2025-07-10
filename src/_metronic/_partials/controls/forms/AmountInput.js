import React, { useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { FieldFeedbackLabel } from "./FieldFeedbackLabel";

const getFieldCSSClasses = (touched, errors) => {
  const classes = ["form-control"];
  if (touched && errors) classes.push("is-invalid");
  if (touched && !errors) classes.push("is-valid");
  return classes.join(" ");
};

export function AmountInput({
  field,
  form: { touched, errors, setFieldValue, setFieldTouched },
  label,
  withFeedbackLabel = true,
  placeholder = "",
  customFeedbackLabel,
  max = 99999999,
  onChange,
  value,
  ...props
}) {
  const fieldName = field.name;
  const inputClass = getFieldCSSClasses(touched[fieldName], errors[fieldName]);

  useEffect(() => {
    if (value !== undefined && value !== field.value) {
      setFieldValue(fieldName, value);
    }
  }, [value]);

  return (
    <>
      {label && <label>{label}</label>}
      <NumericFormat
        {...props}
        placeholder={placeholder}
        className={inputClass}
        value={value !== undefined ? value : field.value}
        thousandSeparator
        allowNegative={false}
        isAllowed={({ value }) => value === "" || Number(value) <= max}
        onValueChange={({ value: raw }) => {
          setFieldValue(fieldName, raw);
          if (onChange) onChange(raw); // yahan aapka local state update hoga
        }}
        onBlur={() => setFieldTouched(fieldName, true)}
      />

      {withFeedbackLabel && (
        <FieldFeedbackLabel
          error={errors[fieldName]}
          touched={touched[fieldName]}
          label={label}
          customFeedbackLabel={customFeedbackLabel}
        />
      )}
    </>
  );
}
