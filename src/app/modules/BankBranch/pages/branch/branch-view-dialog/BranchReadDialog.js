import React, { useEffect, useMemo } from "react"
import { Modal } from "react-bootstrap"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { BranchReadForm } from "./BranchReadForm"
import { UserReadDialogHeader } from "./BranchReadDialogHeader"
import { useBranchUIContext } from "../BranchUIContext"
import * as actions from "../../../_redux/branchActions"

export function BranchEditDialog({ id, show, onHide }) {
  const title = "BankEditDialog"
  const branchUIContext = useBranchUIContext()
  const usersUIProps = useMemo(() => {
    return {
      initUser: branchUIContext.initUser,
      queryParams: branchUIContext.queryParams,
    }
  }, [branchUIContext])

  const dispatch = useDispatch()
  const { actionsLoading, userForEdit, roles, centers } = useSelector(
    (state) => ({
      
      actionsLoading: state.users.actionsLoading,
      userForEdit: state.branch.userForEdit,
      roles: state.users.roles,
      centers: state.users.centers,
    }),
    shallowEqual
  )



  useEffect(() => {
   
    dispatch(actions.fetchUser(id))
    dispatch(actions.fetchRoles())
    dispatch(actions.fetchCenters())
    // dispatch(actions.fetchUser(usersUIProps.queryParams))
  }, [id, dispatch])

  const saveBranch = (user) => {
    
    if (!id) {
      dispatch(actions.createUser(user)).then((res) => {
        onHide()
        //dispatch(actions.fetchUser(queryParams))
      })
    } else {
      const userUpdatedFields = {
        Id: user.Id,
        Name: user.Name,
       
      }
      dispatch(actions.updateUser(userUpdatedFields)).then(() => onHide())
    }
  }

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <UserReadDialogHeader id={id} />
      <BranchReadForm
        saveBranch={saveBranch}
        user={userForEdit || usersUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
      />
    </Modal>
  )
}
