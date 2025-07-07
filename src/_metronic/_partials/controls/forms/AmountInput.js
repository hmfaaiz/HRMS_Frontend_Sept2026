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
  customFeedbackLabel,
  onChange,
  value, // external controlled value (like defBasicSalary)
  ...props
}) {
  const fieldName = field.name;
  const inputClass = getFieldCSSClasses(touched[fieldName], errors[fieldName]);

  // Sync external value with Formik state if value is passed
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
        className={inputClass}
        value={value !== undefined ? value : field.value} // prefer external value if given
        thousandSeparator
        allowNegative={false}
        onValueChange={({ value: raw }) => {
          setFieldValue(fieldName, raw); // update Formik
          if (onChange) onChange(raw);   // also call external handler
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
