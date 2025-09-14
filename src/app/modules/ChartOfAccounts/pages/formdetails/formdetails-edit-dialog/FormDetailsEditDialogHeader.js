import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  //const userForEdit = false
  const [title, setTitle] = useState("");

  const { userForEdit, actionsLoading } = useSelector(
    (state) => ({
      userForEdit: state.chart_of_accounts.userForEdit,
      actionsLoading: state.chart_of_accounts.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? "" : "Add Chart Of Accounts";
    if (id) {
      _title = `Edit Chart Of Accounts`;
    } //else if (isUserForRead) {
    //   _title = `Read user '}'`
    // }
    setTitle(_title);
  }, [userForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {!isUserForRead ? title : "View Chart Of Accounts"}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
