import React, { useMemo, useEffect } from "react";
import { EmployeeSelect } from "../form-edit-dialog/EmployeeSelect";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { FormTable } from "../form-table/FormTable";
import { FormTablePayrollGroup } from "../FormTablePayrollGroup/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import TCard from "../../../../../utils/common-modules/TCard";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const FormUIProps = useMemo(() => {
    return {
      employeeId: FormUIContext.employeeId,
      setemployeeId: FormUIContext.setemployeeId,
      queryParamsLeaveApp: FormUIContext.queryParamsLeaveApp,
      id: FormUIContext.ids,
    };
  }, [FormUIContext]);

  useEffect(() => {}, [FormUIProps]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.payroll_process,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreatePayrollProcess"
  );

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.payroll_process,
      userAccess: state?.auth?.userAccess["payroll_process"],
    };
  }, shallowEqual);

  const { dashboard } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (!dashboard.allEmployees || !dashboard.allEmployees.length)
      dispatch(fetchAllActiveEmployees());
  }, [dispatch, FormUIProps.employeeId]);

  return (
    // <>
    //   <Card>
    //     <CardHeader title={"Execute Payroll Process"}></CardHeader>
    //     <CardBody>
    //       {/* <br /> */}
    //       {/* <hr /> */}
    //       {/* FormEditDialog Starts */}
    //       <FormEditDialog
    //         id={FormUIProps.id}
    //         employeeId={FormUIProps.employeeId}
    //       />
    //       {/* FormEditDialog Ends */}

    //       <br />
    //       {/* <hr /> */}
    //       <FormTable />
    //     </CardBody>
    //   </Card>
      <TCard name={"Execute Payroll Process"}>
        <FormEditDialog
          id={FormUIProps.id}
          employeeId={FormUIProps.employeeId}
        />
        {/* FormEditDialog Ends */}

        <br />
        <FormTable />
      </TCard>
    // </>
  );
}
