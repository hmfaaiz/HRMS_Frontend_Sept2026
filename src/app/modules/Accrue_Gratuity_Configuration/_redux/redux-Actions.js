import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {accrue_gratuity_configurationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = accrue_gratuity_configurationSlice;


export const fetchAccrueGratuityConfigs = (queryparm) => async (dispatch) => {
  
  return requestFromServer.getAllAccrueGratuityConfig(queryparm)
   
    .then((response) => {
    
   
      dispatch(actions.accrueGratuityConfigFetched(response));
    })
    .catch((error) => {
      
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAccrueGratuityConfig = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.AccrueGratuityConfigFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getAccrueGratuityConfigById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

    
      dispatch(actions.AccrueGratuityConfigFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteAccrueGratuityConfig = (id) => (dispatch) => {
  return requestFromServer
    .deleteAccrueGratuityConfig({ Id: id })
    .then((response) => {

      dispatch(actions.AccrueGratuityConfigDeleted({ Id: id }));
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


export const createAccrueGratuityConfig = (accrueGratuityConfigForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  return requestFromServer
    .createAccrueGratuityConfig(accrueGratuityConfigForCreation)
    .then((res) => {
      
      const user = res.data?.data;
     

      dispatch(actions.accrueGratuityConfigCreated(user));
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

export const updateAccrueGratuityConfig = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateAccrueGratuityConfig(user)
    .then((response) => {
  
      const updatedAccrueGratuityConfig = response?.config?.data; // response.data?.data;
    
      dispatch(actions.accrueGratuityConfigUpdated({ updatedAccrueGratuityConfig }));
    
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
