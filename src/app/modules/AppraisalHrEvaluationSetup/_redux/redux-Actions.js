import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {HrEvaluationSetupSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = HrEvaluationSetupSlice;


export const fetchHrEvaluationSetups = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllHrEvaluationSetup(queryparm)
   
    .then((response) => {
    

      dispatch(actions.hrEvaluationSetupFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchHrEvaluationSetup = (Id) => (dispatch) => {


  if (!Id) {
    return dispatch(actions.hrEvaluationSetupFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getHrEvaluationSetupById( Id)
    .then((response) => {
      const entities = response.data?.data;

   
      dispatch(actions.hrEvaluationSetupFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteHrEvaluationSetup = (Id) => (dispatch) => {

  return requestFromServer
    .deleteHrEvaluationSetup(Id)
    .then((response) => {
    
      dispatch(actions.HrEvaluationSetupDeleted({ Id}));
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





export const createHrEvaluationSetup = (appraisalForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createHrEvaluationSetup(appraisalForCreation)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.hrEvaluationSetupCreated(user));
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

export const updateHrEvaluationSetup = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateHrEvaluationSetup(user)
    .then((response) => {
  
      const updatedAppraisal = response?.config?.data; // response.data?.data;
   
      dispatch(actions.hrEvaluationSetupUpdated({ updatedAppraisal }));
    
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
