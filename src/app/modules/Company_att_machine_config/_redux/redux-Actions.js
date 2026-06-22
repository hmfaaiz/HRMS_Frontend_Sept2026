import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {CompanyAttMachineConfigSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = CompanyAttMachineConfigSlice;


export const fetchAttMachineConfigs = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllAttMachineConfig(queryparm)
   
    .then((response) => {
    

      dispatch(actions.attMachineConfigFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAttMachineConfig = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.AttMachineConfigFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getAttMachineConfigById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

   
      dispatch(actions.AttMachineConfigFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteAttMachineConfig = (id) => (dispatch) => {

  return requestFromServer
    .deleteAttMachineConfig({ Id: id })
    .then((response) => {
    
      dispatch(actions.AttMachineConfigDeleted({ Id: id }));
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




export const createAttMachineConfig = (CompanyAttendnaceMachineConfigurationForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createAttMachineConfig(CompanyAttendnaceMachineConfigurationForCreation)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.attMachineConfigCreated(user));
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

export const updateAttMachineConfig = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateAttMachineConfig(user)
    .then((response) => {
  
      const updatedAttMachineConfig = response?.config?.data;
   
      dispatch(actions.attMachineConfigUpdated({ updatedAttMachineConfig }));
    
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
