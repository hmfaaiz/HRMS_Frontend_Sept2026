import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create checklist
export function createSubsidiaryChecklist(body) {
    return axios.post(`${API_URL}/onboarding_checklist/create-onboarding-checklist`, body);
}

// Read all
export function getAllSubsidiaryChecklist(body) {
    return axios.post(`${API_URL}/onboarding_checklist/read-all-onboarding-checklist`, body);
}

// Read by Id
export function getSubsidiaryChecklistById(id) {
    return axios.get(`${API_URL}/onboarding_checklist/read-onboarding-checklist/${id}`);
}

// Update
export function updateSubsidiaryChecklist(body) {
    return axios.put(`${API_URL}/onboarding_checklist/update-onboarding-checklist`, body);
}

// Delete
export function deleteSubsidiaryChecklist(body) {
    return axios.patch(`${API_URL}/onboarding_checklist/delete-onboarding-checklist`, body);
}


export function getSubsidiaryChecklistBySubsidiaryId(subsidiaryId) {
  return axios.get(`${API_URL}/onboarding_checklist/read-onboarding-checklist/${subsidiaryId}`);
}


/**
 * Upload File or Image
 *
 * @param {Object} body
 * @returns res
 */
export function uploadImage(body) {
  return axios.post(`${API_URL}/file-upload`, body);
}