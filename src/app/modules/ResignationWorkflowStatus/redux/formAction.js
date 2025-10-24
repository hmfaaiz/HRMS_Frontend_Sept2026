import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { ResignationWorkflowStatusSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = ResignationWorkflowStatusSlice;

export const fetchResignationApprovalApplication = (
  queryparm,
  employeeId
) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer
      .getAllResignationApproval({ ...queryparm, employeeId })
      .then((response) => {
        dispatch(actions.ResignationApprovalApplicationFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Leave Data";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.ResignationApprovalApplicationFetched({}));
  }
};


export const getEmployeeAuthorities = (empId) => (dispatch) => {
  return requestFromServer
    .getEmployeeAuthorties(empId, "567")
    .then((res) => {
      const data = Array.isArray(res.data?.data) ? res.data?.data : [];
      dispatch(actions.EmployeeAuthorityFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't Get Employee Authorities";
    });
};

export const fetchResignationWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.ResignationWorkflowStatusFetched(response.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.ResignationWorkflowStatusFetched([]));
  }
};

export const handleResignationRequest = (body, resetForm) => () => {
  return requestFromServer
    .handleResignationRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Resignation Request";
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};
