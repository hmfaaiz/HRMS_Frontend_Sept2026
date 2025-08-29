import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {gratuity_configurationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = gratuity_configurationSlice;


export const fetchGratuityConfigs = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllGratuityConfig(queryparm)
   
    .then((response) => {
    

      dispatch(actions.gratuityConfigFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchGratuityConfig = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.GratuityConfigFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getGratuityConfigById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

   
      dispatch(actions.GratuityConfigFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteGratuityConfig = (id) => (dispatch) => {

  return requestFromServer
    .deleteGratuityConfig({ Id: id })
    .then((response) => {
    
      dispatch(actions.GratuityConfigDeleted({ Id: id }));
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


export const createGratuityConfig = (gratuityConfigForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createGratuityConfig(gratuityConfigForCreation)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.gratuityConfigCreated(user));
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

export const updateGratuityConfig = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateGratuityConfig(user)
    .then((response) => {
  
      const updatedGratuityConfig = response?.config?.data; // response.data?.data;
   
      dispatch(actions.gratuityConfigUpdated({ updatedGratuityConfig }));
    
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
