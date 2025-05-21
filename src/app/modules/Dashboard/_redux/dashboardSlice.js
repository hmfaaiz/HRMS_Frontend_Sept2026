import { createSlice } from "@reduxjs/toolkit";

const initialDashboardState = {
  listLoading: false,
  allCenters: [],
  allSubCenter: [],
  allCountry: [],
  allEmployees: [],
  allSalaryReviewDateByEmpIdForDDL: [],
  allSubidiaryList: [],
  allEmployeesSalaryDDL: [],
  allBankBranch: [],
  allEearningDeductList: [],
  allCity: [],
  allCompanyBanks: [],
  allDept: [],
  allEarnings: [],
  allDeductions: [],
  allChildMenus: [],
  allPayrollPayableAccounts: [],
  allDegreeTitle: [],
  allStatus: [],
  allInstitution: [],
  allTeamsChildMenus: [],
  allRegionChildMenus: [],
  allReligionChildMenus: [],
  allEmpTypeChildMenus: [],
  allNationalities: [],
  allLocationChildMenus: [],
  allCurrencyCodeList: [],
  allDesignations: [],
  allPaymentModeList: [],
  allEmployeeGradeList: [],
  allCompanyList: [],
  allRelationCodeList: [],
  allParentMenus: [],
  cityCenters: [],
  allVehicles: [],
  standBy: [],
  onDuty: [],
  offDuty: [],
  lastTrips: [],
  alarmTime: [],
  incidentTypes: [],
  allPayrollAccounts: [],
  allCompensationBenefitsList: [],
  allCompensationBenefitsList: [],
  allAccountList: [],
  allHumanResourceRoleList: [],
  allLoanTypeList: [],
  allContractTypeList: [],
  allPayrolGroupList: [],
  allCycleTypeList: [],
  allReimbursementTypeList: [],
  allReimbursementConfigList: [],
  allPayrollMonthYearList: [],
  allHolidayTypeList: [],
  allEmployeeStatus: [],
  allEmployeesWithNoPermissionList: [],
  allEmpTypeDynamicChildMenus: [],
  allRosterPatternList: [],
  levelList: [], /// current Employee level report to
  employeeList: [], /// current Employee level report to employee
  logedInEmpoyee: null,
  leaveBalances: [],
  profileInfo: null,
  contactInfo: null,
  experienceInfo: null,
  skillsInfo: null,
  academicInfo: null,
  payrollData: null,
  reportingEmployee: null,
  loanList: [],
  holidayList: [],
  allJobVacancyList:[],
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialDashboardState,
  reducers: {
    AllPayrollPayableAccounts: (state, action) => {
      state.allPayrollPayableAccounts = action.payload;
    },
    AllBankBranchFetch: (state, action) => {
      state.allBankBranch = action.payload;
    },
    AllSubsidiaryFetch: (state, action) => {
      state.allSubidiaryList = action.payload;
    },
    AllCentersFetch: (state, action) => {
      state.allCenters = action.payload;
    },
    AllSubCenterFetch: (state, action) => {
      state.allSubCenter = action.payload;
    },
    AllCountryFetch: (state, action) => {
      state.allCountry = action.payload;
    },
    AllCityFetch: (state, action) => {
      state.allCity = action.payload;
    },
    AllDeptFetch: (state, action) => {
      state.allDept = action.payload;
    },

    AllActiveEmployeeFetch: (state, action) => {
      state.allEmployees = action.payload;
    },

    AllEmpSalaryReviewDate: (state, action) => {
      state.allSalaryReviewDateByEmpIdForDDL = action.payload;
    },

    allPayrollAccounts: (state, action) => {
      state.allPayrollAccounts = action.payload;
    },

    AllActiveEmployeeSalaryDDL: (state, action) => {
      state.allEmployeesSalaryDDL = action.payload;
    },

    AllActiveNationalityFetch: (state, action) => {
      state.allNationalities = action.payload;
    },

    AllEarningDeductionListFetch: (state, action) => {
      state.allEearningDeductList = action.payload;
    },

    AllCurrencyCodesListFetch: (state, action) => {
      state.allCurrencyCodeList = action.payload;
    },

    AllPaymentModeListFetch: (state, action) => {
      state.allPaymentModeList = action.payload;
    },

    AllEarningHeadsFetch: (state, action) => {
      state.allEarnings = action.payload;
    },

    AllCompensationBenefitsListFetch: (state, action) => {
      state.allCompensationBenefitsList = action.payload;
    },

    AllDeductionHeadsFetch: (state, action) => {
      state.allDeductions = action.payload;
    },

    AllChildMenusFetch: (state, action) => {
      state[action.payload.key] = action.payload.entities;
    },

    AllChildMenusForTeams: (state, action) => {
      state.allTeamsChildMenus = action.payload;
    },

    AllParentMenusFetch: (state, action) => {
      state.allParentMenus = action.payload;
    },

    AllCentersByCityIdFetch: (state, action) => {
      state.cityCenters = action.payload;
    },
    AllVehiclesByCenterAndSubCenterId: (state, action) => {
      state.allVehicles = action.payload;
    },
    AllBanksFetch: (state, action) => {
      state.allBanks = action.payload;
    },
    AllDesignationsFetch: (state, action) => {
      state.allDesignations = action.payload;
    },

    AllCompanyBanksFetch: (state, action) => {
      state.allCompanyBanks = action.payload;
    },
    dashboardVehicles: (state, action) => {
      state.standBy = action.payload.standBy;
      state.onDuty = action.payload.onDuty;
      state.offDuty = action.payload.offDuty;
    },
    lastTripsVehicles: (state, action) => {
      state.lastTrips = action.payload.rows;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
    updateData: (state, action) => {
      state.lastTrips = state.lastTrips.map((entity) => {
        if (entity.id === action.payload.id) {
          return action.payload;
        }

        return entity;
      });
    },
    AlaramTime: (state, action) => {
      state.alarmTime = action.payload;
    },
    AllIncidentTypes: (state, action) => {
      state.incidentTypes = action.payload;
    },
    AllAccountListFetch: (state, action) => {
      state.allAccountList = action.payload;
    },
    AllHumanResourceRoleListFetch: (state, action) => {
      state.allHumanResourceRoleList = action.payload.entities;
    },
    AllContractTypeListFetch: (state, action) => {
      state.allContractTypeList = action.payload;
    },

    AllPayrolGroupListFetch: (state, action) => {
      state.allPayrolGroupList = action.payload;
    },

    AllReimbursementConfigListFetch: (state, action) => {
      state.allReimbursementConfigList = action.payload;
    },
    AllPayrollMonthYearListFetch: (state, action) => {
      state.allPayrollMonthYearList = action.payload;
    },
    AllHolidayTypeListFetch: (state, action) => {
      state.allHolidayTypeList = action.payload;
    },

    AllEmployeesWithNoPermissionFetch: (state, action) => {
      state.allEmployeesWithNoPermissionList = action.payload;
    },
    AllPayrollConfigApproverPermissionFetch: (state, action) => {
      state.allPayrollConfigApproverPermissionList = action.payload;
    },

    AllRosterPatternFetch: (state, action) => {
      state.allRosterPatternList = action.payload;
    },
    EmployeeHierarchyFetched: (state, action) => {
      const { levelList, employeeList } = action?.payload;
      state.levelList = levelList;
      state.employeeList = employeeList;
    },
    fetchLogedInInEmployee: (state, action) => {
      const data = action?.payload;
      state.logedInEmpoyee = data;
    },
    LeaveBalancesFetched: (state, action) => {
      const leaveBalances = action.payload.data?.data;
      state.listLoading = false;
      state.error = null;
      state.leaveBalances = leaveBalances;
    },
    ProfileInfoFetched: (state, action) => {
      state.error = null;
      state.profileInfo = action.payload;
    },
    ContactInfoFetched: (state, action) => {
      state.error = null;
      state.contactInfo = action.payload;
    },
    ExperienceInfoFetched: (state, action) => {
      state.error = null;
      state.experienceInfo = action.payload;
    },
    AcademicInfoFetched: (state, action) => {
      state.error = null;
      state.academicInfo = action.payload;
    },
    SkillsInfoFetched: (state, action) => {
      state.error = null;
      state.skillsInfo = action.payload;
    },
    ReportingEmployeeFetched: (state, action) => {
      state.error = null;
      state.reportingEmployee = action.payload;
    },
    PayrollMonthFetched: (state, action) => {
      const payrollData = action?.payload?.payrollData;
      state.error = null;
      state.payrollData = payrollData;
    },
    AllLoanTypeFetch: (state, action) => {
      state.allLoanTypeList = action.payload;
    },
    AllLoanFetch: (state, action) => {
      state.loanList = action.payload;
    },
    AllHolidayFetch: (state, action) => {
      state.holidayList = action.payload;
    },

    AllJobVacancyFetch: (state, action) => {
      state.allJobVacancyList = action.payload;
   
 
    },
  },
});
