import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    roles: null,
    centers: null,
    userStatusTypes: null,
    userForEdit: undefined,
    lastError: null,
    userForRead: false,
    allPolicyType:[]
};

export const callTypes = {
    list: "list",
    action: "action",
};

export const AllocateLeavesSlice = createSlice({
    name: "AllocateLeaves",
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
        AllocateLeavesFetched: (state, action) => {
            const data = action.payload;
            state.listLoading = false;
            state.error = null;
            state.userForEdit = data;
        },
        policyDropdownFetched: (state, action) => {
            const dropdownData = action.payload.data?.data;
            state.allPolicyType = dropdownData;
        },
        AllocateLeavesCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.userForEdit = action.payload;
        }
    },
});
