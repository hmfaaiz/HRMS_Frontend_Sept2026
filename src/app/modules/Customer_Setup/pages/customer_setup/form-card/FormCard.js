import React, { useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { CirclePlus, FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

import { CustomerTable } from "../form-table/FormTable";
import { CustomerFilter } from "../form-filter/FormFilter";
import { useCustomerUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";

export function CustomerCard() {
  const customerUIContext = useCustomerUIContext();
  const dispatch = useDispatch();

  const customerUIProps = useMemo(() => {
    return {
      newCustomerButtonClick: customerUIContext.newCustomerButtonClick,
      queryParams: customerUIContext.queryParams,
      setQueryParams: customerUIContext.setQueryParams,
    };
  }, [customerUIContext]);

  const { userAccess, pdfLoading, csvLoading, excelLoading } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.customer_setup,
      pdfLoading: state?.customerSetup?.pdfLoading,
      csvLoading: state?.customerSetup?.csvLoading,
      excelLoading: state?.customerSetup?.excelLoading,
    }),
    shallowEqual
  );

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateCustomerSetup"
  );

  const print = async (value) => {
    // Create updated query params with the export flag
    let updatedQueryParams = {
      ...customerUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: true,
    };

    await dispatch(actions.fetchCustomers(updatedQueryParams));
    
    // Reset the export flags after download completes
    updatedQueryParams = {
      ...customerUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
    };

    customerUIProps.setQueryParams(updatedQueryParams);
  };

  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        <CustomerFilter />

        <div className="flex items-center gap-2">
          {accessUser && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={customerUIProps.newCustomerButtonClick}
              >
                <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            </>
          )}

          <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm">
            <OverlayTrigger
              overlay={<Tooltip id="products-edit-tooltip">Export PDF</Tooltip>}
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
              overlay={<Tooltip id="products-edit-tooltip">Export CSV</Tooltip>}
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
                <Tooltip id="products-edit-tooltip">Export Excel</Tooltip>
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
        </div>
      </div>

      <CustomerTable />
    </TCard>
  );
}