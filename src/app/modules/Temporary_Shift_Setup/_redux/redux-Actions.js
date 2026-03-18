import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { employeeTempShiftSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = employeeTempShiftSlice;

export const fetchEmployeeTemporaryShift = (queryParams) => async (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.list }));
    return requestFromServer
        .getAllEmployeeTempShiftSetup(queryParams)
        .then((response) => {
            dispatch(actions.TempShiftFetched(response));
        })
        .catch((error) => {
            error.clientMessage = "Can't fetch temporary shifts";
            dispatch(actions.catchError({ error, callType: callTypes.list }));
        });
};

export const fetchEditRecord = (id) => (dispatch) => {
    if (!id) return dispatch(actions.TempShiftFetchedForEdit(null));
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getEmployeeTempShiftSetupById(id)
        .then((response) => {
            const entity = response.data?.data;
            dispatch(actions.TempShiftFetchedForEdit({ userForEdit: entity }));
        })
        .catch((error) => {
            error.clientMessage = "Can't fetch temporary shift";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const saveRecord = (data, id, disableLoading, onHide) => (dispatch) => {
    const request = id
        ? requestFromServer.updateEmployeeTempShiftSetup(data)
        : requestFromServer.createEmployeeTempShiftSetup(data);

    return request
        .then((res) => {
            const entity = res.data?.data;
            if (entity) {
                if (id) dispatch(actions.TempShiftUpdated(entity));
                else dispatch(actions.TempShiftCreated(entity));
                disableLoading();
                toast.success(
                    id ? SERVER_MESSAGES.updatedSuccess : SERVER_MESSAGES.insertedSuccess,
                    { position: "top-right", autoClose: 5000 }
                );
                onHide();
            }
        })
        .catch((error) => {
            disableLoading();
            dispatch(actions.catchError({ error, callType: callTypes.action }));
            toast.error(
                error?.response?.data?.message || SERVER_MESSAGES.updatedFail,
                { position: "top-right", autoClose: 5000 }
            );
        });
};

export const deleteRecord = (id, disableLoading, onHide) => (dispatch) => {
    return requestFromServer
        .deleteEmployeeTempShiftSetup(id)
        .then(() => {
            dispatch(actions.TempShiftDeleted({ id }));
            disableLoading();
            toast.success(SERVER_MESSAGES.deletedSuccess, {
                position: "top-right",
                autoClose: 5000,
            });
            onHide();
        })
        .catch((error) => {
            disableLoading();
            toast.error(SERVER_MESSAGES.deletedFail, {
                position: "top-right",
                autoClose: 5000,
            });
        });
};

export const fetchAllEmployeeShiftList = () => async (dispatch) => {
    return await requestFromServer
        .getAllEmployeeShiftList({
            sortOrder: "DESC",
            pageSize: 1000,
            pageNumber: 1,
            filter: { searchQuery: "" },
        })
        .then((response) => {
            const entities = response?.data?.data?.rows || [];
            dispatch(actions.AllChildMenusFetch({  entities }));
        })
        .catch((error) => {
            dispatch(actions.AllChildMenusFetch({ entities: [] }));
        });
};