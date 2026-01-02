import React, { useEffect, useMemo } from "react";


import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";

import { useSelector, shallowEqual,useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { EmployeeSelect } from "../form-edit-dialog/employeeSelect";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      setemployeeId: FormUIContext.setemployeeId,
      id: FormUIContext.ids,
      employeeId: FormUIContext.employeeId,
      panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
      readMode: FormUIContext.readMode,
      setReadMode: FormUIContext.setReadMode,
    };
  }, [FormUIContext]);

  const { userAccess,dashboard } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.facilitator_ticket_creation,
       dashboard: state.dashboard,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateEmployeeDoc"
  );

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.facilitator_ticket_creation,
      userAccess: state?.auth?.userAccess["facilitator_ticket_creation"],
    };
  }, shallowEqual);

  useEffect(() => {
    if (!dashboard.employee || !dashboard.employee.length)
      dispatch(fetchAllActiveEmployees());
  }, [dispatch, FormUIProps.employeeId]);

  const { entities } = currentState;

  return (

    <TCard name={CurrentModuleName()}>
      {/* <EmployeeSelect
        setemployeeId={FormUIProps.setemployeeId}
        setPanelMode={FormUIProps.setPanelMode}
        panelMode={FormUIProps.panelMode}
      />
      <br /> */}

      {/* <EmployeeProfile
        employeeId={FormUIProps.employeeId}
        panelMode={FormUIProps.panelMode}
      /> */}
      {/* EmployeeProfile Ends */}

    <FormTable />
      <br />
   <hr />
      {/* FormEditDialog Starts */}
      <FormEditDialog id={FormUIProps.id} employeeId={FormUIProps.employeeId} />
      {/* FormEditDialog Ends */}

      <br />
      <hr />
      <FormTable />
    </TCard>
    // </>
  );


}
