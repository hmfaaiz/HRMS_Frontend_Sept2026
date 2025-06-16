import { createSlice } from "@reduxjs/toolkit";

const initialRecruitmentDashboardState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    roles: null,
    centers: null,
    userStatusTypes: null,
    dataForEdit: undefined,
    lastError: null,
    dataForRead: false,
};


export const callTypes = {
    list: "list",
    action: "action",
};

export const RecruitmentDashboardSlice = createSlice({
    name: "RecruitmentDashboard",
    initialState: initialRecruitmentDashboardState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },

        RecruitmentDashboardFetched: (state, action) => {


            const entities = action.payload.data?.data.rows;

       


            state.listLoading = false;
            state.error = null;
            state.entities = entities;


        },

        RecruitmentDashboardFetchedDetail: (state, action) => {


            state.actionsLoading = false;
            state.dataForEdit = action.payload.data?.data.rows;
            state.error = null;
            const totalResult = action.payload.data?.data.totalResults;
            state.totalCount = totalResult;
            console.log("dat11111",state.dataForEdit)
        },


    },
});
