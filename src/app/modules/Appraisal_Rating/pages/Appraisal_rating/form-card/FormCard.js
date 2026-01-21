import React, { useMemo } from "react";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { useSelector, shallowEqual } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { SelectSub } from "./Select-subsidiary";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";

export function FormCard() {
  const FormUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      fetchSubsidiaryId: FormUIContext?.fetchSubsidiaryId,
      setFetchSubsidiaryId: FormUIContext?.setFetchSubsidiaryId,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.appraisal_rating,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateAppraisalRating"
  );

  return (
    <TCard name={CurrentModuleName()}>
      <SelectSub
        setFetchSubsidiaryId={FormUIProps?.setFetchSubsidiaryId}
        fetchSubsidiaryId={FormUIProps?.fetchSubsidiaryId}
      />
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {accessUser && FormUIProps?.fetchSubsidiaryId && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={FormUIProps.newFormButtonClick}
              >
                <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            </>
          )}
        </div>
      </div>
      {FormUIContext?.fetchSubsidiaryId ? <FormTable /> : <></>}
    </TCard>
    // </>
  );
}
