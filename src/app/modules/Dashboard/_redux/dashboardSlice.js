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
  contactInfo: null,
  experienceInfo: null,
  skillsInfo: null,
  academicInfo: null,
  payrollData: null,
  reportingEmployee: null,
  loanList: [],
  holidayList: [],
  allJobVacancyList: [],
  allPostedJobVacancyList: [],
  allParentDept: [],
  //// dashbaord related service
  allDashboardAlerts: [],
  summaryData: {},
  summaryDetailData: null,
  allPayrollAccountList: [],
  announcement: [],
  allExitTypeList: [],
  allExitReasonList: [],
  currentAtt: null,
  getAllUserList: [],
  getAllAuditTablesNameList: [],
  fiscalyearBySubList: [],
  appraisalPeriodBySubList: [],
  departmentBySubIdsList: [],
  appraisalPeriodList: [],
  approvedResignedEmpList: [],
  allEarningList: [],
  separatedEmployee: null,
  salaryRoundingPolicy: [],
  geoLocation: [],
  profileDetailInfo: [],
  allFSApprovedEmp: [],
  allTaxYearSetupList: [],
  allowRequestBySenior: false,
  currentDateTime: null,
  allTicketTypeList: [],
  priorityLevelList: [],
  facilitatorEmployeeList: [],
  allFacilitatorTicketType: [],
  moduleRights: [],
  allUsers: [],
  allCustomers: [],
  allProjects: [],
  allTicketStatus: [],
  allTicket: [],
  ticket: {},
  allMasterTicketType: [],
  portalInfo: {},
  allCompanyEmployeesData: [],
  allCurrentParentTask: [],
  allAlertTask: [],
  dateWiseAttLogs: [],
  budgetyearBySubList: [],
  budgetRequestList: [],
  allCompDeptList: [],
  allDesignationByDeptList: [],
  allAssetMakeList: [],
  allAssetModelNameList: [],
  allAssetCategoryList: [],
  allRegisterAssetList: [],
  allPresentUnassignedCategoryList: [],
  allPresentUnassignedMakeCompanyList: [],
  allAssetInspectionList: [],
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
    AllPostedJobVacancyFetch: (state, action) => {
      state.allPostedJobVacancyList = action.payload;
    },
    AllParentDeptFetch: (state, action) => {
      state.allParentDept = action.payload;
    },

    AllPayrollAccountListFetch: (state, action) => {
      state.allPayrollAccountList = action.payload;
    },
    ///// dashboard related tickers
    AllDashboardAlertsFetch: (state, action) => {
      state.allDashboardAlerts = action.payload;
    },
    SummaryFetch: (state, action) => {
      state.summaryData = action.payload;
    },
    SummaryDetailFetch: (state, action) => {
      state.summaryDetailData = action.payload;
    },
    AnnouncementFetch: (state, action) => {
      state.announcement = action.payload;
    },

    AllExitReasonListFetch: (state, action) => {
      state.allExitReasonList = action.payload;
    },
    CurrentAttFetch: (state, action) => {
      state.currentAtt = action.payload;
    },
    CurrentDateTimeFetch: (state, action) => {
      state.currentDateTime = action.payload;
    },
    AllUserFetch: (state, action) => {
      state.getAllUserList = action.payload;
    },
    AllAuditTablesNameFetch: (state, action) => {
      state.getAllAuditTablesNameList = action.payload;
    },

    AllFiscalYearBySubListFetch: (state, action) => {
      state.fiscalyearBySubList = action.payload;
    },

    AllDepartmentBysSubIdsListFetch: (state, action) => {
      state.departmentBySubIdsList = action.payload;
    },
    AllAppraisalPeriodListFetch: (state, action) => {
      state.appraisalPeriodList = action.payload;
    },

    AllAppraisalPeriodBySubListFetch: (state, action) => {
      state.appraisalPeriodBySubList = action.payload;
    },

    AllApprovedResignedEmpListFetch: (state, action) => {
      state.approvedResignedEmpList = action.payload;
    },
    AllGeoLocationFetchedFetch: (state, action) => {
      state.geoLocation = action.payload;
    },


    AllEarningFetch: (state, action) => {
      state.allEarningList = action.payload;
    },

    SeparatedEmployeeFetch: (state, action) => {
      state.separatedEmployee = action.payload;
    },

    SalaryRoundingFetch: (state, action) => {
      state.salaryRoundingPolicy = action.payload;

    },

    ProfileDetailInfoFetch: (state, action) => {
      state.profileDetailInfo = action.payload;

    },

    FSApprovedEmpFetch: (state, action) => {
      state.allFSApprovedEmp = action.payload;

    },

    TaxYearSetupFetch: (state, action) => {
      state.allTaxYearSetupList = action.payload;

    },
    requestRaisedBySenior: (state, action) => {
      state.allowRequestBySenior = action.payload;

    },
    AllActiveCustomerFetch: (state, action) => {
      state.allCustomers = action.payload;
    },
    AllProjectFetch: (state, action) => {
      state.allProjects = action.payload;
    },
    AllTicketStatusFetch: (state, action) => {
      state.allTicketStatus = action.payload;
    },
    AllTicketFetch: (state, action) => {
      state.allTicket = action.payload;
    },
    TicketFetch: (state, action) => {
      state.ticket = action.payload;
    },
    FacilitatorEmployeeFetch: (state, action) => {
      state.facilitatorEmployeeList = action.payload;

    },


    AllFacilitatorTicketTypeFetch: (state, action) => {

      state.allFacilitatorTicketType = action.payload;

    },

    ModuleRightFetched: (state, action) => {
      state.moduleRights = action.payload;
    },
    UsersByCompanyFetched: (state, action) => {
      state.allUsers = action.payload;
    },
    AllMasterTicketTypeFetched: (state, action) => {
      state.allMasterTicketType = action.payload;
    },
    PortalInfoFetched: (state, action) => {
      state.portalInfo = action.payload;
    },
    AllCompanyEmployeesDataFetched: (state, action) => {
      state.allCompanyEmployeesData = action.payload;
    },

    AllCurrentParentTaskFetched: (state, action) => {
      state.allCurrentParentTask = action.payload;
    },

    AllAlertTaskFetched: (state, action) => {
      state.allAlertTask = action.payload;
    },

    DateWiseAttLogsFetched: (state, action) => {
      state.dateWiseAttLogs = action.payload;
    },

    AllBudgetYearBySubListFetch: (state, action) => {
      state.budgetyearBySubList = action.payload;
    },

    AllBudgetRequestFetch: (state, action) => {
      state.budgetRequestList = action.payload;
    },
    AllCompDeptFetch: (state, action) => {
      state.allCompDeptList = action.payload;
    },
    AllDesignationByhDeptFetch: (state, action) => {
      state.allDesignationByDeptList = action.payload;
    },

    AllAssetModelNameFetch: (state, action) => {
      state.allAssetModelNameList = action.payload;
    },
    AllRegisterAssetNameFetch: (state, action) => {
      state.allRegisterAssetList = action.payload;
    },

    AllPresentUnassignedCategoryFetch: (state, action) => {
      state.allPresentUnassignedCategoryList = action.payload;
    },


    AllPresentUnassignedMakeCompanyFetch: (state, action) => {
      state.allPresentUnassignedMakeCompanyList = action.payload;
    },


    AllAssetInspectionListFetch: (state, action) => {
      console.log("action.payload", action.payload);
      state.allAssetInspectionList = action.payload;
    },



  }
});
