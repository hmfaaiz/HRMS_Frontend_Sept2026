import * as requestFromServer from "./redux-Crud";
import {FacilitatorTicketCreationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = FacilitatorTicketCreationSlice;


export const fetchEmployeeDocs = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllEmployeeDoc(queryparm)
   
    .then((response) => {
    

      dispatch(actions.employeeDocFetched(response));
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

export const fetchEmployeeDoc = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.EmployeeDocFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getEmployeeDocById(id)
    .then((response) => {
      const entities = response.data?.data;

   
      dispatch(actions.EmployeeDocFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteEmployeeDoc = (id) => (dispatch) => {

  return requestFromServer
    .deleteEmployeeDoc( id)
    .then((response) => {
    
      dispatch(actions.EmployeeDocDeleted({ Id: id }));
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



export const createEmployeeDoc = (employeeDocForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createEmployeeDoc(employeeDocForCreation)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.employeeDocCreated(user));
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

export const updateEmployeeDoc = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateEmployeeDoc(user)
    .then((response) => {
  
      const updatedEmployeeDoc = response?.config?.data; // response.data?.data;
   
      dispatch(actions.employeeDocUpdated({ updatedEmployeeDoc }));
    
      disbaleLoading();
      onHide();
      toast.success(response.data.message , {
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
