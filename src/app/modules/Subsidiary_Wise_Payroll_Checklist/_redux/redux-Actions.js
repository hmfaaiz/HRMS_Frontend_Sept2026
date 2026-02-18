// import { toast } from "react-toastify";
// import { SERVER_MESSAGES } from "../../../utils/constants";
// import * as requestFromServer from "./redux-Crud";
// import { SubsidiaryWisePayrollChecklistSlice, callTypes } from "./redux-Slice";

// const { actions } = SubsidiaryWisePayrollChecklistSlice;

// // Fetch all
// export const fetchPayrollChecklist = (queryParams) => async (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.list }));

//   return requestFromServer.getAllPayrollChecklist(queryParams)
//     .then((response) => {
//       dispatch(actions.checklistFetched(response));
//     })
//     .catch((error) => {
//       error.clientMessage = "Can't fetch payroll checklist";
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };

// // Fetch for edit
// export const fetchPayrollChecklistForEdit = (subsidiaryId, payrollGroupId) => (dispatch) => {
//   if (!subsidiaryId || !payrollGroupId) {
//     return dispatch(actions.checklistFetchedForEdit({ dataForEdit: undefined }));
//   }

//   dispatch(actions.startCall({ callType: callTypes.action }));

//   return requestFromServer
//     .getPayrollChecklist(subsidiaryId, payrollGroupId)
//     .then((response) => {
//       dispatch(actions.checklistFetchedForEdit({ dataForEdit: response.data?.data }));
//     })
//     .catch((error) => {
//       error.clientMessage = "Can't fetch payroll checklist";
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// // Create
// export const createPayrollChecklistAction = (data, disableLoading, onHide) => (dispatch) => {
//   return requestFromServer.createPayrollChecklist(data)
//     .then((res) => {
//       dispatch(actions.checklistCreated(res.data?.data));
//       disableLoading();
//       toast.success(SERVER_MESSAGES.insertedSuccess);
//       if (onHide) onHide();
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//       disableLoading();
//       toast.error(error?.response?.data?.message || "Create failed");
//     });
// };

// // Update
// export const updatePayrollChecklistAction = (data, disableLoading, onHide) => (dispatch) => {
//   return requestFromServer.updatePayrollChecklist(data)
//     .then((res) => {
//       dispatch(actions.checklistUpdated(res.data?.data));
//       disableLoading();
//       toast.success(SERVER_MESSAGES.updatedSuccess);
//       if (onHide) onHide();
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//       disableLoading();
//       toast.error(error?.response?.data?.message || "Update failed");
//     });
// };

// // Delete
// export const deletePayrollChecklistAction = (body) => (dispatch) => {
//   return requestFromServer.deletePayrollChecklist(body)
//     .then(() => {
//       dispatch(actions.checklistDeleted(body));
//       toast.success(SERVER_MESSAGES.deletedSuccess);
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//       toast.error(SERVER_MESSAGES.deletedFail);
//     });
// };



// export const uploadImage = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   return await requestFromServer
//     .uploadImage(formData)
//     .then((response) => {
//       return response;
//     })
//     .catch((error) => {
//       error.clientMessage = "File not Uploaded";
//       // dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };


import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { SubsidiaryWisePayrollChecklistSlice, callTypes } from "./redux-Slice";

const { actions } = SubsidiaryWisePayrollChecklistSlice;

// Fetch all
export const fetchPayrollChecklist = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  return requestFromServer
    .getAllPayrollChecklist(queryParams)
    .then((response) => {
      dispatch(actions.checklistFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch payroll checklist";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error("Can't fetch payroll checklist");
    });
};


export const fetchPayrollChecklistForEdit = (subsidiaryId, payroll_groupId) => (dispatch) => {
  if (!subsidiaryId || payroll_groupId === undefined) {
    return dispatch(actions.checklistFetchedForEdit({ dataForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return requestFromServer
    .getPayrollChecklist(subsidiaryId, payroll_groupId)
    .then((response) => {
      dispatch(
        actions.checklistFetchedForEdit({ dataForEdit: response.data?.data })
      );
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error("Can't fetch payroll checklist for edit");
    });
};
// Create
export const createPayrollChecklistAction =
  (data, disableLoading, onHide) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
      .createPayrollChecklist(data)
      .then((res) => {
        dispatch(actions.checklistCreated(res.data?.data));
        disableLoading();
        toast.success(SERVER_MESSAGES.insertedSuccess);
        if (onHide) onHide();
      })
      .catch((error) => {
        dispatch(actions.catchError({ error, callType: callTypes.action }));
        disableLoading();
        toast.error(error?.response?.data?.message || "Create failed");
      });
  };

// Update
export const updatePayrollChecklistAction =
  (data, disableLoading, onHide) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
      .updatePayrollChecklist(data)
      .then((res) => {
        dispatch(actions.checklistUpdated(res.data?.data));
        disableLoading();
        toast.success(SERVER_MESSAGES.updatedSuccess);
        if (onHide) onHide();
      })
      .catch((error) => {
        dispatch(actions.catchError({ error, callType: callTypes.action }));
        disableLoading();
        toast.error(error?.response?.data?.message || "Update failed");
      });
  };

// Delete
export const deletePayrollChecklistAction = (body) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletePayrollChecklist(body)
    .then(() => {
      dispatch(actions.checklistDeleted(body));
      toast.success(SERVER_MESSAGES.deletedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};

// Upload Image
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return await requestFromServer.uploadImage(formData).catch((error) => {
    toast.error("File not uploaded");
    throw error;
  });
};