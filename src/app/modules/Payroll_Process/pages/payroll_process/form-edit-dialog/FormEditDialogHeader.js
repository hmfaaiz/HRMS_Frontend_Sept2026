import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  //const userForEdit = false
  const [title, setTitle] = useState("");
 
  const { userForEdit, actionsLoading } = useSelector(
    
    (state) => ({
      userForEdit: state.payroll_process.userForEdit,
      actionsLoading: state.users.actionsLoading,
    }),
    shallowEqual
  );

  // useEffect(() => {
  //   let _title = id ? "" : "Execute Payroll Process" ;
  //   if (id) {
  //     _title = `Execute Payroll Process`;
  //   } //else if (isUserForRead) {
  //   //   _title = `Read user '}'`
  //   // }
  //   setTitle(_title);
  // }, [userForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg" className="text-bold">
          {!isUserForRead ? title : "View Payroll Process"}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
