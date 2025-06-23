import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { JobVacancySlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = JobVacancySlice;


export const fetchJobVacancy = (queryparm) => async (dispatch) => {



  return requestFromServer.getAllJobVacancy(queryparm)

    .then((response) => {


      dispatch(actions.jobVacancyFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchJobVacancyById = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.JobVacancyFetchedForEdit({ dataForEdit: undefined }));
  }

  return requestFromServer
    .getJobVacancyById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.JobVacancyFetchedForEdit({ dataForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteJobVacancy = (id) => (dispatch) => {

  return requestFromServer
    .deleteJobVacancy({ Id: id })
    .then((response) => {

      dispatch(actions.JobVacancyDeleted({ Id: id }));
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
      toast.error(error.response.data.message);
    });
};


export const createJobVacancy = (jobVacancyForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

console.log("onhide111",onHide)
  return requestFromServer
    .createJobVacancy(jobVacancyForCreation)
    .then((res) => {

      const user = res.data?.data;


      dispatch(actions.jobVacancyCreated(user));
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

export const updateJobVacancy = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateJobVacancy(user)
    .then((response) => {

      const updatedJobVacancy = response?.config?.data; // response.data?.data;

      dispatch(actions.jobVacancyUpdated({ updatedJobVacancy }));

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

//Post
export const postJobVacancy = (id) => (dispatch) => {

  return requestFromServer
    .postJobVacancy({ Id: id })
    .then((response) => {

      dispatch(actions.JobPostedStatus({ Id: id }));
      toast.success(SERVER_MESSAGES.postedSuccess, {
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

//Hold
export const holdJobVacancy = (id) => (dispatch) => {

  return requestFromServer
    .holdJobVacancy({ Id: id })
    .then((response) => {

      dispatch(actions.JobPostedStatus({ Id: id }));
      toast.success(SERVER_MESSAGES.holdSuccess, {
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

//Close
export const closeJobVacancy = (id) => (dispatch) => {

  return requestFromServer
    .closeJobVacancy({ Id: id })
    .then((response) => {

      dispatch(actions.JobPostedStatus({ Id: id }));
      toast.success(SERVER_MESSAGES.closedSuccess, {
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