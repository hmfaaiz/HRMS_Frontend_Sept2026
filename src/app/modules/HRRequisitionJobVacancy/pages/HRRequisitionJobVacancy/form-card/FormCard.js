import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { CirclePlus } from "lucide-react";

export function FormCard() {
  const FormUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector((state) => {
    console.log("aaaa", state.auth.userAccess);
    return {
      userAccess: state.auth.userAccess.hr_requisition_job_vacancy,
    };
  }, shallowEqual);

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateHrRequisitionJobVacancy",
  );

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.hr_requisition_job_vacancy,
      userAccess: state?.auth?.userAccess["hr_requisition_job_vacancy"],
    };
  }, shallowEqual);

  // const { currentState } = useSelector();

  const { entities } = currentState;

  return (
    <>
      <div className="flex justify-start sm:justify-end items-end flex-wrap gap-2">
        <FormFIlter />
        <div className="flex items-center gap-2">
          {accessUser && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={FormUIProps.newFormButtonClick}
            >
              <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" />{" "}
              Add
            </button>
          )}
        </div>
      </div>
      <FormTable />
    </>
  );
}
