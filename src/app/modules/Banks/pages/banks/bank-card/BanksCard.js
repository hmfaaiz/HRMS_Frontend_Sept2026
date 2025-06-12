import React, { useMemo } from "react"
import SVG from "react-inlinesvg";



import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"
import { BanksTable } from "../bank-table/BanksTable"
import { useBanksUIContext } from "../BanksUIContext"
import { BanksFilter } from "../bank-filter/BanksFIlter"
import { useSelector, shallowEqual, useDispatch, } from "react-redux"
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName"
import * as actions from "../../../_redux/bankActions";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";

export function BanksCard() {
  const banksUIContext = useBanksUIContext()
  //console.log("banksUIContext", banksUIContext)
  const BanksUIProps = useMemo(() => {
    return {
      newBankButtonClick: banksUIContext.newBankButtonClick,
      openEditBankDialog: banksUIContext.openEditBankDialog,
      queryParams: banksUIContext.queryParams,
      setQueryParams: banksUIContext.setQueryParams,
    }
  }, [banksUIContext])

  const { userAccess, pdfLoading, csvLoading, excelLoading } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess.Bank,
      pdfLoading: state?.bank?.pdfLoading,
      csvLoading: state?.bank?.csvLoading,
      excelLoading: state?.bank?.excelLoading,
    }),
    shallowEqual
  )

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateBank"
  )

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

  }



  return (
    <>
      <Card>

        <CardHeader title={CurrentModuleName()} >

          <div className="d-flex justify-content-between align-items-center gap-3 m-4">



            <div className="pt-5">

              <BanksFilter />

            </div>

            <div className=" p-2">

              <CardHeaderToolbar>



                {accessUser && (
                  <>
                    <button

                      type="button"

                      className="btn btn-primary mr-2"
                      onClick={BanksUIProps.newBankButtonClick}



                    >

                      + Add Bank

                    </button>
                    <button

                      type="button"

                      className="file-button"
                      disabled={pdfLoading}
                      onClick={() => { print("pdf") }}

                    >

                      {/* Print PDF */}
                      <span className="file-button">
                        <SVG
                        
                          src={toAbsoluteUrl("/media/svg/icons/Communication/Download-PDF-01.svg")}
                        />
                      </span>
                      {/* {pdfLoading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )} */}
                    </button>

                    <button

                      type="button"

                      className=" file-button"
                      disabled={csvLoading}
                      onClick={() => { print("csv") }}

                    >

                      {/* Print CSV
                       */}

                      <span className=" file-button">
                        <SVG
                          src={toAbsoluteUrl("/media/svg/icons/Communication/Download-CSV.svg")}
                        />
                      </span>
                      {/* {csvLoading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )} */}
                    </button>



                    <button

                      type="button"

                      className=" file-button"
                      disabled={excelLoading}
                      onClick={() => { print("excel") }}

                    >

                      {/* Print Excel 
                      */}

                      <span className="file-button">
                        <SVG
                          src={toAbsoluteUrl("/media/svg/icons/Communication/Download-Excel.svg")}
                        />
                      </span>
                      {/* {excelLoading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )} */}
                    </button>

                  </>
                )}





              </CardHeaderToolbar>

            </div>



          </div>

        </CardHeader>



        <CardBody>



          <BanksTable />

        </CardBody>

      </Card>



    </>
  )
}
