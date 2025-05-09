import React, { useMemo } from "react"

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"
import { FormTable } from "../formdetails-table/FormDetailsTable"
import { useFormUIContext } from "../FormDetailsUIContext"
import { BanksFilter } from "../bank-filter/BanksFIlter"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName"
import * as actions from "../../../_redux/formdetailsActions";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers"

export function FormCard() {
  const formUIContext = useFormUIContext()

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: formUIContext.newFormButtonClick,
      openEditFormDialog: formUIContext.openEditFormDialog,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams

    }
  }, [formUIContext])

  const { userAccess, currentState, pdfLoading, excelLoading, csvLoading } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess?.FormDetails,
      currentState: state?.formDetails,
      pdfLoading: state?.formDetails?.pdfLoading,
      excelLoading: state?.formDetails?.excelLoading,
      csvLoading: state?.formDetails?.csvLoading,
    }),
    shallowEqual
  )

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateChildForms"
  )

  const currentId = currentState?.currentId



  const dispatch = useDispatch();

  const print = async (value) => {

    let updatedQueryParams = {
      ...FormUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: true,
      parentId:currentId,
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

  }


    const switchModule = async (value) => {

    let updatedQueryParams = {
      ...FormUIProps.queryParams,
      moduleType: value,
      parentId:null
    
    };

   
    FormUIProps.setQueryParams(updatedQueryParams);

    await dispatch(actions.customfetchFormDetail(updatedQueryParams));

  }


  return (
    <>

      <Card>

        <CardHeader title={CurrentModuleName()} >

          <div className="d-flex justify-content-between align-items-center gap-3 m-4">



            <div className="pt-5">

              {/* <BanksFilter /> */}

            </div>

            <div className=" p-2">

              <CardHeaderToolbar>

<>
{
  FormUIProps.queryParams.moduleType == 2 ? (
    <button
      type="button"
      className="btn btn-secondary mr-2"
      onClick={() => switchModule(1)}
    >
      HRMS
    </button>
  ) : (
    <button
      type="button"
      className="btn btn-secondary mr-2"
      onClick={() => switchModule(2)}
    >
      Recruitment
    </button>
  )
}


</>

                {accessUser && currentId && (
                  <>

                  

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={FormUIProps.newFormButtonClick}
                    >
                      + Add General Setup
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

                          src={toAbsoluteUrl("/media/svg/icons/Communication/PDF.svg")}
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
                          src={toAbsoluteUrl("/media/svg/icons/Communication/CSV.svg")}
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
                          src={toAbsoluteUrl("/media/svg/icons/Communication/XLSX.svg")}
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



          <FormTable />

        </CardBody>

      </Card>
    </>
  )
}
