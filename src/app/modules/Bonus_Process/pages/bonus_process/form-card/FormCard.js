import React, { useMemo } from "react";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { useSelector, shallowEqual } from "react-redux";
import TCard from "../../../../../utils/common-modules/TCard";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const FormUIProps = useMemo(() => {
    return {
      id: FormUIContext.ids,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.bonus_process,
    }),
    shallowEqual
  );
  

  return (
    <TCard name={"Execute Bonus Process"}>
      <FormEditDialog id={FormUIProps.id} />
      <br />
      <FormTable />
    </TCard>
  );
}