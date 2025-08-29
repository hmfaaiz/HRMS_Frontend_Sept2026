import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";

export function FormCard() {
  return (
    // <>
    //   <Card>
    //     <CardHeader title={CurrentModuleName()}></CardHeader>
    //     <CardBody>
    //       <FormEditDialog />
    //     </CardBody>
    //   </Card>
    <TCard name={CurrentModuleName()}>
      <FormEditDialog />
    </TCard>
    // </>
  );
}
