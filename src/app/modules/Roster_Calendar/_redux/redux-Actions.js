import * as requestFromServer from "./redux-Crud";
import {RosterCalendarSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = RosterCalendarSlice;


export const fetchRosters = (body,setLoading) => async (dispatch) => {
 if (new Date(body?.from_date) > new Date (body?.to_date)) {
      toast.error("Please select correct date range");
      dispatch(actions.clearEvents(null));
      return;
    }

  return requestFromServer.getAllRoster(body)
   
    .then((response) => {
    

      dispatch(actions.rosterFetched(response));
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

