import { toast } from "react-toastify";
import { taskAssignmentTimelineSlice, callTypes } from "./redux-Slice";
import * as requestFromServer from "./redux-Crud";

const { actions } = taskAssignmentTimelineSlice;

// Fetch Task Assignment Timeline with filters, pagination & downloads
export const fetchTaskAssignmentTimeline = (queryParams) => async (dispatch) => {
  // ===== PDF =====
  if (queryParams.pdf) {
    dispatch(actions.startCall({ callType: callTypes.pdf }));
    return requestFromServer
      .getTaskAssignmentTimeline(queryParams)
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", "task_assignment_timeline.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        dispatch(actions.pdfFetched({}));
      })
      .catch((error) => {
        error.clientMessage = "Can't Generate PDF";
        dispatch(actions.catchError({ error, callType: callTypes.pdf }));
        toast.error(error?.clientMessage);
      });
  }

  // ===== CSV =====
  else if (queryParams.csv) {
    dispatch(actions.startCall({ callType: callTypes.csv }));
    return requestFromServer
      .getTaskAssignmentTimeline(queryParams)
      .then((res) => {
        const csvBlob = new Blob([res.data], { type: "text/csv" });
        const csvUrl = URL.createObjectURL(csvBlob);
        const link = document.createElement("a");
        link.href = csvUrl;
        link.setAttribute("download", "task_assignment_timeline.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        dispatch(actions.csvFetched({}));
      })
      .catch((error) => {
        error.clientMessage = "Can't Generate CSV";
        dispatch(actions.catchError({ error, callType: callTypes.csv }));
        toast.error(error?.clientMessage);
      });
  }

  // ===== EXCEL =====
  else if (queryParams.excel) {
    dispatch(actions.startCall({ callType: callTypes.xlsx }));
    return requestFromServer
      .getTaskAssignmentTimeline(queryParams)
      .then((res) => {
        const excelBlob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const excelUrl = URL.createObjectURL(excelBlob);
        const link = document.createElement("a");
        link.href = excelUrl;
        link.setAttribute("download", "task_assignment_timeline.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        dispatch(actions.excelFetched({}));
      })
      .catch((error) => {
        error.clientMessage = "Can't Generate Excel";
        dispatch(actions.catchError({ error, callType: callTypes.xlsx }));
        toast.error(error?.clientMessage);
      });
  }

  // ===== NORMAL LIST =====
  else {
    dispatch(actions.startCall({ callType: callTypes.list }));
    try {
      const response = await requestFromServer.getTaskAssignmentTimeline(queryParams);
      dispatch(actions.timelineFetched(response.data?.data));
    } catch (error) {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error(error?.response?.data?.message || "Can't fetch task assignment timeline");
    }
  }
};

export const clearTaskAssignmentTimeline = () => (dispatch) => {
  dispatch(actions.timelineCleared());
};


export const fetchAllFacilitatorTimeLogDetail = (body) => (dispatch) => {


  if (!body) {
    return dispatch(actions.FacilitatorTimeLogDetailFetched({ detailData: undefined }));
  }

  return requestFromServer
    .getAllFacilitatorTimeLogDetail(body)
    .then((response) => {
      const entities = response.data.data;
    
      dispatch(actions.FacilitatorTimeLogDetailFetched(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

