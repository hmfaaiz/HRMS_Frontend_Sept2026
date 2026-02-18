import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { ticketSetupSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = ticketSetupSlice;

// Fetch all tickets
export const fetchTickets = (queryParams) => async (dispatch) => {
  // PDF Export
  // PDF Export
  if (queryParams.pdf) {
    dispatch(actions.startCall({ callType: callTypes.pdf }));
    return requestFromServer
      .getAllTickets(queryParams)
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Trigger file download
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", "ticket_setup.pdf"); // Updated filename
        document.body.appendChild(link);
        link.click();
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        error.clientMessage = "Can't Generate PDF";
        dispatch(actions.catchError({ error, callType: callTypes.pdf }));
        toast.error(
          error?.response?.status == 400
            ? "Please select filter to generate PDF"
            : error.clientMessage,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined, // Fixed typo
          },
        );
      });
  }

  // CSV Export
  else if (queryParams.csv) {
    dispatch(actions.startCall({ callType: callTypes.csv }));
    return requestFromServer
      .getAllTickets(queryParams)
      .then((res) => {
        const csvBlob = new Blob([res.data], {
          type: "text/csv",
        });
        const csvUrl = URL.createObjectURL(csvBlob);

        // Trigger file download
        const link = document.createElement("a");
        link.href = csvUrl;
        link.setAttribute("download", "ticket_setup.csv"); // Updated filename
        document.body.appendChild(link);
        link.click();
        dispatch(actions.csvFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        error.clientMessage = "Can't Generate CSV";
        dispatch(actions.catchError({ error, callType: callTypes.csv }));
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

  // Excel Export
  else if (queryParams.excel) {
    dispatch(actions.startCall({ callType: callTypes.xlsx }));
    return requestFromServer
      .getAllTickets(queryParams)
      .then((res) => {
        const excelBlob = new Blob([res.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const excelUrl = URL.createObjectURL(excelBlob);

        // Trigger file download
        const link = document.createElement("a");
        link.href = excelUrl;
        link.setAttribute("download", "ticket_setup.xlsx"); // Updated filename
        document.body.appendChild(link);
        link.click();
        dispatch(actions.excelFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        error.clientMessage = "Can't Generate Excel";
        dispatch(actions.catchError({ error, callType: callTypes.xlsx }));
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
  // Normal Fetch
  else {
    dispatch(actions.startCall({ callType: callTypes.list }));
    return requestFromServer
      .getAllTickets(queryParams)
      .then((response) => {
        dispatch(actions.ticketsFetched(response.data?.data));
      })
      .catch((error) => {
        dispatch(actions.catchError({ error, callType: callTypes.list }));
        toast.error(error?.response?.data?.message || "Can't fetch tickets");
      });
  }
};

// Fetch ticket by ID
export const fetchTicket = (id) => async (dispatch) => {
  if (!id) {
    return dispatch(actions.ticketFetchedForEdit({ dataForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  try {
    const response = await requestFromServer.getTicketById({ Id: id });
    const ticket = response.data?.data;
    dispatch(actions.ticketFetchedForEdit({ dataForEdit: ticket }));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't find ticket");
  }
};

// Create ticket
export const createTicket = (
  ticketData,
  disableLoading,
  onHide,
  addMore,
  setValues,
) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.createTicket(ticketData);
    const ticket = res.data?.data;
    dispatch(actions.ticketCreated(ticket));
    disableLoading();
    if (addMore) {
      setValues({
        ...ticketData,
        ticketSummary: "",
        ticketDescription: "",
        dueDate: "",
        noOfHours: "",
        assignToEmpId: null,
        ticketStatusId: null,
      });
    } else {
      onHide();
    }
    toast.success(SERVER_MESSAGES.insertedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(error?.response?.data?.message || "Can't create ticket");
  }
};

// Update ticket
export const updateTicket = (ticketData, disableLoading, onHide) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.updateTicket(ticketData);
    dispatch(actions.ticketUpdated());
    disableLoading();
    onHide();
    toast.success(SERVER_MESSAGES.updatedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(error?.response?.data?.message || "Can't update ticket");
  }
};

// Delete ticket
export const deleteTicket = (id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    await requestFromServer.deleteTicket({ Id: id });
    dispatch(actions.ticketDeleted({ Id: id }));
    toast.success(SERVER_MESSAGES.deletedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't delete ticket");
  }
};

export const getLatestTicketNumBaseOnProjectId = (Id) => async () => {
  return await requestFromServer
    .getLatestTicketNumBaseOnProjectId({ Id })
    .then((response) => {
      return response?.data?.data;
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message);
    });
};

export const fetchTimeLogDetail = (Id) => async (dispatch) => {
  return await requestFromServer
    .getTimeLogDetail({ Id })
    .then((response) => {
      // return response?.data?.data;
      dispatch(actions.ticketTimeLogsFetched(response?.data?.data));
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message);
    });
};
