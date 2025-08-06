import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { FormTable } from "../form-table/FormTable";
import "../../../../../utils/common-modules/form.css";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";

export function FormCard() {
  return (
    // <>
    //   <Card>
    //     {/* Card Starts */}

    //     <CardHeader title={CurrentModuleName()}></CardHeader>
    //     <CardBody>
    //       {/* FormEditDialog Starts */}
    //       <FormEditDialog />
    //       {/* FormEditDialog Ends */}

    //       <br />
    //       <hr />

    //       {/* FormTable Starts */}
    //       <FormTable />
    //       {/* FormTable Ends */}
    //     </CardBody>

    //     {/* Card Ends */}
    //   </Card>
    <TCard name={CurrentModuleName()}>
      <div className="">
        <FormEditDialog />
      </div>
      <FormTable />
    </TCard>
    // </>
  );
}
