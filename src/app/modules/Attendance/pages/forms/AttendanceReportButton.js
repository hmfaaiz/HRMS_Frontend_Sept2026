import React, { useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useFormUIContext } from "./FormUIContext";
import * as actions from "../../_redux/formActions";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";

const ReportButton = () => {
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  const { pdfLoading, csvLoading, excelLoading } = useSelector(
    (state) => ({
      pdfLoading: state?.attendance?.pdfLoading,
      csvLoading: state?.attendance?.csvLoading,
      excelLoading: state?.attendance?.excelLoading,
    }),
    shallowEqual
  );

  const print = async (value) => {
    let updatedQueryParams = {
      ...FormUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: true,
    };

    FormUIProps.setQueryParams(updatedQueryParams);
    await dispatch(actions.fetchAttendance(FormUIProps.queryParams));

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
    <>
    <div className=" d-flex  justify-content-end mr-10">


      <button
        type="button"
        className="att-file-button" 
        disabled={pdfLoading}
        onClick={() => print("pdf")}
      >
        <span className="att-file-button">
          <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/PDF.svg")} />
        </span>
      </button>

      <button
        type="button"
        className="att-file-button"
        disabled={csvLoading}
        onClick={() => print("csv")}
      >
        <span className="att-file-button">
          <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/CSV.svg")} />
        </span>
      </button>

      <button
        type="button"
        className="att-file-button"
        disabled={excelLoading}
        onClick={() => print("excel")}
      >
        <span className="att-file-button">
          <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/XLSX.svg")} />
        </span>
      </button>
        </div>
    </>
  );
};

export default ReportButton;
