import React from "react";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

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

export function DateTimePickerField({ ...props }) {
  const { setFieldValue, errors, touched } = useFormikContext();
  const [field, { setValue }] = useField(props);
  console.log("field", field);
  return (
    <>
      {props.label && <label>{props.label}</label>}
      <DatePicker
        className={getFieldCSSClasses(touched[field.name], errors[field.name])}
        style={{ width: "100%" }}
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={(val) => {
          console.log("val", val);
          // val.preventdefault();
          //setFieldValue(field.name, val);
          setValue(val);
        }}
        timeInputLabel="Time:"
        dateFormat="MM/dd/yyyy hh:mm"
        showTimeInput
      />
      {errors[field.name] && touched[field.name] && (
        <div className="invalid-datepicker-feedback">
          {errors[field.name].toString()}
        </div>
      )}
    </>
  );
}
