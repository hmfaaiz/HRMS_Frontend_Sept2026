import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { SeparationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = SeparationSlice;


export const fetchSeparation = (queryparm) => async (dispatch) => {



  return requestFromServer.getAllSeparation(queryparm)

    .then((response) => {


      dispatch(actions.separationFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchSeparationById = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.SeparationFetchedForEdit({ dataForEdit: undefined }));
  }

  return requestFromServer
    .getSeparationById( id)
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.SeparationFetchedForEdit({ dataForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchEmpBySeparationFlag= (body) => (dispatch) => {

  if (!body.flag && !body.employeeId) {
    return dispatch(actions.EmployeeFetchedList({ employeeList: [] }));
  }

  return requestFromServer
    .getsEmpBySeparationFlag(body)
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.EmployeeFetchedList(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find employee";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteSeparation = (id) => (dispatch) => {

  return requestFromServer
    .deleteSeparation(id)
    .then((response) => {

      dispatch(actions.SeparationDeleted( id));
      toast.success(SERVER_MESSAGES.deletedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES?.deletedFail);
    });
};

export const separateById = (body,onHide) => (dispatch) => {

  return requestFromServer
    .separateById(body)
    .then((response) => {
onHide();
      toast.success(SERVER_MESSAGES.updatedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES?.updatedFail);
    });
};


export const createSeparation = (separationForCreation, disbaleLoading, onHide) => (
  dispatch
) => {


  return requestFromServer
    .createSeparation(separationForCreation)
    .then((res) => {

      const user = res.data?.data;


      dispatch(actions.separationCreated(user));
      disbaleLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
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

export const updateSeparation = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateSeparation(user)
    .then((response) => {

      const updatedSeparation = response?.config?.data; // response.data?.data;

      dispatch(actions.separationUpdated({ updatedSeparation }));

      disbaleLoading();
      onHide();
      toast.success(SERVER_MESSAGES.updatedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });


    })
    .catch((error) => {

      //error.clientMessage = "Can't update User"
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
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



export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return await requestFromServer.uploadFile(formData)
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


