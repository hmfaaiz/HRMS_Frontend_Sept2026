import React, { useMemo } from "react"

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"
import { DeptTable } from "../dept-table/DeptTable"
import { useDeptUIContext } from "../DeptUIContext"
import { DeptFilter } from "../dept-filter/DeptFIlter"
import { useSelector, shallowEqual,useDispatch } from "react-redux"
import * as actions from "../../../_redux/deptActions";
import SVG from "react-inlinesvg";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName"
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";

export function DeptCard() {
  const DeptUIContext = useDeptUIContext()

  const DeptUIProps = useMemo(() => {
    return {
      newDeptButtonClick: DeptUIContext.newDeptButtonClick,
      openEditDeptDialog: DeptUIContext.openEditDeptDialog,
      queryParams: DeptUIContext.queryParams,
      setQueryParams: DeptUIContext.setQueryParams

    }
  }, [DeptUIContext])

  const { userAccess ,pdfLoading, csvLoading, excelLoading} = useSelector(
    (state) =>
    ({
      userAccess: state.auth.userAccess.Department || [],
      pdfLoading: state?.dept?.pdfLoading,
      csvLoading: state?.dept?.csvLoading,
      excelLoading: state?.dept?.excelLoading,
    }),
    shallowEqual
  )


  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateDept"
  )


  const dispatch = useDispatch();
  const print = async (value) => {
 
     let updatedQueryParams = {
       ...DeptUIProps.queryParams,
       csv: false,
       excel: false,
       pdf: false,
       [value]: true,
     };
 
     // Set the updated queryParams
     DeptUIProps.setQueryParams(updatedQueryParams);
 
     await dispatch(actions.fetchUsers(DeptUIProps.queryParams));
     updatedQueryParams = {
       ...DeptUIProps.queryParams,
       csv: false,
       excel: false,
       pdf: false,
       [value]: false,
 
     };
 
     DeptUIProps.setQueryParams(updatedQueryParams);
 
   }
 

  return (
    <>


      <Card>

        <CardHeader title={CurrentModuleName()} >

          <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">



            <div className="col-6">

              <DeptFilter />

            </div>

            <div className=" p-2">

              <CardHeaderToolbar>



                {accessUser && (
<>
                  <button

                    type="button"

                    className="btn btn-primary"

                    onClick={DeptUIProps.newDeptButtonClick}

                  >

                    + Add Department

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



          <DeptTable />

        </CardBody>

      </Card>


    </>
  )
}
