import React, { useMemo ,useEffect} from "react"
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog"



import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"

import { useFormUIContext } from "../FormUIContext"

import { useSelector, shallowEqual, useDispatch } from "react-redux"
import TCard from "../../../../../utils/common-modules/TCard"


export function FormCard() {
  const FormUIContext = useFormUIContext()
  const dispatch = useDispatch();
  const FormUIProps  = useMemo(() => {
    return {
      employeeId: FormUIContext.employeeId,
      setemployeeId: FormUIContext.setemployeeId,
      id: FormUIContext.ids,
    }
  }, [FormUIContext])

  useEffect(()=>{


  },[FormUIProps])

  const { currentState, userAccess } = useSelector(
    (state) => {
     // Log the entire state
      return {


        currentState: state.password,
        userAccess: state?.auth?.userAccess["Password"],
      }
    },
    shallowEqual
  );


  const accessUser = userAccess.find(
    (item) => item.componentName === "ResetPassword"
  )


  const { dashboard } = useSelector(
    (state) => ({
      dashboard: state.dashboard
    }),
    shallowEqual
  )



  

  
  return (
    <>

      {/* <Card>
      

        <CardBody>
       
        



   <FormEditDialog id={FormUIProps.id} employeeId={FormUIProps.employeeId} />
 
          
        </CardBody>
      </Card> */}
          <TCard name={"Reset password"}>
         <FormEditDialog id={FormUIProps.id} employeeId={FormUIProps.employeeId} />
    </TCard>
    </>
  )
}
