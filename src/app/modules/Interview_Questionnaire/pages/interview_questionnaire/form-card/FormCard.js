import React, { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFilter";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";

export function FormCard() {
  const FormUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth?.userAccess?.interview_questionnaire,
    }),
    shallowEqual
  );

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateInterviewQuestionnaire"
  );

  const { currentState } = useSelector(
    (state) => ({
      currentState: state.interview_questionnaire,
    }),
    shallowEqual
  );

  const { entities } = currentState;

  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        <FormFIlter />
        <div className="flex items-center gap-2">
          {accessUser && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={FormUIProps.newFormButtonClick}
            >
              <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
              Add
            </button>
          )}
        </div>
      </div>
      <FormTable />
    </TCard>
  );
}