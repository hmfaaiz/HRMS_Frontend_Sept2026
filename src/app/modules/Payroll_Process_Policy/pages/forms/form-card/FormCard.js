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

export function FormCard({ id, setid, readOnly }) {
  const FormUIContext = useFormUIContext()
  const formUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
    }
  }, [FormUIContext])

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess?.Payroll_Process_Policy,
    }),
    shallowEqual
  )

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreatePayrollProcessPolicy"
  )

  return (
    <>

      <Card>
        <CardHeader title={CurrentModuleName()}>
           <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">



            <div className="col-6">
              <FormFilter />
            </div>

            <div className=" p-2">
              <CardHeaderToolbar>
                {accessUser ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={formUIProps.newFormButtonClick}
                  >
                    + Add Payroll Policy
                  </button>
                ) : (
                  <></>
                )}
              </CardHeaderToolbar>
            </div>
          </div>
        </CardHeader>

        <CardBody>

          <FormTable formid={id} setid={setid} readOnly={readOnly} />
        </CardBody>
      </Card>
    </>
  )
}
