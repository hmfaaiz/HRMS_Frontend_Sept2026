import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  const { userForEdit, actionsLoading } = useSelector(
    (state) => ({
      userForEdit: state.onetime_allowance.userForEdit,
      actionsLoading: state.onetime_allowance.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? "" : "Add Employee One Time Allowances";
    if (id) {
      _title = `Edit Employee One Time Allowances`;
    }
    setTitle(_title);
  }, [userForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header>
        <Modal.Title
          className="text-black font-bold text-[1.25rem]"
          id="example-modal-sizes-title-lg"
        >
          {!isUserForRead ? title : "View Employee One Time Allowances"}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
