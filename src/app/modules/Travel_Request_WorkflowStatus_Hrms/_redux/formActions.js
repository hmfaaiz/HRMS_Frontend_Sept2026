import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { TravelRequestWorkflowAdminSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = TravelRequestWorkflowAdminSlice;

export const fetchTravelApprovalApplication = (queryparm, employeeId) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllTravelApproval({ ...queryparm, employeeId })
    .then((response) => {
      let responseData = response?.data?.data;
      let rows = responseData?.rows || [];
      let uniqueData = [
        ...new Map(rows.map((item) => [item.parentRecordId, item])).values(),
      ];
      dispatch(actions.TravelApprovalApplicationFetched({
        entities: uniqueData,
        totalCount: responseData?.totalResults || uniqueData.length,
      }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Travel Data";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchTravelBalances = (employeeId) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (employeeId) {
    return requestFromServer
      .getAllTravelBalances({ employeeId })
      .then((response) => {
        dispatch(actions.TravelBalancesFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Travel Balances";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.TravelBalancesFetched([]));
  }
};

export const fetchTravelWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.TravelWorkflowStatusFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.TravelBalancesFetched([]));
  }
};

export const handleTravelRequest = (body, resetForm, setLoading) => () => {
  return requestFromServer
    .handleTravelRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      setLoading(false);
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Travel Approval Failed";
      toast.error(error?.response?.data?.message || error?.clientMessage);
      setLoading(false);
    });
};
