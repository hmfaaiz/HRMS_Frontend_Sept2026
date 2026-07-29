import * as requestFromServer from "./redux-Crud";
import { CPLApprovalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { savingFields } from "../pages/forms/FormUIHelpers";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = CPLApprovalSlice;

/**
 * 
 * Fetch All Attendance Paginated from the server
 * 
 * @param {Object} queryparm 
 * @returns 
 */
export const fetchAttendance = (queryparm) => async (dispatch) => {


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

   if (queryparm.pdf2) {

     dispatch(actions.startCall({ callType: callTypes.pdf2 }));
     return requestFromServer.getAllAttendanceSetup(queryparm)
 
 
 
       .then((res) => {
        
         const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
         const pdfUrl = URL.createObjectURL(pdfBlob);
 
         // Trigger file download
         const link = document.createElement('a');
         link.href = pdfUrl;
         link.setAttribute('download', 'Attendance_Sheet.pdf');
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
         link.setAttribute('download', 'Attendance_Sheet.csv');
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
         link.setAttribute('download', 'Attendance_Sheet.xlsx');
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

/**
 * 
 * Fetch Single Attendance Record by Id
 * 
 * @param {string|number} id 
 * @returns
 */
export const fetchEditRecord = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.AttendanceFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAttendanceSetupById(id)
    .then((response) => {

      const entities = response.data?.data;
      dispatch(actions.AttendanceFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Attendance";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

/**
 * 
 * Fetch Single Attendance Record by Id
 * 
 * @param {string|number} id 
 * @returns
 */
export const fetchRecordByFilters = (filters) => (dispatch) => {
  if (!(filters.employeeId && filters.attDateIn)) {
    return dispatch(actions.AttendanceFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAttendanceSetupByFilters(filters)
    .then((response) => {

      const entities = response.data?.data;
      dispatch(actions.AttendanceFetchedForEdit({ userForEdit: entities || filters }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Attendance";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

/**
 * 
 * Save or update Attendance Record
 * 
 * @param {Object} data 
 * @param {String|Number|Null} id 
 * @param {Function} disableLoading 
 * @param {Function} onHide 
 * @returns 
 */
export const saveRecord = (data, disableLoading, initialValues) => (dispatch) => {
  const values = {};
  savingFields.forEach(key => values[key]= data[key])
  if (!data.Id) {
    return requestFromServer.createAttendanceSetup(values)
      .then((res) => {
        const AttendanceData = res.data?.data;
        if (AttendanceData) {
          dispatch(actions.AttendanceCreated(AttendanceData));
          disableLoading();
          toast.success(SERVER_MESSAGES.insertedSuccess, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        disableLoading();
        error.clientMessage = "Can't Create Attendance";
        toast.error(error?.response?.data?.message, {
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
    return requestFromServer.updateAttendanceSetup(values)
      .then((res) => {
        const AttendanceData = res.data?.data;
        if (AttendanceData) {
          dispatch(actions.AttendanceUpdated(AttendanceData));
          disableLoading();
          toast.success(SERVER_MESSAGES.updatedSuccess, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        disableLoading();
        error.clientMessage = "Can't Update Attendance";
        toast.error(error?.response?.data?.message, {
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
};

/**
 * 
 * Run Process
 * 
 * @param {Object} values 
 * @returns
 */
export const runProcess = (values) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.process }));
  return requestFromServer
    .processAttendance(values)
    .then((response) => {
      dispatch(actions.stopCall({ callType: callTypes.process }));
      toast.success(SERVER_MESSAGES.processSuccessful, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      error.clientMessage = "Can't process Attendance";
      dispatch(actions.catchError({ error, callType: callTypes.process }));
      toast.error(error?.response?.data?.message, {
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



//attendance sheet report
export const fetchAttendanceSheetConsolidated = (filters, document, labels = {},group_by_emp) => async (dispatch) => {

  // if (!(filters.employeeId && filters.attDateIn)) {
 
  //   return dispatch(actions.AttendanceFetchedForEdit(null));
  // }
if(group_by_emp){
  dispatch(actions.startCall({ callType: callTypes.empWise }));
}else{
  dispatch(actions.startCall({ callType: callTypes.consolidated }));
}
   
    return requestFromServer.getAttendanceSheetConsolidated({ ...filters, labels ,group_by_emp})



      .then((res) => {
      
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 'Attendance_Sheet.pdf');
        document.body.appendChild(link);
        link.click();
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
        dispatch(actions.catchError({callType: callTypes.consolidated }));
        dispatch(actions.catchError({callType: callTypes.empWise }));
      })


      .catch((error) => {
      
        error.clientMessage = SERVER_MESSAGES.pdfFail;
        dispatch(actions.catchError({ error, callType: callTypes.consolidated }));
        dispatch(actions.catchError({error,callType: callTypes.empWise }));
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

export const stopAllCalls=() => (dispatch) =>{
  dispatch(actions.stopCall({ callType: callTypes.list }));

};