import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listLoading: false,
    actionsLoading: false, // FIXED: Changed from null to false
    totalCount: 0,
    entities: null,
    dataForEdit: undefined,
    lastError: null,
};

export const callTypes = {
    list: "list",
    action: "action",
};

export const SubsidiaryWiseOnboardingChecklistSlice = createSlice({
    name: "SubsidiaryWiseOnboardingChecklist", // Match the state key used in components
    initialState,
    reducers: {
        // Add startCall reducer to set loading states
        startCall: (state, action) => {
            state.lastError = null;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            } else {
                state.actionsLoading = true;
            }
        },

        catchError: (state, action) => {
            state.lastError = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },

        checklistFetched: (state, action) => {
            const entities = action.payload.data?.data?.rows;
            const totalResult = action.payload.data?.data?.totalResults;

            state.listLoading = false;
            state.lastError = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },

        checklistFetchedForEdit: (state, action) => {
            state.actionsLoading = false;
            state.dataForEdit = action.payload.dataForEdit;
            state.lastError = null;
        },

        checklistDeleted: (state, action) => {
            state.actionsLoading = false;
            state.lastError = null;
            state.entities = state.entities.filter(el => el.Id !== action.payload.Id);
        },

        checklistCreated: (state, action) => {
            state.actionsLoading = false;
            state.lastError = null;
            // Check if entities exists before unshift
            if (state.entities) {
                state.entities.unshift(action.payload);
            } else {
                state.entities = [action.payload];
            }
        },

        checklistUpdated: (state, action) => {
            state.actionsLoading = false;
            state.lastError = null;
            //  Check if entities exists before mapping
            if (state.entities) {
                state.entities = state.entities.map(entity => {
                    if (entity.Id === action.payload.Id) {
                        return action.payload;
                    }
                    return entity;
                });
            }
        },
    },
});

export const { actions } = SubsidiaryWiseOnboardingChecklistSlice;