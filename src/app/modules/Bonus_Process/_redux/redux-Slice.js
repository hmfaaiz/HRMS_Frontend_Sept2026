import { createSlice } from "@reduxjs/toolkit";


const initialBonusProcessState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    userForEdit: undefined,
    lastError: null,
    userForRead: false,
    bonus_policy_details: null,
    checkBonus_EmployeesExist: null,
    resultAfterBonusProcess: null
};


export const callTypes = {
    list: "list",
    action: "action",
};

export const bonus_processSlice = createSlice({
    name: "bonus_processSlice",
    initialState: initialBonusProcessState,
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

        bonusProcessFetched: (state, action) => {

            const entities = action.payload.data?.data.rows;
            const totalResult = action.payload.data?.data.totalResults;

            state.listLoading = false;
            state.error = null;
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            const updatedEntities = (entities || []).map(row => {
                const month = row.PayrollMonth ? row.PayrollMonth.month : null;
                const year = row.PayrollMonth ? row.PayrollMonth.year : null;

                if (month !== null && year !== null) {
                    row.currentMonth = `${monthNames[month - 1]}-${year}`;
                } else {
                    row.currentMonth = null;
                }

                return row;
            });

            state.entities = updatedEntities;
            state.totalCount = totalResult || 0;
        },

        // Clears table data (entities/totalCount) — used whenever the
        // selected subsidiary/bonus type/payroll group/month combo is
        // incomplete or changes, so stale rows never linger on screen.
        bonusProcessCleared: (state) => {
            state.entities = null;
            state.totalCount = 0;
            state.listLoading = false;
            state.error = null;
        },

        bonusPolicyDetailFetched: (state, action) => {

            let bonus_policy_details = action?.payload?.data?.data;
            state.listLoading = false;
            state.error = null;
            state.bonus_policy_details = bonus_policy_details;
        },

        checkBonus_EmployeesByIdsFetched: (state, action) => {

            let checkBonus_EmployeesExist = action?.payload?.data?.data;
            state.listLoading = false;
            state.error = null;
            state.checkBonus_EmployeesExist = checkBonus_EmployeesExist;
        },

        resultAfterBonusProcessFetched: (state, action) => {

            let resultAfterBonusProcess = action?.payload;
            state.listLoading = false;
            state.error = null;
            state.resultAfterBonusProcess = resultAfterBonusProcess;
        },

        //get record by ID
        BonusProcessFetchedForEdit: (state, action) => {

            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },

        BonusProcessDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;

            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },

        bonusProcessCreated: (state, action) => {

            state.actionsLoading = false;
            state.error = null;

            const newEntity = { ...action.payload };
            state.entities.unshift(newEntity);
        },

        bonusProcessUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;

            state.entities = state.entities.map((entity) => {

                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedBonusProcess);
                if (entity.Id === finalObj.Id) {
                    return finalObj;
                }

                return entity;
            });
        },

    },
});