import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


export function RichTextInput({
  label,
  onChange,
  value,
  touched,
  errors,
  name,
}) {
  return (
    <>
      {label && <label> {label}</label>}
      <ReactQuill
        theme="snow"
        value={value}
        style={{ height: "250px", backgroundColor: "white", overflow: "auto" }}
        onChange={onChange}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "link",
              "color",
              "background",
              "clear",
            ],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
              { align: [] },
            ],
            ["clean"],
          ],
        }}
      />
    </>
  );
}
