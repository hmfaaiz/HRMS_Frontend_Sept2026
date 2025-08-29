import { createSlice } from "@reduxjs/toolkit";

const initialSalarypolicyState = {
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

export const salarypolicySlice = createSlice({
    name: "salarypolicy",
    initialState: initialSalarypolicyState,
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
        salarypolicyFetched: (state, action) => {
     
   
            const entities = action.payload.data?.data.rows;
       
            const totalResult = action.payload.data?.data.totalResults;
          
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },

        //get User By ID
        SalarypolicyFetchedForEdit: (state, action) => {
        
      
            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },

        SalarypolicyDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;


            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },
        salarypolicyCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
        },
        salarypolicyUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)

            state.entities = state.entities.map((entity) => {

                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedSalarypolicy);
                if (entity.Id === finalObj.Id) {
                    return finalObj; //action.payload.updatedSalarypolicy;
                }
                return entity;
            });

        },

        //get User By ID
        CurrentMonthFetched: (state, action) => {
          
            const entities = action.payload?.response?.data?.data?.rows;
    
            const totalResult = action.payload.data?.data.totalResults;
   
            state.listLoading = false;
            state.error = null;
            state.currentMonth = entities;
            state.totalCount = totalResult;
        },


    },
});
