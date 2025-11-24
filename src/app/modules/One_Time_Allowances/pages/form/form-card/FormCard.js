import React, { useMemo } from "react";
import { FormTable } from "../form-table/FormTable";
import { useFromUIContext } from "../FormUIContext";
import { FormFilter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { CirclePlus } from "lucide-react";
import TCard from "../../../../../utils/common-modules/TCard";

export function FormCard() {
  const formUIContext = useFromUIContext();
  const FormUIProps = useMemo(() => {
    return {
      newButtonClick: formUIContext.newButtonClick,
      openEditDialog: formUIContext.openEditDialog,
      panelMode: formUIContext.panelMode,
      setPanelMode: formUIContext.setPanelMode,
    };
  }, [formUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.onetime_allowance,
    }),
    shallowEqual
  );
  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateOnetimeAllowance"
  );

  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-end flex-wrap gap-2">
        <FormFilter />
        <div className="flex items-end gap-2">
          {/* <CardHeaderToolbar> */}
          {accessUser && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={FormUIProps.newButtonClick}
              >
                <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            </>
          )}
        </div>
      </div>
      <FormTable />
    </TCard>
    // </>
  );
}
