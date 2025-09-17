import * as requestFromServer from "./formcrud";
import { workflowPolicySlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = workflowPolicySlice;

export const fetchAllRecord = (queryparm, type) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllRecords(queryparm, type)
    .then((response) => {
      dispatch(actions.ReocrdsFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Workflow Record";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchRecordById = (id, type) => (dispatch) => {
  if (!id) {
    return dispatch(actions.RecordFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getRecordById(id, type)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.RecordFetchedForEdit(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Workflow Record";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createRecord = (data, disableLoading, type, hide) => (
  dispatch
) => {
  return requestFromServer
    .createRecord(data, type)
    .then((res) => {
      const createdData = res.data?.data;
      if (createdData) {
        dispatch(actions.RecordCreated(createdData));
        disableLoading();
        toast.success(SERVER_MESSAGES.insertedSuccess);
        hide();
      }
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Create Workflow Record";
      toast.error(error?.response?.data?.message);
    });
};

export const updateRecord = (data, disableLoading, type, hide) => (
  dispatch
) => {
  return requestFromServer
    .updateRecord(data, type)
    .then((res) => {
      const updatedData = res.data?.data;
      if (updatedData) {
        dispatch(actions.RecordUpdated(updatedData));
        disableLoading();
        toast.success(SERVER_MESSAGES.updatedSuccess);
        hide();
      }
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Update Workflow Record";
      toast.error(error?.response?.data?.message);
    });
};

export const deleteRecord = (id, disableLoading, onHide, type) => (
  dispatch
) => {
  return requestFromServer
    .deleteRecord(id, type)
    .then((res) => {
      dispatch(actions.RecordDeleted({ id }));
      disableLoading();
      toast.success(SERVER_MESSAGES.deletedSuccess);
      onHide();
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Delete Workflow Record";
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};

export const createMultipleRecord = (data, disableLoading, type) => (
  dispatch
) => {
  return requestFromServer
    .createMultipleRecord(data, type)
    .then((res) => {
      const createdData = res.data?.data;
      if (createdData) {
        dispatch(actions.MultipleRecordCreated(createdData));
        disableLoading();
        toast.success(SERVER_MESSAGES.insertedSuccess);
      }
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Create Workflow Record";
      toast.error(error?.response?.data?.message);
    });
};

export const fetchDesignationRecord = (workflowTypeId) => async (dispatch) => {
  return requestFromServer
    .getDesignationList(workflowTypeId)
    .then((response) => {
      const entities =
        response?.data?.data.length > 0 ? response?.data?.data : [];
      dispatch(actions.RecordDesignationListFetch(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Designation List";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchWorkflowTypeRecord = (id) => async (dispatch) => {
  return requestFromServer
    .getWorkflowTypeList(id)
    .then((response) => {
      const entities =
        response?.data?.data.length > 0 ? response?.data?.data : [];
      dispatch(actions.RecordWorkflowTYpeListListFetch(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Designation List";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchRoles = () => (dispatch) => {
  return requestFromServer
    .getAllRoles()
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.RolesFetched(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find roles";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
