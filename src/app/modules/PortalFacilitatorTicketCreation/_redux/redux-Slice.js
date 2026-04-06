import { createSlice } from "@reduxjs/toolkit";

const initialFacilitatorTicketCreationState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    roles: null,
    centers: null,
    userStatusTypes: null,
    userForEdit: undefined,
    timeLogForEdit: undefined,
    lastError: null,
    userForRead: false,
    receiveEntities: null,
    receiveTotalCount: 0,
    userForReceive: false,
    detailData: undefined,
    detailEntities: null,
    detailTotalCount: 0,
    timeLogsTotalCount: 0,
    timelogsEntities: null,
};


export const callTypes = {
    list: "list",
    action: "action",
    userForEdit: "userForEdit",
    timelogsEntities: "timelogsEntities",
    detailEntities: "detailEntities",
    detailData: "detailData",
};

export const PortalFacilitatorTicketCreationSlice = createSlice({
    name: "FacilitatorTicketCreation",
    initialState: initialFacilitatorTicketCreationState,
    reducers: {
        catchError: (state, action) => {


            state.error = `${action.type}: ${action.payload.error}`;


            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            }
            
            else if (action.payload.callType === callTypes.userForEdit) {
                state.userForEdit = null;
            }
            
              
            else if (action.payload.callType === callTypes.timelogsEntities) {
                state.timelogsEntities = null;
            }
            
                  
            else if (action.payload.callType === callTypes.detailEntities) {
                state.detailEntities = null;
            }
                  
            else if (action.payload.callType === callTypes.detailData) {
                state.detailData = null;
            }
            
            
            else {
                state.actionsLoading = false;
            }

            

        },

        ticketCreationFetched: (state, action) => {


            // const entities = action.payload.data?.data.rows;

            // const totalResult = action.payload.data?.data.totalResults;

            // state.listLoading = false;
            // state.error = null;
            // state.entities = entities;
            // state.totalCount = totalResult;

            const rows = action.payload.data?.data.rows || [];
            const totalResult = action.payload.data?.data.totalResults || 0;

            // flatten all Details from all parents
            // const allDetails = rows.flatMap(parent => parent.Details || []);
            const allDetails = rows.flatMap(parent =>
                (parent.Details || []).map(detail => ({
                    ...detail,


                    desc: parent.ticketDescription, // ya parent.remarks jo bhi chahiye
                    ticketCode: parent.ticketCode,
                }))
            );
            state.listLoading = false;
            state.error = null;
            state.entities = allDetails;
            state.totalCount = allDetails.length; // total number of details

        },

        receiveFetched: (state, action) => {
            const rows = action.payload.data?.data.rows || [];
            const totalResult = action.payload.data?.data.totalResults || 0;


            const allDetails = rows.flatMap(parent =>
                (parent.Details || []).map(detail => ({
                    ...detail,


                    desc: parent.ticketDescription, // ya parent.remarks jo bhi chahiye
                    ticketCode: parent.ticketCode,
                    isPermanent: parent.ticketStatus == 0
                })));

            state.listLoading = false;
            state.error = null;
            state.receiveEntities = allDetails;
            state.receiveTotalCount = allDetails.length; // total number of details


        },

        //get User By ID
        TicketCreationFetchedForEdit: (state, action) => {


            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },

        FacilitatorDetailFetched: (state, action) => {
            state.listLoading = false;
            state.error = null;

            // Backend se data aa raha hai (single object OR array)
            const data = action.payload;

            // Defensive: hamesha array bana lo
            const parents = Array.isArray(data) ? data : data ? [data] : [];

            // Flatten Details + inject parent fields
            const allDetails = parents.flatMap(parent =>
                (parent.Details || []).map(detail => ({
                    ...detail,


                    desc: parent.ticketDescription, // ya parent.remarks
                    parentId: parent.Id,
                    parentDueDate: parent.dueDate,

                }))
            );

            state.detailEntities = allDetails;
            state.detailTotalCount = allDetails.length;
        },

        FacilitatorTimeLogDetailFetched: (state, action) => {
            state.listLoading = false;
            state.error = null;

            // Backend se data aa raha hai (single object OR array)
            const data = action.payload;


            state.listLoading = false;
            state.error = null;
            state.timelogsEntities = data || [];
            state.timeLogsTotalCount = data.length; // total number of details
        },

        TicketCreationDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;


            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },

        TimeLogFetchedForEdit: (state, action) => {


            state.actionsLoading = false;
            state.timeLogForEdit = action.payload.timeLogForEdit;
            state.error = null;
        },



        ticketCreationCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            // state.entities.unshift(action.payload);
            if (action.payload.receiver || action.payload.isSelf) {
                state.receiveEntities.unshift(action.payload);
            }

            else {
                state.entities.unshift(action.payload);
            }



        },




        ticketCreationUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)


            state.entities = state.entities.map((entity) => {

                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedTicketCreation);
                if (entity.Id === finalObj.Id) {
                    return finalObj; //action.payload.updatedTicketCreation;
                }
                return entity;
            });

        },





    },
});
