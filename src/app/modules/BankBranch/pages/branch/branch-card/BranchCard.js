import React, { useMemo } from "react"
import SVG from "react-inlinesvg";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"
import { BranchTable } from "../branch-table/BranchTable"
import { useBranchUIContext } from "../BranchUIContext"
import { BranchFilter } from "../branch-filter/BranchFIlter"
import { useSelector, shallowEqual,useDispatch } from "react-redux"
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName"
import * as actions from "../../../_redux/branchActions";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers"

export function BranchCard() {
  const BranchUIContext = useBranchUIContext()

  const BranchUIProps = useMemo(() => {
    return {
      newBranchButtonClick: BranchUIContext.newBranchButtonClick,
      openEditBranchDialog: BranchUIContext.openEditBranchDialog,
      queryParams: BranchUIContext.queryParams,
      setQueryParams: BranchUIContext.setQueryParams,
    }
  }, [BranchUIContext])


  const { userAccess ,pdfLoading, csvLoading, excelLoading} = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Branch,
      pdfLoading: state.branch.pdfLoading,
      csvLoading: state.branch.csvLoading,
      excelLoading: state.branch.excelLoading,
    }),
    shallowEqual
  )

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateBranch"
  )
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

  }



  return (
    <>
      <Card>

        <CardHeader title={CurrentModuleName()} >

          <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">



            <div className="col-6">

              <BranchFilter />

            </div>

            <div className=" p-2">

              <CardHeaderToolbar>



                {accessUser && (
<> 
                  <button

                    type="button"

                    className="btn btn-primary"

                    onClick={BranchUIProps.newBranchButtonClick}

                  >

                    + Add Branch

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



          <BranchTable />

        </CardBody>

      </Card>

    </>
  )
}
