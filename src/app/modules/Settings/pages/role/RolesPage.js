import React, { useMemo, useEffect } from "react"
import { Route } from "react-router-dom"
import { RolesUIProvider } from "./RolesUIContext"
import { RolesCard } from "./RolesCard"
import { RoleEditDialog } from "./role-edit-dialog/RoleEditDialog"
import { RoleLoadingDialog } from "./role-loading-dialog/RoleLoadingDialog"
import { RoleDeleteDialog } from "./role-delete-dialog/RoleDeleteDialog"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import * as actions from "../../_redux/roles/rolesAction"
import { ToastContainer } from "react-toastify"
// import { AccessRights } from "./access-right-page/AccessRightPage"

export function RolePage({ history }) {

  const dispatch = useDispatch()

  //console.log("rolePage history", history)
  const rolesUIEvents = {
    newRoleButtonClick: () => {
      history.push("/settings/read-all-roles/new")
    },
    openEditRoleDialog: (id) => {
      history.push(`/settings/read-all-roles/${id}/edit`)
    },

    openDeleteRoleDialog: (id) => {
      history.push(`/settings/read-all-roles/${id}/delete`)
    },
    openRoleAccessPage: async (id) => {
   await  dispatch(
      actions.accessRights({ roleId: id, sortBy: "name", limit: 10, page: 1 })
      )
     history.push(`/settings/read-all-roles-access/${id}/edit`)

    },
  }
  return (
    <RolesUIProvider rolesUIEvents={rolesUIEvents}>
      <Route path="/settings/read-all-roles/new">
        {({ history, match }) => (
          <RoleEditDialog
            show={match != null}
            onHide={() => {
              history.push("/settings/read-all-roles")
            }}
          />
        )}
      </Route>
      <Route path="/settings/read-all-roles/:id/edit">
        {({ history, match }) => (
          <RoleEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/settings/read-all-roles")
            }}
          />
        )}
      </Route>
      <Route path="/settings/read-all-roles/:id/delete">
        {({ history, match }) => (
          <RoleDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/settings/read-all-roles")
            }}
          />
        )}
      </Route>
      <RolesCard />
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
    </RolesUIProvider>
  )
}
