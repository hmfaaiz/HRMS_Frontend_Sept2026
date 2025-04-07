import * as requestFromServer from "./redux-Crud";
import {CalendarSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = CalendarSlice;


export const fetchHolidays = (body,setLoading) => async (dispatch) => {


  return requestFromServer.getAllHoliday(body)
   
    .then((response) => {
    

      dispatch(actions.holidayFetched(response));
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

