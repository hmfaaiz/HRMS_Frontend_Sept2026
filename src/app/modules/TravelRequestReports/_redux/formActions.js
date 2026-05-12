import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { TravelRequestReportsSlice, callTypes } from "./TravelRequestReportsSlice";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = TravelRequestReportsSlice;


/**
 * 
 * Fetch Pdf from server
 * 
 * @param {Object} filter 
 * @param {Document} document 
 * @param {Object} labels 
 * @returns 
 */






export const fetchTravelRequestReport = (filter, document, labels = {}) => async (dispatch) => {

  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer.getTravelRequestReport({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'Travel_History.pdf');
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

export const fetchPendingApprovalTravelRequestReport = (filter, document, labels = {}) => async (dispatch) => {

  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer.getPendingApprovalTravelRequestReport({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'Pending_Travel_Requests.pdf');
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


