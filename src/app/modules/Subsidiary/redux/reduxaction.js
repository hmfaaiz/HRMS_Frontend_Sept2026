import * as requestFromServer from "./crudaction";
import { SubsidiarySlice, callTypes } from "./subsidiarySlice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = SubsidiarySlice;

export const fetchAllRecord = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllSubsidiary(queryparm)
    .then((response) => {
      dispatch(actions.SubsidiaryFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Subsidiary";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchRecordById = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.SubsidiaryFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getSubsidiaryById(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.SubsidiaryFetchedForEdit(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Subsidiary";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createRecord = (data, disableLoading) => (dispatch) => {
  return requestFromServer
    .createSubsidiary(data)
    .then((res) => {
      const createdData = res.data?.data;
      if (createdData) {
        dispatch(actions.SubsidiaryCreated(createdData));
        disableLoading();
        toast.success(SERVER_MESSAGES.insertedSuccess);
      }
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Create subsidiary";
      toast.error(error?.response?.data?.message);
    });
};

export const updateRecord = (data, disableLoading) => (dispatch) => {
  return requestFromServer
    .updateSubsidiary(data)
    .then((res) => {
      const updatedData = res.data?.data;
      if (updatedData) {
        dispatch(actions.SubsidiaryUpdated(updatedData));
        disableLoading();
        toast.success(SERVER_MESSAGES.updatedSuccess);
      }
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Update Subsidiary";
      toast.error(error?.response?.data?.message);
    });
};

export const deleteRecord = (id, disableLoading, onHide) => (dispatch) => {
  return requestFromServer
    .deleteSubsidiary(id)
    .then((res) => {
      dispatch(actions.SubsidiaryDeleted({ id }));
      disableLoading();
      toast.success(SERVER_MESSAGES.deletedSuccess);
      onHide();
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Delete Subsidiary";
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};
