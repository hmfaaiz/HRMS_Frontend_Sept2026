import { createSlice } from "@reduxjs/toolkit";




const initialEmpSalaryRevisionState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    roles: null,
    userStatusTypes: null,
    userForEdit: undefined,
    lastError: null,
    userForRead: false,
    loan_config_details_permission: null,
    loan_type: null,
    empForSalRev: null,
    previousSalaryRev: null,
};


export const callTypes = {
    list: "list",
    action: "action",
};

export const EmpSalaryRevisionSlice = createSlice({
    name: "EmpSalaryRevisionSlice",
    initialState: initialEmpSalaryRevisionState,
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

        empForSalaryRevisionFetched: (state, action) => {


            state.empForSalRev = action.payload.data?.data || [];


        },


        // previousSalaryRevisionFetched: (state, action) => {
        //     const { rows = [], totalResults = 0, page = 1, totalPages = 1 } = action.payload;

        //     state.entities = rows;              // ✅ array for display
        //     state.totalCount = totalResults;    // if needed for pagination
        //     state.page = page;
        //     state.totalPages = totalPages;
        // }, 

        previousSalaryRevisionFetched: (state, action) => {
            const entities = action.payload.data?.data.rows;

            const totalResult = action.payload.data?.data.totalResults;
    

            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },

        //get User By ID
        EmpSalaryRevisionFetchedForEdit: (state, action) => {


            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },



        EmpSalaryRevisionCreated: (state, action) => {

            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
        },
        // EmpSalaryRevisionUpdated: (state, action) => {
        //     state.error = null;
        //     state.actionsLoading = false;
        //     // state.entities.push(action.payload)

        //     state.entities = state.entities.map((entity) => {

        //         //const payload = { ...action.payload };
        //         let payload = JSON.stringify(action.payload)
        //         let payloadObj = JSON.parse(payload);
        //         let finalObj = JSON.parse(payloadObj.updatedEmpSalaryRevision);
        //         if (entity.Id === finalObj.Id) {
        //             return finalObj;
        //         }

        //         return entity;
        //     });

        // },







    },
});
