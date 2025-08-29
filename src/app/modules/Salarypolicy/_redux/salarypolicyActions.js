import * as requestFromServer from "./salarypolicyCrud";
import { salarypolicySlice, callTypes } from "./salarypolicySlice";
import { toast } from "react-toastify";

const { actions } = salarypolicySlice;


export const fetchSalarypolicies = (queryparm) => async (dispatch) => {
  
  dispatch(actions.startCall({ callType: callTypes.list }));

  return requestFromServer.getAllSalarypolicy(queryparm)
    .then((response) => {

  
      dispatch(actions.salarypolicyFetched(response));
    })
    .catch((error) => {
  
      error.clientMessage = "Can't find receipts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchSalarypolicy = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.SalarypolicyFetchedForEdit({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getSalarypolicyById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

    
      dispatch(actions.SalarypolicyFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteSalarypolicy = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteSalarypolicy({ Id: id })
    .then((response) => {
    
      dispatch(actions.SalarypolicyDeleted({ Id: id }));
      toast.success("Successfully Deleted", {
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


export const createSalarypolicy = (salarypolicyForCreation, disbaleLoading, onHide) => (
  dispatch
) => {
  // salarypolicyForCreation.phNo = salarypolicyForCreation.phNo.toString();
  // salarypolicyForCreation.cnic = salarypolicyForCreation.cnic.toString();

  
  return requestFromServer
    .createSalarypolicy(salarypolicyForCreation)
    .then((res) => {
      dispatch(actions.startCall({ callType: callTypes.action }));
      const user = res.data?.data;
     
  
      dispatch(actions.salarypolicyCreated(user));
      disbaleLoading();
      toast.success("Successfully Created", {
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

export const updateSalarypolicy = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateSalarypolicy(user)
    .then((response) => {

      const updatedSalarypolicy = response?.config?.data; // response.data?.data;
  
      dispatch(actions.salarypolicyUpdated({ updatedSalarypolicy }));
      dispatch(actions.startCall({ callType: callTypes.action }));
      disbaleLoading();
      onHide();
      toast.success(response.data.message + " Updated", {
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

export const getCurrentMonth = () => (dispatch) => {


  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getCurrentMonth()
    .then((response) => {


      dispatch(actions.CurrentMonthFetched({ response }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
