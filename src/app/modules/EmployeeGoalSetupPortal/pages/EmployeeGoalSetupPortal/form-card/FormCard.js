import React, { useMemo } from "react";

import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import { CirclePlus } from "lucide-react";

export function FormCard() {
  const FormUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector((state) => {
    return {
      userAccess: state.auth.userAccess["Employee_Goal_Setup_Portal"],
    };
  }, shallowEqual);

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateEmployeeGoalSetup"
  );

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.employee_goal_setup_portal,
      userAccess: state?.auth?.userAccess["Employee_Goal_Setup_Portal"],
    };
  }, shallowEqual);

  console.log(userAccess, "q123")

  const menuOptions = [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div>

      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>

        <div className="px-3 py-2 rounded-lg bg-white">
          <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
            <FormFIlter />
            <div className="flex items-center gap-2">
              {accessUser && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    FormUIProps.newFormButtonClick();
                    FormUIProps.setPanelMode(false);
                  }}
                >
                  <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                  Add
                </button>
              )}
            </div>
          </div>
          <FormTable />
        </div>
      </div>
    </div>
  );
}
