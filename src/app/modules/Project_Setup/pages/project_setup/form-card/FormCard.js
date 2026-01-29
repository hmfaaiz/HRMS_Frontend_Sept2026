import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { CirclePlus } from "lucide-react";

import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

import { FormTable } from "../form-table/FormTable";
import { FormFilter } from "../form-filter/FormFilter";
import { useFormUIContext } from "../FormUIContext";

export function FormCard() {
  const formcustomerUIContext = useFormUIContext();

  const customerUIProps = useMemo(() => {
    return {
      newButtonClick: formcustomerUIContext.newButtonClick,
    };
  }, [formcustomerUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.project_setup,
    }),
    shallowEqual,
  );

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateProjectSetup",
  );

  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        <FormFilter />

        {accessUser && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={customerUIProps.newButtonClick}
          >
            <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
            Add
          </button>
        )}
      </div>

      <FormTable />
    </TCard>
  );
}
