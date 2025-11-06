import * as requestFromServer from "./formCrud";
import { AttendanceSummarySlice, callTypes } from "./AttendanceSlice";
import { toast } from "react-toastify";
import { savingFields } from "../pages/forms/FormUIHelpers";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = AttendanceSummarySlice;

/**
 * 
 * Fetch All Attendance Paginated from the server
 * 
 * @param {Object} queryparm 
 * @returns 
 */
export const fetchAttendance = (queryparm) => async (dispatch) => {

    if(!queryparm.filter.payroll_monthId){
    return;
  }

  dispatch(actions.startCall({ callType: callTypes.list }));
  dispatch(actions.startLoader({ callType: callTypes.list }));
  
  return requestFromServer.getAllAttendanceSetup(queryparm)
    .then((response) => {
      dispatch(actions.AttendanceFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Attendances";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
  // }
};

export const fetchAttendanceReport = (queryparm) => async (dispatch) => {

  if(!queryparm.filter.payroll_monthId){
    return;
  }

   if (queryparm.pdf2) {

     dispatch(actions.startCall({ callType: callTypes.pdf2 }));
     return requestFromServer.getAllAttendanceSetup(queryparm)
 
 
 
       .then((res) => {
        
         const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
         const pdfUrl = URL.createObjectURL(pdfBlob);
 
         // Trigger file download
         const link = document.createElement('a');
         link.href = pdfUrl;
         link.setAttribute('download', 't_attendance.pdf');
         document.body.appendChild(link);
         link.click();
         dispatch(actions.pdf2Fetched({}));
         document.body.removeChild(link);
       
       })
 
 
       .catch((error) => {
       
         error.clientMessage = "Can't Generate PDF";
         dispatch(actions.catchError({ error, callType: callTypes.pdf2 }));
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
 
   }
 
  else if (queryparm.csv) {
 
     dispatch(actions.startCall({ callType: callTypes.csv }));
     return requestFromServer.getAllAttendanceSetup(queryparm)
 
 
 
    .then((res) => {
         const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
         const pdfUrl = URL.createObjectURL(pdfBlob);
   
         // Trigger file download
         const link = document.createElement('a');
         link.href = pdfUrl;
         link.setAttribute('download', 't_attendance.csv');
         document.body.appendChild(link);
         link.click();
         dispatch(actions.csvFetched({}));
         dispatch(actions.pdfFetched({}));
         document.body.removeChild(link);
       })
       .catch((error) => {
         error.clientMessage = "Can't Generate CSV";
         const decodedData = new TextDecoder().decode(error?.response?.data);
         const jsonData = JSON.parse(decodedData);
         // dispatch(actions.catchError({ error, callType: callTypes.registerExcel }));
         toast.error( error?.clientMessage, {
           position: "top-right",
           autoClose: 5000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
         });
       });
 
   }
 
 
   else if (queryparm.excel) {
  
     dispatch(actions.startCall({ callType: callTypes.xlsx }));
   
     return requestFromServer.getAllAttendanceSetup(queryparm)
 
 
 
    .then((res) => {
         const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
         const pdfUrl = URL.createObjectURL(pdfBlob);
   
         // Trigger file download
         const link = document.createElement('a');
         link.href = pdfUrl;
         link.setAttribute('download', 't_attendance.xlsx');
         document.body.appendChild(link);
         link.click();
         dispatch(actions.excelFetched({}));
         dispatch(actions.pdfFetched({}));
         document.body.removeChild(link);
       })
       .catch((error) => {
         error.clientMessage = "Can't Generate Excel";
         const decodedData = new TextDecoder().decode(error?.response?.data);
         const jsonData = JSON.parse(decodedData);
         // dispatch(actions.catchError({ error, callType: callTypes.registerExcel }));
         toast.error( error?.clientMessage, {
           position: "top-right",
           autoClose: 5000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
         });
       });
 
   }
 
   else {
    return
   }

};

export const getPayrollMonth = (employeeId) => (dispatch) => {
  if (!employeeId) {
    dispatch(actions.PayrollMonthFetched({ payrollData: null }));
  }
  else {
    return requestFromServer.getPayrollMonth({ employeeId })
      .then((res) => {
        const payrollData = res.data?.data;
        dispatch(actions.PayrollMonthFetched({ payrollData }));
      })
      .catch((error) => {
        dispatch(actions.PayrollMonthFetched({ payrollData: null }));
        error.clientMessage = "Can't Get Payroll Data";
      });
  }
}


export const stopAllCalls=() => (dispatch) =>{
  dispatch(actions.stopCall({ callType: callTypes.list }));

};