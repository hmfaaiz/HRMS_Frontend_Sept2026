import React, { useMemo ,useEffect} from "react"
import { EmployeeSelect } from "../form-edit-dialog/EmployeeSelect"
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile"
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog"
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions"


import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"
import { FormTable } from "../form-table/FormTable"
import { useFormUIContext } from "../FormUIContext"
import { FormFIlter } from "../form-filter/FormFIlter"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { getAllReimbursementConfigPolicy } from "../../../_redux/redux-Actions"

export function FormCard() {
  const FormUIContext = useFormUIContext()
  const dispatch = useDispatch();
  const FormUIProps  = useMemo(() => {
    return {
      employeeId: FormUIContext.employeeId,
      setemployeeId: FormUIContext.setemployeeId,
      queryParamsLeaveApp: FormUIContext.queryParamsLeaveApp,
      id: FormUIContext.ids,
      panelMode:FormUIContext.panelMode,
      setPanelMode:FormUIContext.setPanelMode,
    }
  }, [FormUIContext])

  useEffect(()=>{


  },[FormUIProps])



  const { userAccess } = useSelector(
   
    (state) => ({
      
      userAccess: state.auth.userAccess.reimbursement_claim,
    }),
    shallowEqual
  )
 
  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateReimbursementClaim"
  )

  const { currentState } = useSelector(
    (state) => {  return {
      
      currentState: state.reimbursement_claim,
      userAccess: state?.auth?.userAccess["reimbursement_claim"],
    }},
    shallowEqual
  );

  const { dashboard } = useSelector(
    (state) => ({
      dashboard: state.dashboard
    }),
    shallowEqual
  )


  useEffect(() => {


    if (!dashboard.allEmployees || !dashboard.allEmployees.length)
      dispatch(fetchAllActiveEmployees());

  }, [dispatch, FormUIProps.employeeId])

  
  useEffect(() => {


    if (FormUIProps.employeeId)
      dispatch(getAllReimbursementConfigPolicy({Id:FormUIProps.employeeId}));

  }, [dispatch, FormUIProps.employeeId])

  
  return (
    <>

      <Card>
      

        <CardBody>
          <EmployeeSelect setemployeeId={FormUIProps.setemployeeId} setPanelMode={FormUIProps.setPanelMode} panelMode={FormUIProps.panelMode}/>
        <br />
        
        


        <EmployeeProfile employeeId={FormUIProps.employeeId} panelMode={FormUIProps.panelMode} />
        {/* EmployeeProfile Ends */}

        {/* <br /> */}
      
   {/* FormEditDialog Starts */}
   <FormEditDialog id={FormUIProps.id} employeeId={FormUIProps.employeeId} />
        {/* FormEditDialog Ends */}

        <br />
        <hr />
          <FormTable />
          
        </CardBody>
      </Card>
    </>
  )
}
