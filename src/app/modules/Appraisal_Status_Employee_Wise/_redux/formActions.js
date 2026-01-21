import * as requestFromServer from "./formCrud";
import { appraisalStatusSlice, callTypes } from "./fromSlice";
import { toast } from "react-toastify";

const { actions } = appraisalStatusSlice;

export const fetchAllAppraisalStatusEmployeeWise = (payload) => async (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAppraisalStatus(payload)
    .then((response) => {
      dispatch(
        actions.appraisalStatusEmployeeWiseFetched(response?.data?.data || [])
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find appraisal status";
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

