import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createDepartmentWiseBudget(body) {

  return axios.post(`${USERS_URL}/portal_department_wise_budget/create-portal-department-wise-budget`, body);
  
}


// Read
export function getAllDepartmentWiseBudget(body) {

  return axios.post(`${USERS_URL}/portal_department_wise_budget/read-all-portal-department-wise-budget`, body);
}

export function getDepartmentWiseBudgetById(body) {

  return axios.post(`${USERS_URL}/portal_department_wise_budget/read-portal-department-wise-budget`, body);
}

//Update
export function updateDepartmentWiseBudget(body) {
   
  return axios.put(`${USERS_URL}/portal_department_wise_budget/update-portal-department-wise-budget`, body);
}

//Delete
export function deleteDepartmentWiseBudget(body) {

  return axios.patch(`${USERS_URL}/portal_department_wise_budget/delete-portal-department-wise-budget`, body);
}

export function getEmployeeAuthorties(empId, workflowTypeId) {
  return axios.get(
    `${USERS_URL}/workflow_policy/get-employee-authorties/${empId}/${workflowTypeId}`
  );
}
