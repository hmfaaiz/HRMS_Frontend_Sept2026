import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { releasePayslipSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = releasePayslipSlice;

export const fetchPayrollGroup = (body) => async (dispatch) => {
  return requestFromServer
    .fetchPayrollGroup(body)
    .then((response) => {
      let finalizePayrollGroup = response?.data?.data?.finalizePayrollGroup || [];
      let payrollMonth = response?.data?.data?.payrollMonth || "";
      dispatch(actions.PayrollGroupFetched({finalizePayrollGroup ,payrollMonth }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const updatePayrollGroupForReleasePayslip = (body) => (dispatch) => {
  return requestFromServer
    .updatePayrollGroupReleasePayslip(body)
    .then((response) => {
      dispatch(actions.PayrollGroupUpdatedForReleasePayslip());
      toast.success(SERVER_MESSAGES.processSuccessful);
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
