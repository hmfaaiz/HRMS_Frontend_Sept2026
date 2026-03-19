import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: [],
    userForEdit: undefined,
    lastError: null,
    allChildMenus: [],
    allEmployeeShiftList: [], 
};

export const callTypes = {
    list: "list",
    action: "action",
};

export const employeeTempShiftSlice = createSlice({
    name: "employeeTempShiftSlice",
    initialState,
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
        TempShiftFetched: (state, action) => {
            const entities = action.payload?.data?.data?.rows;
            const totalResult = action.payload?.data?.data?.totalResults;
            state.listLoading = false;
            state.error = null;
            state.entities = entities || [];
            state.totalCount = totalResult;
        },
        TempShiftFetchedForEdit: (state, action) => {
            const entity = action?.payload?.userForEdit;
            state.actionsLoading = false;
            if (entity) {
                entity.workingdays = entity.workingdays?.split(",") || [];
            }
            state.userForEdit = entity;
            state.error = null;
        },
        TempShiftDeleted: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.filter(
                (el) => el.Id != action.payload.id
            );
            state.totalCount--;
        },
        TempShiftCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
            state.totalCount++;
        },
        TempShiftUpdated: (state, action) => {
            const id = action.payload.Id;
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.map((el) =>
                el.Id === id ? action.payload : el
            );
        },
        AllChildMenusFetch: (state, action) => {
            state[action.payload.key] = action.payload.entities;
        },
    },
});

export const { actions } = employeeTempShiftSlice;