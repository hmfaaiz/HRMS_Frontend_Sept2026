import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobData: {},
  applicants: [],
  jobList: [],
  applicantProfile: {},
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  applicantStatusList: [],
  userForEdit: {},
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const InterviewScheduleSlice = createSlice({
  name: "interview_schedule",
  initialState: initialState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
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
    InterviewCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.unshift(action.payload);
    },
    InterviewListFetched: (state, action) => {
      const entities = action.payload?.rows;
      const totalCount = action.payload?.totalResults;
      state.error = null;
      state.entities = entities;
      state.listLoading = false;
      state.totalCount = totalCount;
    },
    InterviewFetched: (state, action) => {
      state.error = null;
      state.userForEdit = action.payload;
      state.actionsLoading = false;
    },
    InterviewUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.userForEdit = {};
    },
    InterviewDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
    },
    InterviewEmailSent: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
    },
    ApplicationStatusFetched: (state, action) => {
      state.error = null;
      state.applicantStatusList = action.payload;
    },
    ApplicantStatusUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
    },
    JobVacancyListFetched: (state, action) => {
      state.error = null;
      state.jobList = action.payload;
    },
  },
});
