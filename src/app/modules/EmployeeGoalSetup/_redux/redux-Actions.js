import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {EmployeeGoalSetupSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = EmployeeGoalSetupSlice;


export const fetchExitTypeExitReason = (queryparm) => async (dispatch) => {
  
  return requestFromServer.getAllAccrueGratuityConfig(queryparm)
   
    .then((response) => {
    
   
      dispatch(actions.accrueGratuityConfigFetched(response));
    })
    .catch((error) => {
      
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchExitTypeExitReasonDataForEdit = (body) => (dispatch) => {


  if (!body.employeeId || !body.appraisalPeriodId) {
    return dispatch(actions.AccrueGratuityConfigFetchedForEdit({ dataForEdit: undefined }));
  }

  return requestFromServer
    .getAccrueGratuityConfigById(body)
    .then((response) => {
      const entities = response.data?.data;

    
      dispatch(actions.AccrueGratuityConfigFetchedForEdit({ dataForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteExitTypeExitReason = (body) => (dispatch) => {
  return requestFromServer
    .deleteExitTypeExitReason( body)
    .then((response) => {

      dispatch(actions.AccrueGratuityConfigDeleted({ Id: body }));
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


export const createExitTypeExitReason = (accrueGratuityConfigForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  return requestFromServer
    .createExitTypeExitReason(accrueGratuityConfigForCreation)
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

export const updateExitTypeExitReason = (data, disbaleLoading, onHide) => (dispatch) => {

  return requestFromServer

    .updateExitTypeExitReason(data)
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


export const fetchDesignationWiseGoalSetupByEmp= (body) => (dispatch) => {


  if (!body.employeeId) {
    return dispatch(actions.DesignationWiseGoalSetupByEmpFetchedForEdit({ dataForEdit: undefined }));
  }

  return requestFromServer
    .getDesignationWiseGoalSetupByEmp(body)
    .then((response) => {
      const entities = response.data?.data;

    
      dispatch(actions.DesignationWiseGoalSetupByEmpFetchedForEdit({ dataForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};