import React from "react";

import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import "../../../../../utils/common-modules/form.css";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";

export function FormCard() {
  return (

    <TCard name={CurrentModuleName()}>
      <FormEditDialog />
    </TCard>
  );
}
