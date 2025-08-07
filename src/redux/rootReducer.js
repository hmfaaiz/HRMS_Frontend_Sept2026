import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "../app/modules/Auth/_redux/authRedux";
import { customersSlice } from "../app/modules/ECommerce/_redux/customers/customersSlice";
import { productsSlice } from "../app/modules/ECommerce/_redux/products/productsSlice";
import { remarksSlice } from "../app/modules/ECommerce/_redux/remarks/remarksSlice";
import { usersSlice } from "../app/modules/UserMangement/_redux/usersSlice";
import { specificationsSlice } from "../app/modules/ECommerce/_redux/specifications/specificationsSlice";
import { rolesSlice } from "../app/modules/Settings/_redux/roles/rolesSlice";

import { dashboardSlice } from "../app/modules/Dashboard/_redux/dashboardSlice";

import { bankSlice } from "../app/modules/Banks/_redux/bankSlice";

import { tax_slabSlice } from "../app/modules/Tax_Slab/_redux/redux-Slice";
import { branchSlice } from "../app/modules/BankBranch/_redux/branchSlice";
import { deptSlice } from "../app/modules/Department/_redux/deptSlice";
import { empTypeSlice } from "../app/modules/EmployeeType/_redux/employeeTypeSlice";
import { religionSlice } from "../app/modules/Religion/_redux/religionSlice";
import { regionSlice } from "../app/modules/Region/_redux/regionSlice";
import { designationSlice } from "../app/modules/Designation/_redux/designationSlice";
import { formSlice } from "../app/modules/Forms/_redux/formsSlice";
import { formDetailsSlice } from "../app/modules/FormDetails/_redux/formdetailsSlice";
import { empPolicySlice } from "../app/modules/EmployeePolicy/_redux/employeePolicySlice";
import { policySlice } from "../app/modules/Policy/_redux/policySlice";
import { empProfileSlice } from "../app/modules/EmployeeProfile/_redux/employeeProfileSlice";
import { contactSlice } from "../app/modules/Contact/_redux/contactSlice";
import { academicSlice } from "../app/modules/Academic/_redux/academicSlice";
import { experienceSlice } from "../app/modules/Experience/_redux/experienceSlice";
import { skillslice } from "../app/modules/Skills/_redux/skillSlice";
import { incidentSlice } from "../app/modules/incident/_redux/incidentSlice";
import { earningSlice } from "../app/modules/Eearning/_redux/earningSlice";
import { deductionSlice } from "../app/modules/Deduction/_redux/deductionSlice";
import { stoppageAllowanceSlice } from "../app/modules/StoppageAllowance/_redux/stoppageAllowanceSlice";
import { exchangeRateSlice } from "../app/modules/ExchangeRate/_redux/exchangeRateSlice";
import { compensationBenefitsSlice } from "../app/modules/compensation_benefits/_redux/compensationBenefitsSlice";
import { earning_transactionSlice } from "../app/modules/Compensation_Earning_Transaction/_redux/earning_transactionSlice";
import { deduction_transactionSlice } from "../app/modules/Compensation_Deduction_Transaction/_redux/deduction_transactionSlice";
import { employeeSalaryEarningSlice } from "../app/modules/Employee_Salary_Earning/_redux/employeeSalaryEarningSlice";
import { employeeSalary_DeductionSlice } from "../app/modules/Employee_Salary_Deduction/_redux/employeeSalary_DeductionSlice";
import { employeeSalarySlice } from "../app/modules/Employee_Salary_Setup/_redux/employeeSalarySlice";
import { employeeSalaryExpSlice } from "../app/modules/Employee_Salary_Expatriate/_redux/employeeSalaryExpSlice";
import { compensationExpSlice } from "../app/modules/Compensation_Expatriate/_redux/compensationExpSlice";
import { employee_transfer_slice } from "../app/modules/Employee_Transfer/_redux/employee_transfer_slice";
// import { SalaryRevisionSlice } from "../app/modules/Employee_Salary_Revision/_redux/SalaryRevisionSlice";

