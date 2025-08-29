import React, { useState, useEffect } from "react"
import { shallowEqual, useSelector } from "react-redux"
import { Modal } from "react-bootstrap"
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls"

export function BankReadDialogHeader({ id }) {
  const userForEdit = false
  const [title, setTitle] = useState("")

  const { customerForEdit, actionsLoading } = useSelector(
    (state) => ({
      userForEdit: state.profile.userForEdit,
      actionsLoading: state.users.actionsLoading,
    }),
    shallowEqual
  )

  useEffect(() => {
  
    let _title = id ? "" : "View Employee Profile"
    if (userForEdit && id) {
      _title = `Edit Employee Profile '${userForEdit.firstName} ${userForEdit.lastName}'`
    }
    setTitle(_title)
  })

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  )
}
