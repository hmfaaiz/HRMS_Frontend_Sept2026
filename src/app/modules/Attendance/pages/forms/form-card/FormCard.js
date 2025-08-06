import React from "react";
import {
  Card,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import "../../../../../utils/common-modules/form.css";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";

export function FormCard() {
  return (
    // < Card>
    // <CardHeader title={CurrentModuleName()}>
    // </CardHeader>
    //   {/* Card Starts */}
    //     {/* FormEditDialog Starts */}
    //     <FormEditDialog />
    //     {/* FormEditDialog Ends */}
    //   {/* Card Ends */}
    // </Card >
    <TCard name={CurrentModuleName()}>
      <FormEditDialog />
    </TCard>
  );
}
