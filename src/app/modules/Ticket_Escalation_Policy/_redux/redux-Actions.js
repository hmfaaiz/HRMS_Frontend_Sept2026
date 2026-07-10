import * as requestFromServer from "./redux-Crud";
import { ticketEscalationPolicySlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = ticketEscalationPolicySlice;

// Fetch all escalation policies
export const fetchTicketEscalationPolicies = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllTicketEscalationPolicy(queryParams)
    .then((response) => {
      dispatch(actions.ticket_escalation_policy_Fetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch escalation policies";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

// Fetch single policy by Id
export const fetchTicketEscalationPolicy = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.ticket_escalation_policy_FetchedForEdit(undefined));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return requestFromServer.getTicketEscalationPolicyById(id)
    .then((response) => {
      const entity = response.data?.data;
      dispatch(actions.ticket_escalation_policy_FetchedForEdit(entity));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch escalation policy details";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

// Create
export const createTicketEscalationPolicy = (data, disableLoading, onHide) => (dispatch) => {
  return requestFromServer.createTicketEscalationPolicy(data)
    .then((res) => {
      dispatch(actions.ticket_escalation_policy_Created(res.data.data));
      disableLoading();
      toast.success("Escalation policy created successfully", {
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
      error.clientMessage = "Can't create escalation policy";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disableLoading();
      toast.error(error?.response?.data?.message || "Creation failed", {
        position: "top-right",
        autoClose: 5000,
      });
    });
};

// Update
export const updateTicketEscalationPolicy = (data, disableLoading, onHide) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return requestFromServer.updateTicketEscalationPolicy(data)
    .then((res) => {
      dispatch(actions.ticket_escalation_policy_Updated(res.data.data));
      disableLoading();
      toast.success("Escalation policy updated successfully", {
        position: "top-right",
        autoClose: 5000,
      });
      onHide();
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disableLoading();
      toast.error(error?.response?.data?.message || "Update failed", {
        position: "top-right",
        autoClose: 5000,
      });
    });
};

// Delete
export const deleteTicketEscalationPolicy = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return requestFromServer.deleteTicketEscalationPolicy({ Id: id })
    .then(() => {
      dispatch(actions.ticket_escalation_policy_Deleted({ Id: id }));
      toast.success("Escalation policy deleted successfully", {
        position: "top-right",
        autoClose: 5000,
      });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message || "Deletion failed", { position: "top-right" });
    });
};

// Clear form
export const clearTicketEscalationPolicyData = () => (dispatch) => {
  dispatch(actions.clearTicketEscalationPolicyForEdit());
};