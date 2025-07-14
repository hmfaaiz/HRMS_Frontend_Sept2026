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
        <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">
           <div className="col-6">

              <WorkflowFormFilter />
           </div>
        <CardHeaderToolbar>
          {/* <div className="pr-5">
            <WorkflowFormFilter />
            </div> */}
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
              </div>
      </CardHeader>
      <CardBody>
        <WorkflowPolicyTable />
      </CardBody>
    </Card>
  );
};

export default WorkflowFormCard;
