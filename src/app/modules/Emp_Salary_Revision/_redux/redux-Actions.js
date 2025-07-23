import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { EmpSalaryRevisionSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = EmpSalaryRevisionSlice;


export const fetchEmpSalaryRevision = (params) => async (dispatch) => {

  // delete params?.openDeleteFormDialog

  return requestFromServer.getAllEmpSalaryRevision(params)

    .then((response) => {

     
      dispatch(actions.empSalaryRevisionFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchmoduledata = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.EmpSalaryRevisionFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getEmpSalaryRevisionById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.EmpSalaryRevisionFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteEmpSalaryRevision= (id) => (dispatch) => {

  return requestFromServer
    .deleteEmpSalaryRevision({ Id: id })
    .then((response) => {

      dispatch(actions.EmpSalaryRevisionDeleted({ Id: id }));
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



export const createEmpSalaryRevision = (empSalaryRevisionForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  return requestFromServer
    .createEmpSalaryRevision(empSalaryRevisionForCreation)
    .then((res) => {

      const user = res.data?.data;


      dispatch(actions.empSalaryRevisionCreated(user));
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



export const updateEmpSalaryRevision = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateEmpSalaryRevision(user)
    .then((response) => {

      const updatedEmpSalaryRevision = response?.config?.data; // response.data?.data;


      dispatch(actions.clearUserForEdit());
      // dispatch(actions.empSalaryRevisionUpdated({ updatedEmpSalaryRevision }));

 
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