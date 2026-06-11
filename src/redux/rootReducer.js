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
import { budgetYearSetupSlice } from "../app/modules/Budget_Year_Setup/_redux/budgetYearSetupSlice";
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
import { RecruitmentPortalConfigSlice } from "../app/modules/Recruitment_Portal_Config/_redux/redux-Slice";
import { DashboardAlertConfigSlice } from "../app/modules/Dashboard_Alert_Config/_redux/redux-Slice";
import { EmailConfigurationSlice } from "../app/modules/EmailConfiguration/_redux/redux-Slice";
import { Ai_Api_ConfigurationSlice } from "../app/modules/Ai_Api_Configuration/_redux/redux-Slice";
import { DesignationMappingSlice } from "../app/modules/DesignationMapping/_redux/redux-Slice";
import { ExitTypeExitReasonSlice } from "../app/modules/Exit_Type_Exit_Reason/_redux/redux-Slice";
import { SeparationSlice } from "../app/modules/Separation/_redux/redux-Slice";
import { LeaveWorkflowAdminSlice } from "../app/modules/LeaveWorkflowAdmin/redux/formSlice";
import { AttendanceWorkflowAdminSlice } from "../app/modules/AttendanceWorkflowAdmin/redux/formSlice";
import { LoanWorkflowAdminSlice } from "../app/modules/LoanWorkflowAdmin/redux/formSlice";
import { ChartOfAccountSlice } from "../app/modules/ChartOfAccounts/_redux/formdetailsSlice";
import { AuditTrailReportSlice } from "../app/modules/Audit_Trail_Report/_redux/AuditTrailReportSlice";
import { appraisalRatingSlice } from "../app/modules/Appraisal_Rating/_redux/redux-Slice";
import { AppraisalPeriodsSetupSlice } from "../app/modules/AppraisalPeriodSetup/_redux/redux-Slice";
import { appraisalConfigSlice } from "../app/modules/Appraisal_Configuration/_redux/redux-Slice";
import { GeneralEvaluationSetupSlice } from "../app/modules/AppraisalGeneralEvaluationSetup/_redux/redux-Slice";
import { HrEvaluationSetupSlice } from "../app/modules/AppraisalHrEvaluationSetup/_redux/redux-Slice";
import { appraisalPublishSlice } from "../app/modules/Appraisal_Publishing/_redux/redux-Slice";
import { RequisitionJobVacancySlice } from "../app/modules/RequisitionJobVacancy/_redux/redux-Slice";
import { HRRequisitionJobVacancySlice } from "../app/modules/HRRequisitionJobVacancy/_redux/redux-Slice";
import { appraisalEvaluationSlice } from "../app/modules/Appraisal_Evaluation/_redux/redux-Slice";
import { DesignationWiseGoalSetupSlice } from "../app/modules/DesignationWiseGoalSetup/_redux/redux-Slice";
import { EmployeeGoalSetupSlice } from "../app/modules/EmployeeGoalSetup/_redux/redux-Slice";
import { EmployeeGoalSetupPortalSlice } from "../app/modules/EmployeeGoalSetupPortal/_redux/redux-Slice";
import { ContributionReportSlice } from "../app/modules/ContributionRreport/_redux/ContributionReportSlice";

