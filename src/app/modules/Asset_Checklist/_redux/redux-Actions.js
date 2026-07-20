import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {AssetChecklistSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = AssetChecklistSlice;


export const fetchAssetInspectionList = (queryparm) => async (dispatch) => {
  
  return requestFromServer.getAllAssetInspectionList(queryparm)
   
    .then((response) => {
    
   
      dispatch(actions.assetInspectionListFetched(response));
    })
    .catch((error) => {
      
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAssetInspectionListDataForEdit = (params) => (dispatch) => {
  console.log("params11111",params)
  if (!params) {
    return dispatch(
      actions.AssetInspectionListFetchedForEdit({
        dataForEdit: undefined,
      })
    );
  }

  return requestFromServer
    .getAssetInspectionListById(params)
    .then((response) => {
      const entities = response.data?.data;

      dispatch(
        actions.AssetInspectionListFetchedForEdit({
          dataForEdit: entities,
        })
      );
    })
    .catch((error) => {
      console.log("error11111", error);
      error.clientMessage = "Can't find record";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
       return dispatch(
      actions.AssetInspectionListFetchedForEdit({
        dataForEdit: undefined,
      })
    );
    });
};

export const deleteAssetInspectionList = (body) => (dispatch) => {
  console.log("body111111",body)
  return requestFromServer
    .deleteAssetInspectionList(body)
    .then((response) => {

      dispatch(actions.AssetInspectionListDeleted({ Id: body }));
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


export const createAssetInspectionList = (assetInspectionListForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  return requestFromServer
    .createAssetInspectionList(assetInspectionListForCreation)
    .then((res) => {
      
      const user = res.data?.data;
     

      dispatch(actions.assetInspectionListCreated(user));
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

export const updateAssetInspectionList = (data, disbaleLoading, onHide) => (dispatch) => {

  return requestFromServer

    .updateAssetInspectionList(data)
    .then((response) => {
  
      const updatedAssetInspectionList = response?.config?.data; // response.data?.data;
    
      dispatch(actions.assetInspectionListUpdated({ updatedAssetInspectionList }));
    
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

export const clearForm =()=>(dispatch)=>{
  console.log("hit11111")
  return dispatch(
      actions.AssetInspectionListFetchedForEdit({
        dataForEdit: undefined,
      })
    );

};