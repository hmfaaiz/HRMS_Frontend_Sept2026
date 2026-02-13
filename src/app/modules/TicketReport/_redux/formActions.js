import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { TicketTimeReportSlice, callTypes } from "./formSlice"
const { actions } = TicketTimeReportSlice;

export const fetchAllTicketReportByFiltersForExcel = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer.getTicketReportByFilters({ ...filter, labels })
    .then((res) => {
         const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
         const pdfUrl = URL.createObjectURL(pdfBlob);
   
         // Trigger file download
         const link = document.createElement('a');
         link.href = pdfUrl;
         link.setAttribute('download', 'TicketTimeReport.xlsx');
         document.body.appendChild(link);
         link.click();
         dispatch(actions.pdfLoadingFetched({}));
         document.body.removeChild(link);
       })
       .catch((error) => {
         error.clientMessage = "Can't generate Register";
         const decodedData = new TextDecoder().decode(error.response.data);
         const jsonData = JSON.parse(decodedData);
         dispatch(actions.catchError({ error, callType: callTypes.registerExcel }));
         toast.error(error?.response?.status == 400 ? 'Please provide dates' : jsonData.message, {
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


export const fetchPreviewData = (body) => async (dispatch) => {
 if (new Date(body?.from_date) > new Date (body?.to_date)) {
      toast.error(SERVER_MESSAGES.correctDateRange)
    
      return;
    }

  return requestFromServer.getAllPreviewData(body)
   
    .then((response) => {
    
      console.log("response1111",response)
      dispatch(actions.previewDataFetched(response));
    
    })
    .catch((error) => {

   
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error(error.response?.data?.message);
    });
};
