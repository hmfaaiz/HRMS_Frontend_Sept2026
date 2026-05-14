import React, { useState } from "react";
import { ConfirmationDialog } from "./ConfirmationDialog";

export function useConfirmationDialog() {
  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
    cancelText: "Cancel",
    confirmText: "Confirm",
  });

  const [resolver, setResolver] = useState(null);

  const confirm = (
    title,
    message,
    cancelText = "Cancel",
    confirmText = "Confirm",
  ) => {
    setDialog({
      show: true,
      title,
      message,
      cancelText,
      confirmText,
    });

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolver(true);
    setDialog((prev) => ({ ...prev, show: false }));
  };

  const handleCancel = () => {
    resolver(false);
    setDialog((prev) => ({ ...prev, show: false }));
  };

  const ConfirmationComponent = () => (
    <ConfirmationDialog
      show={dialog.show}
      title={dialog.title}
      message={dialog.message}
      cancelText={dialog.cancelText}
      confirmText={dialog.confirmText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return {
    confirm,
    ConfirmationComponent,
  };
}
