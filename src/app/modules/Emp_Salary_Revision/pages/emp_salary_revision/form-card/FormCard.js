import React, { useMemo, useEffect } from "react"
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
import { getAllLoanConfigDetail } from "../../../_redux/redux-Actions"
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName"

export function FormCard() {
  const FormUIContext = useFormUIContext()
  const dispatch = useDispatch();
  const FormUIProps = useMemo(() => {
    return {
      employeeId: FormUIContext.employeeId,
      setemployeeId: FormUIContext.setemployeeId,
      queryParamsLeaveApp: FormUIContext.queryParamsLeaveApp,
      id: FormUIContext.ids,
      panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
      revisedDate: FormUIContext.revisedDate,
      setRevisedDate: FormUIContext.setRevisedDate,

    }
  }, [FormUIContext])

  useEffect(() => {


  }, [FormUIProps])



  const { userAccess } = useSelector(

    (state) => ({

      userAccess: state.auth.userAccess.emp_salary_revision,
    }),
    shallowEqual
  )

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateEmployeeSalaryRevision"
  )

  const { currentState } = useSelector(
    (state) => {
      return {

        currentState: state.emp_salary_revision,
        userAccess: state?.auth?.userAccess["emp_salary_revision"],
      }
    },
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



  return (
    <>

      <Card>
        <CardHeader title={CurrentModuleName()} >
        </CardHeader>

        <CardBody>
          <EmployeeSelect setemployeeId={FormUIProps.setemployeeId} setPanelMode={FormUIProps.setPanelMode} panelMode={FormUIProps.panelMode} setRevisedDate={FormUIProps.setRevisedDate} revisedDate={FormUIProps.revisedDate} />
          <br />
          {/* <hr /> */}



          <EmployeeProfile employeeId={FormUIProps.employeeId} panelMode={FormUIProps.panelMode} />
          {/* EmployeeProfile Ends */}

          {/* <br /> */}
          {/* <hr /> */}
          {/* FormEditDialog Starts */}
          <FormEditDialog id={FormUIProps.id} employeeId={FormUIProps.employeeId} setemployeeId={FormUIProps.setemployeeId} revisedDate={FormUIProps.revisedDate} setRevisedDate={FormUIProps.setRevisedDate}  />
          {/* FormEditDialog Ends */}

          {/* <br />
          <hr /> */}
          {/* <FormTable /> */}

        </CardBody>
      </Card>
    </>
  )
}
