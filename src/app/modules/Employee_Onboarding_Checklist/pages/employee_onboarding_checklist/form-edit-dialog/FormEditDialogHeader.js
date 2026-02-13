import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ Id, isdataForRead }) {
  const [title, setTitle] = useState("");
  const { actionsLoading } = useSelector((state) => ({
    actionsLoading: state.employee_onboarding_checklist.actionsLoading,
  }), shallowEqual);

  useEffect(() => {
    let _title = Id ? "Edit Employee (Onboarding Checklist)" : "New Employee (Onboarding Checklist)";
    setTitle(_title);
  }, [Id]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title>{isdataForRead ? "View Employee Onboarding Checklist" : title}</Modal.Title>
      </Modal.Header>
    </>
  );
  
}
