import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { EmpSalaryRevisionSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = EmpSalaryRevisionSlice;


export const fetchEmpForSalaryRevision = () => async (dispatch) => {

  // delete params?.openDeleteFormDialog

  return requestFromServer.getAllEmpForSalaryRevision()

    .then((response) => {

     
      dispatch(actions.empForSalaryRevisionFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchCurrentEmpSalary= (employeeId) => (dispatch) => {


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
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};





export const createEmpSalaryRev = (data, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createEmpSalaryRev(data)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.EmpSalaryRevisionCreated(user));
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


