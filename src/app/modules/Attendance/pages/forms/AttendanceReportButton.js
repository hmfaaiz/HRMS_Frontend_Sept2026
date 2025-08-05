import React, { useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useFormUIContext } from "./FormUIContext";
import * as actions from "../../_redux/formActions";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";

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

  const { pdf2Loading, pdfLoading, csvLoading, excelLoading, listLoading,
    processLoading, consolidatedLoading, empWiseLoading } = useSelector(
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
        ...filterValues, // ✅ set actual form fields inside filter
      }, // ✅ Push filter values into context
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
        ...filterValues, // ✅ set actual form fields inside filter
      },
      csv: false,
      excel: false,
      pdf2: false,
      [value]: false,
    };

    FormUIProps.setQueryParams(updatedQueryParams);
  };

  return (
    <>
      <div className=" d-flex  justify-content-end mr-10">

        <div className="">
          <button
            type="button"
            className="att-file-button position-relative "
            // disabled={pdfLoading}
            disabled={pdfLoading || pdf2Loading || csvLoading || excelLoading || listLoading || processLoading || consolidatedLoading || empWiseLoading || !filterValues.from || !filterValues.to}
            onClick={() => print("pdf2")}
          >
            <span className="att-file-button">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/PDF.svg")} />
            </span>
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
        </div>
        <div className="">
          <button
            type="button"
            className="att-file-button position-relative"
            disabled={csvLoading || excelLoading || pdfLoading || pdf2Loading || listLoading || processLoading || consolidatedLoading || empWiseLoading || !filterValues.from || !filterValues.to}
            onClick={() => print("csv")}
          >
            <span className="att-file-button">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/CSV.svg")} />
            </span>
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
        </div>

        <div className="">
          <button
            type="button"
            className="att-file-button position-relative"
            disabled={excelLoading || listLoading || pdfLoading || pdf2Loading || processLoading || consolidatedLoading || empWiseLoading || !filterValues.from || !filterValues.to}
            onClick={() => print("excel")}
          >
            <span className="att-file-button">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/XLSX.svg")} />
            </span>

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

        </div>
      </div>
    </>
  );
};

export default ReportButton;
