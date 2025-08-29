import * as requestFromServer from "./crudaction";
import { HODSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = HODSlice;

export const fetchAllRecord = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllHOD(queryparm)
    .then((response) => {
      dispatch(actions.RecordFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find HOD";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAllRecordForEmployeelist = (depId) => async (dispatch) => {
  return requestFromServer
    .getAllEmployeeByDepartmentId(depId)
    .then((response) => {
      let data = response?.data?.data?.length > 0 ? response?.data?.data : [];
      dispatch(actions.RecordFetchedForEmployee(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find HOD";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
export const fetchAllDepartment = () => async (dispatch) => {
  return requestFromServer
    .getDepartmentList()
    .then((response) => {
      let data = response?.data?.data?.length > 0 ? response?.data?.data : [];
      dispatch(actions.RecordFetchedForDepartment(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find HOD";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchRecordById = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.RecordFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getHODById(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.RecordFetchedForEdit(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find HOD";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createRecord = (data, disableLoading) => (dispatch) => {
  return requestFromServer
    .createHOD(data)
    .then((res) => {
      const createdData = res.data?.data;
      if (createdData) {
        dispatch(actions.RecordCreated(createdData));
        disableLoading();
        toast.success(SERVER_MESSAGES.insertedSuccess);
      }
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Create HOD";
      toast.error(error?.response?.data?.message);
    });
};

export const updateRecord = (data, disableLoading) => (dispatch) => {
  return requestFromServer
    .updateHOD(data)
    .then((res) => {
      const updatedData = res.data?.data;
      if (updatedData) {
        dispatch(actions.RecordUpdated(updatedData));
        disableLoading();
        toast.success(SERVER_MESSAGES.updatedSuccess);
      }
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Update HOD";
      toast.error(error?.response?.data?.message);
    });
};

export const deleteRecord = (id, disableLoading, onHide) => (dispatch) => {
  return requestFromServer
    .deleteHOD(id)
    .then((res) => {
      dispatch(actions.RecordDeleted({ id }));
      disableLoading();
      toast.success(SERVER_MESSAGES.deletedSuccess);
      onHide();
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Delete Record";
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};
