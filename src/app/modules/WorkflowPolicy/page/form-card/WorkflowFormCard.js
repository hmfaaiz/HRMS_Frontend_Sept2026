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
const WorkflowFormCard = ({ accessPage }) => {
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      newButtonClick: formUIContext.newButtonClick,
    };
  }, [formUIContext]);
  return (
    <Card>
      <CardHeader title={CurrentModuleName()}>
        <CardHeaderToolbar>
          <div className="pr-5">
            <WorkflowFormFilter />
            </div>
          {accessPage && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={formUIProps.newButtonClick}
            >
              Add Workflow Policy
            </button>
          )}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <WorkflowPolicyTable />
      </CardBody>
    </Card>
  );
};

export default WorkflowFormCard;
