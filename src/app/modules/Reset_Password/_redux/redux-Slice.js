import { createSlice } from "@reduxjs/toolkit";




const initialPasswordState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    userForEdit: undefined,
    lastError: null,
    userForRead: false,
};


export const callTypes = {
    list: "list",
    action: "action",
};

export const passwordSlice = createSlice({
    name: "passwordSlice",
    initialState: initialPasswordState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },

        clearUserForEdit: (state) => {

            state.userForEdit = null;
        },
        

    },
});