import { releasePayslipSlice } from "../app/modules/Release_Payslip/_redux/redux-Slice";
import { ResignationRequestSlice } from "../app/modules/Resignation_Request/_redux/redux-Slice";
import { ResignationApprovalSlice } from "../app/modules/ResignationApproval/redux/formSlice";
import { ResignationWorkflowStatusSlice } from "../app/modules/ResignationWorkflowStatus/redux/formSlice";
import { DesignationDepMapforExitClearanceSlice } from "../app/modules/Designation_Dep_Map_for_Exit_Clearance/_redux/redux-Slice";
import { ExitClearanceSlice } from "../app/modules/Separate_Exit_Clearance/_redux/redux-Slice";
import { ResignationWorkflowAdminSlice } from "../app/modules/ResignationWorkflowAdmin/redux/formSlice";
import { FinalSettlementSlice } from "../app/modules/FinalSettlement/_redux/redux-Slice";
import { GeoLocationSlice } from "../app/modules/GeoLocation/_redux/redux-Slice";
import { AttendanceSummarySlice } from "../app/modules/Attendance_Summary/_redux/AttendanceSlice";
import { attAppUserSlice } from "../app/modules/Attendance_App_User/_redux/redux-Slice";
import { FinalSettlementReportSlice } from "../app/modules/FinalSettlementReport/_redux/FinalSettlementReportSlice";
import { PayrollIncomeTaxReportSlice } from "../app/modules/PayrollIncomeTaxReport/_redux/PayrollIncomeTaxReportSlice";
import { oneTimeAllowanceSlice } from "../app/modules/One_Time_Allowances/_redux/fromSlice";
import { PayrollGratuityReportSlice } from "../app/modules/PayrollGratuityReport/_redux/formSlice";
import { PayrollOvertimeSlice } from "../app/modules/PayrollOverTimeReport/_redux/formSlice";
import { CompanyDocumentSlice } from "../app/modules/CompanyDocument/_redux/redux-Slice";
import { CompanyDocumentPortalSlice } from "../app/modules/CompanyDocumentPortal/_redux/redux-Slice";
import { EmployeeDocumentSlice } from "../app/modules/EmployeeDocument/_redux/redux-Slice";
import { appraisalReviewSlice } from "../app/modules/Appraisal_Review/_redux/fromSlice";
import { empAppraisalReviewSlice } from "../app/modules/Appraisal_Review_Portal/_redux/fromSlice";
import { AttendanceCorrectionSlice } from "../app/modules/AttendanceCorrection/_redux/AttendanceSlice";
import { appraisalFinalizationSlice } from "../app/modules/Appraisal_Finalization/_redux/fromSlice";
import { appraisalStatusSlice } from "../app/modules/Appraisal_Status_Employee_Wise/_redux/fromSlice";
import { BankPaymentAdviceSlice } from "../app/modules/BankPaymentAdvice/_redux/formSlice";
import { FacilitatorTicketCreationSlice } from "../app/modules/FacilitatorTicketCreation/_redux/redux-Slice";

import { facilitatorSetupSlice } from "../app/modules/Facilitator_Setup/_redux/facilitatorSetupSlice";

import { FacilitatorOwnershipSlice } from "../app/modules/Facilitator_Ownership/_redux/redux-Slice";

import { customerSetupSlice } from "../app/modules/Customer_Setup/_redux/redux-Slice";

import { SubsidiaryWiseOnboardingChecklistSlice } from "../app/modules/Subsidiary_Wise_Onboarding_Checklist/_redux/redux-Slice";

import { projectSetupSlice } from "../app/modules/Project_Setup/_redux/redux-Slice";
import { ticketSetupSlice } from "../app/modules/Ticket_Setup/_redux/redux-Slice";

import { ticketStatusSlice } from "../app/modules/Ticket_Status/_redux/redux-Slice";
import { projectTimelineSlice } from "../app/modules/Project_Timeline/_redux/redux-Slice";
import { taskAssignmentTimelineSlice } from "../app/modules/Task_Assignment_Timeline/_redux/redux-Slice";
import { TicketCalendarSlice } from "../app/modules/Ticket_Calendar/_redux/redux-Slice";
import { projectTimeLogSetupSlice } from "../app/modules/Project_TimeLog/_redux/redux-Slice";
import { EmployeeOnboardingChecklistSlice } from "../app/modules/Employee_Onboarding_Checklist/_redux/redux-Slice";
import { TicketTimeReportSlice } from "../app/modules/TicketReport/_redux/formSlice";
import { ticketActivitySlice } from "../app/modules/Ticket_Activity/_redux/redux-Slice";
import { TaskDashboardSlice } from "../app/modules/Task_Dashboard/_redux/redux-Slice";
import { SubsidiaryWisePayrollChecklistSlice } from "../app/modules/Subsidiary_Wise_Payroll_Checklist/_redux/redux-Slice";
import { PortalFacilitatorTicketCreationSlice } from "../app/modules/PortalFacilitatorTicketCreation/_redux/redux-Slice";
import { PortalTicketTimeReportSlice } from "../app/modules/PortalTicketReport/_redux/formSlice";
import { PortalTicketCalendarSlice } from "../app/modules/PortalTicket_Calendar/_redux/redux-Slice";
import { portalTaskAssignmentTimelineSlice } from "../app/modules/PortalTaskAssignmentTimeline/_redux/redux-Slice";

