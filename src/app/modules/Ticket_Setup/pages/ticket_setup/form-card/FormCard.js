import React, { useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

import { FormTable } from "../form-table/FormTable";
import { FormFilter } from "../form-filter/FormFilter";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";

export function FormCard() {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const formUIProps = useMemo(() => {
    return {
      newButtonClick: formUIContext.newButtonClick,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  const { userAccess, pdfLoading, csvLoading, excelLoading } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.ticket_setup,
      pdfLoading: state?.ticket_setup?.pdfLoading,
      csvLoading: state?.ticket_setup?.csvLoading,
      excelLoading: state?.ticket_setup?.excelLoading,
    }),
    shallowEqual
  );

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateTicketSetup",
  );

  const print = async (value) => {
    // Create updated query params with the export flag
    let updatedQueryParams = {
      ...formUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: true,
    };

    await dispatch(actions.fetchTickets(updatedQueryParams));
    
    // Reset the export flags after download completes
    updatedQueryParams = {
      ...formUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
    };

    formUIProps.setQueryParams(updatedQueryParams);
  };

  return (
    <TCard name={CurrentModuleName()}>
      <div className="mb-3">
        <FormFilter
          accessUser={accessUser}
          newButtonClick={() => {
            formUIProps.newButtonClick();
          }}
          exportButtons={
            <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm">
              <OverlayTrigger
                overlay={<Tooltip id="tickets-pdf-tooltip">Export PDF</Tooltip>}
              >
                <button
                  type="button"
                  className="border-none bg-transparent"
                  disabled={pdfLoading}
                  onClick={() => {
                    print("pdf");
                  }}
                >
                  <FileText className="w-4 h-4 text-black cursor-pointer" />
                </button>
              </OverlayTrigger>

              <OverlayTrigger
                overlay={<Tooltip id="tickets-csv-tooltip">Export CSV</Tooltip>}
              >
                <button
                  type="button"
                  className="border-none bg-transparent"
                  disabled={csvLoading}
                  onClick={() => {
                    print("csv");
                  }}
                >
                  <FileSpreadsheet className="w-4 h-4 text-black cursor-pointer" />
                </button>
              </OverlayTrigger>

              <OverlayTrigger
                overlay={
                  <Tooltip id="tickets-excel-tooltip">Export Excel</Tooltip>
                }
              >
                <button
                  type="button"
                  className="border-none bg-transparent"
                  disabled={excelLoading}
                  onClick={() => {
                    print("excel");
                  }}
                >
                  <Sheet className="w-4 h-4 text-black cursor-pointer" />
                </button>
              </OverlayTrigger>
            </div>
          }
        />
      </div>

      <FormTable />
    </TCard>
  );
}