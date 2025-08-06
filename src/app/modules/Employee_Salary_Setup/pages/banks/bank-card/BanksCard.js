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
import { CirclePlus, FileText } from "lucide-react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import TCard from "../../../../../utils/common-modules/TCard"

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
    // <>

    //   <Card>
    //     <CardHeader title={CurrentModuleName()}>
    //      <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">
    //         <div className="col-6">
    //           <BanksFilter />
    //         </div>
    //         <div className=" p-2">
    //           <CardHeaderToolbar>
    //             {accessUser ? (
    //               <button
    //                 type="button"
    //                 className="btn btn-primary"
    //                 onClick={BanksUIProps.newBankButtonClick}
    //               >
    //                 + Add Employee Salary
    //               </button>
    //             ) : (
    //               <></>
    //             )}
    //           </CardHeaderToolbar>
    //         </div>
    //       </div>
    //     </CardHeader>

    //     <CardBody>

    //       <BanksTable />
    //     </CardBody>
    //   </Card >
          <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        <BanksFilter />
        <div className="flex items-center gap-2">
          {/* <CardHeaderToolbar> */}
          {accessUser && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={BanksUIProps.newBankButtonClick}
              >
                <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" /> Add
                
              </button>
            </>
          )}
        </div>
      </div>
      <BanksTable />
    </TCard>
    // </>
  )
}
