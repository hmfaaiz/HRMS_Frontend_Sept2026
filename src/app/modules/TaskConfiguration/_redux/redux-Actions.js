import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { TaskConfigurationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = TaskConfigurationSlice;


export const fetchTaskConfigurations = (queryparm) => async (dispatch) => {



  return requestFromServer.getAllTaskConfig(queryparm)

    .then((response) => {

      dispatch(actions.TaskConfigFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchTaskConfiguration = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.TaskConfigFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getTaskConfigById(id)
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.TaskConfigFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteTaskConfig = (id) => (dispatch) => {

  return requestFromServer
    .deleteTaskConfig(id)
    .then((response) => {

      dispatch(actions.TaskConfigurationDeleted({ Id: id }));
      toast.success("Successfully Deleted", {
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
      toast.error(error.response.data.message);
    });
};





export const createTaskConfig = (taskConfigurationForCreation, disbaleLoading, onHide) => (
  dispatch
) => {


  return requestFromServer
    .createTaskConfig(taskConfigurationForCreation)
    .then((res) => {

      const user = res.data?.data;


      dispatch(actions.taskConfigurationCreated(user));
      disbaleLoading();
      toast.success("Successfully Created", {
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

export const updateTaskConfig = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateTaskConfig(user)
    .then((response) => {

      const updatedTaskConfiguration = response?.config?.data; // response.data?.data;

      dispatch(actions.taskConfigurationUpdated({ updatedTaskConfiguration }));

      disbaleLoading();
      onHide();
      toast.success(response.data.message, {
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
