import * as requestFromServer from "./redux-Crud";
import {CPLLeaveSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = CPLLeaveSlice;


export const fetchAssetRegisters = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllAssetRegister(queryparm)
   
    .then((response) => {
    

      dispatch(actions.assetRegisterFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAssetRegister = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.AssetRegisterFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getAssetRegisterById(id)
    .then((response) => {
      const entities = response.data?.data;

   
      dispatch(actions.AssetRegisterFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteAssetRegister = (id) => (dispatch) => {

  return requestFromServer
    .deleteAssetRegister( id)
    .then((response) => {
    
      dispatch(actions.AssetRegisterDeleted({ Id: id }));
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



export const createAssetRegister = (assetRegisterForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createAssetRegister(assetRegisterForCreation)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.assetRegisterCreated(user));
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

export const updateAssetRegister = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateAssetRegister(user)
    .then((response) => {
  
      const updatedAssetRegister = response?.config?.data; // response.data?.data;
   
      dispatch(actions.assetRegisterUpdated({ updatedAssetRegister }));
    
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

