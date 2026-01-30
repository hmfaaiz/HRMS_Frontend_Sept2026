import { createSlice } from "@reduxjs/toolkit";

const initialTicketStatusState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  ticketStatusForEdit: undefined,
  lastError: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const ticketStatusSlice = createSlice({
  name: "ticketStatus",
  initialState: initialTicketStatusState,
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
    ticketStatusesFetched: (state, action) => {
      state.listLoading = false;
      state.entities = action.payload?.rows || [];
      state.totalCount = action.payload?.totalResults || 0;
      state.lastError = null;
    },
    ticketStatusFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.ticketStatusForEdit = action.payload.ticketStatusForEdit;
      state.lastError = null;
    },
    ticketStatusCreated: (state, action) => {
      state.actionsLoading = false;
      state.entities.unshift(action.payload);
      state.totalCount += 1;
      state.lastError = null;
    },
    ticketStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) =>
        entity.Id === action.payload.updatedTicketStatus.Id
          ? action.payload.updatedTicketStatus
          : entity
      );
      state.lastError = null;
    },
    ticketStatusDeleted: (state, action) => {
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.Id !== action.payload.Id
      );
      state.totalCount -= 1;
      state.lastError = null;
    },
  },
});

export const { actions } = ticketStatusSlice;
