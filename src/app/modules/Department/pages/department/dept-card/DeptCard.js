import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { DeptTable } from "../dept-table/DeptTable";
import { useDeptUIContext } from "../DeptUIContext";
import { DeptFilter } from "../dept-filter/DeptFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import * as actions from "../../../_redux/deptActions";
import SVG from "react-inlinesvg";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus, FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export function DeptCard() {
  const DeptUIContext = useDeptUIContext();

  const DeptUIProps = useMemo(() => {
    return {
      newDeptButtonClick: DeptUIContext.newDeptButtonClick,
      openEditDeptDialog: DeptUIContext.openEditDeptDialog,
      queryParams: DeptUIContext.queryParams,
      setQueryParams: DeptUIContext.setQueryParams,
    };
  }, [DeptUIContext]);

  const { userAccess, pdfLoading, csvLoading, excelLoading } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Department || [],
      pdfLoading: state?.dept?.pdfLoading,
      csvLoading: state?.dept?.csvLoading,
      excelLoading: state?.dept?.excelLoading,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateDept"
  );

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
  };

  return (
    <>
      <TCard name={CurrentModuleName()}>
        <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
          <DeptFilter />
          <div className="flex items-center gap-2">
            {/* <CardHeaderToolbar> */}
            {accessUser && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={DeptUIProps.newDeptButtonClick}
                >
  
               <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                  Add
                </button>
              </>
            )}
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
        <DeptTable />
      </TCard>
    </>
  );
}
