import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobData: {},
  applicants: [],
  applicantProfile: {},
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  previewJobOfferLetterwData: null,
  pdfGenerateLoading: false,
  emailSendLoading: false,

};

export const callTypes = {
  list: "list",
  action: "action",
  pdfGenerate: "pdfGenerate",
  emailSend: "emailSend",
};

export const JobOfferSlice = createSlice({
  name: "job_offer",
  initialState: initialState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else if (action.payload.callType === callTypes.pdfGenerate) {
        state.pdfGenerateLoading = false;
      }

      else if (action.payload.callType === callTypes.emailSend) {
        state.emailSendLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {

      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else if (action.payload.callType === callTypes.pdfGenerate) {
        state.pdfGenerateLoading = true;
      }

      else if (action.payload.callType === callTypes.emailSend) {
        state.emailSendLoading = true;
      } else {
        state.actionsLoading = true;
      }

  
    },

    stopCall: (state, action) => {
        state.pdfGenerateLoading = false;
        state.emailSendLoading = false;

    },
    JobVacancyFetched: (state, action) => {
      state.error = null;
      state.jobData = action.payload;
    },
    ApplicantsFetched: (state, action) => {
      state.error = null;
      state.applicants = action.payload;
    },
    ApplicantsProfileFetched: (state, action) => {
      state.error = null;
      state.applicantProfile = action.payload;
    },
    PreviewjobOfferLetterFetched: (state, action) => {

      const previewJobOfferLetterwData = action.payload;

      state.listLoading = false;
      state.error = null;
      state.previewJobOfferLetterwData = previewJobOfferLetterwData;


      localStorage.setItem('JobOfferPreview', JSON.stringify(previewJobOfferLetterwData));

      state.registerPreviewLoading = false;
    },

  },
});
