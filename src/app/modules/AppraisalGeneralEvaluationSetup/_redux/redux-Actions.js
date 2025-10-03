import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {GeneralEvaluationSetupSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = GeneralEvaluationSetupSlice;


export const fetchGeneralEvaluationSetups = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllGeneralEvaluationSetup(queryparm)
   
    .then((response) => {
    

      dispatch(actions.generalEvaluationSetupFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchGeneralEvaluationSetup = (Id) => (dispatch) => {


  if (!Id) {
    return dispatch(actions.generalEvaluationSetupFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getGeneralEvaluationSetupById( Id)
    .then((response) => {
      const entities = response.data?.data;

   
      dispatch(actions.generalEvaluationSetupFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteGeneralEvaluationSetup = (Id) => (dispatch) => {

  return requestFromServer
    .deleteGeneralEvaluationSetup(Id)
    .then((response) => {
    
      dispatch(actions.GeneralEvaluationSetupDeleted({ Id}));
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





export const createGeneralEvaluationSetup = (appraisalForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createGeneralEvaluationSetup(appraisalForCreation)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.generalEvaluationSetupCreated(user));
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

export const updateGeneralEvaluationSetup = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateGeneralEvaluationSetup(user)
    .then((response) => {
  
      const updatedAppraisal = response?.config?.data; // response.data?.data;
   
      dispatch(actions.generalEvaluationSetupUpdated({ updatedAppraisal }));
    
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
