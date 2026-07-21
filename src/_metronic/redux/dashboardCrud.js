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

export const getAllEarningDeductionList = async (Id, subsidiaryId, employeeId, excludeBasic = false) => {
  return await axios.post(`${USERS_URL}/stoppage/read-earning-deduction-list`, {
    flag: Id,
    subsidiaryId: subsidiaryId,
    employeeId: employeeId,
    excludeBasic: excludeBasic
  });
};

export const getAllEmp_Compensation_Benefits_DDL = async () => {
  return await axios.post(
    `${USERS_URL}/compensation/read-all-compensation-benefits-ddl`
  );
};

export const getAllActiveEmployees = async (body) => {
  return await axios.post(`${USERS_URL}/settings/read-all-profile`,body);
};

export const getAllActiveEmployeesBySubsidiary = async (body) => {
  return await axios.post(`${USERS_URL}/settings/read-all-profile-by-subsidiary`,body);
};

export const getAllEmployeeSalaryReviewForDDL = async (employeeId) => {
  return await axios.post(
    `${USERS_URL}/settings/read-salary-revision-by-employeeId`,
    { employeeId: employeeId }
  );
};

export const getAllActiveEmployeesSalaryForDDL = async (employeeId) => {
  return await axios.post(
    `${USERS_URL}/employee_salary_earning/read-all-employee-salary-ddl`,
    {
      employeeId: employeeId,
    }
  );
};

export const getCityByCountryId = async (countryId) => {
  return await axios.post(`${USERS_URL}/settings/read-all-cities-master-data`, {
    countryId: countryId,
  });
};

export const getAllBanks = async (Id) => {
  return await axios.get(`${USERS_URL}/settings/read-all-banks`, {
    Id: Id,
  });
};

export const getAllBankBranch = async (Id) => {

  return await axios.post(`${USERS_URL}/settings/read-all-branch`,Id);
};

export const getAllEarningHeads = async (Id) => {
  return await axios.get(`${USERS_URL}/earning/read-all-earning`, {
    Id: Id,
  });
};

export const getAllDepartments = async (Id) => {
  return await axios.post(`${USERS_URL}/settings/read-all-dept`, {
    Id: Id,
  });
};

export const getAllFormMenus = async (Id, text=null,mergeLabel=false) => {
  return await axios.post(`${USERS_URL}/settings/read-all-form`, {
    Id: Id,
    text: text,
    mergeLabel:mergeLabel
  });
};

export const getAllLeaveTypes = async (body) => {
  return await axios.post(`${USERS_URL}/settings/read-all-leave-types`,body);
};

export const getAllLeaveTypesBySubsidiary = async (body) => {
  return await axios.post(`${USERS_URL}/settings/read-all-leave-types-by-subsidiary`,body);
};

export const getAllEmployeeShift = async (body) => {
  return await axios.post(`${USERS_URL}/settings/read-all-employee-shift`,body);
};

export function getPayrollMonth() {
  return axios.post(`${USERS_URL}/payroll_month/get-payroll-month-previous-date`);
}

export function getActiveFiscalYear(body) {
  return axios.post(`${USERS_URL}/settings/read-current-fiscal-year`,body);
}

export const getAllEncashmentLeaveTypes = async (body) => {
  return await axios.post(`${USERS_URL}/settings/read-encashment-leave-types`,body);
};

export const getAllSubsidiary = async (Id) => {
  return await axios.get(`${USERS_URL}/settings/read-all-subsidiaries`);
};

export const getAllFiscalYear = async (body) => {
  return await axios.post(`${USERS_URL}/settings/read-all-fiscal-year`,body);
};

export const getAllParentDepartments = async (Id) => {
  return await axios.get(`${USERS_URL}/settings/read-all-parentDept`, {
    Id: Id,
  });
};

export const getVehiclesByCenterAndSubcenterId = async (body) => {
  return await axios.post(
    `${USERS_URL}/settings/read-all-vehicles-by-centerId-master-data`,
    body
  );
};

export const getDashboardVehicle = async (body) => {
  return await axios.post(
    `${USERS_URL}/settings/read-all-vehicles-dashboard`,
    body
  );
};

export const updateVehicleStatus = async (body) => {
  return await axios.put(`${USERS_URL}/vehicles/update-vehicle-status`, body);
};

