import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function IncidentEditDialogHeader({ id, isUserForRead }) {
  //const userForEdit = false
  const [title, setTitle] = useState("");

  // const { incidentForEdit, actionsLoading } = useSelector(
  //   (state) => ({
  //     incidentForEdit: state.incidentDetails.incidentForEdit,
  //     actionsLoading: state.incidentDetails.actionsLoading,
  //   }),
  //   shallowEqual
  // );
  // console.log(";current state for incident", incidentForEdit)
  useEffect(() => {
    let _title = id ? "" : "Add Incident";
    if (incidentForEdit?.incident && id) {
      _title = `Edit Incident for '${incidentForEdit?.incident?.callerName}'`;
    } //else if (isUserForRead) {
    //   _title = `Read user '}'`
    // }
    setTitle(_title);
  }, [incidentForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {!isUserForRead ? title : "Incident Read"}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
