import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isdataForRead }) {
  //const dataForEdit = false
  const [title, setTitle] = useState("");
 
  const { dataForEdit, actionsLoading } = useSelector(
    
    (state) => ({
      dataForEdit: state.employee_goal_setup.dataForEdit,
      actionsLoading: state.users.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? "" : "Employee Goal Setup";
    if (id) {
      _title = `Edit Employee Wise Goal Setup`;
    } //else if (isdataForRead) {
    //   _title = `Read user '}'`
    // }
    setTitle(_title);
  }, [dataForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {!isdataForRead ? title : "View Employee Goal Setup"}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
