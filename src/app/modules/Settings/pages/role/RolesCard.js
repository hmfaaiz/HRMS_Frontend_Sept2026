import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { RolesTable } from "./role-table/RolesTable";
import { useRolesUIContext } from "./RolesUIContext";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
export function RolesCard() {
  const rolesUIContext = useRolesUIContext();
  const rolesUIProps = useMemo(() => {
    return {
      newRoleButtonClick: rolesUIContext.newRoleButtonClick,
    };
  }, [rolesUIContext]);
  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-primary mr-2"
            onClick={rolesUIProps.newRoleButtonClick}
          >
            <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" />{" "}
            Add
          </button>
        </div>
      </div>
      <RolesTable />
    </TCard>
  );
}
