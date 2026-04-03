import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { projectSprintSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = projectSprintSlice;

// Fetch all projects
export const fetchProjectSprints = (queryParams) => async (dispatch) => {
  // PDF Export
  // if (queryParams.pdf) {
  //   dispatch(actions.startCall({ callType: callTypes.pdf }));
  //   return requestFromServer
  //     .getAllProjects(queryParams)
  //     .then((res) => {
  //       const pdfBlob = new Blob([res.data], { type: "application/pdf" });
  //       const pdfUrl = URL.createObjectURL(pdfBlob);

  //       // Trigger file download
  //       const link = document.createElement("a");
  //       link.href = pdfUrl;
  //       link.setAttribute("download", "project_setup.pdf");
  //       document.body.appendChild(link);
  //       link.click();
  //       dispatch(actions.pdfFetched({}));
  //       document.body.removeChild(link);
  //     })
  //     .catch((error) => {
  //       error.clientMessage = "Can't Generate PDF";
  //       dispatch(actions.catchError({ error, callType: callTypes.pdf }));
  //       toast.error(
  //         error?.response?.status == 400
  //           ? "Please select filter to generate PDF"
  //           : error.clientMessage,
  //         {
  //           position: "top-right",
  //           autoClose: 5000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //         },
  //       );
  //     });
  // }

  // // CSV Export
  // else if (queryParams.csv) {
  //   dispatch(actions.startCall({ callType: callTypes.csv }));
  //   return requestFromServer
  //     .getAllProjects(queryParams)
  //     .then((res) => {
  //       const csvBlob = new Blob([res.data], {
  //         type: "text/csv",
  //       });
  //       const csvUrl = URL.createObjectURL(csvBlob);

  //       // Trigger file download
  //       const link = document.createElement("a");
  //       link.href = csvUrl;
  //       link.setAttribute("download", "project_setup.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       dispatch(actions.csvFetched({}));
  //       document.body.removeChild(link);
  //     })
  //     .catch((error) => {
  //       error.clientMessage = "Can't Generate CSV";
  //       dispatch(actions.catchError({ error, callType: callTypes.csv }));
  //       toast.error(error?.clientMessage, {
  //         position: "top-right",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });
  //     });
  // }

  // // Excel Export
  // else if (queryParams.excel) {
  //   dispatch(actions.startCall({ callType: callTypes.xlsx }));
  //   return requestFromServer
  //     .getAllProjects(queryParams)
  //     .then((res) => {
  //       const excelBlob = new Blob([res.data], {
  //         type:
  //           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       });
  //       const excelUrl = URL.createObjectURL(excelBlob);

  //       // Trigger file download
  //       const link = document.createElement("a");
  //       link.href = excelUrl;
  //       link.setAttribute("download", "project_setup.xlsx");
  //       document.body.appendChild(link);
  //       link.click();
  //       dispatch(actions.excelFetched({}));
  //       document.body.removeChild(link);
  //     })
  //     .catch((error) => {
  //       error.clientMessage = "Can't Generate Excel";
  //       dispatch(actions.catchError({ error, callType: callTypes.xlsx }));
  //       toast.error(error?.clientMessage, {
  //         position: "top-right",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });
  //     });
  // }

  // // Normal Fetch
  // else {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllProjectSprints(queryParams)
    .then((response) => {
      dispatch(actions.projectSprintsFetched(response.data?.data));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error(
        error?.response?.data?.message || "Can't fetch project sprints",
      );
    });
  // }
};

// Fetch project by ID
export const fetchProjectSprint = (id) => async (dispatch) => {
  if (!id) {
    return dispatch(
      actions.projectSprintFetchedForEdit({ dataForEdit: undefined }),
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  try {
    const response = await requestFromServer.getProjectSprintById({ Id: id });
    const project = response.data?.data;
    dispatch(actions.projectSprintFetchedForEdit({ dataForEdit: project }));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't find project sprint");
  }
};

// Create project
export const createProjectSprint = (data, disableLoading, onHide) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.createProjectSprint(data);
    const project = res.data?.data;
    dispatch(actions.projectSprintCreated(project));
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
export const updateProjectSprint = (data, disableLoading, onHide) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.updateProjectSprint(data);
    dispatch(actions.projectSprintUpdated(res?.data?.data));
    disableLoading();
    onHide();
    toast.success(SERVER_MESSAGES.updatedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(
      error?.response?.data?.message || "Can't update project sprint",
    );
  }
};

// Delete project
export const deleteProjectSprint = (id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    await requestFromServer.deleteProjectSprint({ Id: id });
    dispatch(actions.projectSprintDeleted({ Id: id }));
    toast.success(SERVER_MESSAGES.deletedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(
      error?.response?.data?.message || "Can't delete project sprint",
    );
  }
};

export const fetchLinkedTickets = (id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    let response = await requestFromServer.getAllLinkedTickets({
      projectId: id,
    });
    dispatch(
      actions.linkedTicketFetched({
        allTicket: response?.data?.data?.allTicket || [],
        previousTicket: response?.data?.data?.previousTicket || [],
      }),
    );
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
  }
};

export const fetchSprintTickets = (id) => async (dispatch) => {
  let response = await requestFromServer.getSprintTickets({
    Id: id,
  });
  return response?.data?.data;
};

// Delete project
export const excuteProjectSprint = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    let res = await requestFromServer.excuteSprint(payload);
    dispatch(actions.projectSprintExcuted(res?.data?.data));
    toast.success(SERVER_MESSAGES.processSuccessful);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || SERVER_MESSAGES.updatedFail);
  }
};
