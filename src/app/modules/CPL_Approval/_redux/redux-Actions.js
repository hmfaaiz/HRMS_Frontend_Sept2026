import * as requestFromServer from "./redux-Crud";
import { CPLApprovalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = CPLApprovalSlice;

export const fetchAttendance = (queryparm) => async (dispatch) => {


  dispatch(actions.startCall({ callType: callTypes.list }));
  dispatch(actions.startLoader({ callType: callTypes.list }));

  return requestFromServer.getAllAttendanceSetup(queryparm)
    .then((response) => {
      dispatch(actions.AttendanceFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find record";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Can't find record", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
        link.setAttribute('download', 'Compensatory Leave Approval.pdf');
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
        link.setAttribute('download', 'Compensatory Leave Approval.csv');
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
        link.setAttribute('download', 'Compensatory Leave Approval.xlsx');
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

  }

  else {
    return
  }

};



export const runProcess = (values) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.process }));
  return requestFromServer
    .processAttendance(values)
    .then((response) => {
      dispatch(actions.stopCall({ callType: callTypes.process }));
      dispatch(actions.clearModifiedRows());
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




export const stopAllCalls = () => (dispatch) => {
  dispatch(actions.stopCall({ callType: callTypes.list }));

};