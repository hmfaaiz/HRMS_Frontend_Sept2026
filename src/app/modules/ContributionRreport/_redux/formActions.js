import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { ContributionReportSlice, callTypes } from "./ContributionReportSlice";
const { actions } = ContributionReportSlice;

export const fetchAllEOBIContributionSummaryForPdf = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer.getAllEOBIContributionSummaryForPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'eobi_contribution_summary.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.pdfFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't generate PDF";
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

export const fetchAllSocialSecurityContributionSummaryForPdf = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer.getAllSocialSecurityContributionSummaryForPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'social_security_contribution_summary.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.pdfFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't generate PDF";
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
