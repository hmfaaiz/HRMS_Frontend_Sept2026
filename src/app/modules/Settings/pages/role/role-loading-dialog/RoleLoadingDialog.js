import React, { useEffect } from "react"
import { shallowEqual, useSelector } from "react-redux"
import { LoadingDialog } from "../../../../../../_metronic/_partials/controls"

export function RoleLoadingDialog() {
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state }),
    shallowEqual
  )

  console.log("isLoading", isLoading)

  //looking for loading/dispatch

  useEffect(() => {}, [isLoading])
  return <LoadingDialog isLoading={isLoading} text="Loading...." />
}
