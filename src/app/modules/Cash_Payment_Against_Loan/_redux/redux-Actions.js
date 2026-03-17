import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { actions, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

// ── Fetch All — filtered by employeeId when provided ─────────────────────────
export const fetchLoanCashPayments = (params) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  const body = {
    ...(params?.filter || {}),
    pageNumber: params?.pageNumber || params?.queryParams?.pageNumber || 1,
    pageSize:   params?.pageSize   || params?.queryParams?.pageSize   || 10,
    sortOrder:  params?.sortOrder  || "desc",
    // Pass employeeId so backend filters records for selected employee only
    ...(params?.employeeId ? { employeeId: params.employeeId } : {}),
  };

  return requestFromServer
    .getAllLoanCashPayments(body)
    .then((response) => {
      dispatch(actions.loanCashPaymentsFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find records";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

// ── Fetch Single for Edit / View ──────────────────────────────────────────────
export const fetchLoanCashPaymentById = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.loanCashPaymentFetchedForEdit({ userForEdit: undefined }));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getLoanCashPaymentById({ Id: id })
    .then((response) => {
      dispatch(actions.loanCashPaymentFetchedForEdit({ userForEdit: response.data?.data }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find record";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

// ── Fetch Loan Outstanding ────────────────────────────────────────────────────
export const fetchLoanOutstanding = (employeeId, loanTypeId) => (dispatch) => {
  if (!employeeId || !loanTypeId) {
    return dispatch(actions.clearLoanOutstanding());
  }
  dispatch(actions.loanOutstandingStarted());
  return requestFromServer
    .getLoanOutstandingRequest({ employeeId, loanTypeId })
    .then((res) => {
      dispatch(actions.loanOutstandingFetched(res.data?.data ?? null));
    })
    .catch((error) => {
      dispatch(actions.clearLoanOutstanding());
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

// ── Create ────────────────────────────────────────────────────────────────────
export const createLoanCashPayment =
  (body, disableLoading, onHide, refetchParams) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
      .createLoanCashPayment(body)
      .then(() => {
        dispatch(actions.actionsLoadingDone());
        disableLoading();
        toast.success(SERVER_MESSAGES.insertedSuccess, {
          position: "top-right", autoClose: 2000, hideProgressBar: false,
          closeOnClick: true, pauseOnHover: true, draggable: true,
        });
        onHide();
        if (refetchParams) {
          dispatch(fetchLoanCashPayments(refetchParams));
        }
      })
      .catch((error) => {
        error.clientMessage = "Can't create record";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
        disableLoading();
        toast.error(error?.response?.data?.message || "Failed to save record", {
          position: "top-right", autoClose: 5000, hideProgressBar: false,
          closeOnClick: true, pauseOnHover: true, draggable: true,
        });
      });
  };

// ── Update ────────────────────────────────────────────────────────────────────
export const updateLoanCashPayment =
  (body, disableLoading, onHide, refetchParams) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
      .updateLoanCashPayment(body)
      .then(() => {
        dispatch(actions.actionsLoadingDone());
        disableLoading();
        toast.success(SERVER_MESSAGES.updatedSuccess, {
          position: "top-right", autoClose: 5000, hideProgressBar: false,
          closeOnClick: true, pauseOnHover: true, draggable: true,
        });
        onHide();
        if (refetchParams) {
          dispatch(fetchLoanCashPayments(refetchParams));
        }
      })
      .catch((error) => {
        dispatch(actions.catchError({ error, callType: callTypes.action }));
        disableLoading();
        toast.error(error?.response?.data?.message || "Failed to update record", {
          position: "top-right", autoClose: 5000, hideProgressBar: false,
          closeOnClick: true, pauseOnHover: true, draggable: true,
        });
      });
  };

// ── Delete ────────────────────────────────────────────────────────────────────
export const deleteLoanCashPayment = (id, refetchParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteLoanCashPayment({ Id: id })
    .then(() => {
      dispatch(actions.loanCashPaymentDeleted({ Id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess, {
        position: "top-right", autoClose: 2000, hideProgressBar: false,
        closeOnClick: true, pauseOnHover: true, draggable: true,
      });
      // Re-fetch so table stays filtered by employee after delete
      if (refetchParams) {
        dispatch(fetchLoanCashPayments(refetchParams));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message || SERVER_MESSAGES.deletedFail);
    });
};

// ── Clear helpers ─────────────────────────────────────────────────────────────
export const clearUserForEdit = () => (dispatch) => {
  dispatch(actions.clearUserForEdit());
};

export const clearLoanOutstanding = () => (dispatch) => {
  dispatch(actions.clearLoanOutstanding());
};