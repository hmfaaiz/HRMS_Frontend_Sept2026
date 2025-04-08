import { createSlice } from "@reduxjs/toolkit";

const initialCalendarState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    holidayCalendar: null,
    lastError: null,
    dateRange:null,


};


export const callTypes = {
    list: "list",
    action: "action",
};

export const CalendarSlice = createSlice({
    name: "calendar",
    initialState: initialCalendarState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },

        holidayFetched: (state, action) => {
 
            state.listLoading = false;
            state.error = null;
            state.holidayCalendar =  action.payload.data?.data?.rows;
            state.dateRange=action.payload.data?.data?.dateRange;
            state.totalCount = action.payload.data?.data?.count;

        },

        clearEvents: (state, action) => {
            state.listLoading = false;
            state.actionsLoading = null;
            state.lastError = null;
            state.totalCount = 0;
            state.holidayCalendar = null;
            state.dateRange=null;
          
            
          
        },











    },
});
