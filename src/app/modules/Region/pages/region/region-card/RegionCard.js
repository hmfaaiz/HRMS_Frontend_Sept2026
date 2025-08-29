import React, { useMemo } from "react"

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"
// import { RegionPage } from "../region-table/RegionTable"
import { useBanksUIContext } from "../ReligionUIContext"
import { BanksFilter } from "../bank-filter/BanksFIlter"
import { useSelector, shallowEqual } from "react-redux"
import { RegionTable } from "../region-table/RegionTable"

export function RegionCard() {
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
      userAccess: state.auth.userAccess.Region,
    }),
    shallowEqual
  )
  console.log("userAccess Temp region",userAccess)
  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateRegion"
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
                + Add Region
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

          <RegionTable />
        </CardBody>
      </Card>
    </>
  )
}
