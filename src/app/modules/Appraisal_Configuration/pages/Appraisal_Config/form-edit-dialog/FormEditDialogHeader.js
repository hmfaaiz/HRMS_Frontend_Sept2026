import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  //const userForEdit = false
  const [title, setTitle] = useState("");
 
  const { userForEdit, actionsLoading } = useSelector(
    
    (state) => ({
      userForEdit: state.appraisal_config.userForEdit,
      actionsLoading: state.appraisal_config.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? "" : "Add Appraisal Configuration";
    if (id) {
      _title = `Edit Appraisal Configuration`;
    }
    setTitle(_title);
  }, [userForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {!isUserForRead ? title : "View Appraisal Configuration"}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
