import React, { useMemo, useEffect, useState } from "react";
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
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getAllLoanConfigDetail } from "../../../_redux/redux-Actions";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();

  // ── Independent of employee selection ──
  const [showDetails, setShowDetails] = useState(false);

  const FormUIProps = useMemo(() => {
    return {
      employeeId: FormUIContext.employeeId,
      setemployeeId: FormUIContext.setemployeeId,
      queryParamsLeaveApp: FormUIContext.queryParamsLeaveApp,
      id: FormUIContext.ids,
      panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
    };
  }, [FormUIContext]);

  useEffect(() => {}, [FormUIProps]);

  const { userAccess } = useSelector(
    (state) => ({ userAccess: state.auth.userAccess.employee_loan_request }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateEmployeeLoanRequest"
  );

  const { currentState } = useSelector((state) => ({
    currentState: state.employee_loan_request,
    userAccess: state?.auth?.userAccess["employee_loan_request"],
  }), shallowEqual);

  const { dashboard } = useSelector(
    (state) => ({ dashboard: state.dashboard }),
    shallowEqual
  );

  useEffect(() => {
    if (!dashboard.allEmployees || !dashboard.allEmployees.length)
      dispatch(fetchAllActiveEmployees());
  }, [dispatch, FormUIProps.employeeId]);

  useEffect(() => {
    if (FormUIProps.employeeId)
      dispatch(getAllLoanConfigDetail({ Id: FormUIProps.employeeId }));
  }, [dispatch, FormUIProps.employeeId]);

  return (
    <TCard name={CurrentModuleName()}>
      <EmployeeSelect
        setemployeeId={FormUIProps.setemployeeId}
        setPanelMode={FormUIProps.setPanelMode}
        panelMode={FormUIProps.panelMode}
      />
      <br />

      <EmployeeProfile
        employeeId={FormUIProps.employeeId}
        panelMode={FormUIProps.panelMode}
      />

      <FormEditDialog
        id={FormUIProps.id}
        employeeId={FormUIProps.employeeId}
      />

      <br />
      <hr />

      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          id="loanDetailsToggle"
          checked={showDetails}
          onChange={(e) => setShowDetails(e.target.checked)}
          style={{ cursor: "pointer", width: 15, height: 15 }}
        />
        <label
          htmlFor="loanDetailsToggle"
          className="text-md mb-0"
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          Show Installment Details
        </label>
      </div>

      <FormTable showDetails={showDetails} />
    </TCard>
  );
}