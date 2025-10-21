import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {DesignationDepMapforExitClearanceSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = DesignationDepMapforExitClearanceSlice;


export const fetchDesignationDepMapForExitClearance = (queryparm) => async (dispatch) => {
  
  return requestFromServer.getAllDesignationMapForExitClearance(queryparm)
   
    .then((response) => {
    
   
      dispatch(actions.designationDepMapForExitClearanceFetched(response));
    })
    .catch((error) => {
      
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchDesignationDepMapForExitClearanceDataForEdit = (Id) => (dispatch) => {


  if (!Id) {
    return dispatch(actions.DesignationDepMapForExitClearanceFetchedForEdit({ dataForEdit: undefined }));
  }

  return requestFromServer
    .getDesignationMapForExitClearanceById(Id)
    .then((response) => {
      const entities = response.data?.data;

    
      dispatch(actions.DesignationDepMapForExitClearanceFetchedForEdit({ dataForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteDesignationDepMapForExitClearance = (id) => (dispatch) => {
  return requestFromServer
    .deleteDesignationDepMapForExitClearance({ Id: id })
    .then((response) => {

      dispatch(actions.DesignationDepMapForExitClearanceDeleted({ Id: id }));
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
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};


export const createDesignationDepMapForExitClearance = (accrueGratuityConfigForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  return requestFromServer
    .createDesignationDepMapForExitClearance(accrueGratuityConfigForCreation)
    .then((res) => {
      
      const user = res.data?.data;
     

      dispatch(actions.designationDepMapForExitClearanceCreated(user));
      disbaleLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess,{
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

export const updateDesignationDepMapForExitClearance = (data, disbaleLoading, onHide) => (dispatch) => {

  return requestFromServer

    .updateDesignationDepMapForExitClearance(data)
    .then((response) => {
  
      const updatedAccrueGratuityConfig = response?.config?.data; // response.data?.data;
    
      dispatch(actions.designationDepMapForExitClearanceUpdated({ updatedAccrueGratuityConfig }));
    
      disbaleLoading();
      onHide();
      toast.success(SERVER_MESSAGES.updatedSuccess, {
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
