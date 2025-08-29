import React, { useEffect, useMemo } from "react"
import { Modal } from "react-bootstrap"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { DeptReadForm } from "./DeptReadForm"
import { UserReadDialogHeader } from "./DeptReadDialogHeader"
import { useDeptUIContext } from "../DeptUIContext"
import * as actions from "../../../_redux/deptActions"

export function DeptEditDialog({ id, show, onHide }) {
  const title = "DeptEditDialog"
  const deptUIContext = useDeptUIContext()
  const usersUIProps = useMemo(() => {
    return {
      initUser: deptUIContext.initUser,
      queryParams: deptUIContext.queryParams,
    }
  }, [deptUIContext])

  const dispatch = useDispatch()
  const { actionsLoading, userForEdit, roles, centers } = useSelector(
    (state) => ({
      
      actionsLoading: state.users.actionsLoading,
      userForEdit: state.dept.userForEdit,
      roles: state.users.roles,
      centers: state.users.centers,
    }),
    shallowEqual
  )



  useEffect(() => {

    dispatch(actions.fetchUser(id))
    // dispatch(actions.fetchRoles())
    // dispatch(actions.fetchCenters())
    // dispatch(actions.fetchUser(usersUIProps.queryParams))
  }, [id, dispatch])

  const saveDept = (user) => {
 
    if (!id) {
      dispatch(actions.createDept(user)).then((res) => {
        onHide()
        //dispatch(actions.fetchUser(queryParams))
      })
    } else {
      const userUpdatedFields = {
        deptId: user.deptId,
        deptName: user.deptName,
        deptCode: user.deptCode,
        parentDept: user.parentDept,
        subsidiary: user.subsidiary,
        budgetStrength: user.budgetStrength
      }
      dispatch(actions.updateDept(userUpdatedFields)).then(() => onHide())
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
      <DeptReadForm
        saveDept={saveDept}
        user={userForEdit || usersUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
      />
    </Modal>
  )
}
