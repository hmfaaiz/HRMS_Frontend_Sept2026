import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { DesignationTable } from "../designation-table/DesignationTable";
import { useDesignationUIContext } from "../DesignationUIContext";
import { BanksFilter } from "../bank-filter/BanksFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import * as actions from "../../../_redux/designationActions";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus, FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export function ReligionCard() {
  const designationUIContext = useDesignationUIContext();

  const DesignationUIProps = useMemo(() => {
    return {
      newDesignationButtonClick: designationUIContext.newDesignationButtonClick,
      openEditDesignationDialog: designationUIContext.openEditDesignationDialog,
      queryParams: designationUIContext.queryParams,
      setQueryParams: designationUIContext.setQueryParams,
    };
  }, [designationUIContext]);

  const { userAccess, pdfLoading, csvLoading, excelLoading } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Policy,
      pdfLoading: state?.policy?.pdfLoading,
      csvLoading: state?.policy?.csvLoading,
      excelLoading: state?.policy?.excelLoading,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreatePolicy"
  );

  const dispatch = useDispatch();
  const print = async (value) => {
    let updatedQueryParams = {
      ...DesignationUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: true,
    };

    // Set the updated queryParams
    DesignationUIProps.setQueryParams(updatedQueryParams);

    await dispatch(actions.fetchUsers(DesignationUIProps.queryParams));
    updatedQueryParams = {
      ...DesignationUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: false,
    };

    DesignationUIProps.setQueryParams(updatedQueryParams);
  };

  return (
    //     <>
    //       <Card>
    //         <CardHeader title={CurrentModuleName()}>
    //           <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">
    //             <div className="col-6">
    //               <BanksFilter />
    //             </div>

    //             <div className=" p-2">
    //               <CardHeaderToolbar>
    //                 {accessUser && (
    //                   <>
    //                     <button
    //                       type="button"
    //                       className="btn btn-primary"
    //                       onClick={DesignationUIProps.newDesignationButtonClick}
    //                     >
    //                       + Add Application Configuration
    //                     </button>

    //                     <button
    //                       type="button"
    //                       className="file-button"
    //                       disabled={pdfLoading}
    //                       onClick={() => {
    //                         print("pdf");
    //                       }}
    //                     >
    //                       {/* Print PDF */}
    //                       <span className="file-button">
    //                         <SVG
    //                           src={toAbsoluteUrl(
    //                             "/media/svg/icons/Communication/PDF.svg"
    //                           )}
    //                         />
    //                       </span>
    //                       {/* {pdfLoading && (
    //   <span className="ml-3 mr-3 spinner spinner-white"></span>
    // )} */}
    //                     </button>

    //                     <button
    //                       type="button"
    //                       className=" file-button"
    //                       disabled={csvLoading}
    //                       onClick={() => {
    //                         print("csv");
    //                       }}
    //                     >
    //                       {/* Print CSV
    //                        */}

    //                       <span className=" file-button">
    //                         <SVG
    //                           src={toAbsoluteUrl(
    //                             "/media/svg/icons/Communication/CSV.svg"
    //                           )}
    //                         />
    //                       </span>
    //                       {/* {csvLoading && (
    //   <span className="ml-3 mr-3 spinner spinner-white"></span>
    // )} */}
    //                     </button>

    //                     <button
    //                       type="button"
    //                       className=" file-button"
    //                       disabled={excelLoading}
    //                       onClick={() => {
    //                         print("excel");
    //                       }}
    //                     >
    //                       {/* Print Excel
    //                        */}

    //                       <span className="file-button">
    //                         <SVG
    //                           src={toAbsoluteUrl(
    //                             "/media/svg/icons/Communication/XLSX.svg"
    //                           )}
    //                         />
    //                       </span>
    //                       {/* {excelLoading && (
    //   <span className="ml-3 mr-3 spinner spinner-white"></span>
    // )} */}
    //                     </button>
    //                   </>
    //                 )}
    //               </CardHeaderToolbar>
    //             </div>
    //           </div>
    //         </CardHeader>

    //         <CardBody>
    //           <DesignationTable />
    //         </CardBody>
    //       </Card>
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
                onClick={DesignationUIProps.newDesignationButtonClick}
              >
                <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" />{" "}
                Add Application Configuration
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
      <DesignationTable />
    </TCard>
    // </>
  );
}
