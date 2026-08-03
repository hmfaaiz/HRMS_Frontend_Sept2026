import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { SubsidiaryWiseOnboardingChecklistSlice, callTypes } from "./redux-Slice";

const { actions } = SubsidiaryWiseOnboardingChecklistSlice;

// FIXED: Fetch all checklists with proper loading states
export const fetchSubsidiaryChecklist = (queryParams) => async (dispatch) => {
    // Set loading state BEFORE making request
    dispatch(actions.startCall({ callType: callTypes.list }));
    
    return requestFromServer.getAllSubsidiaryChecklist(queryParams)
        .then(response => {
            dispatch(actions.checklistFetched(response));
        })
        .catch(error => {
            error.clientMessage = "Can't fetch checklists";
            dispatch(actions.catchError({ error, callType: callTypes.list }));
        });
};

// FIXED: Fetch checklist by Id for edit
export const fetchSubsidiaryChecklistForEdit = (Id) => (dispatch) => {
    if (!Id) {
        return dispatch(actions.checklistFetchedForEdit({ dataForEdit: undefined }));
    }

    // Set loading state
    dispatch(actions.startCall({ callType: callTypes.action }));

    return requestFromServer.getSubsidiaryChecklistById(Id)
        .then(response => {
            dispatch(actions.checklistFetchedForEdit({ dataForEdit: response.data?.data }));
        })
        .catch(error => {
            error.clientMessage = "Can't fetch checklist";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

// Create checklist
export const createSubsidiaryChecklistAction = (data, disableLoading, onHide) => (dispatch) => {
    return requestFromServer.createSubsidiaryChecklist(data)
        .then(res => {
            const checklist = res.data?.data;
            dispatch(actions.checklistCreated(checklist));
            disableLoading();
            toast.success(SERVER_MESSAGES.insertedSuccess);
            if (onHide) onHide();
        })
        .catch(error => {
            error.clientMessage = "Can't create checklist";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
            disableLoading();
            toast.error(error?.response?.data?.message || "Failed to create checklist");
        });
};

// Update checklist
export const updateSubsidiaryChecklistAction = (data, disableLoading, onHide) => (dispatch) => {
    return requestFromServer.updateSubsidiaryChecklist(data)
        .then(res => {
            const updatedChecklist = res.data?.data;
            dispatch(actions.checklistUpdated(updatedChecklist));
            disableLoading();
            toast.success(SERVER_MESSAGES.updatedSuccess);
            if (onHide) onHide();
        })
        .catch(error => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
            disableLoading();
            toast.error(error?.response?.data?.message || "Failed to update checklist");
        });
};

// Delete checklist
export const deleteSubsidiaryChecklistAction = (id) => (dispatch) => {
    return requestFromServer.deleteSubsidiaryChecklist({ Id: id })
        .then(() => {
            dispatch(actions.checklistDeleted({ Id: id }));
            toast.success(SERVER_MESSAGES.deletedSuccess);
        })
        .catch(error => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
            toast.error(SERVER_MESSAGES.deletedFail);
        });
};



export const fetchSubsidiaryChecklistForEditBySubsidiaryId = (subsidiaryId) => (dispatch) => {
  if (!subsidiaryId) {
    return dispatch(actions.checklistFetchedForEdit({ dataForEdit: undefined }));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.getSubsidiaryChecklistBySubsidiaryId(subsidiaryId)  // New API call
    .then(response => {
      dispatch(actions.checklistFetchedForEdit({ dataForEdit: response.data?.data }));
    })
    .catch(error => {
      error.clientMessage = "Can't fetch checklist";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};


/**
 *
 * Fetch All Leave Application Paginated from the server
 *
 * @param {Object} queryparm
 * @returns
 */
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

export const uploadFormDoc= async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return await requestFromServer
    .uploadFormDoc(formData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message || SERVER_MESSAGES.fileFail, {
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
