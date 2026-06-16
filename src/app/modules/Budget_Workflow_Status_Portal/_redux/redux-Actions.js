import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { BudgetWorkflowPortalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = BudgetWorkflowPortalSlice;

export const fetchBudgetApprovalApplication = (
  queryParam,
  employeeId
) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  if (employeeId) {
    const filter = queryParam?.filter || {};

    const payload = {
      approvalBelongTo: employeeId,
      requestBelongTo:  filter.requestRaisedFor || "",
      requestStatus:    filter.requestStatus    || "",
      reportingLevel:   filter.reportingLevel   || "",
      requestDate: {
        from: filter.requestDate?.from || "",
        to:   filter.requestDate?.to   || "",
      },
    };

    return requestFromServer
      .getAllBudgetApproval(payload)
      .then((response) => {
        dispatch(actions.BudgetApprovalApplicationFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Budget Workflow Data";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.BudgetApprovalApplicationFetched({}));
  }
};

export const fetchBudgetWorkflowById = (Id) => async (dispatch) => {
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

export const handleBudgetWorkflowRequest = (
  body,
  resetForm,
  setLoading
) => () => {
  return requestFromServer
    .handleBudgetRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      setLoading(false);
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Budget Workflow Request";
      setLoading(false);
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};