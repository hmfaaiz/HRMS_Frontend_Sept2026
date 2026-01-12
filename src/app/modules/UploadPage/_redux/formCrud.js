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

export function saveEmployeeSalaryData(body) {
    return axios.post(`${USERS_URL}/upload/save-employee-salary-data`, body);
}

export function saveEmployeeSocialSecruityData(body) {
    return axios.post(`${USERS_URL}/upload/save-employee-social-security-data`, body);
}

export function saveEmployeeEOBIData(body) {
    return axios.post(`${USERS_URL}/upload/save-employee-eobi-data`, body);
}
export function saveEmployeeGratuityData(body) {
    return axios.post(`${USERS_URL}/upload/save-employee-gratuity-data`, body);
}

export function saveEmployeePFData(body) {
    return axios.post(`${USERS_URL}/upload/save-employee-pf-data`, body);
}

export function saveEmployeeIncomeTaxData(body) {
    return axios.post(`${USERS_URL}/upload/save-employee-incometax-data`, body);
}

export function saveEmployeeRosterData(body) {
    return axios.post(`${USERS_URL}/upload/save-employee-roster-data`, body);
}

export function saveEmployeeOneTimeEarningDeductionData(body) {
    return axios.post(`${USERS_URL}/upload/save-employee-onetime-allowance-data`, body);
}


export function saveEmployeeGoalSetupData(body) {
    return axios.post(`${USERS_URL}/upload/save-employee-goal-setup-data`, body);
}