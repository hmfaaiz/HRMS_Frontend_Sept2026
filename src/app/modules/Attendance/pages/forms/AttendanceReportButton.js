import React, { useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useFormUIContext } from "./FormUIContext";
import * as actions from "../../_redux/formActions";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { formatDates } from "../../../../utils/common";

const ReportButton = (values) => {
  const filterValues = values?.values || {};
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

    const formattedFilterValues = {
    ...filterValues,
    from: filterValues.from ? formatDates(filterValues.from, "dd-MMM-yyyy") : null,
    to: filterValues.to ? formatDates(filterValues.to, "dd-MMM-yyyy") : null,
  };

  const {
    pdf2Loading,
    pdfLoading,
    csvLoading,
    excelLoading,
    listLoading,
    processLoading,
    consolidatedLoading,
    empWiseLoading,
  } = useSelector(
    (state) => ({
      pdf2Loading: state?.attendance?.pdf2Loading,
      pdfLoading: state?.attendance?.pdfLoading,
      csvLoading: state?.attendance?.csvLoading,
      excelLoading: state?.attendance?.excelLoading,
      listLoading: state.attendance.listLoading,
      processLoading: state.attendance.processLoading,
      consolidatedLoading: state.attendance.consolidatedLoading,
      empWiseLoading: state.attendance.empWiseLoading,
    }),
    shallowEqual
  );

  const print = async (value) => {
    let updatedQueryParams = {
      ...FormUIProps.queryParams,
      filter: {
        ...FormUIProps.queryParams.filter,
        // ...filterValues, 
        ...formattedFilterValues
      },
      csv: false,
      excel: false,
      pdf2: false,
      [value]: true,
    };

    FormUIProps.setQueryParams(updatedQueryParams);

    await dispatch(actions.fetchAttendanceReport(updatedQueryParams));

    updatedQueryParams = {
      ...FormUIProps.queryParams,
      filter: {
        ...FormUIProps.queryParams.filter,
        ...filterValues, 
      },
      csv: false,
      excel: false,
      pdf2: false,
      [value]: false,
    };

    FormUIProps.setQueryParams(updatedQueryParams);
  };

  return (
    <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm">
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Export PDF</Tooltip>}
      >
        <button
          type="button"
          className="border-none bg-transparent"
          // disabled={pdfLoading}
          disabled={
            pdfLoading ||
            pdf2Loading ||
            csvLoading ||
            excelLoading ||
            listLoading ||
            processLoading ||
            consolidatedLoading ||
            empWiseLoading ||
            !filterValues.from ||
            !filterValues.to
          }
          onClick={() => print("pdf2")}
        >
          <FileText className="w-4 h-4 text-black cursor-pointer" />

          {pdf2Loading && (
            <span
              className="spinner spinner-black"
              style={{
                position: "absolute",
                top: "50%",
                left: "45%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            ></span>
          )}
        </button>
      </OverlayTrigger>
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Export CSV</Tooltip>}
      >
        <button
          type="button"
          className="border-none bg-transparent"
          disabled={
            csvLoading ||
            excelLoading ||
            pdfLoading ||
            pdf2Loading ||
            listLoading ||
            processLoading ||
            consolidatedLoading ||
            empWiseLoading ||
            !filterValues.from ||
            !filterValues.to
          }
          onClick={() => print("csv")}
        >
          <FileSpreadsheet className="w-4 h-4 text-black cursor-pointer" />

          {csvLoading && (
            <span
              className="spinner spinner-black"
              style={{
                position: "absolute",
                top: "50%",
                left: "45%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            ></span>
          )}
        </button>
      </OverlayTrigger>

      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Export Excel</Tooltip>}
      >
        <button
          type="button"
          className="border-none bg-transparent"
          disabled={
            excelLoading ||
            listLoading ||
            pdfLoading ||
            pdf2Loading ||
            processLoading ||
            consolidatedLoading ||
            empWiseLoading ||
            !filterValues.from ||
            !filterValues.to
          }
          onClick={() => print("excel")}
        >
          <Sheet className="w-4 h-4 text-black cursor-pointer" />

          {excelLoading && (
            <span
              className="spinner spinner-black"
              style={{
                position: "absolute",
                top: "50%",
                left: "45%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            ></span>
          )}
        </button>
      </OverlayTrigger>
    </div>
  );
};

export default ReportButton;
