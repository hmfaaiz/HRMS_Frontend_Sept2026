import React, { useState, useEffect } from "react"
import { shallowEqual, useSelector } from "react-redux"
import { Modal } from "react-bootstrap"
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls"

export function DesignationEditDialogHeader({ id ,isUserForRead}) {
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

    let _title = id ? "" : "Add Employee Profile"
    if (id) {
      _title = `Edit Employee Profile `
    }
    setTitle(_title)
  },[userForEdit, actionsLoading])

  return (
    <>
      <Modal.Header >
        <Modal.Title id="example-modal-sizes-title-lg">
        {!isUserForRead ? title : "View Employee Profile"}
          </Modal.Title>
      </Modal.Header>
    </>
  )
}
