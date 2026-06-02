import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {DepartmentWiseBudgetSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = DepartmentWiseBudgetSlice;


export const fetchDepartmentWiseBudgets = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllPolicyforNewYearBudget(queryparm)
   
    .then((response) => {
    

      dispatch(actions.policyforNewYearBudgetFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchDepartmentWiseBudget = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.PolicyforNewYearBudgetFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getPolicyforNewYearBudgetById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

   
      dispatch(actions.PolicyforNewYearBudgetFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteDepartmentWiseBudget = (id) => (dispatch) => {

  return requestFromServer
    .deleteDepartmentWiseBudget({ Id: id })
    .then((response) => {
    
      dispatch(actions.PolicyforNewYearBudgetDeleted({ Id: id }));
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



export const createPolicyforNewYearBudget = (holidayForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createPolicyforNewYearBudget(holidayForCreation)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.policyforNewYearBudgetCreated(user));
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

export const updatePolicyforNewYearBudget = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updatePolicyforNewYearBudget(user)
    .then((response) => {
  
      const updatedHoliday = response?.config?.data; // response.data?.data;
   
      dispatch(actions.policyforNewYearBudgetUpdated({ updatedHoliday }));
    
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
