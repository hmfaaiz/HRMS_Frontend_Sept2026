
// This is a copy of the salary form, created as per the instructions of the Project Manager.
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
    dataForRead: false,
    loan_config_details_permission: null,
    loan_type: null,
    empForSalRev: null,
    previousSalaryRev: null,
    dataForEdit: false,
    previousSalaryComparison:null,
    dataForSalaryComparison:false,

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
  previousSalaryComparisonFetched: (state, action) => {


            state.previousSalaryComparison = action.payload.data?.data ;


        },


 
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

      EmpLastCompSalaryRevisionForView: (state, action) => {


            state.actionsLoading = false;
            state.dataForSalaryComparison =action.payload.flag;
            state.error = null;
         
        },



        EmpSalaryRevisionCreated: (state, action) => {

            state.actionsLoading = false;
            state.error = null;
            // state.entities.unshift(action.payload);
        },

        updateUserAccess: (state, action) => {
            const mode = action.payload;
            state.dataForRead = mode === "read";
            state.dataForEdit = mode === "edit";

        },


        clearPreviousSalaryRevisionFetched: (state) => {
            const entities = [];

            const totalResult = 0;
            state.dataForEdit = false
            state.dataForRead = false
            state.userForEdit = null
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },




    },
});
