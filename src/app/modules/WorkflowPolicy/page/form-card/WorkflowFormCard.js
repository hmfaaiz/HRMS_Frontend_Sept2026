import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import { useFormUIContext } from "../FormUIContext";
import WorkflowFormFilter from "../form-filter/WorkflowFormFilter";
import { WorkflowPolicyTable } from "../form-table/WorkflowPolicyTable";
import TCard from "../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
const WorkflowFormCard = ({ accessPage, value, setValue }) => {
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      newButtonClick: formUIContext.newButtonClick,
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
          <WorkflowFormFilter />
          {accessPage && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={formUIProps.newButtonClick}
              >
                <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" />{" "}
                Add Workflow Policy
              </button>
            </>
          )}
        </div>
      </div>
      <WorkflowPolicyTable />
    </TCard>
  );
};

export default WorkflowFormCard;
