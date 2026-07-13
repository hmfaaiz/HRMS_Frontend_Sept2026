import { createSlice } from "@reduxjs/toolkit";

const initialTicketEscalationPolicyState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  ticketEscalationPolicyForEdit: undefined,
  lastError: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const ticketEscalationPolicySlice = createSlice({
  name: "ticket_escalation_policy",
  initialState: initialTicketEscalationPolicyState,
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
    ticket_escalation_policy_Fetched: (state, action) => {
      const responseData = action.payload?.data;
      const entities = responseData?.rows || [];
      const totalResult = responseData?.totalResults || 0;

      state.listLoading = false;
      state.entities = entities;
      state.totalCount = totalResult;
      state.lastError = null;
    },

    /** READ BY ID (VIEW / EDIT) */
    ticket_escalation_policy_FetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.ticketEscalationPolicyForEdit = action.payload;
      state.lastError = null;
    },

    /** CREATE */
    ticket_escalation_policy_Created: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
      state.entities.unshift(action.payload);
    },

    /** UPDATE */
    ticket_escalation_policy_Updated: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
      state.entities = state.entities.map((entity) =>
        entity.Id === action.payload.Id ? action.payload : entity,
      );
    },

    /** DELETE */
    ticket_escalation_policy_Deleted: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
      state.entities = state.entities.filter(
        (el) => el.Id !== action.payload.Id,
      );
    },

    /** CLEAR FORM */
    clearTicketEscalationPolicyForEdit: (state) => {
      state.ticketEscalationPolicyForEdit = undefined;
    },
  },
});

export const { actions } = ticketEscalationPolicySlice;
export default ticketEscalationPolicySlice.reducer;
