import React, { useMemo } from "react";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFilter } from "../form-filter/FormFilter";
import { useSelector, shallowEqual } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";

export function FormCard() {
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess?.temporary_shift_setup || [],
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateTemporaryShiftSetup"
  );

  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        
        {/* Filter */}
        <FormFilter />

        {/* Add Button */}
        <div className="flex items-center gap-2">
          {accessUser && (
            <button
              type="button"
              className="btn btn-primary flex items-center gap-1"
              onClick={formUIProps.newFormButtonClick}
            >
              <CirclePlus className="w-3 h-3 text-white stroke-3" />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <FormTable />
    </TCard>
  );
}