import { createSlice } from "@reduxjs/toolkit";

const initialApplicantProfileState = {
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
    pdfGenerateLoading: false,
    pdfLoading: false,
    csvLoading: false,
    excelLoading: false,
};


export const callTypes = {
    list: "list",
    action: "action",
    pdfGenerate: "pdfGenerate",
};

export const ApplicantProfileSlice = createSlice({
    name: "applicantProfile",
    initialState: initialApplicantProfileState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else if (action.payload.callType === callTypes.pdfGenerate) {
                state.pdfGenerateLoading = false;
            }
            else if (action.payload.callType === callTypes.pdf) {
                state.pdfLoading = false;
            }

            else if (action.payload.callType === callTypes.csv) {
                state.csvLoading = false;
            }
            else if (action.payload.callType === callTypes.xlsx) {
                state.excelLoading = false;
            }
            else {
                state.actionsLoading = false;
            }
        },
        startCall: (state, action) => {

            state.error = null;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            } else if (action.payload.callType === callTypes.pdfGenerate) {
                state.pdfGenerateLoading = true;
            }

            else {
                state.actionsLoading = true;
            }


        },

        stopCall: (state, action) => {
            state.pdfGenerateLoading = false;


        },

        applicantProfileFetched: (state, action) => {


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
        ApplicantProfileFetchedForEdit: (state, action) => {


            state.actionsLoading = false;
            state.dataForEdit = action.payload.dataForEdit;
            state.error = null;
        },


        ApplicantProfileDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;


            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },

        JobPostedStatus: (state, action) => {

            state.error = null;
            state.actionsLoading = false;

        },





        // applicantProfileCreated: (state, action) => {

        //     state.actionsLoading = false;
        //     state.error = null;
        //     state.entities.unshift(action.payload);
        // },


        applicantProfileCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;

            // Clone the payload to avoid direct mutation
            // let payload = JSON.stringify(action.payload);
            // let payloadObj = JSON.parse(payload);

            // // If basis_of_gratuityId is 0, set "Gross", if 1, set "Basis"
            // if (payloadObj.basis_of_gratuityId == 0) {

            //     payloadObj.basis_of_gratuity = "Gross";
            // } else if (payloadObj.basis_of_gratuityId == 1) {

            //     payloadObj.basis_of_gratuity = "Basis";
            // }

            // Add the modified payload to the beginning of the entities list
            state.entities.unshift(action.payload);
        },




        applicantProfileUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)


            state.entities = state.entities.map((entity) => {

                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedApplicantProfile);
                if (entity.Id === finalObj.Id) {
                    return finalObj;
                }
                return entity;
            });

        },

        pdfFetched: (state, action) => {
            state.pdfLoading = false;
        },

        csvFetched: (state, action) => {
            state.csvLoading = false;
        },

        excelFetched: (state, action) => {
            state.excelLoading = false;
        },


        startCall: (state, action) => {
            state.error = null;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            } else if (action.payload.callType === callTypes.pdfGenerate) {
                state.pdfGenerateLoading = true;
            } else {
                state.actionsLoading = true;
            }
        },





    },
});
