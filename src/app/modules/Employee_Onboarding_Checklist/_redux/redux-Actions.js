import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { EmployeeOnboardingChecklistSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = EmployeeOnboardingChecklistSlice;


export const fetchEmployeeOnboardingChecklist = (query) => async (dispatch) => {
  try {
    const res = await requestFromServer.getAllEmployeeOnboardingChecklist(query);
    const data = res.data?.data || {
      results: [],
      totalResults: 0,
      page: 1,
      limit: 10,
    };

    // Map employee name, department, responsible employee for table
    const mappedResults = (data.results || []).map((item) => ({
      ...item,
      employeeName: item.EmployeeDetail
        ? `${item.EmployeeDetail.firstName} ${item.EmployeeDetail.middleName || ""} ${item.EmployeeDetail.lastName}`
        : item.employeeName || "N/A",
      department: item.DepartmentDetail?.deptName || item.department || "-",
      responsibleEmployeeName: item.ResponsibleEmployeeDetail
        ? `${item.ResponsibleEmployeeDetail.firstName} ${item.EmployeeDetail.middleName || ""} ${item.ResponsibleEmployeeDetail.lastName}`
        : item.responsibleEmployeeName || "-",
      completionDate: item.completionDate ? new Date(item.completionDate) : null, // keep as Date
    }));

    dispatch(
      actions.checklistFetched({
        ...data,
        results: mappedResults,
      })
    );
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.list }));
  }
};

// READ BY EMPLOYEE
export const fetchEmployeeChecklistByEmployee = (employeeId) => async (dispatch) => {
  try {
    const res = await requestFromServer.getEmployeeOnboardingChecklistByEmployee(employeeId);
    dispatch(actions.checklistFetchedForEdit(res.data?.data));
    return res.data?.data || []; 
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    return [];
  }
};

// LOAD MASTER FROM SUBSIDIARY (BY EMPLOYEE)
export const loadMasterChecklistByEmployee = (body) => async (dispatch) => {
  try {
    const res = await requestFromServer.getMasterChecklistByEmployee(body);
    dispatch(actions.masterChecklistFetched(res.data?.data));
    return res.data?.data || [];  
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    return [];
  }
};

// CREATE
export const createEmployeeChecklist = (data, disableLoading, onHide) => async (dispatch, getState) => {
  try {
    const res = await requestFromServer.createEmployeeOnboardingChecklist(data);
    const createdRecords = res.data?.data || [];

    // Update redux state
    dispatch(actions.checklistCreated(createdRecords));

    toast.success(SERVER_MESSAGES.insertedSuccess);
    disableLoading();
    onHide();

    // REFRESH TABLE: get current query params from UI context
    const queryParams = getState().employee_onboarding_checklist.entities.queryParams || {};
    dispatch(fetchEmployeeOnboardingChecklist(queryParams));

  } catch (error) {
    disableLoading();
    toast.error(error?.response?.data?.message || "Failed to create checklist");
  }
};

// UPDATE
export const updateEmployeeChecklist = (data, disableLoading, onHide) => async (dispatch, getState) => {
  try {
    const res = await requestFromServer.updateEmployeeOnboardingChecklist(data);
    const updatedRecords = res.data?.data || [];

    // Update redux state
    dispatch(actions.checklistUpdated(updatedRecords));

    toast.success(SERVER_MESSAGES.updatedSuccess);
    disableLoading();
    onHide();

    // REFRESH TABLE: get current query params from UI context
    const queryParams = getState().employee_onboarding_checklist.entities.queryParams || {};
    dispatch(fetchEmployeeOnboardingChecklist(queryParams));

  } catch (error) {
    disableLoading();
    toast.error(error?.response?.data?.message || "Failed to update checklist");
  }
};


// DELETE
export const deleteEmployeeChecklist = (employeeId) => async (dispatch, getState) => {
  try {
    await requestFromServer.deleteEmployeeOnboardingChecklist(employeeId);
    dispatch(actions.checklistDeleted(employeeId));
    toast.success(SERVER_MESSAGES.deletedSuccess);
    
    // Refresh the list after deletion
    const queryParams = getState().employee_onboarding_checklist.entities.queryParams || {};
    dispatch(fetchEmployeeOnboardingChecklist(queryParams));
  } catch (error) {
    toast.error(error?.response?.data?.message || SERVER_MESSAGES.deletedFail);
  }
};
