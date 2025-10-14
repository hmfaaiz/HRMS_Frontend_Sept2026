import React from "react";
import { FormTable } from "../form-table/FormTable";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { FormFIlter } from "../form-filter/FormFIlter";

export function FormCard() {
  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        <FormFIlter />
      </div>
      <FormTable />
    </TCard>
    // </>
  );
}
