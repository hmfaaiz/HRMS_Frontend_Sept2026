import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual ,useDispatch} from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus, FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { fetchFinalSettlement } from "../../../_redux/redux-Actions";

export function FormCard() {
    const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector((state) => {
    return {
      userAccess: state.auth.userAccess.final_settlement,
    };
  }, shallowEqual);

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateFinalSettlement"
  );

  const { currentState,pdfLoading, csvLoading, excelLoading } = useSelector((state) => {
    return {
      currentState: state.final_settlement,
      userAccess: state?.auth?.userAccess["final_settlement"],
       pdfLoading: state?.final_settlement?.pdfLoading,
      csvLoading: state?.final_settlement?.csvLoading,
      excelLoading: state?.final_settlement?.excelLoading,
    };
  }, shallowEqual);

  // const { currentState } = useSelector();

  const { entities } = currentState;

    const print = async (value) => {
        let updatedQueryParams = {
          ...FormUIProps.queryParams,
          csv: false,
          excel: false,
          pdf: false,
          [value]: true,
        };
    
        // Set the updated queryParams
        FormUIProps.setQueryParams(updatedQueryParams);
    
        await dispatch(fetchFinalSettlement(FormUIProps.queryParams));
        updatedQueryParams = {
          ...FormUIProps.queryParams,
          csv: false,
          excel: false,
          pdf: false,
          [value]: false,
        };
    
        FormUIProps.setQueryParams(updatedQueryParams);
      };
    

  return (
  
    <TCard name={CurrentModuleName()}>
        <div className="grid md:grid-cols-7 justify-between  items-center gap-2 ">
                <div className="grid md:col-span-5"> 
                        <FormFIlter />
                      </div>
             <div className="flex md:col-span-2 items-center gap-2 md:justify-end  ">
          {/* <CardHeaderToolbar> */}
          {/* {accessUser && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={FormUIProps.newFormButtonClick}
              >
           
                <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            </>
          )} */}
             <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm ">
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
      <FormTable />
    </TCard>
    // </>
  );
}
