import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { employee_loan_requestSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = employee_loan_requestSlice;


export const fetchEmployeeLoanRequest = (params) => async (dispatch) => {

  // delete params?.openDeleteFormDialog

  return requestFromServer.getAllEmployeeLoanRequest(params)

    .then((response) => {

     
      dispatch(actions.employeeLoanRequestFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchmoduledata = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.EmployeeLoanRequestFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getEmployeeLoanRequestById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.EmployeeLoanRequestFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteEmployeeLoanRequest= (id) => (dispatch) => {

  return requestFromServer
    .deleteEmployeeLoanRequest({ Id: id })
    .then((response) => {

      dispatch(actions.EmployeeLoanRequestDeleted({ Id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      console.log("error1111",error.response.data.message);
      toast.error(error.response.data.message || SERVER_MESSAGES.deletedFail);
    });
};



export const createEmployeeLoanRequest = (employeeLoanRequestForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  return requestFromServer
    .createEmployeeLoanRequest(employeeLoanRequestForCreation)
    .then((res) => {

      const user = res.data?.data;


      dispatch(actions.employeeLoanRequestCreated(user));
      disbaleLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess, {
        position: "top-right",
        autoClose: 2000,
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
      onHide();
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


export const getAllLoanConfigDetail = (employeeId) => (

  dispatch
) => {

  return requestFromServer
    .getAllLoanConfigDetail(employeeId)
    .then((res) => {
   
      const user = res.data?.data;


      dispatch(actions.getLoanConfigDetails(user));

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
      dispatch(actions.getLoanConfigDetails(null));
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



export const updateEmployeeLoanRequest = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateEmployeeLoanRequest(user)
    .then((response) => {

      const updatedEmployeeLoanRequest = response?.config?.data; // response.data?.data;


      dispatch(actions.clearUserForEdit());
      // dispatch(actions.employeeLoanRequestUpdated({ updatedEmployeeLoanRequest }));

 
      disbaleLoading();
 
      toast.success(SERVER_MESSAGES.updatedSuccess, {
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

export const updateApprovedStatus = (data,disbaleLoading,onHide, resetForm) => (dispatch) => {

  return requestFromServer
    .updateApprovedStatus({data})
    .then((response) => {
      dispatch(actions.clearUserForEdit());
      // dispatch(actions.LoanApprovedStatusUpdated({ updateApprovedStatus }));

 
      disbaleLoading();
     
      toast.success(SERVER_MESSAGES.updatedSuccess, {
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