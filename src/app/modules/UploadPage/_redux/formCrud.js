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