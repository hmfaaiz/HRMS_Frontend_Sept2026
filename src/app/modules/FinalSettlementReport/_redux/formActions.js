import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { FinalSettlementReportSlice, callTypes } from "./FinalSettlementReportSlice";
const { actions } = FinalSettlementReportSlice;




/**
 * 
 * Fetch Payroll Register from server as PDF
 * 
 * @param {Object} filter 
 * @param {Document} document 
 * @param {Object} labels 
 * @returns 
 */
export const generateRegisterPdf = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.payableSlip }));
  return requestFromServer.generatePdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'fs_payable_report.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.payableSlipFetched({}));
      dispatch(actions.pdfFetched({}));
      
      document.body.removeChild(link);
    })
    .catch((error) => {
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      error.clientMessage = "Can't generate Report";
      dispatch(actions.catchError({ error, callType: callTypes.payableSlip }));
      toast.error(error?.response?.status == 400 ? 'Please provide Employee' : jsonData?.message, {
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

export const generateIncomeTaxComputationReport = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.incomeTaxComputationSlip }));
  return requestFromServer.generateIncomeTaxComputationPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'fs_income_tax_computation_report.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.incomeTaxComputationSlipetched({}));
      document.body.removeChild(link);
      dispatch(actions.pdfFetched({}));
    })
    .catch((error) => {
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      error.clientMessage = "Can't generate Report";
      dispatch(actions.catchError({ error, callType: callTypes.incomeTaxComputationSlip }));
      toast.error(error?.response?.status == 400 ? 'Please provide Employee' : jsonData?.message, {
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


export const generateGratuityReport = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.gratuitySlip }));
  return requestFromServer.generateGratuityPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'fs_gratuity_report.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.gratuitySlipFetched({}));
      document.body.removeChild(link);
      dispatch(actions.pdfFetched({}));
    })
    .catch((error) => {
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      error.clientMessage = "Can't generate Report";
      dispatch(actions.catchError({ error, callType: callTypes.gratuitySlip }));
      toast.error(error?.response?.status == 400 ? 'Please provide Employee' : jsonData?.message, {
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



export const getProvidentFundReport = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.providentFundSlip }));
  return requestFromServer.getProvidentFundPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'fs_providentfund_report.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.providentFundSlipFetched({}));
      document.body.removeChild(link);
      dispatch(actions.pdfFetched({}));
    })
    .catch((error) => {
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      error.clientMessage = "Can't generate Report";
      dispatch(actions.catchError({ error, callType: callTypes.providentFundSlip }));
      toast.error(error?.response?.status == 400 ? 'Please provide Employee' : jsonData?.message, {
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



export const getAcknowledgmentLetter = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.acknowledgementLetter }));
  return requestFromServer.getAcknowledgmentLetterPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'acknowledgment_letter.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.acknowledgementLetterFetched({}));
      document.body.removeChild(link);
      dispatch(actions.pdfFetched({}));
    })
    .catch((error) => {
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      error.clientMessage = "Can't generate Report";
      dispatch(actions.catchError({ error, callType: callTypes.acknowledgementLetter }));
      toast.error(error?.response?.status == 400 ? 'Please provide Employee' : jsonData?.message, {
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

