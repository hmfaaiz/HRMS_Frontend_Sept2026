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
const DesignationWorkflowFormCard = ({ accessPage }) => {
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      newButtonDesigClick: formUIContext.newButtonDesigClick,
    };
  }, [formUIContext]);
  return (
    <Card>
      <CardHeader title={"Designation" + " " + CurrentModuleName()}>
        <CardHeaderToolbar>
          <div className="pr-5">
            <DesignationWorkflowFormFilter />
          </div>
          {accessPage && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={formUIProps.newButtonDesigClick}
            >
              Add Designation Workflow Policy
            </button>
          )}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <DesignationWorkflowPolicyTable />
      </CardBody>
    </Card>
  );
};

export default DesignationWorkflowFormCard;
