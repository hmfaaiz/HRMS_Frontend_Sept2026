import React, { useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider, useFormUIContext } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

export function FormPage({ history }) {
  const FormUIEvents = useMemo(() => ({}), []);

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <InnerPage />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </FormUIProvider>
  );
}

function InnerPage() {
  const { idToDelete, closeDeleteDialog } = useFormUIContext();
  const [resetForm, setResetForm] = useState(null);

  return (
    <>
      {idToDelete && (
        <FormDeleteDialog
          show={true}
          Id={idToDelete}
          onHide={closeDeleteDialog}
          onDeleteSuccess={() => {
            closeDeleteDialog();
            if (resetForm) resetForm();
          }}
        />
      )}
      <FormCard onRegisterReset={(fn) => setResetForm(() => fn)} />
    </>
  );
}