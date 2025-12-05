import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { ReimbursementRegisterSlice, callTypes } from "./ReimbursementRegisterSlice";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = ReimbursementRegisterSlice;


/**
 * 
 * Fetch Pdf from server
 * 
 * @param {Object} filter 
 * @param {Document} document 
 * @param {Object} labels 
 * @returns 
 */






export const fetchReimbursementReport = (filter, document, labels = {}) => async (dispatch) => {

  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer.getReimbursementReport({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'Reimbursement_Report.pdf');
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


