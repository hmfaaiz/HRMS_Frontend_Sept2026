import React from "react";
import { useField } from "formik";
import { FieldFeedbackLabel } from "./FieldFeedbackLabel";

const getFieldCSSClasses = (touched, errors) => {
  // Chnage form-control-solid to form-control
  const classes = ["form-control", "form-control"];
  if (touched && errors) {
    classes.push("is-invalid-select");
  }

  if (touched && !errors) {
    classes.push("is-valid-select");
  }

  return classes.join(" ");
};

export function CustumSelect({ name, value, label, ...props }) {
  console.log("custum Select props", name, value, label);
  const [field, meta] = useField(props);
  //   const { touched, error } = meta;
  return (
    <>
      {label && (
        <label htmlFor="email" style={{ display: "block" }}>
          Select {label}
        </label>
      )}

      <select name={name} value={value}>
        <option value="" label="Select a color" />
        <option value="red" label="red" />
        <option value="blue" label="blue" />
        <option value="green" label="green" />
      </select>
      {meta.touched && meta.error ? (
        <div className="input-feedback">Getting Error</div>
      ) : null}
      {/* {errors.fuelType && touched.color && (
        <div className="input-feedback">{errors.fuelType}</div>
      )} */}
      {/* <select
        className={getFieldCSSClasses(touched, error)}
        {...field}
        {...props}
      >
        {children}
      </select>
      {withFeedbackLabel && (
        <FieldFeedbackLabel
          erros={error}
          touched={touched}
          label={label}
          customFeedbackLabel={customFeedbackLabel}
        />
      )} */}
    </>
  );
}
