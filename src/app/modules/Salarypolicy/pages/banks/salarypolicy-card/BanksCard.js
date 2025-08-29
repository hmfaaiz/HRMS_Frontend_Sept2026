import React, { useMemo } from "react"

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"
import { BanksTable } from "../salarypolicy-table/BanksTable"
import { useBanksUIContext } from "../BanksUIContext"
// import { BanksFilter } from "../salarypolicy-filter/BanksFIlter"
import { useSelector, shallowEqual } from "react-redux"

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
      userAccess: state.auth.userAccess.salary_policy,
    }),
    shallowEqual
  )

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateSalarypolicy"
  )

  return (
    <>

      <Card>
        <CardHeader title="">
          {/* <BanksFilter /> */}
          <CardHeaderToolbar>
            {accessUser ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={BanksUIProps.newBankButtonClick}
              >
                + Add Salary Policy
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

          <BanksTable />
        </CardBody>
      </Card>
    </>
  )
}
