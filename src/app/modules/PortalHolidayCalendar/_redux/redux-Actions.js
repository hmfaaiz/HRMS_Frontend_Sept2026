import * as requestFromServer from "./redux-Crud";
import { PortalHolidayCalendarSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = PortalHolidayCalendarSlice;

export const fetchHolidays = (body, setLoading) => async (dispatch) => {
  if (new Date(body?.from_date) > new Date(body?.to_date)) {
    toast.error(SERVER_MESSAGES.correctDateRange);
    dispatch(actions.clearEvents(null));
    return;
  }
  return requestFromServer
    .getAllHoliday(body)

    .then((response) => {
      dispatch(actions.holidayFetched(response));
      setLoading(false);
    })
    .catch((error) => {
      dispatch(clearEvents());
      setLoading(false);
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error(error.response?.data?.message);
    });
};

export const clearEvents = () => async (dispatch) => {
  dispatch(actions.clearEvents(null));
};
