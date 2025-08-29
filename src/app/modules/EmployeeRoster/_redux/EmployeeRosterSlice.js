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
    payrollData: null
};

export const callTypes = {
    list: "list",
    action: "action",
};

export const EmployeeRosterSlice = createSlice({
    name: "EmployeeRoster",
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
        EmployeeRosterFetched: (state, action) => {
            const entities = action.payload.data?.data.rows;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },
        EmployeeRosterFetchedForEdit: (state, action) => {
            const entities = action?.payload?.userForEdit;
            state.actionsLoading = false;
            state.userForEdit = entities;
            state.error = null;
        },
        EmployeeRosterDeleted: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.filter(
                (el) => el.Id != action.payload.id
            );
            state.totalCount--;
        },
        EmployeeRosterCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.totalCount++;
        },
        EmployeeRosterUpdated: (state, action) => {
            const id = action.payload.Id;
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.map((el) => {
                if (el.Id == id) {
                    return action.payload;
                }
                return el;
            });
        },
        PayrollMonthFetched: (state, action) => {
            const payrollData = action?.payload?.payrollData;
            state.error = null;
            state.payrollData = payrollData;
        },
    },
});
