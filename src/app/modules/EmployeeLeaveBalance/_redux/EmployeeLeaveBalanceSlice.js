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
};

export const callTypes = {
    list: "list",
    action: "action",
};

export const EmployeeLeaveBalanceSlice = createSlice({
    name: "EmployeeLeaveBalance",
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
        EmployeeLeaveBalanceFetched: (state, action) => {
            const entities = action.payload.data?.data.rows;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },
        EmployeeLeaveBalanceFetchedForEdit: (state, action) => {
            const entities = action?.payload;
            state.actionsLoading = false;
            state.userForEdit = entities;
            state.error = null;
        },
        EmployeeLeaveBalanceCreated: (state, action) => {
            const entities = action?.payload;
            state.actionsLoading = false;
            state.error = null;
            state.userForEdit = entities;
        }
    },
});
