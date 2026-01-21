import * as requestFromServer from "./redux-Crud";
import { FacilitatorOwnershipSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";

const { actions } = FacilitatorOwnershipSlice;

// Fetch all sent facilitator ownerships
export const fetchFacilitatorOwnershipSent = (queryParam) => async (dispatch) => {
  return requestFromServer.getAllFacilitatorOwnershipSent(queryParam)
    .then((response) => {

      dispatch(actions.ownershipSentFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch sent ownerships";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

// Fetch all received facilitator ownerships
export const fetchFacilitatorOwnershipReceived = (queryParam) => async (dispatch) => {
  return requestFromServer.getAllFacilitatorOwnershipReceived(queryParam)
    .then((response) => {
      dispatch(actions.ownershipReceivedFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch received ownerships";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};


export const transferTickets = ({ ticketIds, fromEmployeeId, toEmployeeId }) => async (dispatch) => {
  try {
    const response = await requestFromServer.transferFacilitatorTickets({
      ticketIds,
      fromEmployeeId,
      toEmployeeId,
    });

    toast.success("Ticket(s) transfer successfully");

     //Refresh both sent & received tables
    if (fromEmployeeId) dispatch(fetchFacilitatorOwnershipSent({ employeeId: fromEmployeeId }));
    if (toEmployeeId) dispatch(fetchFacilitatorOwnershipReceived({ employeeId: toEmployeeId }));

    return response;

  } catch (error) {
     toast.error(error.response?.data?.message || "Transfer failed");
     throw error;
  }
};