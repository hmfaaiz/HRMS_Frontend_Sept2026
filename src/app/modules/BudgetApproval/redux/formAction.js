import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { BudgetApprovalSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = BudgetApprovalSlice;

export const fetchBudgetApprovalApplication = (
  queryparm,
  employeeId
) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer
      .getAllBudgetApproval({ ...queryparm, employeeId })
      .then((response) => {
        dispatch(actions.BudgetApprovalApplicationFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Budget Data";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.BudgetApprovalApplicationFetched({}));
  }
};



export const getEmployeeAuthorities = (empId) => (dispatch) => {
  return requestFromServer
    .getEmployeeAuthorties(empId, "457")
    .then((res) => {
      const data = Array.isArray(res.data?.data) ? res.data?.data : [];
      dispatch(actions.EmployeeAuthorityFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't Get Employee Authorities";
    });
};

export const fetchBudgetWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.BudgetWorkflowStatusFetched(response.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.BudgetWorkflowStatusFetched([]));
  }
};

export const handleBudgetRequest = (body, resetForm) => () => {
  return requestFromServer
    .handleBudgetRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Budget Request";
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};
