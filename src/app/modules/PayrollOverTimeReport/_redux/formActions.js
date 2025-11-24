import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { PayrollOvertimeSlice, callTypes } from "./formSlice"
const { actions } = PayrollOvertimeSlice;

export const fetchAllOvertimeReportForPdf = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer.getAllOvertimeReportForPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'p_overtime_report_by_fiscal_year.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.pdfFetched({}));
      dispatch(actions.pdfLoadingFetched({}));

      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "No data found to generate PDF";
      dispatch(actions.catchError({ error, callType: callTypes.pdf }));
      toast.error(error?.response?.status == 400 ? 'Please select filter to generate PDF' : error.clientMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
};

export const fetchAllOvertimeReportByMonthForPdf = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.monththPdf }));
  return requestFromServer.getAllOvertimeReportByMonthForPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'p_overtime_report_by_month.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.monththPdfFetched({}));
      dispatch(actions.pdfLoadingFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "No data found to generate PDF";
      dispatch(actions.catchError({ error, callType: callTypes.monththPdf }));
      toast.error(error?.response?.status == 400 ? 'Please select filter to generate PDF' : error.clientMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
};
