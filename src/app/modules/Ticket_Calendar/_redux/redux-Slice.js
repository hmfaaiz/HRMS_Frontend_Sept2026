import { createSlice } from "@reduxjs/toolkit";

const initialTicketCalendarState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    leaveCalendar: null,
    lastError: null,
    dateRange:null,


};


export const callTypes = {
    list: "list",
    action: "action",
};

export const TicketCalendarSlice = createSlice({
    name: "ticket_calendar",
    initialState: initialTicketCalendarState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },

        leaveFetched: (state, action) => {

            state.listLoading = false;
            state.error = null;
            state.leaveCalendar =  action.payload.data?.data?.rows;
            state.dateRange=action.payload.data?.data?.dateRange;
            state.totalCount = action.payload.data?.data?.count;

        },

        clearEvents: (state, action) => {
            state.listLoading = false;
            state.actionsLoading = null;
            state.lastError = null;
            state.totalCount = 0;
            state.leaveCalendar = null;
            state.dateRange=null;
          
            
          
        },











    },
});
