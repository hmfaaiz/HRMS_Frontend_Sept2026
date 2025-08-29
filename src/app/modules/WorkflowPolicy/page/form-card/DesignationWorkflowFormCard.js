import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import { useFormUIContext } from "../FormUIContext";
import DesignationWorkflowFormFilter from "../form-filter/DesignationWorkflowFormFilter";
import { DesignationWorkflowPolicyTable } from "../form-table/DesignationWorkflowPolicyTable";
import TCard from "../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
const DesignationWorkflowFormCard = ({ accessPage, value, setValue }) => {
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      newButtonDesigClick: formUIContext.newButtonDesigClick,
    };
  }, [formUIContext]);
  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          {/* {FormUIProps.queryParams.moduleType == 2 ? ( */}
          <button
            type="button"
            className={`btn mr-2 rounded-xl ${
              value === 0 ? "bg-black text-white" : "btn-secondary"
            }`}
            onClick={() => setValue(0)}
          >
            Workflow Policy
          </button>
          {/* ) : ( */}
          <button
            type="button"
            className={`btn mr-2 rounded-xl ${
              value === 1 ? "bg-black text-white" : "btn-secondary"
            }`}
            onClick={() => setValue(1)}
          >
            Designation Workflow Policy
          </button>
          {/* )} */}
        </div>
        <div className="flex items-center gap-2">
          <DesignationWorkflowFormFilter />
          {accessPage && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={formUIProps.newButtonDesigClick}
              >
                <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            </>
          )}
        </div>
      </div>
      <DesignationWorkflowPolicyTable />
    </TCard>
  );
};

export default DesignationWorkflowFormCard;
