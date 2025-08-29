import React, { useMemo } from "react"
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"
import { FormTable } from "../form-table/FormTable"
import { useFormUIContext } from "../FormUIContext"
import { FormFilter } from "../form-filter/FormFilter"
import { useSelector, shallowEqual } from "react-redux"
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName"

export function FormCard() {
  const FormUIContext = useFormUIContext()
  const formUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
    }
  }, [FormUIContext])

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Attendance_Configuration,
    }),
    shallowEqual
  )

  //Check if access to create Leave Type
  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateAttConfiguration"
  )

  return (
    <>
      <Card>
        <CardHeader title={CurrentModuleName()}>
          <div className="d-flex justify-content-between align-items-center gap-3 m-4">
            <div className="pt-5">
              <FormFilter />
            </div>

            <div className=" p-2">
              <CardHeaderToolbar>
                {accessUser && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={formUIProps.newFormButtonClick}
                  >
                    + Add Attendance Configuration
                  </button>
                )}
              </CardHeaderToolbar>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <FormTable />
        </CardBody>
      </Card>
    </>
  )
}
