import React, { useMemo } from "react"

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"
import { BanksTable } from "../bank-table/BanksTable"
import { useBanksUIContext } from "../BanksUIContext"
import { BanksFilter } from "../bank-filter/BanksFIlter"
import { useSelector, shallowEqual } from "react-redux"
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName"

export function BanksCard() {
  const banksUIContext = useBanksUIContext()
  const BanksUIProps = useMemo(() => {
    return {
      newBankButtonClick: banksUIContext.newBankButtonClick,
      openEditBankDialog: banksUIContext.openEditBankDialog,
    }
  }, [banksUIContext])

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Employee_Salary,
    }),
    shallowEqual
  )
  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateEmployeeSalary"
  )

  return (
    <>

      <Card>
        <CardHeader title={CurrentModuleName()}>
         <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">
            <div className="col-6">
              <BanksFilter />
            </div>
            <div className=" p-2">
              <CardHeaderToolbar>
                {accessUser ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={BanksUIProps.newBankButtonClick}
                  >
                    + Add Employee Salary
                  </button>
                ) : (
                  <></>
                )}
              </CardHeaderToolbar>
            </div>
          </div>
        </CardHeader>

        <CardBody>

          <BanksTable />
        </CardBody>
      </Card >
    </>
  )
}
