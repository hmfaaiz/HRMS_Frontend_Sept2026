import React from "react";
import { Mention, MentionsInput } from "react-mentions";

const getFieldCSSClasses = (touched, errors) => {
  const classes = [""];
  if (touched && errors) classes.push("is-invalid");
  if (touched && !errors) classes.push("is-valid");
  return classes.join(" ");
};

//  Your MultiSelect theme adapted to react-mentions
const mentionsInputStyle = {
  control: {
    backgroundColor: "#e6f8ff",
    fontSize: "10.4px",
    border: "0.5px solid #000000",
    borderRadius: "0.32rem",
    minHeight: 32,
  },
  "&form-control__control": {
    backgroundColor: "none",
  },
  "&multiLine": {
    control: {
      fontFamily: "inherit",
      minHeight: 70,
    },
    highlighter: {
      padding: "0.27rem 0.5rem",
    },
    input: {
      padding: "0.27rem 0.5rem",
      margin: 0,
      border: "0.5px solid #000000",
      borderRadius: "0.32rem",
      outline: "none",
      backgroundColor: "#e6f8ff",
      fontSize: "10.4px",
    },
  },

  //  Mention suggestions dropdown (same as react-select menu)
  suggestions: {
    list: {
      backgroundColor: "#e6f8ff",
      border: "1px solid rgba(0,0,0,0.12)",
      borderRadius: "6px",
      marginTop: "2px",
      fontSize: "10.4px",
      zIndex: 9999,
      boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
      maxHeight: 220,
      overflowY: "auto",
    },
    item: {
      padding: "5px 10px",
      fontSize: "10.4px",
      color: "#374151",
      cursor: "pointer",
      borderBottom: "1px solid rgba(0,0,0,0.06)",

      "&focused": {
        backgroundColor: "#dcdfe0", // react-select focused
        color: "#374151",
      },
    },
  },
};

//  Mention highlight (like selected option theme)
const mentionStyle = {
  backgroundColor: "rgba(0,147,221,0.18)",
  color: "#111827",
  borderRadius: 4,
  padding: "0 3px",
};
export function MentionInputField({
  name,
  label,
  value,
  onBlur,
  error,
  touched,
  mentionData = [],
  placeholder = "Add Comment. Use '@' for mention",
  a11ySuggestionsListLabel = "Suggested mentions",

  setFieldValue, //  Formik ka setter
  onMentionsChange, // optional
  onChangeComplete, // optional
  ...props
}) {
  const handleChange = (event, newValue, newPlainTextValue, mentions) => {
    //  IMPORTANT: Formik value update
    if (setFieldValue && name) {
      setFieldValue(name, newValue);
    }

    if (onMentionsChange) {
      onMentionsChange(mentions);
    }

    if (onChangeComplete) {
      onChangeComplete({
        value: newValue,
        plainText: newPlainTextValue,
        mentions,
      });
    }
  };

  return (
    <>
      {label && <label>{label}</label>}

      <MentionsInput
        name={name}
        value={value || ""}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        a11ySuggestionsListLabel={a11ySuggestionsListLabel}
        className={getFieldCSSClasses(touched, error)}
        style={mentionsInputStyle}
        {...props}
      >
        <Mention
          trigger="@"
          data={mentionData}
          style={mentionStyle}
          displayTransform={(id, display) => `@${display}`}
        />
      </MentionsInput>

      {error && touched && <div className="invalid-feedback">{error}</div>}
    </>
  );
}
