import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { CirclePlus } from "lucide-react";

import {
  FormTable
} from "../form-table/FormTable";
import { EmployeeOnboardingFilter } from "../form-filter/FormFilter";
import { useEmployeeOnboardingUIContext } from "../FormUIContext";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";

export function FormCard() {
  const FormUIContext = useEmployeeOnboardingUIContext();

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.employee_onboarding_checklist,
    }),
    shallowEqual
  );

  // Check if the user has access to create a new checklist
  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateEmployeeOnboardingChecklist"
  );

  return (
    <TCard name={CurrentModuleName()}>
      {/* Filter + Add Button */}
      <div className="grid md:grid-cols-7 justify-between items-center gap-2">
        <div className="grid md:col-span-5">
          <EmployeeOnboardingFilter />
        </div>

        <div className="flex md:col-span-2 items-center gap-2 md:justify-end">
          {accessUser && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={FormUIProps.newFormButtonClick}
            >
              <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
              Add
            </button>
          )}
        </div>
      </div>

      {/* Employee Onboarding Table */}
      <FormTable />
    </TCard>
  );
}
