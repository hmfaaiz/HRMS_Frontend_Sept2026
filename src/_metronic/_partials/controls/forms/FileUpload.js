import { Upload } from "lucide-react";
import React from "react";

const FileUpload = ({
  label = "Attachment:",
  id = "file_input",
  name = "file",
  fileName,
  onChange,
  inputFile,
  accept = "",
  isEdit = false,
  error,
}) => {
  return (
    <div>
      {/* Field Label */}
      {label && <label>{label}</label>}

      {/* Hidden File Input */}
      <input
        id={id}
        name={name}
        className="hidden"
        type="file"
        disabled={isEdit}
        accept={accept}
        ref={inputFile}
        onChange={onChange}
      />
      <div style={{ position: "relative", width: "100%" }}>
        {/* Visible Upload Label */}
        <label
          htmlFor={id}
          className="form-control block w-full cursor-pointer"
          title={fileName || ""}
        >
          {fileName && fileName?.length > 20
            ? fileName.split(0, 20) + "..."
            : "Browse"}
        </label>
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
          <Upload className="w-3 h-3 text-gray-800" />
        </div>
      </div>
      {error && <span className="invalid-feedback">{error?.file}</span>}
      {/* Existing File Preview */}
      {/* {values.fileName && values[name] === values.fileName && (
        <div className="mt-2">
          <strong>Existing File: </strong>
          <a
            href={getUploadUrl(values.fileName)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {getFileName(values.fileName)}
          </a>
        </div>
      )} */}
    </div>
  );
};

export default FileUpload;
