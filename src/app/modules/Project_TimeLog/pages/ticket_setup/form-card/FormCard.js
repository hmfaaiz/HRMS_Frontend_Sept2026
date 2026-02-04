import React, { useEffect, useMemo } from "react";
import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { FormTable } from "../form-table/FormTable";
import { FormFilter } from "../form-filter/FormFilter";
import { useFormUIContext } from "../FormUIContext";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { useDispatch } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";

export function FormCard() {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const formUIProps = useMemo(() => {
    return {
      panelMode: formUIContext.panelMode,
      setPanelMode: formUIContext.setPanelMode,
      employeeId: formUIContext.employeeId,
      setEmployeeId: formUIContext.setEmployeeId,
      queryParams: formUIContext.queryParams,
      Id: formUIContext.Id,
      setId: formUIContext.setId,
    };
  }, [formUIContext]);

  useEffect(() => {
    if (!formUIProps?.employeeId) return;
    dispatch(
      actions.fetchTimeLogs({
        ...formUIProps.queryParams,
        filter: {
          ...formUIProps.queryParams?.filter,
          employeeId: formUIProps?.employeeId,
        },
      }),
    );
  }, [formUIProps?.employeeId]);

  useEffect(() => {
    dispatch(fetchAllActiveEmployees());
  }, []);

  return (
    <TCard name={CurrentModuleName()}>
      <FormFilter
        setEmployeeId={formUIProps.setEmployeeId}
        setPanelMode={formUIProps.setPanelMode}
        panelMode={formUIProps.panelMode}
      />
      <br />
      <EmployeeProfile
        employeeId={formUIProps.employeeId}
        panelMode={formUIProps.panelMode}
      />
      {formUIProps?.employeeId ? (
        <>
          <FormEditDialog Id={formUIProps?.Id} />
          <FormTable />
        </>
      ) : null}
    </TCard>
  );
}
