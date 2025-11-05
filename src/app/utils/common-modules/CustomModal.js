// CustomModal.js
import React from "react";
import { Modal } from "react-bootstrap";
export const CustomModal = ({ show, onClose, title, children ,className = ""}) => {
  if (!show) return null;
  const modalClass = className
    ? `relative bg-white rounded-2xl shadow-lg w-full ${className} mx-4 flex flex-col max-h-[90vh]`
    : `relative bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
     <div className={modalClass}>
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {/* <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button> */}
        </div>

        {/* Body (scrollable if large) */}
        <div className="p-6 overflow-y-auto">{children}</div>

        {/* Footer */}
        <div className="flex justify-end border-t p-4 bg-white sticky bottom-0 rounded-b-2xl">
          <button
            onClick={onClose}
          className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
