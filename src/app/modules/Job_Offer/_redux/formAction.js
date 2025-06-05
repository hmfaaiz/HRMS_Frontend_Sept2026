import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { JobOfferSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
import React from 'react';
const { actions } = JobOfferSlice;


export const fetchJobVacancy = (Id) => async (dispatch) => {
  if (Id) {
    return requestFromServer
      .getJobVancy({ Id })
      .then((response) => {
        dispatch(actions.JobVacancyFetched(response?.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Job Vacancy";
      });
  } else {
    dispatch(actions.JobVacancyFetched({}));
  }
};

export const fetchApplicants = (Id) => async (dispatch) => {
  if (Id) {
    return requestFromServer
      .getInterviewApplicants({ Id })
      .then((response) => {
        dispatch(actions.ApplicantsFetched(response?.data?.data));
        dispatch(actions.ApplicantsProfileFetched({}));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Applicants";
      });
  } else {
    dispatch(actions.ApplicantsFetched([]));
  }
};

export const fetchApplicantProfile = (Id) => async (dispatch) => {
  if (Id) {
    return requestFromServer
      .getApplicantProfile({ Id })
      .then((response) => {
        dispatch(actions.ApplicantsProfileFetched(response?.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Applicant Profile";
      });
  } else {
    dispatch(actions.ApplicantsProfileFetched({}));
  }
};

// export const Generatejob_offer_letter = (body) => async (dispatch) => {

//   // if (!body.headOfHrId || !body.hrId) {
//   //   toast.error("Please select all the fields");
//   //   return;
//   // }

//   // dispatch(actions.startCall({ callType: callTypes.empWise }));
//   return requestFromServer.generatejob_offer_letter(body)



//     .then((res) => {

//       const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
//       const pdfUrl = URL.createObjectURL(pdfBlob);

//       // Trigger file download
//       const link = document.createElement('a');
//       link.href = pdfUrl;
//       link.setAttribute('download', 'job_offer_letter.pdf');
//       document.body.appendChild(link);
//       link.click();
//       dispatch(actions.pdfFetched({}));
//       document.body.removeChild(link);
//       // dispatch(actions.catchError({ callType: callTypes.consolidated }));
//       // dispatch(actions.catchError({ callType: callTypes.empWise }));
//     })


//     .catch((error) => {

//       const status = error?.response?.status;
//       console.log("error22", error.response)
//       if (status === 409) {

//         const updatedBody = {
//           ...body,
//           regenerated: true, // add new field here
//         };
//         toast.warning(
//           ({ closeToast }) => (
//             <div>
//               Offer Letter already generated.
//               <br />
//               Are you sure you want to regenerate?
//               <br />
//               <button
//                 onClick={() => {
//                   dispatch(Generatejob_offer_letter(updatedBody)); // ✅ dispatch thunk again
//                   closeToast(); // close the toast after clicking
//                 }}
//                 style={{
//                   marginTop: "10px",
//                   padding: "6px 12px",
//                   backgroundColor: "#f0ad4e",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer"
//                 }}
//               >
//                 Yes
//               </button>
//             </div>
//           ),
//           {
//             autoClose: false,
//             closeOnClick: true
//           }
//         );
//       } else if (status === 404) {
//         toast.error(error?.response?.data?.message, {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         });
//       }

//       // dispatch(actions.catchError({ error, callType: callTypes.consolidated }));
//       // dispatch(actions.catchError({ error, callType: callTypes.empWise }));
//     });
// };


export const Generatejob_offer_letter = (body) => async (dispatch) => {
  return requestFromServer.generatejob_offer_letter(body)
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

      if (status === 409) {
        const updatedBody = { ...body, regenerated: true };
        toast.warning(
          ({ closeToast }) => (
            <div>
              Offer Letter already generated.
              <br />
              Are you sure you want to regenerate?
              <br />
              <button
                onClick={() => {
                  dispatch(Generatejob_offer_letter(updatedBody));
                  closeToast();

                }}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  backgroundColor: "#f0ad4e",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Yes
              </button>
            </div>
          ),
          { autoClose: false, closeOnClick: true }
        );
      } else if (status === 404) {
        toast.error(error?.response?.data?.message || "Not found");
      } else if (status === 500) {
        toast.error(SERVER_MESSAGES.pdfFail);
      }
    });
};

export const Previewjob_offer_letter = (body) => (dispatch) => {




  return requestFromServer
    // .previewjob_offer_letter(body)
    .sendJobOfferEmail(body)
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.PreviewjobOfferLetterFetched(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
   
        toast.error(error?.response?.data?.message || "Not found");
      
    });
};
export const SendJobOfferEmail = (body) => (dispatch) => {




  return requestFromServer
    .sendJobOfferEmail(body)
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.PreviewjobOfferLetterFetched(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
   
        toast.error(error?.response?.data?.message || "Not found");
      
    });
};