import React, { useMemo, useState } from "react";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { FormFilter } from "../form-filter/FormFilter";
import { useSelector, shallowEqual } from "react-redux";
import { useFormUIContext } from "../../FormUIContext";
import { ApprovalFormTable } from "../form-table/ApprovalTable";
import { WorkflowTable } from "../form-table/WorkflowTable";
import { Accordion, Button, Card } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";
import TCard from "../../../../../utils/common-modules/TCard";
import { FormApproval } from "../form-approval/FormApproval";

export const FormCard = () => {
  const [activeKey, setActiveKey] = useState('0');
  const FormUIContext = useFormUIContext();
  const { listLoading } = useSelector(
    (state) => ({
      listLoading: state?.resignation_workflow_admin?.listLoading,
    }),
    shallowEqual
  );

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext?.queryParams,
      workflowId: FormUIContext?.workflowId,
      setWorkflowId: FormUIContext?.setWorkflowId,
    };
  });

  return (
    <>
      <TCard name={CurrentModuleName()}>
        <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
          <Card>
            <Card.Header className="d-flex justify-content-center">
              <div className="accordion-header-btn w-100  d-flex bg-tsecondary">
                <Accordion.Toggle
                  as={Button}
                  eventKey="0"
                  className="flex justify-start text-bold"
                >
                  {activeKey === "0" ? (
                    <CircleMinus className="h-4 w-4 text-black mr-1" />
                  ) : (
                    <CirclePlus className="h-4 w-4 text-black mr-1" />
                  )}
                  <span className="text-black">Filters</span>
                </Accordion.Toggle>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <FormFilter
                loading={listLoading}
                queryParams={formUIProps.queryParams}
              />
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <FormApproval />

        <ApprovalFormTable />
      </TCard>
      {formUIProps.workflowId && (
        <WorkflowTable
          onHide={() => {
            formUIProps.setWorkflowId(null);
          }}
          show={formUIProps.workflowId !== null}
        />
      )}
    </>
  );
};
