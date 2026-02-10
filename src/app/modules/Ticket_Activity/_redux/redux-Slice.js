import { createSlice } from "@reduxjs/toolkit";

const initState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  dataForEdit: undefined,
  commentsList: [],
  lastError: null,
  logDetail: {},
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const ticketActivitySlice = createSlice({
  name: "ticket_activity",
  initialState: initState,
  reducers: {
    startCall: (state, action) => {
      state.lastError = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    catchError: (state, action) => {
      state.lastError = action.payload.error;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    ticketCommentsFetched: (state, action) => {
      state.actionsLoading = false;
      state.commentsList = action.payload;
    },
    ticketCommentsCreated: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
      if (action.payload) {
        state.commentsList = [action.payload, ...state.commentsList];
      }
    },
    ticketCommentsUpdated: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
      if (action.payload) {
        state.commentsList = state.commentsList.map((comment) =>
          comment.Id === action.payload.Id ? action.payload : comment,
        );
      }
    },
    ticketCommentsDeleted: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
      if (action.payload) {
        state.commentsList = state.commentsList.filter(
          (comment) => comment.Id !== action.payload.Id,
        );
      }
    },
    ticketsFetched: (state, action) => {
      state.listLoading = false;
      state.entities = action.payload?.rows || [];
      state.totalCount = action.payload?.totalResults || 0;
      state.lastError = null;
    },
    clearState: (state, action) => {
      state = initState;
    },
  },
});

export const { actions } = ticketActivitySlice;
