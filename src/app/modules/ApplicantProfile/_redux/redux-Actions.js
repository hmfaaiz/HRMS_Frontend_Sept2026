import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { ApplicantProfileSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = ApplicantProfileSlice;


export const fetchApplicantProfile = (queryparm) => async (dispatch) => {


    if (queryparm.pdf) {
      dispatch(actions.startCall({ callType: callTypes.pdf }));
      return requestFromServer.getAllApplicantProfile(queryparm)
  
        .then((res) => {
         
          const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
          const pdfUrl = URL.createObjectURL(pdfBlob);
  
          // Trigger file download
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.setAttribute('download', 'Applicant.pdf');
          document.body.appendChild(link);
          link.click();
          dispatch(actions.pdfFetched({}));
          document.body.removeChild(link);
        })
  
        .catch((error) => {
          dispatch(actions.catchError({ error, callType: callTypes.pdf }));
          toast.error( SERVER_MESSAGES.pdfFail, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
  
    }
  
   else if (queryparm.csv) {
  
      dispatch(actions.startCall({ callType: callTypes.csv }));
      return requestFromServer.getAllApplicantProfile(queryparm)
  
     .then((res) => {
          const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const pdfUrl = URL.createObjectURL(pdfBlob);
    
          // Trigger file download
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.setAttribute('download', 'Applicant.csv');
          document.body.appendChild(link);
          link.click();
          dispatch(actions.csvFetched({}));
          dispatch(actions.pdfFetched({}));
          document.body.removeChild(link);
        })
        .catch((error) => {
          const decodedData = new TextDecoder().decode(error?.response?.data);
          const jsonData = JSON.parse(decodedData);
       
          toast.error( SERVER_MESSAGES?.csvFail, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
  
    }
  
    else if (queryparm.excel) {
   
      dispatch(actions.startCall({ callType: callTypes.xlsx }));
      return requestFromServer.getAllApplicantProfile(queryparm)
  
     .then((res) => {
          const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const pdfUrl = URL.createObjectURL(pdfBlob);
    
          // Trigger file download
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.setAttribute('download', 'Applicant.xlsx');
          document.body.appendChild(link);
          link.click();
          dispatch(actions.excelFetched({}));
          dispatch(actions.pdfFetched({}));
          document.body.removeChild(link);
        })
        .catch((error) => {
          const decodedData = new TextDecoder().decode(error?.response?.data);
          const jsonData = JSON.parse(decodedData);
          toast.error(SERVER_MESSAGES.excelFail, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
  
    }
  else{
  return requestFromServer.getAllApplicantProfile(queryparm)

    .then((response) => {


      dispatch(actions.applicantProfileFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
}
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
    .deleteApplicantProfile(id)
    .then((response) => {

      dispatch(actions.ApplicantProfileDeleted( id));
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


export const deleteApplicantVacancyDetail = (data) => (dispatch) => {
  return requestFromServer
    .deleteApplicantVacancyDetailById(data)
    .then((response) => {


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
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};

export const convertApplicantProfile = (id) => (dispatch) => {
  return requestFromServer
    .convertApplicantToEmployee({ Id: id })
    .then((response) => {
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

export const Generatejob_offer_letter = (body) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.pdfGenerate }));
  return requestFromServer.generatejob_offer_letter({applicantId:body})
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'job_offer_letter.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.pdfFetched({}));
      document.body.removeChild(link);
      dispatch(actions.stopCall());
    })
    .catch((error) => {
      const status = error?.response?.status;
      const contentType = error?.response?.headers?.['content-type'];

      if (contentType?.includes('application/json') && error?.response?.data instanceof ArrayBuffer) {
        try {
          const text = new TextDecoder('utf-8').decode(error.response.data);
          const parsed = JSON.parse(text);
          error.response.data = parsed; // Replace data with JSON object
        } catch (e) {
          console.error('Failed to parse JSON error:', e);
        }
      }

      if (status === 404) {
        toast.error(error?.response?.data?.message || "Not found");
      } else if (status === 500) {
        toast.error(SERVER_MESSAGES.pdfFail);
      }
      dispatch(actions.stopCall());
    });
};