export const getLastTrips = async (body) => {
  return await axios.post(
    `${USERS_URL}/drivertriplog/read-all-driver-trip-logs-by-vehicleId`,
    body
  );
};

export const updateTripLog = async (payload) => {
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

export const getLastBookingNo = async (bookingNo) => {
  return await axios.post(`${USERS_URL}/settings/get-max-booking-no`, {
    bookingNo: bookingNo,
  });
};

export const getLastTableId = async (tableName, pkIdColumn,whereClause) => {
  return await axios.post(`${USERS_URL}/settings/get-max-tableId`, {
    tableName: tableName,
    pkIdColumn: pkIdColumn,
    whereClause: whereClause
  });
};

export const getLastDeductionNo = async (bookingNo) => {
  return await axios.post(`${USERS_URL}/settings/get-max-booking-no`, {
    bookingNo: bookingNo,
  });
};

export const getEmployeeProfileById = async (id) => {
  return await axios.get(`${USERS_URL}/profile/read-profile-view/${id}`);
};

export const getAllHumanResourceRole = async () => {
  return await axios.get(
    `${USERS_URL}/settings/read-all-roles-master-data`,
    {}
  );
};

export const getAllReimbursementConfigList = async () => {
  return await axios.post(
    `${USERS_URL}/reimbursement_configuration/read-all-reimbursement-configuration`,
    {
      filter: {
        searchQuery: "",
      },
      pageSize: 4,
      pageNumber: 1,
    }
  );
};


export const getAllPayrollMonthYearList  = async (body) => {
  return await axios.post(
    `${USERS_URL}/reimbursement_claim/read-payroll-month`,{
      body
    });
};

export const getAllCompany = async (Id) => {
  return await axios.get(`${USERS_URL}/settings/read-all-companies`);
};

export const getAllEmployeesWithNoPermission = async (Id) => {
  return await axios.get(`${USERS_URL}/settings/read-all-profile-with-no-permission`);
};
/**
 * 
 * Download Excel Templates
 * 
 * @param {Object} body 
 * @returns res
 */
export async function downloadTemplate(body) {
  return axios.post(`${USERS_URL}/upload/download-template`, body,{
    responseType:'arraybuffer'
  });
}

export const getPayrollConfigApproverPermission = async () => {
  return await axios.get(
    `${USERS_URL}/settings/get-approval-authoritise-permission`,
    {}
  );
};


export const getAllRosterPattern = async () => {
  return await axios.get(
    `${USERS_URL}/settings/read-all-roster-pattern`,
    {}
  );
};





export function getAllLoanType(body) {
  return axios.post(`${USERS_URL}/settings/read-all-loan-type`,
    body
  );

  
}

export function getAllJobVacancy(body) {
  return axios.post(`${USERS_URL}/settings/read-all-job-vacancy`,
    body
  );
};


export function getAllPostedJobVacancy(body) {
  return axios.post(`${USERS_URL}/settings/read-all-posted-job-vacancy`,
    body
  );
};

export const getAllParentDepartment = async (Id) => {
  return await axios.post(`${USERS_URL}/settings/read-all-parent-dept`, {
    Id: Id,
  });
};

export const getAllPayrollAccount = async (Id) => {
  return await axios.post(`${USERS_URL}/settings/read-all-payroll-account`, {
    Id: Id,
  });
};

export const getAllDesignationByGradeId = async (Id) => {
  return await axios.post(`${USERS_URL}/settings/read-all-designation-by-gradeId`, {
    Id: Id,
  });
};

export const getAllChartOfAccounts = async (Id, accountType=null) => {
  return await axios.post(`${USERS_URL}/settings/read-all-chart-of-accounts`, {
    Id: Id,
    accountType: accountType,
  });
};










//fetch all ticket types


// Fetch all ticket types by parentId (545)
// export function fetchAllTicketTypes(parentId) {
//   return axios.post(`${USERS_URL}/forms/read-all-forms-menu`, {
//     filter: { parentId: parentId },
//     sortOrder: "asc",
//     pageNumber: 1,
//     pageSize: 1000,
//   });
// }


export const getAllSpecialLeaveTypes = async (body) => {
  return await axios.post(`${USERS_URL}/settings/read-all-special-leave-types`,body);
};

export const getAllParentSubsidiaries = async () => {
  return await axios.get(`${USERS_URL}/subsidiary/read-all-parent-subsidiaries`);
};
