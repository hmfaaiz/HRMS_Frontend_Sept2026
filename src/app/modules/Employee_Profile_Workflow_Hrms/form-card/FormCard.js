import React, { useMemo } from "react";


import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../utils/common-modules/ModuleName";
import { CirclePlus } from "lucide-react";
import * as actions from "../_redux/redux-Actions";

export function FormCard({ showApplicantDetails, onApplicantDetailsChange }) {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  const { userAccess, pdfLoading, csvLoading, excelLoading } = useSelector((state) => {

    return {
      userAccess: state.auth.userAccess?.employee_profile_workflow_hrms || [],
    };
  }, shallowEqual);

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateEmployeeProfileWorkflow"
  );


  const { currentState } = useSelector((state) => {
    return {
      currentState: state.Employee_Profile_Workflow_Hrms,
      userAccess: state.auth.userAccess?.employee_profile_workflow_hrms || [],
    };
  }, shallowEqual);

  // const { currentState } = useSelector();



  return (
    <>
      <div className="flex items-center justify-end gap-2 mt-2">



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

      <FormTable showApplicantDetails={showApplicantDetails} />
    </>
  );
}
