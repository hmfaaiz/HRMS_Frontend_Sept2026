import React, { useState } from "react";
import { FormTable } from "../form-table/FormTable";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { FormFIlter } from "../form-filter/FormFIlter";
import { Accordion, Button, Card } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";

export function FormCard() {
  const [activeKey, setActiveKey] = useState("0");
  return (
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
            <FormFIlter />
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <FormTable />
    </TCard>
    // </>
  );
}
