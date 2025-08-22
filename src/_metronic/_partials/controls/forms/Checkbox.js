import React from "react";

export function Checkbox({ isSelected, onChange, children, disabled = false }) {
  return (
    <>
      {/* <input type="checkbox" style={{ display: "none" }} /> */}
      <div
        style={{
          fontSize: "10.2px",
        }}
        className="flex justify-start items-center text-black gap-2"
      >
        <input
          className="p-0 m-0 mr-1 "
          type="checkbox"
          checked={isSelected}
          onChange={onChange}
          disabled={disabled}
        />
        {children}
      </div>
    </>
  );
}
