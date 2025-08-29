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

export const SalaryRoundingPolicySlice = createSlice({
    name: "SalaryRoundingPolicy",
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
        RoundingPolicyFetched: (state, action) => {
            const entities = action.payload.data?.data.rows;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },
        paymentModeFetched: (state, action) => {
            const dropdownData = action.payload.dropdownData;
            state.paymentModeDropdown = dropdownData;
        },
        //get User By ID
        RoundingPolicyFetchedForEdit: (state, action) => {
            const entities = action?.payload?.userForEdit;
            state.actionsLoading = false;
            state.userForEdit = entities;
            state.error = null;
        },
        RoundingPolicyDeleted: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.filter(
                (el) => el.Id != action.payload.id
            );
            state.totalCount--;
        },
        RoundingPolicyCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
            state.totalCount++
        },
        RoundingPolicyUpdated: (state, action) => {
            const id = action.payload.Id;
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.map((el) => {
                if (el.Id == id) {
                    return action.payload;
                }
                return el;
            });
        }
    },
});
