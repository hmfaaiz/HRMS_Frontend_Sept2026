import React, { useMemo } from "react";
import SVG from "react-inlinesvg";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { BranchTable } from "../branch-table/BranchTable";
import { useBranchUIContext } from "../BranchUIContext";
import { BranchFilter } from "../branch-filter/BranchFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import * as actions from "../../../_redux/branchActions";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import TCard from "../../../../../utils/common-modules/TCard";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CirclePlus, FileSpreadsheet, FileText, Sheet } from "lucide-react";

export function BranchCard() {
  const BranchUIContext = useBranchUIContext();

  const BranchUIProps = useMemo(() => {
    return {
      newBranchButtonClick: BranchUIContext.newBranchButtonClick,
      openEditBranchDialog: BranchUIContext.openEditBranchDialog,
      queryParams: BranchUIContext.queryParams,
      setQueryParams: BranchUIContext.setQueryParams,
    };
  }, [BranchUIContext]);

  const { userAccess, pdfLoading, csvLoading, excelLoading } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Branch,
      pdfLoading: state.branch.pdfLoading,
      csvLoading: state.branch.csvLoading,
      excelLoading: state.branch.excelLoading,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateBranch"
  );
  const dispatch = useDispatch();
  const print = async (value) => {
    let updatedQueryParams = {
      ...BranchUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: true,
    };

    // Set the updated queryParams
    BranchUIProps.setQueryParams(updatedQueryParams);

    await dispatch(actions.fetchUsers(BranchUIProps.queryParams));
    updatedQueryParams = {
      ...BranchUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: false,
    };

    BranchUIProps.setQueryParams(updatedQueryParams);
  };

  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        <BranchFilter />
        <div className="flex items-center gap-2">
          {/* <CardHeaderToolbar> */}
          {accessUser && (
            <>
              <button
                type="button"
                className="btn btn-primary mr-2"
                onClick={BranchUIProps.newBranchButtonClick}
              >
                <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" />{" "}
                Add Branch
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
                {/* Print PDF */}
                <FileText className="w-4 h-4 text-black cursor-pointer" />
                {/* {pdfLoading && (
            <span className="ml-3 mr-3 spinner spinner-white"></span>
          )} */}
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
                {/* Print CSV
                 */}

                <FileSpreadsheet className="w-4 h-4 text-black cursor-pointer" />
                {/* {csvLoading && (
            <span className="ml-3 mr-3 spinner spinner-white"></span>
          )} */}
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
                {/* Print Excel
                 */}

                <Sheet className="w-4 h-4 text-black cursor-pointer" />
                {/* {excelLoading && (
            <span className="ml-3 mr-3 spinner spinner-white"></span>
          )} */}
              </button>
            </OverlayTrigger>
          </div>
          {/* </CardHeaderToolbar> */}
        </div>
      </div>
      <BranchTable />
    </TCard>
  );
}
