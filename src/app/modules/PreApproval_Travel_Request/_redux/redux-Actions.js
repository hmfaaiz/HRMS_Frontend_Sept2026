import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { preapproval_travel_requestSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = preapproval_travel_requestSlice;

export const fetchPreApprovalTravelRequests = (queryparm) => async (
  dispatch,
) => {
  return requestFromServer
    .getAllPreApprovalTravelRequest(queryparm)
    .then((response) => {
      dispatch(actions.preapprovalTravelRequestFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchPreApprovalTravelRequest = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.preapprovalTravelRequestFetchedForEdit({
        userForEdit: undefined,
      }),
    );
  }

  return requestFromServer
    .getPreApprovalTravelRequestById(id)
    .then((response) => {
      const entities = response.data?.data || response.data;
      dispatch(
        actions.preapprovalTravelRequestFetchedForEdit({
          userForEdit: entities,
        }),
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find request";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deletePreApprovalTravelRequest = (id) => (dispatch) => {
  return requestFromServer
    .deletePreApprovalTravelRequest(id)
    .then((response) => {
      dispatch(actions.preapprovalTravelRequestDeleted({ id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(
        error?.response?.data?.message || SERVER_MESSAGES.deletedFail,
      );
    });
};

export const createPreApprovalTravelRequest = (
  preApprovalTravelRequestForCreation,
  disbaleLoading,
  onHide,
) => (dispatch) => {
  return requestFromServer
    .createPreApprovalTravelRequest(preApprovalTravelRequestForCreation)
    .then((res) => {
      const user = res.data?.data || res.data;
      dispatch(actions.preapprovalTravelRequestCreated(user));
      disbaleLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess);
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(
        error?.response?.data?.message || SERVER_MESSAGES.insertedFail,
      );
    });
};

export const updatePreApprovalTravelRequest = (
  user,
  disbaleLoading,
  onHide,
) => (dispatch) => {
  return requestFromServer
    .updatePreApprovalTravelRequest(user)
    .then((response) => {
      const updatedPreApprovalTravelRequest =
        response.data?.data || response.data;
      dispatch(
        actions.preapprovalTravelRequestUpdated({
          updatedPreApprovalTravelRequest,
        }),
      );
      disbaleLoading();
      onHide();
      toast.success(SERVER_MESSAGES.updatedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(
        error?.response?.data?.message || SERVER_MESSAGES.updatedFail,
      );
    });
};

export const fetchTadaConfigByEmployeeId = (employeeId) => (dispatch) => {
  dispatch(actions.employeeEntitlementFetched({ employeeEntitlement: null }));

  if (!employeeId) {
    return;
  }

  return requestFromServer
    .getTadaConfigurationPolicies(employeeId)
    .then((response) => {
      const entities = response.data?.data || response.data;
      dispatch(
        actions.employeeEntitlementFetched({ employeeEntitlement: entities }),
      );
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      dispatch(
        actions.employeeEntitlementFetched({ employeeEntitlement: null }),
      );
      toast.error(
        error?.response?.data?.message ||
          "TADA Policy not defined for this employee",
      );
    });
};

export const fetchLastApprovedTravelRequest = (
  employeeId,
  setLastTravelData,
) => (dispatch) => {
  if (!employeeId) return;

  const queryParams = {
    filter: {
      employeeId: employeeId,
      isActive: 1,
      approved_status: 1,
      request_status: "A",
    },
    pageSize: 1,
    pageNumber: 1,
  };

  return requestFromServer
    .getAllPreApprovalTravelRequest(queryParams)
    .then((response) => {
      const data = response.data?.data || response.data;
      const entities =
        data?.entities || data?.rows || (Array.isArray(data) ? data : []);
      const lastRecord = entities.length > 0 ? entities[0] : null;
      setLastTravelData(lastRecord);
    })
    .catch((error) => {
      console.error("Error fetching last travel details:", error);
      setLastTravelData(null);
    });
};

export const fetchPreApprovalTravelRequestReport = (id) => async (dispatch) => {
  if (!id) return;

  dispatch(actions.startCall({ callType: callTypes.pdf }));

  return requestFromServer
    .getPreApprovalTravelRequestReportById(id)
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger browser download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'PreApproval_Travel_Request_Report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      dispatch(actions.pdfFetched({}));
    })
    .catch((error) => {
      error.clientMessage = "Can't generate report";
      dispatch(actions.catchError({ error, callType: callTypes.pdf }));
      toast.error(error?.response?.data?.message || "Failed to generate report");
    });
};
