import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { ApplicantProfileSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = ApplicantProfileSlice;


export const fetchApplicantProfile = (queryparm) => async (dispatch) => {



  return requestFromServer.getAllApplicantProfile(queryparm)

    .then((response) => {


      dispatch(actions.applicantProfileFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchApplicantProfileById = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.ApplicantProfileFetchedForEdit({ dataForEdit: undefined }));
  }

  return requestFromServer
    .getApplicantProfileById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.ApplicantProfileFetchedForEdit({ dataForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteApplicantProfile = (id) => (dispatch) => {

  return requestFromServer
    .deleteApplicantProfile({ Id: id })
    .then((response) => {

      dispatch(actions.ApplicantProfileDeleted({ Id: id }));
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


export const createApplicantProfile = (applicantProfileForCreation, disbaleLoading, onHide) => (
  dispatch
) => {


  return requestFromServer
    .createApplicantProfile(applicantProfileForCreation)
    .then((res) => {

      const user = res.data?.data;


      dispatch(actions.applicantProfileCreated(user));
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

export const updateApplicantProfile = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateApplicantProfile(user)
    .then((response) => {

      const updatedApplicantProfile = response?.config?.data; // response.data?.data;

      dispatch(actions.applicantProfileUpdated({ updatedApplicantProfile }));

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
// export const postApplicantProfile = (id) => (dispatch) => {

//   return requestFromServer
//     .postApplicantProfile({ Id: id })
//     .then((response) => {

//       dispatch(actions.JobPostedStatus({ Id: id }));
//       toast.success(SERVER_MESSAGES.postedSuccess, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//       toast.error(error.response.data.message);
//     });
// };

//Hold
// export const holdApplicantProfile = (id) => (dispatch) => {

//   return requestFromServer
//     .holdApplicantProfile({ Id: id })
//     .then((response) => {

//       dispatch(actions.JobPostedStatus({ Id: id }));
//       toast.success(SERVER_MESSAGES.holdSuccess, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//       toast.error(error.response.data.message);
//     });
// };

//Close
// export const closeApplicantProfile = (id) => (dispatch) => {

//   return requestFromServer
//     .closeApplicantProfile({ Id: id })
//     .then((response) => {

//       dispatch(actions.JobPostedStatus({ Id: id }));
//       toast.success(SERVER_MESSAGES.closedSuccess, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//       toast.error(error.response.data.message);
//     });
// };


export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return await requestFromServer.uploadFile(formData)
    .then((response) => {
      return response;
    })
    .catch((error) => {

      toast.error(error?.response?.data?.message || SERVER_MESSAGES.fileFail , {
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
