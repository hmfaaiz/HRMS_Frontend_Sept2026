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
export const fetchPayrollRegister = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllPayrollRegisterSetup(queryparm)
    .then((response) => {
      dispatch(actions.PayrollRegisterFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Registered Payroll";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};


/**
 * 
 * Fetch Payslip from server
 * 
 * @param {Object} filter 
 * @param {Document} document 
 * @param {Object} labels 
 * @returns 
 */
export const generatePayslip = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer.generatePayslip({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'payslip.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.pdfFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't generate Payslip";
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      dispatch(actions.catchError({ error, callType: callTypes.pdf }));
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
  dispatch(actions.startCall({ callType: callTypes.register }));
  return requestFromServer.generatePdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'payroll_register.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.registerFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      error.clientMessage = "Can't generate Register";
      dispatch(actions.catchError({ error, callType: callTypes.register }));
      toast.error(error?.response?.status == 400 ? 'Please provide Subsidiary and Month' : jsonData?.message, {
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

/**
 * 
 * Fetch Payroll Register from server as xlsx
 * 
 * @param {Object} filter 
 * @param {Document} document 
 * @param {Object} labels 
 * @returns 
 */
export const generateRegisterExcel = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.registerExcel }));
  return requestFromServer.generateExcel({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'payroll_register.xlsx');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.registerExcelFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't generate Register";
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      dispatch(actions.catchError({ error, callType: callTypes.registerExcel }));
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
      link.setAttribute('download', 'New_Bank_Payment_Advice.xlsx');
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


export const generateRegisterJVExcel = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.registerGDExcel }));
  return requestFromServer.generateJVExcel({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'Payroll Expense Report.xlsx');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.registerGDExcelFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't Generate JV Report";
      const decodedData = new TextDecoder().decode(error?.response.data);
      const jsonData = JSON.parse(decodedData);
      dispatch(actions.catchError({ error, callType: callTypes.registerGDExcel }));
      toast.error(error?.response?.status == 400 ? 'Please provide Subsidiary and Month' : jsonData?.message, {
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


export const generateRegisterJVCreditExcel = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.registerGDExcel }));
  return requestFromServer.generateJVCreditExcel({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'Payroll Disbursement Report.xlsx');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.registerGDExcelFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't Generate JV Report";
      const decodedData = new TextDecoder().decode(error?.response.data);
      const jsonData = JSON.parse(decodedData);
      dispatch(actions.catchError({ error, callType: callTypes.registerGDExcel }));
      toast.error(error?.response?.status == 400 ? 'Please provide Subsidiary and Month' : jsonData?.message, {
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


//preview

export const fetchPreviewRegisterPdf = (filter, document, labels = {}) => async (dispatch) => {

  dispatch(actions.startCall({ callType: callTypes.registerPreview }));
  return requestFromServer.previewRegisterPdf({ ...filter, labels })
    .then((response) => {
      dispatch(actions.previewRegisterPdfFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find data";
      dispatch(actions.catchError({ error, callType: callTypes.registerPreview }));
    });
};



export const fetchPreviewPayslipPdf = (filter, document, labels = {}) => async (dispatch) => {

  dispatch(actions.startCall({ callType: callTypes.payslipPreview }));
  return requestFromServer.previewPayslipPdf({ ...filter, labels })
    .then((response) => {
      dispatch(actions.previewPayslipPdfFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find data";
      dispatch(actions.catchError({ error, callType: callTypes.payslipPreview }));
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
