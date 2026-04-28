import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { postApprovalTravelRequestSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = postApprovalTravelRequestSlice;

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
export const fetchPostApprovalTravelRequests = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllPostApprovalTravelRequests(queryParams)
    .then((response) => {
      dispatch(actions.postApprovalTravelRequestsFetched(response));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

// ── Read One ──
export const fetchPostApprovalTravelRequest = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.postApprovalTravelRequestFetchedForEdit({
        userForEdit: undefined,
      }),
    );
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getPostApprovalTravelRequestById(id)
    .then((response) => {
      const entities = response.data?.data || response.data;
      dispatch(
        actions.postApprovalTravelRequestFetchedForEdit({
          userForEdit: entities,
        }),
      );
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

// ── Create ──
export const createPostApprovalTravelRequest = (
  body,
  disableLoading,
  onHide,
) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createPostApprovalTravelRequest(body)
    .then((res) => {
      const created = res.data?.data || res.data;
      dispatch(actions.postApprovalTravelRequestCreated(created));
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
export const updatePostApprovalTravelRequest = (
  body,
  disableLoading,
  onHide,
) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updatePostApprovalTravelRequest(body)
    .then((response) => {
      const updated = response.data?.data || response.data;
      dispatch(actions.postApprovalTravelRequestUpdated({ updated }));
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
export const deletePostApprovalTravelRequest = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletePostApprovalTravelRequest(id)
    .then(() => {
      dispatch(actions.postApprovalTravelRequestDeleted({ id }));
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

      // toast.success("Successfully", {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
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
      // dispatch(actions.catchError({ error, callType: callTypes.list }));
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
