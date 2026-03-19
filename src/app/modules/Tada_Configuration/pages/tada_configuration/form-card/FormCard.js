import React, { useMemo } from "react";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import { FormTable } from "../form-table/FormTable";
import { useSelector, shallowEqual } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";

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
      userAccess: state.auth?.userAccess?.t_tada_config || [],
    }),
    shallowEqual
  );
  const moduleName = CurrentModuleName();

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateTadaConfiguration" || item.componentName === "CreateT_Tada_Config"
  );
  
  const canCreate = accessUser || true; 

  return (
    <TCard name={moduleName}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        <FormFIlter />
        <div className="flex items-center gap-2">
          {canCreate && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={FormUIProps.newFormButtonClick}
              >
                <CirclePlus className="w-4 h-4 text-white cursor-pointer mr-2" />
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
