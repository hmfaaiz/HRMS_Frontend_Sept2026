import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { EmpSalaryRevisionSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = EmpSalaryRevisionSlice;

// dropdown
export const fetchEmpForSalaryRevision = () => async (dispatch) => {

  // delete params?.openDeleteFormDialog

  return requestFromServer.getAllEmpForSalaryRevision()

    .then((response) => {

console.log("response111",response)
      dispatch(actions.empForSalaryRevisionFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
// salary from main table 
export const fetchCurrentEmpSalary = (employeeId) => (dispatch) => {


  if (!employeeId) {
    return dispatch(actions.EmpSalaryRevisionFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getCurrentEmpSalaryInfoByEmpId(employeeId)
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.EmpSalaryRevisionFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find record";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};




// insert
export const createEmpSalaryRev = (data, disbaleLoading, onHide) => (
  dispatch
) => {


  return requestFromServer
    .createEmpSalaryRev(data)
    .then((res) => {

      const user = res.data?.data;


      dispatch(actions.EmpSalaryRevisionCreated(user));
      disbaleLoading();
      fetchCurrentEmpSalary(data?.employeeId)
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
      error.clientMessage = "Can't create record";
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


// grid data
export const fetchAllPrevSalaryRevByEmpId = (body) => async (dispatch) => {

  // delete params?.openDeleteFormDialog

  return requestFromServer.getAllPrevSalaryRevByEmpId(body)

    .then((response) => {


      dispatch(actions.previousSalaryRevisionFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch previous salary revisions";
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

export const fetchPreviousEmpSalaryById = (Id) => (dispatch) => {


  if (!Id) {
    return dispatch(actions.EmpSalaryRevisionFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getAllEmpSalaryRevInfoById(Id)
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.EmpSalaryRevisionFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find record";
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



export const deleteEmpSalaryRevById = (Id) => (dispatch) => {

  return requestFromServer
    .deleteEmpSalaryRevInfoById(Id)
    .then((response) => {
    
      // dispatch(actions.deleteEmpSalaryRevInfoById({ Id: id }));
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



export const updateUserAccess = (mode) => (dispatch) => {
      dispatch(actions.updateUserAccess(mode));

};

export const clearPreviousSalaryRevisionFetched = () => (dispatch) => {
      dispatch(actions.clearPreviousSalaryRevisionFetched());

};