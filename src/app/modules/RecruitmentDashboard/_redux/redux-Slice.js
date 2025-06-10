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

            const totalResult = action.payload.data?.data.totalResults;
            // const updatedEntities = entities.map(entity => {

            //     const basis_of_gratuity = entity.basis_of_gratuityId === 0 ? 'Gross' : 'Basis';


            //     return {
            //         ...entity,
            //         basis_of_gratuity // Add the new field to the entity
            //     };
            // });

            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;

        },

        RecruitmentDashboardFetchedForEdit: (state, action) => {


            state.actionsLoading = false;
            state.dataForEdit = action.payload.dataForEdit;
            state.error = null;
        },


    },
});
