import React, { useMemo } from "react"

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"
import { FormTable } from "../form-table/FormTable"
import { useFormUIContext } from "../FormUIContext"
import { FormFIlter } from "../form-filter/FormFIlter"
import { useSelector, shallowEqual } from "react-redux"
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName"

export function FormCard() {
  const FormUIContext = useFormUIContext()

  const FormUIProps  = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
    }
  }, [FormUIContext])

  const { userAccess } = useSelector(
   
    (state) => ({
      
      userAccess: state.auth.userAccess.loan_management_configuration,
    }),
    shallowEqual
  )

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateLoanManagementConfiguration"
  )

  const { currentState } = useSelector(
    (state) => {  return {
      
      currentState: state.loan_management_configuration,
      userAccess: state?.auth?.userAccess["loan_management_configuration"],
    }},
    shallowEqual
  );


  const {entities } = currentState;


  return (
    <>
<Card>
        <CardHeader title={CurrentModuleName()} >
         <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-12">



            <div className="col-4">
      <FormFIlter />
      </div>
      <div className=" p-2">
      <CardHeaderToolbar>
    {accessUser &&
      <button
      type="button"
      className="btn btn-primary "
      onClick={FormUIProps .newFormButtonClick}
    >
     + Add Loan Configuration
    </button>
    }
  
  

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
