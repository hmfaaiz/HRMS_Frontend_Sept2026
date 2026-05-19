import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { postTravelRequestPortalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = postTravelRequestPortalSlice;

// ── Dropdown ──
export const fetchApprovedTravelRequestsByEmployee = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getApprovedTravelRequestsByEmployee()
    .then((response) => {
      const data = response.data?.data || response.data || [];
      dispatch(
        actions.approvedEmployeeListFetched({ approvedEmployeeList: data }),
      );
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error(
        error?.response?.data?.message ||
          "Failed to load approved travel requests",
      );
    });
};

export const setSelectedTravelRequest = (travelRequest) => (dispatch) => {
  dispatch(
    actions.selectedTravelRequestSet({ selectedTravelRequest: travelRequest }),
  );
};

export const clearSelectedTravelRequest = () => (dispatch) => {
  dispatch(actions.selectedTravelRequestCleared());
};

// ── Read All (paginated) ──
export const fetchPostTravelRequestPortals = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllPostTravelRequestPortals(queryParams)
    .then((response) => {
      dispatch(actions.postTravelRequestPortalsFetched(response));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

// ── Read One ──
export const fetchPostTravelRequestPortal = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.postTravelRequestPortalFetchedForEdit({
        userForEdit: undefined,
      }),
    );
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getPostTravelRequestPortalById(id)
    .then((response) => {
      const entities = response.data?.data || response.data;
      dispatch(
        actions.postTravelRequestPortalFetchedForEdit({
          userForEdit: entities,
        }),
      );
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

// ── Create ──
export const createPostTravelRequestPortal = (
  body,
  disableLoading,
  onHide,
) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createPostTravelRequestPortal(body)
    .then((res) => {
      const created = res.data?.data || res.data;
      dispatch(actions.postTravelRequestPortalCreated(created));
      disableLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess);
      onHide();
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disableLoading();
      toast.error(
        error?.response?.data?.message || SERVER_MESSAGES.insertedFail,
      );
    });
};

// ── Update ──
export const updatePostTravelRequestPortal = (
  body,
  disableLoading,
  onHide,
) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updatePostTravelRequestPortal(body)
    .then((response) => {
      const updated = response.data?.data || response.data;
      dispatch(actions.postTravelRequestPortalUpdated({ updated }));
      disableLoading();
      onHide();
      toast.success(SERVER_MESSAGES.updatedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disableLoading();
      toast.error(
        error?.response?.data?.message || SERVER_MESSAGES.updatedFail,
      );
    });
};
// ── Delete ──
export const deletePostTravelRequestPortal = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletePostTravelRequestPortal(id)
    .then(() => {
      dispatch(actions.postTravelRequestPortalDeleted({ id }));
      toast.success(SERVER_MESSAGES.deletedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(
        error?.response?.data?.message || SERVER_MESSAGES.deletedFail,
      );
    });
};

export const getAllReimbursementConfigPolicy = (employeeId) => (dispatch) => {
  return requestFromServer
    .getAllReimbursementConfigPolicy(employeeId)
    .then((res) => {
      const user = res.data?.data;

      dispatch(actions.getReimbursementConfigPolicies(user));
    })
    .catch((error) => {
      error.clientMessage = "Can't create user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      dispatch(actions.getReimbursementConfigPolicies(null));
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return await requestFromServer
    .uploadImage(formData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      error.clientMessage = "File not Uploaded";
    });
};

export const checkCanApproveRequest = (Id) => (dispatch) => {
  return requestFromServer
    .checkCanApprove(Id)
    .then((res) => {
      const canApprove = res.data?.data?.canApprove || false;
      dispatch(actions.canApproveSet({ canApprove }));
      return canApprove;
    })
    .catch(() => {
      dispatch(actions.canApproveSet({ canApprove: false }));
      return false;
    });
};

export const fetchPostTravelRequestPortalReport = (Id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getPostTravelRequestPortalReport(Id)
    .then((response) => {
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `PostTravelRequestPortalReport_${Id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      dispatch(actions.actionCompleted());
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error("Failed to download report");
    });
};
