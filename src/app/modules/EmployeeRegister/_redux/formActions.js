import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { EmployeeRegisterSlice, callTypes } from "./EmployeeRegisterSlice";
const { actions } = EmployeeRegisterSlice;

/**
 * 
 * Fetch All Registered Employees Paginated from the server
 * 
 * @param {Object} queryparm 
 * @returns 
 */
export const fetchEmployeeRegister = (queryparm) => async (dispatch) => {
 
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllEmployeeRegisterSetup(queryparm)
    .then((response) => {
      dispatch(actions.EmployeeRegisterFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Registered Employees";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};


/**
 * 
 * Fetch Pdf from server
 * 
 * @param {Object} filter 
 * @param {Document} document 
 * @param {Object} labels 
 * @returns 
 */
export const fetchPdfData = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer.getAllEmployeeRegisterForPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'Employee_Register.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.pdfFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't Generate PDF";
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



export const generateRegisterExcel = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.registerExcel }));
  return requestFromServer.generateExcel({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'employee_register.xlsx');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.registerExcelFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't Generate Excel";
      const decodedData = new TextDecoder().decode(error?.response?.data);
      const jsonData = JSON.parse(decodedData);
      // dispatch(actions.catchError({ error, callType: callTypes.registerExcel }));
      toast.error(error?.clientMessage, {
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