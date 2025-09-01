import { SERVER_MESSAGES } from "../../../utils/constants";
import { initialVal } from "../pages/form/FormUIHelper";
import * as requestFromServer from "./redux-Crud";
import { RecruitmentPortalConfigSlice } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = RecruitmentPortalConfigSlice;

export const fetchPortalConfig = () => async (dispatch) => {
  dispatch(actions.startCall());
  return requestFromServer
    .getPortalConfig()
    .then((response) => {
      const data = response?.data?.data;
      dispatch(actions.portalConfigFetched(data));
    })
    .catch((error) => {
      dispatch(actions.portalConfigFetched(initialVal));
      dispatch(actions.catchError());
      // toast.error(error.response?.data?.message);
    });
};

export const updatePortalConfig = (body) => async (dispatch) => {
  dispatch(actions.startCall());
  return requestFromServer
    .updatePortalConfig(body)
    .then((response) => {
      const data = response?.data?.data;
      dispatch(actions.portalConfigFetched(data));
      toast.success(SERVER_MESSAGES.updatedSuccess);
    })
    .catch(() => {
      dispatch(actions.catchError());
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};
