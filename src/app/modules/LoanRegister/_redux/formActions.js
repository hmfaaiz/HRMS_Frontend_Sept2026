import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { LoanRegisterSlice, callTypes } from "./EmployeeRegisterSlice";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = LoanRegisterSlice;


/**
 * 
 * Fetch Pdf from server
 * 
 * @param {Object} filter 
 * @param {Document} document 
 * @param {Object} labels 
 * @returns 
 */






export const fetchLoanReqReport = (filter, document, labels = {}) => async (dispatch) => {

  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer.getLoanReqReport({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'loan_request_report.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.pdfFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = SERVER_MESSAGES.pdfFail;
      dispatch(actions.catchError({ error, callType: callTypes.pdf }));
      toast.error( error.clientMessage, {
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


export const fetchLoanPositionReport = (filter, document, labels = {}) => async (dispatch) => {

  dispatch(actions.startCall({ callType: callTypes.position_report }));

  return requestFromServer.getLoanPositionReport({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'loan_position_report.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.pdfLoanPositionFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = SERVER_MESSAGES.pdfFail;
      dispatch(actions.catchError({ error, callType: callTypes.position_report }));
      toast.error( error.clientMessage, {
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
