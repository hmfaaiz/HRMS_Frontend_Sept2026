import { createSlice } from "@reduxjs/toolkit";

const initialFacilitatorState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  facilitatorForEdit: undefined,
  facilitatorForRead: false,
  lastError: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const facilitatorSetupSlice = createSlice({
  name: "facilitatorSetup",
  initialState: initialFacilitatorState,
  reducers: {
    /** ERROR */
    catchError: (state, action) => {
      state.lastError = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },

    /** START API CALL */
    startCall: (state, action) => {
      state.lastError = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },

    /** READ ALL */
    facilitator_setup_Fetched: (state, action) => {
      const entities = action.payload?.data?.data?.rows || [];
      const totalResult = action.payload?.data?.data?.total || 0;

      state.listLoading = false;
      state.entities = entities;
      state.totalCount = totalResult;
      state.lastError = null;
    },

    /** READ BY ID (VIEW / EDIT) */
    facilitator_setup_FetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.facilitatorForEdit = action.payload;
      state.lastError = null;
    },

    /** CREATE */
    facilitator_setup_Created: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
      state.entities.unshift(action.payload);
    },

    /** UPDATE */
    facilitator_setup_Updated: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;

      state.entities = state.entities.map((entity) =>
        entity.Id === action.payload.Id ? action.payload : entity
      );
    },

    /** DELETE */
    facilitator_setup_Deleted: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
      state.entities = state.entities.filter(
        (el) => el.Id !== action.payload.Id
      );
    },

    /** CLEAR FORM */
    clearFacilitatorForEdit: (state) => {
      state.facilitatorForEdit = undefined;
      state.facilitatorForRead = false;
    },
  },
});

export const { actions } = facilitatorSetupSlice;
export default facilitatorSetupSlice.reducer;