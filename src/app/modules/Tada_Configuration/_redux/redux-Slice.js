import { createSlice } from "@reduxjs/toolkit";

const initialTadaConfigState = {
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

export const tada_configurationSlice = createSlice({
    name: "tada_configurationSlice",
    initialState: initialTadaConfigState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },

        tadaConfigFetched: (state, action) => {
            const data = action.payload.data?.data;
            const entities = data?.rows || data || [];
            const totalResult = data?.totalResults || (Array.isArray(entities) ? entities.length : 0);
            
            state.listLoading = false;
            state.error = null;
            state.entities = Array.isArray(entities) ? entities : [];
            state.totalCount = totalResult;
        },

         //get By ID
         TadaConfigFetchedForEdit: (state, action) => {
            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },

      
        TadaConfigDeleted: (state, action) => {
            const id = action.payload.id || action.payload.Id;
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.filter(
                (el) => (el.id || el.Id) !== id
            );
        },
        tadaConfigCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            if (state.entities) {
                state.entities.unshift(action.payload);
            } else {
                state.entities = [action.payload];
            }
        },
        tadaConfigUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            const updatedTadaConfig = action.payload.updatedTadaConfig;
            const finalObj = typeof updatedTadaConfig === 'string' ? JSON.parse(updatedTadaConfig) : updatedTadaConfig;
            const id = finalObj.id || finalObj.Id;

            state.entities = state.entities.map((entity) => {
                if ((entity.id || entity.Id) === id) {
                    return finalObj; 
                }
                return entity;
            });
        },


    },
});
