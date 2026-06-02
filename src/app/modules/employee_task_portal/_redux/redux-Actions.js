import * as requestFromServer from "./redux-Crud";
import { EmployeeTaskSlice, callTypes } from "./redux-Slice";

const { actions } = EmployeeTaskSlice;

// Fetch paginated list of tasks
export const fetchEmployeeTasks = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getEmployeeTasks(queryParams)
    .then((response) => {
      dispatch(actions.TaskListFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch tasks";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

// Fetch single task detail for modal
export const fetchEmployeeTaskById = (taskId) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getEmployeeTaskById({ id: taskId })
    .then((response) => {
      dispatch(actions.TaskForModalFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch task detail";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

// Clear modal state on close
export const clearTaskForModal = () => (dispatch) => {
  dispatch(actions.ClearTaskForModal());
};

// Handle employee task submission
export const handleEmployeeTask = (taskForSave) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .handleEmployeeTask(taskForSave)
    .catch((error) => {
      error.clientMessage = "Can't save task";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      throw error;
    });
};

// Fetch paginated list of exit clearance tasks
export const fetchExitClearanceTasks = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getExitClearanceTasks(queryParams)
    .then((response) => {
      dispatch(actions.ExitClearanceListFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch tasks";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

// Fetch single exit clearance task detail for modal
export const fetchExitClearanceTaskById = (taskId) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getExitClearanceById({ id: taskId })
    .then((response) => {
      dispatch(actions.TaskForModalFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch task detail";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

// Handle exit clearance submission
export const handleExitClearance = (taskForSave) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .handleExitClearance(taskForSave)
    .catch((error) => {
      error.clientMessage = "Can't save task";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      throw error;
    });
};
