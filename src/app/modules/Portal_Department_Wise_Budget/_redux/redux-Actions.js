import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {PortalDepartmentWiseBudgetSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = PortalDepartmentWiseBudgetSlice;


export const fetchDepartmentWiseBudgets = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllDepartmentWiseBudget(queryparm)
   
    .then((response) => {
    

      dispatch(actions.departmentWiseBudgetFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchDepartmentWiseBudget = (body) => (dispatch) => {


  if (!body.subsidiaryId || !body.budgetYearId || !body.departmentId) {
    return dispatch(actions.departmentWiseBudgetFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getDepartmentWiseBudgetById(body)
    .then((response) => {
      const entities = response.data.data;

 
   if(entities?.data?.length > 0){
    dispatch(actions.departmentWiseBudgetFetchedForEdit({ userForEdit: entities }));
   }
    
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteDepartmentWiseBudget = (body) => (dispatch) => {

  return requestFromServer
    .deleteDepartmentWiseBudget(body)
    .then((response) => {
    
      dispatch(actions.DepartmentWiseBudgetDeleted(body));
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



export const createDepartmentWiseBudget = (body, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createDepartmentWiseBudget(body)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.departmentWiseBudgetCreated(user));
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

export const updateDepartmentWiseBudget = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateDepartmentWiseBudget(user)
    .then((response) => {
  
      const updatedHoliday = response?.config?.data; // response.data?.data;
   
      dispatch(actions.departmentWiseBudgetUpdated({ updatedHoliday }));
    
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


export const getEmployeeAuthorities = (empId) => (dispatch) => {
  return requestFromServer
    .getEmployeeAuthorties(empId, "654")
    .then((res) => {
      const data = Array.isArray(res.data?.data?.data)
        ? res.data?.data?.data
        : [];
      const isPolicyExists = res.data?.data?.isPolicyExists || false;
      dispatch(actions.EmployeeAuthorityFetched({ data, isPolicyExists }));
    })
    .catch((error) => {
      error.clientMessage = "Can't Get Employee Authorities";
    });
};