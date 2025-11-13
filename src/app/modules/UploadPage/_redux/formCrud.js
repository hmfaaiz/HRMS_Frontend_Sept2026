import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


/**
 * Save Leave Data
 * 
 * @param {Object} body 
 * @returns res
 */
export function saveLeaveData(body) {
    return axios.post(`${USERS_URL}/upload/save-leave-data`, body);
}

export function saveAttendanceSheetData(body) {
    return axios.post(`${USERS_URL}/upload/save-attendance-data`, body);
}

export function saveLoanData(body) {
    return axios.post(`${USERS_URL}/upload/save-loan-data`, body);
}

export function saveEmployeeAttendanceSheetData(body) {
    return axios.post(`${USERS_URL}/upload/save-employee-attendance-data`, body);
}

export function saveEmployeeDynasoftAttendanceSheetData(body) {
    return axios.post(`${USERS_URL}/upload/save-dynasoft-employee-attendance`, body);
}

export function saveEmployeeProfileData(body) {
    return axios.post(`${USERS_URL}/upload/save-employee-profile-data`, body);
}