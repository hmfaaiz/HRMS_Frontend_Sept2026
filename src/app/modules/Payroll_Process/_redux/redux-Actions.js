import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { payroll_processSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = payroll_processSlice;


export const fetchPayrollProcess = (params) => async (dispatch) => {




  return requestFromServer.getAllPayrollProcess(params)

    .then((response) => {


      dispatch(actions.payrollProcessFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchmoduledata = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.PayrollProcessFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getPayrollProcessById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.PayrollProcessFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deletePayrollProcess = (id) => (dispatch) => {

  return requestFromServer
    .deletePayrollProcess({ Id: id })
    .then((response) => {

      dispatch(actions.PayrollProcessDeleted({ Id: id }));
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
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};


export const createPayrollProcess = (payrollProcessForCreation, disbaleLoading, onHide) => (
  dispatch
) => {
  dispatch(actions.checkPayroll_EmployeesByIdsFetched(null));
  return requestFromServer
    .createPayrollProcess(payrollProcessForCreation)
    .then((res) => {

      const result = res.data?.data;


      // dispatch(actions.payrollProcessCreated(user));
      dispatch(actions.resultAfterPayrollProcessFetched(result))
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
      // onHide();
   
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





export const updatePayrollProcess = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updatePayrollProcess(user)
    .then((response) => {

      const updatedPayrollProcess = response?.config?.data; // response.data?.data;


      dispatch(actions.clearUserForEdit());
      dispatch(actions.payrollProcessUpdated({ updatedPayrollProcess }));


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



export const fetchPayrollGroupDetails = (params) => async (dispatch) => {




  return requestFromServer.getAllPayrollGroupDetails(params)

    .then((response) => {
      dispatch(actions.payrollGroupDetailsFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};


export const checkPayroll_EmployeesByIds = (data) => async (dispatch) => {




  return requestFromServer.checkPayroll_EmployeesByIds(data)

    .then((response) => {
      dispatch(actions.checkPayroll_EmployeesByIdsFetched(response));
      
      if(response.data.data==true){
        toast.success(SERVER_MESSAGES.updatedSuccess, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
   
  
    })
    .catch((error) => {
      dispatch(actions.checkPayroll_EmployeesByIdsFetched(null));
      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const createPayrollStop_Salary = (data,setSelectedEmployees,disbaleLoading,onHide) => async (dispatch) => {

  return requestFromServer.createPayroll_Stop_Salary({data})

    .then((response) => {
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
      setSelectedEmployees([])
    })
    .catch((error) => {

      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
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


export const createPayrollStop_Loan = (data,setSelectedLoans,disbaleLoading,onHide) => async (dispatch) => {
 
  return requestFromServer.createPayroll_Stop_Loan({data})
 
    .then((response) => {
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
      setSelectedLoans([])
    })
    .catch((error) => {
 
      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
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

export const clearReduxData = () => async (dispatch) => {
  dispatch(actions.checkPayroll_EmployeesByIdsFetched(null));
  dispatch(actions.payrollGroupDetailsFetched(null));
  dispatch(actions.resultAfterPayrollProcessFetched(null));
}