import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { BanksTable } from "../bank-table/BanksTable";
import { useBanksUIContext } from "../BanksUIContext";
import { BanksFilter } from "../bank-filter/BanksFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import * as actions from "../../../_redux/bankActions";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus, FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
export function BanksCard() {
  const banksUIContext = useBanksUIContext();

  const BanksUIProps = useMemo(() => {
    return {
      newBankButtonClick: banksUIContext.newBankButtonClick,
      openEditBankDialog: banksUIContext.openEditBankDialog,
      queryParams: banksUIContext.queryParams,
      setQueryParams: banksUIContext.setQueryParams,
    };
  }, [banksUIContext]);

  const { userAccess, pdfLoading, csvLoading, excelLoading } = useSelector(
    (state) => {
      return {
        userAccess: state?.auth?.userAccess?.Deduction,
        pdfLoading: state?.deduction?.pdfLoading,
        csvLoading: state?.deduction?.csvLoading,
        excelLoading: state?.deduction?.excelLoading,
      };
    },
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateDeduction"
  );

  const dispatch = useDispatch();
  const print = async (value) => {
    let updatedQueryParams = {
      ...BanksUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: true,
    };

    // Set the updated queryParams
    BanksUIProps.setQueryParams(updatedQueryParams);

    await dispatch(actions.fetchUsers(BanksUIProps.queryParams));
    updatedQueryParams = {
      ...BanksUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: false,
    };

    BanksUIProps.setQueryParams(updatedQueryParams);
  };

  return (
    // <>
    //   <Card>
    //     <CardHeader title={CurrentModuleName()}>
    //       <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">
    //         <div className="col-6">
    //           <BanksFilter />
    //         </div>

    //         <div className=" p-2">
    //           <CardHeaderToolbar>
    //             {accessUser && (
    //               <>
    //                 <button
    //                   type="button"
    //                   className="btn btn-primary"
    //                   onClick={BanksUIProps.newBankButtonClick}
    //                 >
    //                   + Add Deduction
    //                 </button>

    //                 <button
    //                   type="button"
    //                   className="file-button"
    //                   disabled={pdfLoading}
    //                   onClick={() => {
    //                     print("pdf");
    //                   }}
    //                 >
    //                   {/* Print PDF */}
    //                   <span className="file-button">
    //                     <SVG
    //                       src={toAbsoluteUrl(
    //                         "/media/svg/icons/Communication/PDF.svg"
    //                       )}
    //                     />
    //                   </span>
    //                 </button>

    //                 <button
    //                   type="button"
    //                   className=" file-button"
    //                   disabled={csvLoading}
    //                   onClick={() => {
    //                     print("csv");
    //                   }}
    //                 >
    //                   {/* Print CSV
    //                    */}

    //                   <span className=" file-button">
    //                     <SVG
    //                       src={toAbsoluteUrl(
    //                         "/media/svg/icons/Communication/CSV.svg"
    //                       )}
    //                     />
    //                   </span>
    //                 </button>

    //                 <button
    //                   type="button"
    //                   className=" file-button"
    //                   disabled={excelLoading}
    //                   onClick={() => {
    //                     print("excel");
    //                   }}
    //                 >
    //                   {/* Print Excel
    //                    */}

    //                   <span className="file-button">
    //                     <SVG
    //                       src={toAbsoluteUrl(
    //                         "/media/svg/icons/Communication/XLSX.svg"
    //                       )}
    //                     />
    //                   </span>
    //                 </button>
    //               </>
    //             )}
    //           </CardHeaderToolbar>
    //         </div>
    //       </div>
    //     </CardHeader>

    //     <CardBody>
    //       <BanksTable />
    //     </CardBody>
    //   </Card>
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        <BanksFilter />
        <div className="flex items-center gap-2">
          {/* <CardHeaderToolbar> */}
          {accessUser && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={BanksUIProps.newBankButtonClick}
              >
                <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
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
      <BanksTable />
    </TCard>
    // </>
  );
}
