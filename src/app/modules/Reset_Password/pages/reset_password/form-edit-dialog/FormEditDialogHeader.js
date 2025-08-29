import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  //const userForEdit = false
  const [title, setTitle] = useState("");
 


  useEffect(() => {
    let _title = id ? "" : "Reset password";
    if (id) {
      _title = `Edit Reset password`;
    } //else if (isUserForRead) {
    //   _title = `Read user '}'`
    // }
    setTitle(_title);
  }, []);

  return (
    <>
      {/* {actionsLoading && <ModalProgressBar />} */}
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg " className="text-bold">
          {!isUserForRead ? title : "View"}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
