import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { PayrollGratuityReportSlice, callTypes } from "./formSlice";
const { actions } = PayrollGratuityReportSlice;

export const fetchAllGratuityForPdf = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.garuityReport }));
  return requestFromServer.getAllGratuityReportForPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'p_gratuity_report.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.garuityReportFetched({}));
      dispatch(actions.pdfLoadingFetched({}));

      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't generate PDF";
      dispatch(actions.catchError({ error, callType: callTypes.garuityReport }));
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

export const fetchAllGratuityReportByMonthForPdf = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.gratuityMonththPdf }));
  return requestFromServer.getAllGratuityDetailReportForPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'p_gratuity_detail_report.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.monthPdfFetched({}));
      dispatch(actions.pdfLoadingFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't generate PDF";
      dispatch(actions.catchError({ error, callType: callTypes.gratuityMonththPdf }));
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

export const fetchAllGratuityAccrualForPdf = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.gratuityAccrualPdf}));
  return requestFromServer.getAllGratuityAccrualPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'p_gratuity_accrual_report.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.gratuityAccrualPdfFetched({}));
      dispatch(actions.pdfLoadingFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't generate PDF";
      dispatch(actions.catchError({ error, callType: callTypes.gratuityAccrualPdf }));
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
