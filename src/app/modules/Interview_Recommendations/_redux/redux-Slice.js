// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   listLoading: false,
//   actionsLoading: false,
//   totalCount: 0,
//   entities: null,          // paginated interview list for the table
//   interviewForModal: null, // single interview opened in recommendation modal
//   statusOptions: [],       // dropdown options for recommendedApplicantStatusId
//   error: null,
// };

// export const callTypes = {
//   list: "list",
//   action: "action",
// };

// export const InterviewRecommendationSlice = createSlice({
//   name: "interview_recommendation",
//   initialState,
//   reducers: {
//     catchError: (state, action) => {
//       state.error = `${action.type}: ${action.payload.error}`;
//       if (action.payload.callType === callTypes.list) {
//         state.listLoading = false;
//       } else {
//         state.actionsLoading = false;
//       }
//     },
//     startCall: (state, action) => {
//       state.error = null;
//       if (action.payload.callType === callTypes.list) {
//         state.listLoading = true;
//       } else {
//         state.actionsLoading = true;
//       }
//     },

//     // Paginated list fetched
//     InterviewListFetched: (state, action) => {
//       state.error = null;
//       state.listLoading = false;
//       state.entities = action.payload?.rows;
//       state.totalCount = action.payload?.totalResults;
//     },

//     // Single interview detail for modal
//     InterviewForModalFetched: (state, action) => {
//       state.error = null;
//       state.actionsLoading = false;
//       state.interviewForModal = action.payload;
//     },

//     // Status dropdown options
//     StatusOptionsFetched: (state, action) => {
//       state.error = null;
//       state.statusOptions = action.payload;
//     },

//     // After recommendation submitted — remove that row from the table
//     RecommendationSubmitted: (state, action) => {
//       state.error = null;
//       state.actionsLoading = false;
//       state.interviewForModal = null;
//       // Remove the submitted interview from entities so table hides it
//       if (state.entities) {
//         state.entities = state.entities.filter(
//           (e) => e.Id !== action.payload?.interviewId
//         );
//         state.totalCount = Math.max(0, state.totalCount - 1);
//       }
//     },

//     // Clear modal data on close
//     ClearInterviewForModal: (state) => {
//       state.interviewForModal = null;
//     },
//   },
// });


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,           // paginated interview list for the table
  interviewForModal: null,  // single interview opened in recommendation modal
  statusOptions: [],        // dropdown options for recommendedApplicantStatusId
  error: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const InterviewRecommendationSlice = createSlice({
  name: "interview_recommendations",
  initialState,
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

    // Paginated list fetched
    InterviewListFetched: (state, action) => {
      state.error = null;
      state.listLoading = false;
      state.entities = action.payload?.rows;
      state.totalCount = action.payload?.totalResults;
    },

    // Single interview detail for modal
    InterviewForModalFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.interviewForModal = action.payload;
    },

    // Status dropdown options
    StatusOptionsFetched: (state, action) => {
      state.error = null;
      state.statusOptions = action.payload;
    },

    // After recommendation submitted — remove that row from the table
    // RecommendationSubmitted: (state, action) => {
    //   state.error = null;
    //   state.actionsLoading = false;
    //   state.interviewForModal = null;
    //   // Remove the submitted interview from entities so the table hides it
    //   if (state.entities) {
    //     state.entities = state.entities.filter(
    //       (e) => e.Id !== action.payload?.interviewId
    //     );
    //     state.totalCount = Math.max(0, state.totalCount - 1);
    //   }
    // },
    RecommendationSubmitted: (state, action) => {
  state.error = null;
  state.actionsLoading = false;
  state.interviewForModal = null;
  if (state.entities) {
    state.entities = state.entities.map((e) => {
      if (e.Id === action.payload?.interviewId) {
        return {
          ...e,
          myRecommendation: action.payload?.recommendation || { submitted: true },
        };
      }
      return e;
    });
  }
},

    // Clear modal data on close
    ClearInterviewForModal: (state) => {
      state.interviewForModal = null;
    },
  },
});