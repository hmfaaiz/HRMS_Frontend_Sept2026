import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { TicketTimeReportSlice, callTypes } from "./formSlice"
const { actions } = TicketTimeReportSlice;

export const fetchAllOvertimeReportForPdf = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer.getAllOvertimeReportForPdf({ ...filter, labels })
    .then((res) => {
         const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
         const pdfUrl = URL.createObjectURL(pdfBlob);
   
         // Trigger file download
         const link = document.createElement('a');
         link.href = pdfUrl;
         link.setAttribute('download', 'TicketTimeReport.xlsx');
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

export const fetchAllOvertimeReportByMonthForPdf = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.monththPdf }));
  return requestFromServer.getAllOvertimeReportByMonthForPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'Overtime_Detail_Report.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.monththPdfFetched({}));
      dispatch(actions.pdfLoadingFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "No data found to generate PDF";
      dispatch(actions.catchError({ error, callType: callTypes.monththPdf }));
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
