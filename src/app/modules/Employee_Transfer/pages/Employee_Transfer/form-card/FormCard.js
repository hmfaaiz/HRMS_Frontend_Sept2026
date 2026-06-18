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
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { CirclePlus, FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import * as actions from "../../../_redux/redux-Actions";

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
      userAccess: state.auth.userAccess?.employee_transfer || [],
      pdfLoading: state?.employee_transfer?.pdfLoading,
      csvLoading: state?.employee_transfer?.csvLoading,
      excelLoading: state?.employee_transfer?.excelLoading,
    };
  }, shallowEqual);

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateEmployeeTransfer"
  );

  // DEBUG: log userAccess to get correct componentName values
  console.log("[Employee Transfer] userAccess:", userAccess);
  console.log("[Employee Transfer] accessUser (Create):", accessUser);

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.employee_transfer,
      userAccess: state.auth.userAccess?.employee_transfer || [],
    };
  }, shallowEqual);

  // const { currentState } = useSelector();

  const { entities } = currentState || {};

  const print = async (value) => {
    let updatedQueryParams = {
      ...FormUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: true,
    };

    // Set the updated queryParams
    FormUIProps.setQueryParams(updatedQueryParams);

    await dispatch(actions.fetchEmployeeTransfer(FormUIProps.queryParams));
    updatedQueryParams = {
      ...FormUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: false,
    };

    FormUIProps.setQueryParams(updatedQueryParams);
  };

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
