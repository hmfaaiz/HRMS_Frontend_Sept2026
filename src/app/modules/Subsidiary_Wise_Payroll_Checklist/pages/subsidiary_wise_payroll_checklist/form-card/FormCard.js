import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { CirclePlus } from "lucide-react";
import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { SubsidiaryPayrollFilter } from "../form-filter/FormFilter";
import { SubsidiaryPayrollTable } from "../form-table/FormTable";
import { useSubsidiaryPayrollUIContext } from "../FormUIContext";

export function SubsidiaryPayrollCard() {
  const uiContext = useSubsidiaryPayrollUIContext();

  const uiProps = useMemo(() => ({
    newFormButtonClick: uiContext.newFormButtonClick,
    openEditFormDialog: uiContext.openEditFormDialog,
  }), [uiContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.subsidiary_wise_payroll_checklist,
    }),
    shallowEqual
  );
  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateSubsidiaryWisePayrollChecklist"
  );

  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2 mb-3">
        <SubsidiaryPayrollFilter />
        {accessUser && (
          <button type="button" className="btn btn-primary" onClick={uiProps.newFormButtonClick}>
            <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" /> Add
          </button>
        )}
      </div>
      <SubsidiaryPayrollTable />
    </TCard>
  );
}