import { fiscalSetupSlice } from "../app/modules/Fiscal_Setup/_redux/fiscalSetupSlice";
import { PayrollMonthSlice } from "../app/modules/Payroll_Month_Setup/_redux/PayrollMonthSlice";
import { ArrearSetupSlice } from "../app/modules/ArrearPolicy/_redux/arrearPolicySlice";
import { SalaryRoundingPolicySlice } from "../app/modules/SalaryRoundingPolicy/_redux/salaryRoundingPolicySlice";
import { LeaveTypeSlice } from "../app/modules/LeaveType/_redux/leaveTypeSlice";
import { FinalSettlementPolicySlice } from "../app/modules/Final_Settlement_Policy/_redux/FinalSettlementPolicySlice";
import { salarypolicySlice } from "../app/modules/Salarypolicy/_redux/salarypolicySlice";
import { OnetimeAllowanceSlice } from "../app/modules/Onetime_Allowance/_redux/OnetimeAllowanceSlice";
import { LoanTypeSlice } from "../app/modules/LoanType/_redux/LoanTypeSlice";
import { leaveManagementConfigurationSlice } from "../app/modules/leaveManagementConfiguration/_redux/leaveManagementConfigurationSlice";
import { payroll_policySlice } from "../app/modules/Payroll_Process_Policy/_redux/payroll_policySlice";
import { LeaveApplicationSlice } from "../app/modules/LeaveApplication/_redux/LeaveApplicationSlice";
import { taxSetupSlice } from "../app/modules/Tax_Setup/_redux/taxSetupSlice";
import { loan_manag_confSlice } from "../app/modules/Loan_manag_conf/_redux/redux-Slice";
import { employee_loan_requestSlice } from "../app/modules/Employee_Loan_Request/_redux/redux-Slice";
import { AllocateLeavesSlice } from "../app/modules/AllocateLeaves/_redux/AllocateLeavesSlice";
import { EmployeeLeaveBalanceSlice } from "../app/modules/EmployeeLeaveBalance/_redux/EmployeeLeaveBalanceSlice";
import { gratuity_configurationSlice } from "../app/modules/Gratuity_Configuration/_redux/redux-Slice";
import { accrue_gratuity_configurationSlice } from "../app/modules/Accrue_Gratuity_Configuration/_redux/redux-Slice";
import { reimbursement_configurationSlice } from "../app/modules/Reimbursement_Configuration/_redux/redux-Slice";
import { reimbursement_claimSlice } from "../app/modules/Reimbursement_claim/_redux/redux-Slice";
import { LeaveEncashmentSlice } from "../app/modules/LeaveEncashment/_redux/LeaveEncashmentSlice";
import { EmployeeRosterSlice } from "../app/modules/EmployeeRoster/_redux/EmployeeRosterSlice";
import { AttendanceConfigurationSlice } from "../app/modules/Attendance_Configuration/_redux/attendanceConfigSlice";
import { employeeShiftSlice } from "../app/modules/Employee_Shift/_redux/employeeShiftSlice";
import { HolidaysSlice } from "../app/modules/Holidays/_redux/redux-Slice";
import { payroll_processSlice } from "../app/modules/Payroll_Process/_redux/redux-Slice";
import { AttendanceSlice } from "../app/modules/Attendance/_redux/AttendanceSlice";
import { LeaveRegisterSlice } from "../app/modules/LeaveRegister/_redux/LeaveRegisterSlice";
import { PayrollRegisterSlice } from "../app/modules/PayrollRegister/_redux/PayrollRegisterSlice";
import { UserSlice } from "../app/modules/User/_redux/redux-Slice";
import { passwordSlice } from "../app/modules/Reset_Password/_redux/redux-Slice";

