import { createSlice } from "@reduxjs/toolkit";
import { addMinutes } from "date-fns";

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
    activePayrollMonth: {}
};

export const callTypes = {
    list: "list",
    action: "action",
};

export const ArrearSetupSlice = createSlice({
    name: "ArrearSetup",
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
        ArrearsFetched: (state, action) => {
            const entities = action.payload.data?.data.rows;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },

        //get User By ID
        ArrearsFetchedForEdit: (state, action) => {
            const entities = action?.payload?.userForEdit;
            state.actionsLoading = false;
            state.userForEdit = entities;
            state.error = null;
        },
        ArrearsDeleted: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.filter(
                (el) => el.Id != action.payload.id
            );
            state.totalCount--;
        },
        ArrearsCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
            state.totalCount++
        },
        ArrearsUpdated: (state, action) => {
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
        ActivePayrollMonthFetched: (state, action) => {
            const data = action?.payload;
            state.actionsLoading = false;
            state.activePayrollMonth = { ...data, expiry: addMinutes(new Date(), 5) };
            state.error = null;
        },
    },
});
