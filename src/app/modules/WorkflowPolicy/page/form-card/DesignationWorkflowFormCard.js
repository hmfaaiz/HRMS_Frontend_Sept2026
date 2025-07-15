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
        <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">
           <div className="col-6">
            <DesignationWorkflowFormFilter />
          </div>
        <CardHeaderToolbar>
         
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
        </div>
      </CardHeader>
      <CardBody>
        <DesignationWorkflowPolicyTable />
      </CardBody>
    </Card>
  );
};

export default DesignationWorkflowFormCard;
