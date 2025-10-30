import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isdataForRead }) {
  //const dataForEdit = false
  const [title, setTitle] = useState("");
 
  const { dataForEdit, actionsLoading } = useSelector(
    
    (state) => ({
      dataForEdit: state.separation.dataForEdit,
      actionsLoading: state.users.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? "" : "Add Final Settlement";
    if (id) {
      _title = `Edit Final Settlement`;
    } //else if (isdataForRead) {
    //   _title = `Read user '}'`
    // }
    setTitle(_title);
  }, [dataForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      {/* <Modal.Header >
        <Modal.Title id="example-modal-sizes-title-lg">
          {!isdataForRead ? title : "View Separation"}
        </Modal.Title>
      </Modal.Header> */}
    </>
  );
}
