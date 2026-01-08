import React, { useMemo } from "react";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { SelectSub } from "./Select-subsidiary";
import TCard from "../../../../../utils/common-modules/TCard";
import { useSelector } from "react-redux";

export function FormCard() {
  const FormUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      subsidiaryId: FormUIContext?.subsidiaryId,
      setSubsidiaryId: FormUIContext?.setSubsidiaryId,
    };
  }, [FormUIContext]);

  const payrollMonth = useSelector(
    (state) => state?.release_payslip?.payrollMonth
  );

  return (
    <TCard name={CurrentModuleName()}>
      <SelectSub
        setFetchSubsidiaryId={FormUIProps?.setSubsidiaryId}
        payrollMonth={payrollMonth}
        fetchSubsidiaryId={FormUIProps.subsidiaryId}
      />
      {FormUIProps?.subsidiaryId ? <FormTable /> : <></>}
    </TCard>
    // </>
  );
}
