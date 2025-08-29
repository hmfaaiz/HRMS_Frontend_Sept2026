import React, { useMemo } from "react"

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"
// import { RegionPage } from "../region-table/RegionTable"
import { useBanksUIContext } from "../EmployeePolicyUIContext"
import { BanksFilter } from "../bank-filter/BanksFIlter"
import { useSelector, shallowEqual } from "react-redux"
import { EmpPolicyTable } from "../region-table/RegionTable"

export function EmpPolicyCard() {
  console.log("userAccess Temp EmployeePoliocy",userAccess)
  const banksUIContext = useBanksUIContext()
  //console.log("banksUIContext", banksUIContext)
  const BanksUIProps = useMemo(() => {
    return {
      newBankButtonClick: banksUIContext.newBankButtonClick,
      openEditBankDialog: banksUIContext.openEditBankDialog,
    }
  }, [banksUIContext])

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Policy,
    }),
    shallowEqual
  )
  console.log("::useracess",userAccess);
  const accessUser = userAccess.find(
    (item) => item.componentName === "CreatePolicy"
  )

  return (
    <>

      <Card>
        <CardHeader title="">
          <BanksFilter />
          <CardHeaderToolbar>
            {accessUser ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={BanksUIProps.newBankButtonClick}
              >
                + Add Employee Policy
              </button>
            ) : (
              <></>
            )}
            {/* {userAccess.find((item) => {
              if (
                item.componentName === "CreateUser" ||
                item.isAccess === true
              ) {
                return (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={BanksUIProps.newUserButtonClick}
                  >
                    Add New User
                  </button>
                )
              }
            })} */}
          </CardHeaderToolbar>
        </CardHeader>

        <CardBody>

          <EmpPolicyTable />
        </CardBody>
      </Card>
    </>
  )
}
