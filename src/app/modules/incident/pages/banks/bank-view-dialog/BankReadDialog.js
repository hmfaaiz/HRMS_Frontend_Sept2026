import React, { useEffect, useMemo } from "react"
import { Modal } from "react-bootstrap"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { BankReadForm } from "./BankReadForm"
import { UserReadDialogHeader } from "./BankReadDialogHeader"
import { useBanksUIContext } from "../BanksUIContext"
import * as actions from "../../../_redux/bankActions"

export function BankEditDialog({ id, show, onHide }) {
  const title = "BankEditDialog"
  const banksUIContext = useBanksUIContext()
  const usersUIProps = useMemo(() => {
    return {
      initUser: banksUIContext.initUser,
      queryParams: banksUIContext.queryParams,
    }
  }, [banksUIContext])

  const dispatch = useDispatch()
  const { actionsLoading, userForEdit, roles, centers } = useSelector(
    (state) => ({
      
      actionsLoading: state.users.actionsLoading,
      userForEdit: state.academic.userForEdit,
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
  const saveBank = (user) => {
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
      <BankReadForm
        saveBank={saveBank}
        user={userForEdit || usersUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
      />
    </Modal>
  )
}
