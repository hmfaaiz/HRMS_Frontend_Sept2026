import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {TicketCalendarSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = TicketCalendarSlice;


export const fetchLeaves = (body,setLoading) => async (dispatch) => {
 if (new Date(body?.from_date) > new Date (body?.to_date)) {
      toast.error(SERVER_MESSAGES.correctDateRange)
      dispatch(actions.clearEvents(null));
      return;
    }

  return requestFromServer.getAllLeave(body)
   
    .then((response) => {
    

      dispatch(actions.leaveFetched(response));
      setLoading(false)
    })
    .catch((error) => {
      dispatch(clearEvents());
      setLoading(false)
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error(error.response?.data?.message);
    });
};




export const clearEvents = () => async (dispatch) => {

  dispatch(actions.clearEvents(null));
  
};

