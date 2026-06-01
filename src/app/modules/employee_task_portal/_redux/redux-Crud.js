import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

// POST paginated list of employee tasks
export function getEmployeeTasks(queryParams) {
  return axios.post(
    `${BASE_URL}/employee_task/read-all-employee-task`,
    queryParams
  );
}

// POST single task detail for modal
export function getEmployeeTaskById(body) {
  return axios.post(
    `${BASE_URL}/employee_task/read-employee-task-by-id`,
    body
  );
}

// POST handle employee task
export function handleEmployeeTask(body) {
  return axios.post(
    `${BASE_URL}/employee_task/handle-employee-task`,
    body
  );
}

// POST paginated list of exit clearance
export function getExitClearanceTasks(queryParams) {
  return axios.post(
    `${BASE_URL}/employee_task/read-all-exit-clearance`,
    queryParams
  );
}

// POST single exit clearance detail for modal
export function getExitClearanceById(body) {
  return axios.post(
    `${BASE_URL}/employee_task/read-exit-clearance-by-id`,
    body
  );
}

// POST handle exit clearance
export function handleExitClearance(body) {
  return axios.post(
    `${BASE_URL}/employee_task/handle-exit-clearance`,
    body
  );
}
