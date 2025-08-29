import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {loan_manag_confSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = loan_manag_confSlice;


export const fetchLoanManagConfigs = (queryparm) => async (dispatch) => {

 
  return requestFromServer.getAllLoanManagConfig(queryparm)

    .then((response) => {
   
  
      dispatch(actions.loanManagConfigFetched(response));
    })
    .catch((error) => {
  
      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchLoanManagConfig = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.LoanManagConfigForEdit({ userForEdit: undefined }));
  }


  return requestFromServer
    .getLoanManagConfigById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

  
      dispatch(actions.LoanManagConfigForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteLoanManagConfig = (id) => (dispatch) => {
  
  return requestFromServer
    .deleteLoanManagConfig({ Id: id })
    .then((response) => {
   
      dispatch(actions.LoanManagConfigDeleted({ Id: id }));
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


export const createLoanManagConfig = (loanManagConfigForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createLoanManagConfig(loanManagConfigForCreation)
    .then((res) => {
     
      const user = res.data?.data;
     

      dispatch(actions.loanManagConfigCreated(user));
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

export const updateLoanManagConfig = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateLoanManagConfig(user)
    .then((response) => {
     
      const updatedLoanManagConfig = response?.config?.data; // response.data?.data;
    
      dispatch(actions.loanManagConfigUpdated({ updatedLoanManagConfig }));
     
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

export const getAllLoanType = () => (

  dispatch
) => {

  return requestFromServer
    .getAllLoanType()
    .then((res) => {
  
      const user = res.data?.data;


      dispatch(actions.getLoanType(user));

      // toast.success("Successfully", {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
  
    })
    .catch((error) => {
      error.clientMessage = "Can't create user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));

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

export const deleteLoanManagConfigDetail = (data) => (dispatch) => {
  
  return requestFromServer
    .deleteLoanManagConfigDetail(data)
    .then((response) => {
   
     
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