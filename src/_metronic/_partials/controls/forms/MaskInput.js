import React from "react";
import { FieldFeedbackLabel } from "./FieldFeedbackLabel";
import MaskedInput from "react-text-mask";

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

export function MaskInput({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  withFeedbackLabel = true,
  customFeedbackLabel,
  type = "text",
  ...props
}) {
  return (
    <>
      {label && <label> {label}</label>}
      <MaskedInput
        type={type}
        mask={[
          "(",
          /[1-9]/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        className={getFieldCSSClasses(touched[field.name], errors[field.name])}
        {...field}
        {...props}
        guide={true}
      />
      {/* <input
        type={type}
        className={getFieldCSSClasses(touched[field.name], errors[field.name])}
        {...field}
        {...props}
      /> */}
      {withFeedbackLabel && (
        <FieldFeedbackLabel
          error={errors[field.name]}
          //rror={"Required"}
          touched={touched[field.name]}
          label={label}
          type={type}
          customFeedbackLabel={customFeedbackLabel}
        />
      )}
    </>
  );
}
