import { createSlice } from "@reduxjs/toolkit";

const initialPortalDepartmentWiseBudgetState = {
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
    totalEmployees: 0,
    totalSalary: 0,
};


export const callTypes = {
    list: "list",
    action: "action",
};

export const PortalDepartmentWiseBudgetSlice = createSlice({
    name: "PortalDepartmentWiseBudget",
    initialState: initialPortalDepartmentWiseBudgetState,
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
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            } else {
                state.actionsLoading = true;
            }
        },

        departmentWiseBudgetFetched: (state, action) => {


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

        //get User By ID
        departmentWiseBudgetFetchedForEdit: (state, action) => {


            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit?.data;
            state.totalEmployees = action.payload.userForEdit?.totalEmployees;
            state.totalSalary = action.payload.userForEdit?.totalSalary;
            state.error = null;
        },


        DepartmentWiseBudgetDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;


            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },








        departmentWiseBudgetCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;

            state.entities.unshift(action.payload);
        },




        departmentWiseBudgetUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)


            state.entities = state.entities.map((entity) => {

                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedHoliday);
                if (entity.Id === finalObj.Id) {
                    return finalObj; //action.payload.updatedHoliday;
                }
                return entity;
            });

        },

        EmployeeAuthorityFetched: (state, action) => {
            state.listLoading = false;
            state.error = null;
            const { data, isPolicyExists } = action.payload;
            state.empAuthorityList = data;
            state.isPolicyExists = isPolicyExists;
        },





    },
});
