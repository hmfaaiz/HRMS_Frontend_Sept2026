import React, { useMemo, useEffect } from "react";
import { EmployeeSelect } from "../form-edit-dialog/EmployeeSelect";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";

import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { useDispatch } from "react-redux";
import { getAllLoanConfigDetail } from "../../../_redux/redux-Actions";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { WorkflowAuthortiesTable } from "../form-table/WorkflowAuthortiesTable";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const { employeeList, payrollData } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
      payrollData: state?.loan_request?.payrollData,
    }),
    shallowEqual
  );

  const FormUIProps = useMemo(() => {
    return {
      employeeId: FormUIContext.employeeId,
      setemployeeId: FormUIContext.setemployeeId,
      queryParams: FormUIContext.queryParams,
      id: FormUIContext.ids,
    };
  }, [FormUIContext]);

  useEffect(() => {
    if (!FormUIProps?.employeeId?.value && employeeList?.length > 0) {
      FormUIProps.setemployeeId(employeeList[0]);
    }
  }, [employeeList, FormUIProps?.employeeId]);

  //Get data from server and set on state whenever employee Id is updated
  useEffect(() => {
    if (FormUIProps.employeeId?.value) {
      dispatch(getAllLoanConfigDetail({ Id: FormUIProps.employeeId?.value }));
      dispatch(
        actions.fetchEmployeeLoanRequest({
          ...FormUIProps.queryParams,
          employeeId: FormUIProps.employeeId.value,
        })
      );
    }
  }, [FormUIProps.employeeId?.value, FormUIProps.queryParams]);

  useEffect(() => {
    if (FormUIProps.employeeId?.value) {
      dispatch(actions.getEmployeeAuthorities(FormUIProps.employeeId.value));
      dispatch(actions.getPayrollMonth(FormUIProps.employeeId.value));
    }
  }, [FormUIProps.employeeId?.value]);
  useEffect(() => {
    if (payrollData) {
      dispatch(
        getActiveFiscalYear("activeFiscalYear", payrollData?.subsidiaryId)
      );
    }
  }, [payrollData]);

  return (
    <>
      <Card>
        <CardBody>
          <CardHeader title={CurrentModuleName()} />
          <EmployeeSelect />
          <br />
          <hr />

          <EmployeeProfile employeeId={FormUIProps.employeeId?.value} />
          {/* EmployeeProfile Ends */}

          <br />
          <hr />
          {/* FormEditDialog Starts */}
          <FormEditDialog
            id={FormUIProps.id}
            employeeId={FormUIProps.employeeId?.value}
          />
          {/* FormEditDialog Ends */}

          <br />
          <hr />
          <FormTable />
          <br />
          <hr />
          <WorkflowAuthortiesTable />
        </CardBody>
      </Card>
    </>
  );
}
