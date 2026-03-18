import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create Temporary Shift
export function createEmployeeTempShiftSetup(body) {
    return axios.post(`${API_URL}/temporary_shift_setup/create-temporary-shift-setup`, body);
}

// Get All Temporary Shifts (paginated)
export function getAllEmployeeTempShiftSetup(body) {
    return axios.post(`${API_URL}/temporary_shift_setup/read-all-temporary-shift-setup`, body);
}

// Get Single Temporary Shift by ID
export function getEmployeeTempShiftSetupById(id) {
    return axios.get(`${API_URL}/temporary_shift_setup/read-temporary-shift-setup/${id}`);
}

// Update Temporary Shift
export function updateEmployeeTempShiftSetup(body) {
    return axios.put(`${API_URL}/temporary_shift_setup/update-temporary-shift-setup`, body);
}

// Delete Temporary Shift
export function deleteEmployeeTempShiftSetup(id) {
    return axios.delete(`${API_URL}/temporary_shift_setup/delete-temporary-shift-setup/${id}`);
}

// Get All Employee Shift List for dropdown
export async function getAllEmployeeShiftList(body) {
    return axios.post(`${API_URL}/employee_shift/read-all-employee-shift`, body);
}