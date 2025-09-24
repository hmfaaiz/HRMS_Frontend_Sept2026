import axios from "axios";
export const USERS_URL = process.env.REACT_APP_API_URL;

export const getAllSubcenter = async (centerId) => {
  return await axios.post(
    `${USERS_URL}/settings/read-all-subcenters-master-data`,
    { centerId: centerId }
  );
};

export const getAllCountry = async () => {
  return await axios.get(
    `${USERS_URL}/settings/read-all-countries-master-data`
  );
};

export const getAllBanks = async () => {
  return await axios.get(`${USERS_URL}/settings/read-all-banks`);
};

export const getAllDepartments = async () => {
  return await axios.get(`${USERS_URL}/settings/read-all-dept`);
};

export const getCityByCountryId = async (countryId) => {
  return await axios.post(`${USERS_URL}/settings/read-all-cities-master-data`, {
    countryId: countryId,
  });
};

export const getVehiclesByCenterAndSubcenterId = async (body) => {
  return await axios.post(
    `${USERS_URL}/settings/read-all-vehicles-by-centerId-master-data`,
    body
  );
};

export const getDashboardVehicle = async (body) => {
  // console.log("Dashboard Request body", body);
  return await axios.post(
    `${USERS_URL}/settings/read-all-vehicles-dashboard`,
    body
  );
};

export const updateVehicleStatus = async (body) => {
  return await axios.put(`${USERS_URL}/vehicles/update-vehicle-status`, body);
};

export const getLastTrips = async (body) => {
  // console.log("Call in crud", body);
  return await axios.post(
    `${USERS_URL}/drivertriplog/read-all-driver-trip-logs-by-vehicleId`,
    body
  );
};

export const updateTripLog = async (payload) => {
  // console.log("payload in crud", payload);
  return await axios.put(
    `${USERS_URL}/drivertriplog/update-driver-trip-log`,
    payload
  );
};

export const getAlaramTime = async () => {
  return await axios.get(
    `${USERS_URL}/settings/read-all-alarmtimes-master-data`
  );
};

export function getEmployeeHierarchy(level) {
  return axios.get(`${USERS_URL}/settings/employee_hierarchy/${level}`);
}

export const getEmployeeProfile = async () => {
  return await axios.get(`${USERS_URL}/profile/read-profile`);
};

export async function getAllLeaveBalances(body) {
  return axios.post(
    `${USERS_URL}/leave_request/read-all-employee-leave-balance`,
    body
  );
}

export async function getProfileInfo(body) {
  return axios.post(`${USERS_URL}/emp_portal/read-profile-by-empId`, body);
}

export async function getContactInfo(body) {
  return axios.post(`${USERS_URL}/emp_portal/read-contact-by-empId`, body);
}

export async function getExperienceInfo(body) {
  return axios.post(`${USERS_URL}/emp_portal/read-experience-by-empId`, body);
}

export async function getAcademicInfo(body) {
  return axios.post(`${USERS_URL}/emp_portal/read-all-academic-by-empId`, body);
}

export async function getSkillsInfo(body) {
  return axios.post(`${USERS_URL}/emp_portal/read-all-skills-by-empId`, body);
}

export async function getReportingEmployee(body) {
  return axios.post(
    `${USERS_URL}/emp_portal/read-reporting-profile-by-empId`,
    body
  );
}

export async function getLoanDetail(body) {
  return axios.post(
    `${USERS_URL}/emp_portal/read-employee-loan-request-by-empId`,
    body
  );
}

export async function getHolidayDetail(body) {
  return axios.post(`${USERS_URL}/emp_portal/read-holidays-by-empId`, body);
}

export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body
  );
}

//// dashbaord related service

export function getDashboardAlert(body) {
  return axios.post(`${USERS_URL}/dashboard/dashboard-alert`,body);
}

export function getSummary(filter) {
  return axios.post(`${USERS_URL}/dashboard/summary`, filter );
}

export function getSummaryDetail(filter) {
  return axios.post(`${USERS_URL}/dashboard/summary-detail`, filter );
}

export function getRecruitmentSummary(filter) {
  return axios.post(`${USERS_URL}/dashboard/recruitment-summary`, filter );
}


export function getAnnouncment(filter) {
  return axios.get(`${USERS_URL}/dashboard/announcement` );
}
export function getExitReason(id) {
 
  return axios.get(`${USERS_URL}/settings/read-all-exit-reason/${id}`);
}

export async function getAttendance() {
  return axios.get(`${USERS_URL}/emp_portal/read-attendance`);
}

export async function createAttendance(body) {
  return axios.post(`${USERS_URL}/emp_portal/create-attendance` , body);
}
export async function getAllUser(body) {
  return axios.post(`${USERS_URL}/settings/read-all-users` , body);
}
export async function getAllAuditTablesName(body) {
  return axios.post(`${USERS_URL}/settings/read-all-audit-table-names` , body);
}
