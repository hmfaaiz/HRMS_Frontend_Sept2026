import React, { useState, useEffect } from "react"
import { shallowEqual, useSelector } from "react-redux"
import { Modal } from "react-bootstrap"
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls"

export function DesignationEditDialogHeader({ id,isUserForRead }) {
  const userForEdit = false
  const [title, setTitle] = useState("")

  const { customerForEdit, actionsLoading } = useSelector(
    (state) => ({
      userForEdit: state.policy.userForEdit,
      actionsLoading: state.users.actionsLoading,
    }),
    shallowEqual
  )

//   useEffect(() => {

//     let _title = id ? "" : "Add Employee Policy"
//     if (userForEdit && id) {
//       _title = `Edit Employee Policy '${userForEdit.firstName} ${userForEdit.lastName}'`
//     }
//     setTitle(_title)
//   })

//   return (
//     <>
//       <Modal.Header closeButton>
//         <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
//       </Modal.Header>
//     </>
//   )
// }


useEffect(() => {
  let _title = id ? "" : "Add Application Configuration";
  if (id) {
    _title = `Edit Application Configuration`;
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
        {!isUserForRead ? title : "View Application Configuration"}
      </Modal.Title>
    </Modal.Header>
  </>
);
}
