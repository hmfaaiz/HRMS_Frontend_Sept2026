import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {tax_slabSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = tax_slabSlice;


export const fetchIncomeTaxSlabs = (queryparm) => async (dispatch) => {


  return requestFromServer.getAllIncomeTaxSlab(queryparm)
   
    .then((response) => {
    

      dispatch(actions.incomeTaxSlabFetched(response));
    })
    .catch((error) => {
   
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchIncomeTaxSlab = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.IncomeTaxSlabFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getIncomeTaxSlabById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

  
      dispatch(actions.IncomeTaxSlabFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteIncomeTaxSlab = (id) => (dispatch) => {
  return requestFromServer
    .deleteIncomeTaxSlab({ Id: id })
    .then((response) => {
    
      dispatch(actions.IncomeTaxSlabDeleted({ Id: id }));
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


export const createIncomeTaxSlab = (incomeTaxSlabForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createIncomeTaxSlab(incomeTaxSlabForCreation)
    .then((res) => {
      const user = res.data?.data;
     

      dispatch(actions.incomeTaxSlabCreated(user));
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

export const updateIncomeTaxSlab = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateIncomeTaxSlab(user)
    .then((response) => {
   
      const updatedIncomeTaxSlab = response?.config?.data; // response.data?.data;
    
      dispatch(actions.incomeTaxSlabUpdated({ updatedIncomeTaxSlab }));
    
      disbaleLoading();
      onHide();
      toast.success(SERVER_MESSAGES.updatedSuccess,{
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


export const fetchgetAllTaxYearSetup = () => async (dispatch) => {

  
  return requestFromServer.getAllTaxYearSetup()
   
    .then((response) => {
    

      dispatch(actions.getAllTaxYearSetupFetched(response));
    })
    .catch((error) => {
   
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
