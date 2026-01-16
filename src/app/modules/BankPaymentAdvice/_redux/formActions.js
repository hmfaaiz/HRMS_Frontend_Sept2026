import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { BankPaymentAdviceSlice, callTypes } from "./formSlice"
const { actions } = BankPaymentAdviceSlice;

/**
 * 
 * Fetch All Registered Payroll Paginated from the server
 * 
 * @param {Object} queryparm 
 * @returns 
 */


/**
 * 
 * Fetch Payslip from server
 * 
 * @param {Object} filter 
 * @param {Document} document 
 * @param {Object} labels 
 * @returns 
 */



/**
 * 
 * Fetch Payroll Register from server as PDF
 * 
 * @param {Object} filter 
 * @param {Document} document 
 * @param {Object} labels 
 * @returns 
 */


/**
 * 
 * Fetch Payroll Register from server as xlsx
 * 
 * @param {Object} filter 
 * @param {Document} document 
 * @param {Object} labels 
 * @returns 
 */


/**
 * 
 * Fetch Bank Advice from server as xlsx
 * 
 * @param {Object} filter 
 * @param {Document} document 
 * @param {Object} labels 
 * @returns 
 */

export const generateNewBankAdvice = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.bankAdvice }));
  return requestFromServer.generateNewBankAdvice({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'Bank_Payment_Advice_(Dynasoft).xlsx');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.adviceFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't generate Advice";
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      dispatch(actions.catchError({ error, callType: callTypes.bankAdvice }));
      toast.error(error?.response?.status == 400 ? 'Please provide Subsidiary and Month' : jsonData.message, {
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


export const generateBankAdvice = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.bankAdvice }));
  return requestFromServer.generateBankAdvice({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'Bank_Payment_Advice.xlsx');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.adviceFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't generate Advice";
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      dispatch(actions.catchError({ error, callType: callTypes.bankAdvice }));
      toast.error(error?.response?.status == 400 ? 'Please provide Subsidiary and Month' : jsonData.message, {
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










export const generateDubaiBankAdviceCSV = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.bankAdvice }));
  return requestFromServer.generateDubaiBankAdvice({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'bank_advice.txt');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.adviceFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't generate Advice";
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      dispatch(actions.catchError({ error, callType: callTypes.bankAdvice }));
      toast.error(error?.response?.status == 400 ? 'Please provide Subsidiary and Month' : jsonData.message, {
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
