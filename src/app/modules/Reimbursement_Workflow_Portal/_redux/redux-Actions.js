import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { ReimbursementWorkflowStatusSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = ReimbursementWorkflowStatusSlice;

export const fetchReimbursementApprovalApplication = (
  queryParam,
  employeeId
) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  if (employeeId) {
    const filter = queryParam?.filter || {};

    const payload = {
      approvalBelongTo:  employeeId,           
      requestBelongTo:   filter.requestRaisedFor || "",  
      requestStatus:     filter.requestStatus    || "",
      reportingLevel:    filter.reportingLevel   || "",
      requestDate: {
        from: filter.requestDate?.from || "",
        to:   filter.requestDate?.to   || "",
      },
    };

    return requestFromServer
      .getAllReimbursementApproval(payload)
      .then((response) => {
        dispatch(actions.ReimbursementApprovalApplicationFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Reimbursement Workflow Data";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.ReimbursementApprovalApplicationFetched({}));
  }
};
export const getPayrollMonth = (employeeId) => (dispatch) => {
  if (!employeeId) {
    dispatch(actions.PayrollMonthFetched({ payrollData: null }));
  } else {
    return requestFromServer
      .getPayrollMonth({ employeeId })
      .then((res) => {
        const payrollData = res.data?.data;
        dispatch(actions.PayrollMonthFetched({ payrollData }));
      })
      .catch((error) => {
        dispatch(actions.PayrollMonthFetched({ payrollData: null }));
        error.clientMessage = "Can't Get Payroll Data";
      });
  }
};

export const fetchReimbursementWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(
          actions.ReimbursementWorkflowStatusFetched(response.data?.data)
        );
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.ReimbursementWorkflowStatusFetched([]));
  }
};

export const handleReimbursementRequest = (body, resetForm) => () => {
  return requestFromServer
    .handleReimbursementRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Reimbursement Request";
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};