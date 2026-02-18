import { toast } from "react-toastify";
import { projectTimelinePortalSlice, callTypes } from "./redux-Slice";
import * as requestFromServer from "./redux-Crud";

const { actions } = projectTimelinePortalSlice;

// Fetch project timeline tickets with filters & pagination
export const fetchProjectTimeline = (queryParams) => async (dispatch) => {

  // ===== PDF =====
  if (queryParams.pdf) {
    dispatch(actions.startCall({ callType: callTypes.pdf }));
    return requestFromServer
      .getProjectTimeline({...queryParams , isPortal : true})
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", "project_timeline.pdf");
        document.body.appendChild(link);
        link.click();
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
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
      .getProjectTimeline({...queryParams , isPortal : true})
      .then((res) => {
        const csvBlob = new Blob([res.data], { type: "text/csv" });
        const csvUrl = URL.createObjectURL(csvBlob);

        const link = document.createElement("a");
        link.href = csvUrl;
        link.setAttribute("download", "project_timeline.csv");
        document.body.appendChild(link);
        link.click();
        dispatch(actions.csvFetched({}));
        document.body.removeChild(link);
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
      .getProjectTimeline({...queryParams , isPortal : true})
      .then((res) => {
        const excelBlob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const excelUrl = URL.createObjectURL(excelBlob);

        const link = document.createElement("a");
        link.href = excelUrl;
        link.setAttribute("download", "project_timeline.xlsx");
        document.body.appendChild(link);
        link.click();
        dispatch(actions.excelFetched({}));
        document.body.removeChild(link);
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
      const response = await requestFromServer.getProjectTimeline({...queryParams , isPortal : true});
      dispatch(actions.timelineFetched(response.data?.data));
    } catch (error) {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error(error?.response?.data?.message || "Can't fetch project timeline");
    }
  }
};


// Update ticket statuses & types (bulk)
export const updateTicketStatuses = (updatedEntities, currentQueryParams) => async (dispatch) => {
  if (!updatedEntities.length) {
    toast.info("No changes to save.");
    return;
  }

  dispatch(actions.startCall({ callType: callTypes.update }));

  try {
    //payload: array of { Id, ticketStatusId, ticketTypeId, priority, assignToEmpId, reportToEmpId, dueDate }
    const updates = updatedEntities.map(entity => ({
      Id: entity.Id,
      ticketStatusId: entity.ticketStatusId,
      ticketTypeId: entity.ticketTypeId,
      priority: entity.priority, 
      assignToEmpId: entity.assignToEmpId,  
      reportToEmpId: entity.reportToEmpId, 
      dueDate: entity.dueDate,  
    }));

    await requestFromServer.updateTicketStatuses({ updates });
    dispatch(actions.ticketStatusesUpdated());
    toast.success("Tickets updated successfully!");

    // Refetch timeline with current query params
    if (currentQueryParams) {
      dispatch(fetchProjectTimeline(currentQueryParams));  
    }
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.update }));
    toast.error(error?.response?.data?.message || "Failed to update tickets");
  }
};

export const clearProjectTimeline = () => (dispatch) => {
  dispatch(actions.timelineCleared());
};
