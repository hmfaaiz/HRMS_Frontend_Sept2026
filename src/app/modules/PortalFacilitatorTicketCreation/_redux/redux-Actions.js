import * as requestFromServer from "./redux-Crud";
import { PortalFacilitatorTicketCreationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = PortalFacilitatorTicketCreationSlice;


export const fetchTicketCreations = (queryparm) => async (dispatch) => {



  return requestFromServer.getAllTicketCreation(queryparm)

    .then((response) => {


      dispatch(actions.ticketCreationFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchReceiveTickets = (queryparm) => async (dispatch) => {



  return requestFromServer.getAllReceiveTicket(queryparm)

    .then((response) => {


      dispatch(actions.receiveFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchTicketCreation = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.TicketCreationFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getTicketCreationById(id)
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.TicketCreationFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.userForEdit }));
    });
};



export const deleteTicketCreation = (id) => (dispatch) => {

  return requestFromServer
    .deleteTicketCreation(id)
    .then((response) => {

      dispatch(actions.TicketCreationDeleted({ Id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess, {
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
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error.response.data.message);
    });
};


export const deleteTimeLog = (id) => (dispatch) => {

  return requestFromServer
    .deleteTimeLog(id)
    .then((response) => {


      toast.success(SERVER_MESSAGES.deletedSuccess, {
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
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error.response.data.message);
    });
};



export const createTicketCreation = (ticketCreationForCreation, disbaleLoading, onHide) => (
  dispatch
) => {


  return requestFromServer
    .createTicketCreation(ticketCreationForCreation)
    .then((res) => {

      const user = res.data?.data;


      dispatch(actions.ticketCreationCreated(user));
      disbaleLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
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

export const updateTicketCreation = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateTicketCreation(user)
    .then((response) => {

      const updatedTicketCreation = response?.config?.data; // response.data?.data;

      dispatch(actions.ticketCreationUpdated({ updatedTicketCreation }));

      disbaleLoading();
      onHide();
      toast.success(response.data.message, {
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

      //error.clientMessage = "Can't update User"
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
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

export const fetchAllFacilitatorDetail = (Id) => (dispatch) => {


  if (!Id) {
    return dispatch(actions.FacilitatorDetailFetched({ detailData: undefined }));
  }

  return requestFromServer
    .getAllFacilitatorDetail(Id)
    .then((response) => {
      const entities = response.data.data;
     

      dispatch(actions.FacilitatorDetailFetched(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};



export const fetchAllFacilitatorTimeLogDetail = (Id) => (dispatch) => {


  if (!Id) {
    return dispatch(actions.FacilitatorTimeLogDetailFetched({ detailData: undefined }));
  }

  return requestFromServer
    .getAllFacilitatorTimeLogDetail(Id)
    .then((response) => {
      const entities = response.data.data.rows;
    
      dispatch(actions.FacilitatorTimeLogDetailFetched(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};



export const createTimeLog = (body, disbaleLoading, clearForm,onHide) => (
  dispatch
) => {


  return requestFromServer
    .createTimeLog(body)
    .then((res) => {

      const data = res.data?.data;
      disbaleLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      clearForm();
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
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


export const fetchTimeLog= (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.TimeLogFetchedForEdit({ timeLogForEdit: undefined }));
  }

  return requestFromServer
    .getTimeLog(id)
    .then((response) => {
      const entities = response.data?.data;

   
      dispatch(actions.TimeLogFetchedForEdit({ timeLogForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};


export const sendFollowUpMessage = (data, onHide) => (dispatch) => {
  return requestFromServer
    .sendFollowUpMessage(data)
    .then((response) => {
      onHide();
      toast.success(response.data?.data?.message, {
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

      //error.clientMessage = "Can't update User"
      dispatch(actions.catchError({ error, callType: callTypes.action }));

      onHide()
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