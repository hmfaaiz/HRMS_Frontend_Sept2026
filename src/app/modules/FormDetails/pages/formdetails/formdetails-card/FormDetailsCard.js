import React, { useMemo } from "react";
import { FormTable } from "../formdetails-table/FormDetailsTable";
import { useFormUIContext } from "../FormDetailsUIContext";
import { BanksFilter } from "../bank-filter/BanksFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import * as actions from "../../../_redux/formdetailsActions";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
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
      userAccess: state?.auth?.userAccess?.FormDetails,
      currentState: state?.formDetails,
      pdfLoading: state?.formDetails?.pdfLoading,
      excelLoading: state?.formDetails?.excelLoading,
      csvLoading: state?.formDetails?.csvLoading,
    }),
    shallowEqual
  );

  // const accessUser = userAccess.find(
  //   (item) => item.componentName === "CreateChildForms"
  // );

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

  const switchModule = async (value) => {
    let updatedQueryParams = {
      ...FormUIProps.queryParams,
      moduleType: value,
      parentId: null,
    };

    FormUIProps.setQueryParams(updatedQueryParams);

    await dispatch(actions.customfetchFormDetail(updatedQueryParams));
  };

  return (
    <>
      <TCard name={CurrentModuleName()}>
        <div className="flex justify-between items-center">
          <div>
            {/* {FormUIProps.queryParams.moduleType == 2 ? ( */}
            <button
              type="button"
              className={`btn mr-2 rounded-xl ${
                FormUIProps.queryParams.moduleType === 1
                  ? "bg-black text-white"
                  : "btn-secondary"
              }`}
              onClick={() => switchModule(1)}
            >
              Employee
            </button>
            {/* ) : ( */}
            <button
              type="button"
              className={`btn mr-2 rounded-xl ${
                FormUIProps.queryParams.moduleType === 2
                  ? "bg-black text-white"
                  : "btn-secondary"
              }`}
              onClick={() => switchModule(2)}
            >
              Recruitment
            </button>

            

               {/* <button
              type="button"
              className={`btn mr-2 rounded-xl ${
                FormUIProps.queryParams.moduleType === 3
                  ? "bg-black text-white"
                  : "btn-secondary"
              }`}
              onClick={() => switchModule(3)}
            >
              Appraisal
            </button> */}





            {/* )} */}


            
          </div>
          {/* <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {accessUser && currentId && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary mr-2"
                    onClick={FormUIProps.newFormButtonClick}
                  >
                    <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                    Add
                  </button>

                  <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm">
                    <OverlayTrigger
                      overlay={
                        <Tooltip id="products-edit-tooltip">Export PDF</Tooltip>
                      }
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
                      overlay={
                        <Tooltip id="products-edit-tooltip">Export CSV</Tooltip>
                      }
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
                        <Tooltip id="products-edit-tooltip">
                          Export Excel
                        </Tooltip>
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
                </>
              )}
            </div>
          </div> */}
        </div>
      </TCard>
      <FormTable />
    </>
  );
}
