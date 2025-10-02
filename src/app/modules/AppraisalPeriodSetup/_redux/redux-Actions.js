import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {AppraisalPeriodsSetupSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = AppraisalPeriodsSetupSlice;


export const fetchAppraisals = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllAppraisal(queryparm)
   
    .then((response) => {
    

      dispatch(actions.appraisalFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAppraisal = (Id) => (dispatch) => {


  if (!Id) {
    return dispatch(actions.AppraisalFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getAppraisalById( Id)
    .then((response) => {
      const entities = response.data?.data;

   
      dispatch(actions.AppraisalFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteAppraisal = (Id) => (dispatch) => {

  return requestFromServer
    .deleteAppraisal(Id)
    .then((response) => {
    
      dispatch(actions.AppraisalDeleted({ Id}));
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





export const createAppraisal = (appraisalForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createAppraisal(appraisalForCreation)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.appraisalCreated(user));
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

export const updateAppraisal = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateAppraisal(user)
    .then((response) => {
  
      const updatedAppraisal = response?.config?.data; // response.data?.data;
   
      dispatch(actions.appraisalUpdated({ updatedAppraisal }));
    
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