import { ticketSetupPortalSlice } from "../app/modules/Ticket_Setup_Portal/_redux/redux-Slice";
import { projectTimeLogPortalSlice } from "../app/modules/Project_TimeLog_Portal/_redux/redux-Slice";
import { ticketActivityPortalSlice } from "../app/modules/Ticket_Activity_Portal/_redux/redux-Slice";
import { projectTimelinePortalSlice } from "../app/modules/Project_Timeline_Portal/_redux/redux-Slice";
import { TaskConfigurationSlice } from "../app/modules/TaskConfiguration/_redux/redux-Slice";
import { CustomerUserManagementSlice } from "../app/modules/Customer_User_Management/_redux/redux-Slice";
import { loanCashPaymentSlice } from "../app/modules/Cash_Payment_Against_Loan/_redux/redux-Slice";
import { CustomerConfigurationSlice } from "../app/modules/Customer_Configuration/_redux/redux-Slice";
import { ReimbursementClaimSlice } from "../app/modules/Reimbursement_Claim_Request/_redux/redux-Slice";
import { tada_configurationSlice } from "../app/modules/Tada_Configuration/_redux/redux-Slice";
import { preapproval_travel_requestSlice } from "../app/modules/PreApproval_Travel_Request/_redux/redux-Slice";
import { travel_requestSlice } from "../app/modules/Travel_Request/_redux/redux-Slice";
import { travelrequestApprovalSlice } from "../app/modules/Travel_Request_Approval/redux/redux-Slice";
import { employeeTempShiftSlice } from "../app/modules/Temporary_Shift_Setup/_redux/redux-Slice";
import { projectSprintSlice } from "../app/modules/Project_Sprint/_redux/redux-Slice";

