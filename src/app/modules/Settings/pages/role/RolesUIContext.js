import React, { createContext, useContext, useState, useCallback } from "react"
import { isEqual, isFunction } from "lodash"
import { initialFilter } from "./RolesUIHelpers"

const RolesUIContext = createContext()

export function useRolesUIContext() {
  return useContext(RolesUIContext)
}

export const RolesUIConsumer = RolesUIContext.Consumer

export function RolesUIProvider({ rolesUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter)
  // console.log("rolesUIEvents", rolesUIEvents)
  const [ids, setIds] = useState([])
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams)
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams
      }

      return nextQueryParams
    })
  }, [])

  const initRole = {
   
    name: "",
    isActive:true
  }

  const value = {
    ids,
    setIds,
    initRole,
    setQueryParamsBase,
    setQueryParams,
    queryParams,
    newRoleButtonClick: rolesUIEvents.newRoleButtonClick,
    openEditRoleDialog: rolesUIEvents.openEditRoleDialog,
    openAccessRightPage: rolesUIEvents.openAccessRightPage,
    openDeleteRoleDialog: rolesUIEvents.openDeleteRoleDialog,
    openRoleAccessPage: rolesUIEvents.openRoleAccessPage,
  }

  return (
    <RolesUIContext.Provider value={value}>{children}</RolesUIContext.Provider>
  )
}
