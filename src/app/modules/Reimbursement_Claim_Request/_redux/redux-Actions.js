import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { ReimbursementClaimSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = ReimbursementClaimSlice;

export const fetchReimbursementClaim = (params) => async (dispatch) => {
  return requestFromServer
    .getAllReimbursementClaim(params)
    .then((response) => {
      dispatch(actions.reimbursementClaimFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find records";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchmoduledata = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.ReimbursementClaimFetchedForEdit({ userForEdit: undefined })
    );
  }
  return requestFromServer
    .getReimbursementClaimById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;
      dispatch(
        actions.ReimbursementClaimFetchedForEdit({ userForEdit: entities })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find record";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteReimbursementClaim = (id) => (dispatch) => {
  return requestFromServer
    .deleteReimbursementClaim({ Id: id })
    .then(() => {
      dispatch(actions.ReimbursementClaimDeleted({ Id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess, {
        position: "top-right",
        autoClose: 2000,
      });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};

export const createReimbursementClaim = (body, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .createReimbursementClaim(body)
    .then((res) => {
      const data = res.data?.data;
      dispatch(actions.reimbursementClaimCreated(data));
      disbaleLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess, {
        position: "top-right",
        autoClose: 2000,
      });
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create record";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      onHide();
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
      });
    });
};

export const updateReimbursementClaim = (body, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .updateReimbursementClaim(body)
    .then(() => {
      dispatch(actions.clearUserForEdit());
      disbaleLoading();
      toast.success(SERVER_MESSAGES.updatedSuccess, {
        position: "top-right",
        autoClose: 5000,
      });
      onHide();
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
      });
    });
};

export const getEmployeeAuthorities = (empId) => (dispatch) => {
  return requestFromServer
    .getEmployeeAuthorties(empId, "629")
    .then((res) => {
      // API returns: { data: { data: [...], isPolicyExists: bool } }
      const data = Array.isArray(res.data?.data?.data)
        ? res.data?.data?.data
        : [];
      const isPolicyExists = res.data?.data?.isPolicyExists || false;
      dispatch(actions.EmployeeAuthorityFetched({ data, isPolicyExists }));
    })
    .catch((error) => {
      error.clientMessage = "Can't Get Employee Authorities";
      // dispatch empty so table shows no records instead of hanging
      dispatch(actions.EmployeeAuthorityFetched({ data: [], isPolicyExists: false }));
    });
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
      .catch(() => {
        dispatch(actions.PayrollMonthFetched({ payrollData: null }));
      });
  }
};

export const fetchReimbursementConfigPolicies = (body) => (dispatch) => {
  return requestFromServer
    .getAllReimbursementConfigPolicy(body)
    .then((res) => {
      dispatch(actions.ReimbursementConfigPoliciesFetched(res?.data?.data));
    })
    .catch(() => {
      dispatch(actions.ReimbursementConfigPoliciesFetched(null));
    });
};