import React, { useEffect, useMemo, useState } from "react"
import { Modal } from "react-bootstrap"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import * as actions from "../../../_redux/roles/rolesAction"
import { useRolesUIContext } from "../RolesUIContext"
import { RoleEditForm } from "./RoleEditForm"
import {RoleEditDialogHeader} from "./RoleEditDialogheader"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export function RoleEditDialog({ id, show, onHide }) {

  const [loading, setLoading] = useState(false)
 
  const enableLoading = () => {
    setLoading(true)
  }

  const disableLoading = () => {
    setLoading(false)
  }

  //Role UI Context
  const rolesUIContext = useRolesUIContext()

  const rolesUIProps = useMemo(() => {
    return {
      initRole: rolesUIContext.initRole,
    }
  }, [rolesUIContext])

  //Role Redux State

  const dispatch = useDispatch()
  const { currentState, actionsLoading, roleForEdit } = useSelector(
    (state) => ({
      currentState: state.roles,
      actionsLoading: state.roles.actionsLoading,
      roleForEdit: state.roles.roleForEdit,
    }),
    shallowEqual
  )
  
  
  useEffect(() => {
    // server call for getting Role by id
    dispatch(actions.fetchRole(id))
  }, [id, dispatch])


  const saveRole = (roleValues) => {
    
    if(!id){
      enableLoading()
      dispatch(actions.createRole(roleValues,disableLoading))
      onHide()
    }else{
      enableLoading()
      const roleUpdatedFields = {
        id: id,
        name: roleValues.name,
        isActive:roleValues.isActive
      }
      
      dispatch(actions.updateRole(roleUpdatedFields))
      onHide()
    }
    
  }

  // const saveRole = (role) => {
  //   if (!id) {
  //     // console.log("i'm in if and role is", role)
  //     dispatch(actions.createRole(role)).then(() => onHide())
  //   } else {
  //     // console.log("i'm in Else Section")
  //   }
  // }
  // console.log("RoleState", actionsLoading)
  return (
    <Modal
      size="md"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <RoleEditDialogHeader id={id} />
      <RoleEditForm
        saveRole={saveRole}
        actionsLoading={actionsLoading}
        onHide={onHide}
        role={roleForEdit || rolesUIProps.initRole}
        loading = {loading}
      />
       <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Modal>
  )
}
