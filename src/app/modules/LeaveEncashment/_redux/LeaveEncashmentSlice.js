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
    payrollData: null,
    leaveBalances: []
};

export const callTypes = {
    list: "list",
    action: "action",
};

export const LeaveEncashmentSlice = createSlice({
    name: "LeaveEncashment",
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
        LeaveEncashmentFetched: (state, action) => {
            const entities = action.payload.data?.data.rows || [];
            const totalResult = action.payload.data?.data.totalResults || 0;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },
        LeaveEncashmentFetchedForEdit: (state, action) => {
            const entities = action?.payload?.userForEdit;
            state.actionsLoading = false;
            state.userForEdit = entities;
            state.error = null;
        },
        LeaveEncashmentDeleted: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.filter(
                (el) => el.Id != action.payload.id
            );
            state.totalCount--;
        },
        LeaveEncashmentCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
            state.totalCount++;
        },
        PayrollMonthFetched: (state, action) => {
            const payrollData = action?.payload?.payrollData;
            state.error = null;
            state.payrollData = payrollData;
        },
        LeaveBalancesFetched: (state, action) => {
            const leaveBalances = action.payload.data?.data;
            state.listLoading = false;
            state.error = null;
            state.leaveBalances = leaveBalances;
        },
    },
});
