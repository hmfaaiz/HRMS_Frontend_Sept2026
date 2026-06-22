import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { CirclePlus } from "lucide-react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";

import { SubsidiaryOnboardingTable } from "../form-table/FormTable";
import { useSubsidiaryOnboardingUIContext } from "../FormUIContext";
import { SubsidiaryOnboardingFilter } from "../form-filter/FormFilter";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";

export function SubsidiaryOnboardingCard() {
  const uiContext = useSubsidiaryOnboardingUIContext();

  const uiProps = useMemo(() => {
    return {
      newFormButtonClick: uiContext.newFormButtonClick,
      openEditFormDialog: uiContext.openEditFormDialog,
    };
  }, [uiContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.onboarding_checklist,
    }),
    shallowEqual
  );

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateOnboardingChecklist"
  );

  
  


  const { currentState } = useSelector(
    (state) => ({
      currentState: state.onboarding_checklist,
      userAccess:
        state?.auth?.userAccess["onboarding_checklist"],
    }),
    shallowEqual
  );
  return (
    <TCard name={CurrentModuleName()}>
      {/* Filter & Add Button */}
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2 mb-3">
        <SubsidiaryOnboardingFilter />
        {accessUser && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={uiProps.newFormButtonClick}
          >
            <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
            Add
          </button>
        )}
      </div>

      {/* Table */}
      <SubsidiaryOnboardingTable />
    </TCard>
  );
}
