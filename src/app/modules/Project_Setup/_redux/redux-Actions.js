import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { projectSetupSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = projectSetupSlice;

// Fetch all projects
export const fetchProjects = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  try {
    const response = await requestFromServer.getAllProjects(queryParams);
    dispatch(actions.projectsFetched(response.data?.data));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.list }));
    toast.error(error?.response?.data?.message || "Can't fetch projects");
  }
};

// Fetch project by ID
export const fetchProject = (id) => async (dispatch) => {
  if (!id) {
    return dispatch(actions.projectFetchedForEdit({ dataForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  try {
    const response = await requestFromServer.getProjectById({ Id: id });
    const project = response.data?.data;
    dispatch(actions.projectFetchedForEdit({ dataForEdit: project }));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't find project");
  }
};

// Create project
export const createProject = (projectData, disableLoading, onHide) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.createProject(projectData);
    const project = res.data?.data;
    dispatch(actions.projectCreated(project));
    disableLoading();
    onHide();
    toast.success(SERVER_MESSAGES.insertedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(error?.response?.data?.message || "Can't create project");
  }
};

// Update project
export const updateProject = (projectData, disableLoading, onHide) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.updateProject(projectData);
    dispatch(actions.projectUpdated());
    disableLoading();
    onHide();
    toast.success(SERVER_MESSAGES.updatedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(error?.response?.data?.message || "Can't update project");
  }
};

// Delete project
export const deleteProject = (id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    await requestFromServer.deleteProject({ Id: id });
    dispatch(actions.projectDeleted({ Id: id }));
    toast.success(SERVER_MESSAGES.deletedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't delete project");
  }
};
