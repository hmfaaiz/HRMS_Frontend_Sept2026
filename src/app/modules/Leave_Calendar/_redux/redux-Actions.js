import * as requestFromServer from "./redux-Crud";
import {LeaveCalendarSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = LeaveCalendarSlice;


export const fetchLeaves = (body,setLoading) => async (dispatch) => {


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