import { ReimbursementApprovalSlice } from "../app/modules/Reimbursement_Claim_Approval/_redux/redux-Slice";
import { ReimbursementWorkflowHrmsSlice } from "../app/modules/Reimbursement_Workflow_Status/_redux/redux-Slice";
import { ReimbursementWorkflowStatusSlice } from "../app/modules/Reimbursement_Workflow_Portal/_redux/redux-Slice";
import { TravelRequestWorkflowStatusSlice } from "../app/modules/Travel_Request_WorkflowStatus_Portal/_redux/redux-Slice";
import { TravelRequestWorkflowAdminSlice } from "../app/modules/Travel_Request_WorkflowStatus_Hrms/_redux/formSlice";
import { RosterRequestSlice } from "../app/modules/Attendance_Roster_Request/_redux/redux-Slice";
import { RosterApprovalSlice } from "../app/modules/Attendance_Roster_Approval/_redux/redux-Slice";
import { RosterWorkflowHrmsSlice } from "../app/modules/Attendance_Roster_Workflow/_redux/redux-Slice";
import { RosterWorkflowStatusSlice } from "../app/modules/Attendance_Roster_Workflow_Portal/_redux/redux-Slice";
import { postApprovalTravelRequestSlice } from "../app/modules/Post_Approval_Travel_Request/_redux/redux-Slice";
import { postTravelRequestPortalSlice } from "../app/modules/Post_Travel_Request_Portal/_redux/redux-Slice";
import { PortalRosterCalendarSlice } from "../app/modules/Roster_Calendar_Portal/_redux/redux-Slice";
import { CompanyAttMachineConfigSlice } from "../app/modules/Company_att_machine_config/_redux/redux-Slice";
import { AIChatbotSlice } from "../app/modules/AIChatbotService/_redux/redux-Slice";
import { InterviewQuestionnaireSlice } from "../app/modules/Interview_Questionnaire/_redux/redux-Slice";
import { InterviewRecommendationSlice } from "../app/modules/Interview_Recommendations/_redux/redux-Slice";
import { JobRequestionApprovalSlice } from "../app/modules/JobRequestionApproval/redux/formSlice";
import { TravelRequestReportsSlice } from "../app/modules/TravelRequestReports/_redux/TravelRequestReportsSlice";
import { JobRequestionWorkflowStatusSlice } from "../app/modules/Job_Requestion_Workflow_Status/_redux/redux-Slice";
import { JobRequestionWorkflowAdminSlice } from "../app/modules/JobRequestionWorkflowStatusApproval/redux/formSlice";
import { ClosePayrollMonthSlice } from "../app/modules/Close_Payroll_Month_Process/_redux/ClosePayrollMonthSlice";
import { EmployeeTaskSlice } from "../app/modules/employee_task_portal/_redux/redux-Slice";
import { PolicyforNewYearBudgetSlice } from "../app/modules/PolicyforNewYearBudget/_redux/redux-Slice";
import { DepartmentWiseBudgetSlice } from "../app/modules/Department_Wise_Budget/_redux/redux-Slice";
import { PortalDepartmentWiseBudgetSlice } from "../app/modules/Portal_Department_Wise_Budget/_redux/redux-Slice";
import { BudgetWorkflowHrmsSlice } from "../app/modules/Budget_Workflow_Status/_redux/redux-Slice";
import { BudgetWorkflowPortalSlice } from "../app/modules/Budget_Workflow_Status_Portal/_redux/redux-Slice"
import { BudgetApprovalSlice } from "../app/modules/BudgetApproval/redux/formSlice";
import { DepartmentDesignationMappingSlice } from "../app/modules/DepartmentDesignationMapping/_redux/redux-Slice";

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
  budget_year_setup: budgetYearSetupSlice.reducer,
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
  // reimbursement_claim: reimbursement_claimSlice.reducer,
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
  resume_search_engine: ResumeSearchEngineSlice.reducer,
  job_offer: JobOfferSlice.reducer,
  recruitment_dashboard: RecruitmentDashboardSlice.reducer,
  LeaveWorkflowStatus: LeaveWorkflowStatusSlice.reducer,
  loan_workflow_status: LoanWorkflowStatusSlice.reducer,
  attendance_workflow_status: AttendanceWorkflowStatusSlice.reducer,
  team_leave_calender: TeamLeaveCalendarSlice.reducer,
  attendance_calendar_team: TeamAttendanceCalendarSlice.reducer,
  portal_holiday_calendar: PortalHolidayCalendarSlice.reducer,
  emp_salary_revision: EmpSalaryRevisionSlice.reducer,
  news_event_ticker: NewsEventTickerSlice.reducer,
  recruitment_portal_config: RecruitmentPortalConfigSlice.reducer,
  dashboard_alert_config: DashboardAlertConfigSlice.reducer,
  email_config: EmailConfigurationSlice.reducer,
  ai_api_configuration: Ai_Api_ConfigurationSlice.reducer,
  desig_map: DesignationMappingSlice.reducer,
  exit_type_exit_reason: ExitTypeExitReasonSlice.reducer,
  separation: SeparationSlice.reducer,
  LeaveWorkflowAdmin: LeaveWorkflowAdminSlice.reducer,
  attendance_workflow_admin: AttendanceWorkflowAdminSlice.reducer,
  loan_workflow_admin: LoanWorkflowAdminSlice.reducer,
  resignation_request: ResignationRequestSlice.reducer,
  resignation_approval: ResignationApprovalSlice.reducer,
  ResignationWorkflowStatus: ResignationWorkflowStatusSlice.reducer,
  chart_of_accounts: ChartOfAccountSlice.reducer,
  audit_trail: AuditTrailReportSlice.reducer,
  appraisal_rating: appraisalRatingSlice.reducer,
  appraisal_period_setup: AppraisalPeriodsSetupSlice.reducer,
  appraisal_config: appraisalConfigSlice.reducer,
  general_evaluation_setup: GeneralEvaluationSetupSlice.reducer,
  hr_evaluation_setup: HrEvaluationSetupSlice.reducer,
  appraisal_publish: appraisalPublishSlice.reducer,
  requisition_job_vacancy: RequisitionJobVacancySlice.reducer,
  hr_requisition_job_vacancy: HRRequisitionJobVacancySlice.reducer,
  appraisal_evaluation: appraisalEvaluationSlice.reducer,
  designation_wise_goal_setup: DesignationWiseGoalSetupSlice.reducer,
  employee_goal_setup: EmployeeGoalSetupSlice.reducer,
  employee_goal_setup_portal: EmployeeGoalSetupPortalSlice.reducer,
  contribution_report: ContributionReportSlice.reducer,
  release_payslip: releasePayslipSlice.reducer,
  designation_dep_map_for_exit_clearance:
    DesignationDepMapforExitClearanceSlice.reducer,
  exit_clearance: ExitClearanceSlice.reducer,
  resignation_workflow_admin: ResignationWorkflowAdminSlice.reducer,
  final_settlement: FinalSettlementSlice.reducer,
  geo_location: GeoLocationSlice.reducer,
  attendance_summary: AttendanceSummarySlice.reducer,
  att_app_user: attAppUserSlice.reducer,
  final_settlement_report: FinalSettlementReportSlice.reducer,
  income_tax_report: PayrollIncomeTaxReportSlice.reducer,
  onetime_allowance: oneTimeAllowanceSlice.reducer,
  gratuity_report: PayrollGratuityReportSlice.reducer,
  overtime_report: PayrollOvertimeSlice.reducer,
  company_doc: CompanyDocumentSlice.reducer,
  company_doc_portal: CompanyDocumentPortalSlice.reducer,
  employee_doc: EmployeeDocumentSlice.reducer,
  appraisal_review: appraisalReviewSlice.reducer,
  attendance_correction: AttendanceCorrectionSlice.reducer,
  appraisal_finalization: appraisalFinalizationSlice.reducer,
  appraisal_status: appraisalStatusSlice.reducer,
  bank_advice: BankPaymentAdviceSlice.reducer,
  facilitator_ticket_creation: FacilitatorTicketCreationSlice.reducer,

  facilitator_setup: facilitatorSetupSlice.reducer,
  emp_appraisal: empAppraisalReviewSlice.reducer,

  facilitator_ownership: FacilitatorOwnershipSlice.reducer,

  customer_setup: customerSetupSlice.reducer,

  onboarding_checklist: SubsidiaryWiseOnboardingChecklistSlice.reducer,

  project_setup: projectSetupSlice.reducer,
  ticket_setup: ticketSetupSlice.reducer,
  ticket_status: ticketStatusSlice.reducer,
  project_timeline: projectTimelineSlice.reducer,
  task_assignment_timeline: taskAssignmentTimelineSlice.reducer,
  ticket_calendar: TicketCalendarSlice.reducer,

  project_timelog: projectTimeLogSetupSlice.reducer,
  employee_onboarding_checklist: EmployeeOnboardingChecklistSlice.reducer,
  ticket_time_report: TicketTimeReportSlice.reducer,
  ticket_activity: ticketActivitySlice.reducer,
  task_dashboard: TaskDashboardSlice.reducer,

  subsidiary_wise_payroll_checklist:
    SubsidiaryWisePayrollChecklistSlice.reducer,
  portal_ticket_creation: PortalFacilitatorTicketCreationSlice.reducer,
  portal_ticket_time_report: PortalTicketTimeReportSlice.reducer,
  portal_ticket_calendar: PortalTicketCalendarSlice.reducer,
  portal_task_assignment_timeline: portalTaskAssignmentTimelineSlice.reducer,
  ticket_setup_portal: ticketSetupPortalSlice.reducer,
  project_timelog_portal: projectTimeLogPortalSlice.reducer,
  project_timeline_portal: projectTimelinePortalSlice.reducer,
  ticket_activity_portal: ticketActivityPortalSlice.reducer,
  task_configuration: TaskConfigurationSlice.reducer,
  customer_user_management: CustomerUserManagementSlice.reducer,
  cash_payment_against_loan: loanCashPaymentSlice.reducer,
  customer_config: CustomerConfigurationSlice.reducer,
  reimbursement_claim_request: ReimbursementClaimSlice.reducer,
  t_tada_config: tada_configurationSlice.reducer,
  t_preapproval_travel_request: preapproval_travel_requestSlice.reducer,
  travel_request: travel_requestSlice.reducer,
  travel_approval: travelrequestApprovalSlice.reducer,
  reimbursement_claim_approval: ReimbursementApprovalSlice.reducer,
  temporary_shift_setup: employeeTempShiftSlice.reducer,
  project_sprint: projectSprintSlice.reducer,
  reimbursement_claim_workflow_status_approval:
    ReimbursementWorkflowHrmsSlice.reducer,
  reimbursement_claim_workflow_status: ReimbursementWorkflowStatusSlice.reducer,
  TravelRequestWorkflowStatus: TravelRequestWorkflowStatusSlice.reducer,
  attendance_roster_request: RosterRequestSlice.reducer,
  attendance_roster_approval: RosterApprovalSlice.reducer,
  attendance_roster_workflow_status: RosterWorkflowHrmsSlice.reducer,
  attendance_roster_workflow_status_portal: RosterWorkflowStatusSlice.reducer,
  post_approval_travel_request : postApprovalTravelRequestSlice.reducer,
  post_travel_request_portal: postTravelRequestPortalSlice.reducer,
  roster_calendar_team : PortalRosterCalendarSlice.reducer,
  company_att_machine_config: CompanyAttMachineConfigSlice.reducer,
  ai_chatbot: AIChatbotSlice.reducer,
  interview_questionnaire: InterviewQuestionnaireSlice.reducer,
  interview_recommendations: InterviewRecommendationSlice.reducer,
  TravelRequestWorkflowAdmin: TravelRequestWorkflowAdminSlice.reducer,
  job_requestion_approval : JobRequestionApprovalSlice.reducer,
  travel_request_reports: TravelRequestReportsSlice.reducer,
  job_requestion_workflow_status: JobRequestionWorkflowStatusSlice.reducer,
  job_requestion_workflow_admin : JobRequestionWorkflowAdminSlice.reducer,
  close_payroll_month: ClosePayrollMonthSlice.reducer,
  employee_task_portal: EmployeeTaskSlice.reducer,
  policy_for_new_year_budget: PolicyforNewYearBudgetSlice.reducer,
  department_wise_budget: DepartmentWiseBudgetSlice.reducer,
  portal_department_wise_budget: PortalDepartmentWiseBudgetSlice.reducer,
  budget_workflow_status: BudgetWorkflowHrmsSlice.reducer,
  budget_workflow_status_portal: BudgetWorkflowPortalSlice.reducer,
  department_wise_budget_approval: BudgetApprovalSlice.reducer,
  department_designation_map: DepartmentDesignationMappingSlice.reducer,

});

export function* rootSaga() {
  yield all([auth.saga()]);
}
