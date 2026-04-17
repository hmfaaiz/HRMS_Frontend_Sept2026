import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { RosterWorkflowStatusSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = RosterWorkflowStatusSlice;

export const fetchRosterApprovalApplication = (
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
      .getAllRosterApproval(payload)
      .then((response) => {
        dispatch(actions.RosterApprovalApplicationFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Roster Workflow Data";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.RosterApprovalApplicationFetched({}));
  }
};

export const fetchRosterWorkflowById = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.RosterWorkflowStatusFetched(response.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.RosterWorkflowStatusFetched([]));
  }
};

export const handleRosterWorkflowRequest = (body, resetForm, setLoading) => () => {
  return requestFromServer
    .handleRosterRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      setLoading(false);
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Roster Workflow Request";
      setLoading(false);
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};