import { EmployeeRegisterSlice } from "../app/modules/EmployeeRegister/_redux/EmployeeRegisterSlice";
import { roster_patternSlice } from "../app/modules/Roster_Pattern/_redux/redux-Slice";
import { CompanySlice } from "../app/modules/Company/redux/companySlice";
import { SubsidiarySlice } from "../app/modules/Subsidiary/redux/subsidiarySlice";
import { LeaveRequestSlice } from "../app/modules/LeaveRequest/_redux/LeaveApplicationSlice";
import { workflowPolicySlice } from "../app/modules/WorkflowPolicy/redux/formSlice";
import { HODSlice } from "../app/modules/HOD_Setup/redux/formSlice";
import { CalendarSlice } from "../app/modules/Calendar/_redux/redux-Slice";
import { LeaveCalendarSlice } from "../app/modules/Leave_Calendar/_redux/redux-Slice";
import { RosterCalendarSlice } from "../app/modules/Roster_Calendar/_redux/redux-Slice";
import { AttendanceCalendarSlice } from "../app/modules/Attendance_Calendar/_redux/redux-Slice";
import { LeaveApprovalSlice } from "../app/modules/LeaveApproval/redux/formSlice";
import { AttendanceRequestSlice } from "../app/modules/AttendanceRequest/_redux/AttendanceRequestSlice";
import { AttendanceApprovalSlice } from "../app/modules/AttendanceApproval/redux/formSlice";
import { PayrollPreviewSlice } from "../app/modules/PayrollPreview/_redux/PayrollPreviewSlice";
import { LoanRegisterSlice } from "../app/modules/LoanRegister/_redux/EmployeeRegisterSlice";
import { ReimbursementRegisterSlice } from "../app/modules/ReimbursementRegister/_redux/ReimbursementRegisterSlice";
import { JobVacancySlice } from "../app/modules/JobVacancy/_redux/redux-Slice";
import { LoanRequestSlice } from "../app/modules/Loan_Request/_redux/redux-Slice";
import { LoanApprovalSlice } from "../app/modules/LoanApproval/redux/formSlice";
import { ApplicantProfileSlice } from "../app/modules/ApplicantProfile/_redux/redux-Slice";
import { InterviewScheduleSlice } from "../app/modules/Interview_Schedule/_redux/formSlice";
import { ResumeSearchEngineSlice } from "../app/modules/ResumeSearchEngine/_redux/redux-Slice";
import { JobOfferSlice } from "../app/modules/Job_Offer/_redux/formSlice";
import { RecruitmentDashboardSlice } from "../app/modules/RecruitmentDashboard/_redux/redux-Slice";
import { LeaveWorkflowStatusSlice } from "../app/modules/LeaveWorkflowStatus/redux/formSlice";
import { LoanWorkflowStatusSlice } from "../app/modules/LoanWorkflowStatus/redux/formSlice";
import { AttendanceWorkflowStatusSlice } from "../app/modules/AttendanceWorkflowStatus/redux/formSlice";
import { TeamLeaveCalendarSlice } from "../app/modules/Leave_Calendar_Team/_redux/redux-Slice";
import { TeamAttendanceCalendarSlice } from "../app/modules/Attendance_Calendar_Team/_redux/redux-Slice";
import { PortalHolidayCalendarSlice } from "../app/modules/PortalHolidayCalendar/_redux/redux-Slice";
import { EmpSalaryRevisionSlice } from "../app/modules/Emp_Salary_Revision/_redux/redux-Slice";
import { NewsEventTickerSlice } from "../app/modules/NewsEventTicker/_redux/redux-Slice";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  dashboard: dashboardSlice.reducer,
  customers: customersSlice.reducer,
  products: productsSlice.reducer,
  remarks: remarksSlice.reducer,
  specifications: specificationsSlice.reducer,
  users: usersSlice.reducer,
  roles: rolesSlice.reducer,
  company: CompanySlice.reducer,
  bank: bankSlice.reducer,
  branch: branchSlice.reducer,
  dept: deptSlice.reducer,
  empType: empTypeSlice.reducer,
  religion: religionSlice.reducer,
  region: regionSlice.reducer,
  designation: designationSlice.reducer,
  form: formSlice.reducer,
  formDetails: formDetailsSlice.reducer,
  emppolicy: empPolicySlice.reducer,
  policy: policySlice.reducer,
  profile: empProfileSlice.reducer,
  contact: contactSlice.reducer,
  academic: academicSlice.reducer,
  experience: experienceSlice.reducer,
  skills: skillslice.reducer,
  incident: incidentSlice.reducer,
  earning: earningSlice.reducer,
  deduction: deductionSlice.reducer,
  stoppage: stoppageAllowanceSlice.reducer,
  exchange: exchangeRateSlice.reducer,
  compensation: compensationBenefitsSlice.reducer,
  earning_transaction: earning_transactionSlice.reducer,
  deduction_transaction: deduction_transactionSlice.reducer,
  employee_salary_earning: employeeSalaryEarningSlice.reducer,
  employee_salary_deduction: employeeSalary_DeductionSlice.reducer,
  employee_salary: employeeSalarySlice.reducer,
  salary_expatriate: employeeSalaryExpSlice.reducer,
  compensation_expatriate: compensationExpSlice.reducer,
  employee_transfer: employee_transfer_slice.reducer,
  // salary_revision: SalaryRevisionSlice.reducer,
  tax_setup: taxSetupSlice.reducer,
  fiscal_setup: fiscalSetupSlice.reducer,
  payroll_month: PayrollMonthSlice.reducer,
  arrear_policy: ArrearSetupSlice.reducer,
  salary_rounding_policy: SalaryRoundingPolicySlice.reducer,
  leave_type: LeaveTypeSlice.reducer,
  final_settlement_policy: FinalSettlementPolicySlice.reducer,
  salary_policy: salarypolicySlice.reducer,
  onetime_earning: OnetimeAllowanceSlice.reducer,
  loan_type: LoanTypeSlice.reducer,
  leave_management_configuration: leaveManagementConfigurationSlice.reducer,
  payroll_process_policy: payroll_policySlice.reducer,
  leave_application: LeaveApplicationSlice.reducer,
  tax_slab: tax_slabSlice.reducer,
  loan_management_configuration: loan_manag_confSlice.reducer,
  gratuity_configuration: gratuity_configurationSlice.reducer,
  reimbursement_configuration: reimbursement_configurationSlice.reducer,
  accrue_gratuity_configuration: accrue_gratuity_configurationSlice.reducer,
  reimbursement_claim: reimbursement_claimSlice.reducer,
  employee_loan_request: employee_loan_requestSlice.reducer,
  allocate_leaves: AllocateLeavesSlice.reducer,
  employee_leave_balance: EmployeeLeaveBalanceSlice.reducer,
  attendance_configuration: AttendanceConfigurationSlice.reducer,
  employee_shift: employeeShiftSlice.reducer,
  holidays: HolidaysSlice.reducer,
  reimbursement_claim: reimbursement_claimSlice.reducer,
  leave_encashment: LeaveEncashmentSlice.reducer,
  payroll_process: payroll_processSlice.reducer,

  attendance: AttendanceSlice.reducer,
  employee_roster: EmployeeRosterSlice.reducer,
  leave_register: LeaveRegisterSlice.reducer,
  payroll_register: PayrollRegisterSlice.reducer,
  UserModule: UserSlice.reducer,
  password: passwordSlice.reducer,
  employee_register: EmployeeRegisterSlice.reducer,
  roster_pattern: roster_patternSlice.reducer,
  subsidiary: SubsidiarySlice.reducer,
  leave_request: LeaveRequestSlice.reducer,
  workflow_policy: workflowPolicySlice.reducer,
  hod_setup: HODSlice.reducer,
  calendar: CalendarSlice.reducer,
  leave_approval: LeaveApprovalSlice.reducer,
  leave_calendar: LeaveCalendarSlice.reducer,
  roster_calendar: RosterCalendarSlice.reducer,
  attendance_calendar: AttendanceCalendarSlice.reducer,
  loan_register: LoanRegisterSlice.reducer,
  reimbursement_register: ReimbursementRegisterSlice.reducer,
  job_vacancy: JobVacancySlice.reducer,
  attendance_request: AttendanceRequestSlice.reducer,
  attendance_approval: AttendanceApprovalSlice.reducer,
  payroll_preview: PayrollPreviewSlice?.reducer,
  loan_request: LoanRequestSlice.reducer,
  loan_approval: LoanApprovalSlice.reducer,
  applicant_profile: ApplicantProfileSlice?.reducer,
  interview_schedule: InterviewScheduleSlice.reducer,
  resume_search_engine:ResumeSearchEngineSlice.reducer,
  job_offer:JobOfferSlice.reducer,
  recruitment_dashboard:RecruitmentDashboardSlice.reducer,
  LeaveWorkflowStatus : LeaveWorkflowStatusSlice.reducer,
  loan_workflow_status : LoanWorkflowStatusSlice.reducer,
  attendance_workflow_status : AttendanceWorkflowStatusSlice.reducer,
  team_leave_calender : TeamLeaveCalendarSlice.reducer,
  attendance_calendar_team : TeamAttendanceCalendarSlice.reducer,
  portal_holiday_calendar : PortalHolidayCalendarSlice.reducer,
  emp_salary_revision : EmpSalaryRevisionSlice.reducer,
  news_event_ticker : NewsEventTickerSlice.reducer,
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
