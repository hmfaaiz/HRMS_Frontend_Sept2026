import React, { useMemo } from "react";
import { FormTable } from "../formdetails-table/FormDetailsTable";
import { useFormUIContext } from "../FormDetailsUIContext";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import * as actions from "../../../_redux/formdetailsActions";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus, FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export function FormCard() {
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: formUIContext.newFormButtonClick,
      openEditFormDialog: formUIContext.openEditFormDialog,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  const {
    userAccess,
    currentState,
    pdfLoading,
    excelLoading,
    csvLoading,
  } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess?.chart_account,
      currentState: state?.chart_of_accounts,
      pdfLoading: state?.chart_of_accounts?.pdfLoading,
      excelLoading: state?.chart_of_accounts?.excelLoading,
      csvLoading: state?.chart_of_accounts?.csvLoading,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateChartOfAccounts"
  );

  const currentId = currentState?.currentId;

  const dispatch = useDispatch();

  const print = async (value) => {
    let updatedQueryParams = {
      ...FormUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: true,
      parentId: currentId,
    };

    // Set the updated queryParams
    FormUIProps.setQueryParams(updatedQueryParams);

    await dispatch(actions.customfetchFormDetail(updatedQueryParams));

    updatedQueryParams = {
      ...FormUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: false,
    };

    FormUIProps.setQueryParams(updatedQueryParams);
  };
  const isAnyLoading = pdfLoading || csvLoading || excelLoading;
  return (
    <>
      <TCard name={CurrentModuleName()}>
        <div className="flex justify-end items-center">
          <div className="flex items-end gap-2">
            {accessUser && (
              <>
                <button
                  type="button"
                  className="btn btn-primary mr-2"
                  onClick={FormUIProps.newFormButtonClick}
                >
                  <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                  Add
                </button>
              </>
            )}
            <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm">
              <OverlayTrigger
                overlay={
                  <Tooltip id="products-edit-tooltip">Export PDF</Tooltip>
                }
              >
                <button
                  type="button"
                  className={`border-none bg-transparent ${
                    isAnyLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isAnyLoading}
                  onClick={() => print("pdf")}
                >
                  <FileText className="w-4 h-4 text-black" />
                </button>
              </OverlayTrigger>

              <OverlayTrigger
                overlay={
                  <Tooltip id="products-edit-tooltip">Export CSV</Tooltip>
                }
              >
                <button
                  type="button"
                  className={`border-none bg-transparent ${
                    isAnyLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isAnyLoading}
                  onClick={() => print("csv")}
                >
                  <FileSpreadsheet className="w-4 h-4 text-black" />
                </button>
              </OverlayTrigger>

              <OverlayTrigger
                overlay={
                  <Tooltip id="products-edit-tooltip">Export Excel</Tooltip>
                }
              >
                <button
                  type="button"
                  className={`border-none bg-transparent ${
                    isAnyLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isAnyLoading}
                  onClick={() => print("excel")}
                >
                  <Sheet className="w-4 h-4 text-black" />
                </button>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </TCard>
      <FormTable />
    </>
  );
}
