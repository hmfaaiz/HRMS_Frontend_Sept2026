import React, { useMemo, useState } from "react";
import { FormFilter } from "../form-filter/FormFilter";
import { useSelector, shallowEqual } from "react-redux";
import { useFormUIContext } from "../../FormUIContext";
import { LeaveApprovalFormTable } from "../form-table/LeaveApprovalTable";
import { LeaveWorkflowTable } from "../form-table/LeaveWorkflowTable";
import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { FormApproval } from "../form-approval/FormApproval";
import { Accordion, Button, Card } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";

export const FormCard = () => {
  const FormUIContext = useFormUIContext();
  const [activeKey, setActiveKey] = useState('0');
  const { listLoading } = useSelector(
    (state) => ({
      listLoading: state?.LeaveWorkflowAdmin?.listLoading,
    }),
    shallowEqual
  );

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext?.queryParams,
      setQueryParams: FormUIContext?.setQueryParams,
      leaveBalanceId: FormUIContext?.leaveBalanceId,
      leaveWorkflowId: FormUIContext?.leaveWorkflowId,
      setLeaveBalanceId: FormUIContext?.setLeaveBalanceId,
      setLeaveWorkflowId: FormUIContext?.setLeaveWorkflowId,
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
              <>
                <FormFilter
                  loading={listLoading}
                  queryParams={formUIProps.queryParams}
                />
              </>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <FormApproval />

        <LeaveApprovalFormTable />
      </TCard>
      {formUIProps.leaveWorkflowId && formUIProps.leaveBalanceId && (
        <LeaveWorkflowTable
          onHide={() => {
            formUIProps.setLeaveWorkflowId(null);
            formUIProps.setLeaveBalanceId(null);
          }}
          show={
            formUIProps.leaveWorkflowId !== null &&
            formUIProps.leaveBalanceId !== null
          }
        />
      )}
    </>
  );
};
