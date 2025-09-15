import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { LoanWorkflowAdminSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = LoanWorkflowAdminSlice;

export const fetchLoanApprovalApplication = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllLoanApproval(queryparm)
    .then((response) => {
      let data = response?.data?.data;
      data = [
        ...new Map(data?.map((item) => [item?.parentRecordId, item]))?.values(),
      ];
      dispatch(actions.LoanApprovalApplicationFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Loan Data";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchLoanWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.LoanWorkflowStatusFetched(response.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.LoanWorkflowStatusFetched([]));
  }
};

export const handleLoanRequest = (body, resetForm, setLoading) => () => {
  return requestFromServer
    .handleLoanRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      setLoading(false);
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Loan Request";
      setLoading(false);
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};
