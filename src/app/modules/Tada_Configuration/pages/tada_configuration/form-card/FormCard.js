import React, { useMemo } from "react";
import { useFormUIContext } from "../FormUIContext";
import { FormTable } from "../form-table/FormTable";
import { useSelector, shallowEqual } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
import { FormFilter } from "../form-filter/FormFIlter";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
    };
  }, [FormUIContext]);
  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth?.userAccess?.tada_config,
    }),
    shallowEqual,
  );
  const moduleName = CurrentModuleName();

  const accessUser = userAccess.find(
    (item) =>
      item.componentName === "CreateTadaConfig" 
  );


  return (
    <TCard name={moduleName}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        <FormFilter />
        <div className="flex items-center gap-2">
          {accessUser && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={FormUIProps.newFormButtonClick}
              >
                <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            </>
          )}
        </div>
      </div>
      <FormTable />
    </TCard>
  );
}
