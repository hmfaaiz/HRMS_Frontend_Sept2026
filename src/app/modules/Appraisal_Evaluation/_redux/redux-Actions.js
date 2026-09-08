import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { appraisalEvaluationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = appraisalEvaluationSlice;

export const fetchAppraisalEvaluation = (queryparm) => async (dispatch) => {
  return requestFromServer
    .getAllAppraisalEvaluations(queryparm)

    .then((response) => {
      dispatch(actions.AppraisalEvaluationsFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAppraisalEvaluationById = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.AppraisalEvaluationByIdFetched({
        question: [],
        ratingSelection: false,
        ratingDetail: {},
      }),
    );
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAppraisalEvaluationById({ Id: id })
    .then((response) => {
      const question = response.data?.data?.questions || [];
      const ratingSelection = response.data?.data?.ratingSelection || false;
      const ratingDetail = response.data?.data?.ratingDetail || {};
      const employeeDetail = response.data?.data?.employeeDetail || {};
      const isHREvaluation = response.data?.data?.isHREvaluation || false;
      const appraisalEmpDetail = response.data?.data?.appraisalEmpDetail || {};
      dispatch(
        actions.AppraisalEvaluationByIdFetched({
          question,
          ratingSelection,
          ratingDetail,
          employeeDetail,
          isHREvaluation,
          appraisalEmpDetail,
        }),
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateAppraisalEvaluation = (body) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateAppraisalEvaluation(body)
    .then((response) => {
      const updateQuestion = response.data?.data;
      dispatch(actions.AppraisalEvaluationUpdated(updateQuestion));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchAppraisalEmployeeDetail = (empId, Id, onHide) => (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAppraisalEmployeeDetail({ Id, empId })
    .then((response) => {
      const res = response.data?.data || {};
      dispatch(actions.AppraisalEmployeeDetailFetched(res));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      onHide();
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateEvaluationConsent = (body, onHide, setLoading) => (
  dispatch,
) => {
  return requestFromServer
    .updateEvaluationConsent(body)
    .then(() => {
      toast.success(SERVER_MESSAGES.updatedSuccess);
      onHide();
      setLoading(false);
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      setLoading(false);
    });
};
/// those appraisal consent where employee is not a part of appraisal feedback
export const getEvaluationConsent = (body) => (dispatch) => {
  return requestFromServer.getEvaluationConsent(body).then((res) => {
    dispatch(actions.appraisalConsentIdFetched(res?.data?.data));
  });
};
