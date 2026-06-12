import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";
import { Dashboard } from "./modules/Dashboard/pages";
import { shallowEqual, useSelector, useDispatch } from "react-redux";

import { fetchAllCountry } from "./modules/Dashboard/_redux/dashboardActions";
import { incidentTypes } from "./modules/Dashboard/_redux/dashboardActions";
import HODManagement from "./modules/HOD_Setup";

const SettingsPage = lazy(() =>
  import("./modules/Settings/pages/SettingsPage"),
);
const AIChatbotManagement = lazy(() =>
  import("./modules/AIChatbotService/pages"),
);

const UserManagment = lazy(() => import("./modules/UserMangement/pages"));

const BankModule = lazy(() => import("./modules/Banks/pages/index"));
const BranchModule = lazy(() => import("./modules/BankBranch/pages/index"));
const DepartmenModule = lazy(() => import("./modules/Department/pages/index"));
const EmployeeTypeModule = lazy(() =>
  import("./modules/EmployeeType/pages/index"),
);
const ReligionModule = lazy(() => import("./modules/Religion/pages/index"));
const RegionModule = lazy(() => import("./modules/Region/pages/index"));
const DesignationModule = lazy(() =>
  import("./modules/Designation/pages/index"),
);
const FormModule = lazy(() => import("./modules/Forms/pages/index"));
const FormDetailsModule = lazy(() =>
  import("./modules/FormDetails/pages/index"),
);
const EmpPolicyModule = lazy(() =>
  import("./modules/EmployeePolicy/pages/index"),
);
const PolicyModule = lazy(() => import("./modules/Policy/pages/index"));
const EmplpyeeProfileModule = lazy(() =>
  import("./modules/EmployeeProfile/pages/index"),
);
const ContactModule = lazy(() => import("./modules/Contact/pages/index"));
const AcademicModule = lazy(() => import("./modules/Academic/pages/index"));
const ExperienceModule = lazy(() => import("./modules/Experience/pages/index"));
const SkillsModule = lazy(() => import("./modules/Skills/pages/index"));
const IncidentModule = lazy(() => import("./modules/incident/pages/index"));
const EarningModule = lazy(() => import("./modules/Eearning/pages/index"));
const DeductionModule = lazy(() => import("./modules/Deduction/pages/index"));
const StoppageAllowanceModule = lazy(() =>
  import("./modules/StoppageAllowance/pages/index"),
);
const ExchangeRateModule = lazy(() =>
  import("./modules/ExchangeRate/pages/index"),
);
const CompensationBenefitsModule = lazy(() =>
  import("./modules/compensation_benefits/pages/index"),
);
const EarningDeductionTranModule = lazy(() =>
  import("./modules/Compensation_Earning_Transaction/pages/index"),
);
const DeductionTranModule = lazy(() =>
  import("./modules/Compensation_Deduction_Transaction/pages/index"),
);
const EmployeeSalaryEarningModule = lazy(() =>
  import("./modules/Employee_Salary_Earning/pages/index"),
);
const EmployeeSalaryDeductionModule = lazy(() =>
  import("./modules/Employee_Salary_Deduction/pages/index"),
);
const EmployeeSalaryModule = lazy(() =>
  import("./modules/Employee_Salary_Setup/pages/index"),
);
const EmployeeSalaryExpModule = lazy(() =>
  import("./modules/Employee_Salary_Expatriate/pages/index"),
);
const CompensationExpModule = lazy(() =>
  import("./modules/Compensation_Expatriate/pages/index"),
);
const EmployeeTransferModule = lazy(() =>
  import("./modules/Employee_Transfer/pages/index"),
);
// const EmployeeSalaryRevisionModule = lazy(() =>
//   import("./modules/Employee_Salary_Revision/pages/index")
// );
const TaxSetupModule = lazy(() => import("./modules/Tax_Setup/pages/index"));
const FiscalSetupModule = lazy(() =>
  import("./modules/Fiscal_Setup/pages/index"),
);
const PayrollMonthSetupModule = lazy(() =>
  import("./modules/Payroll_Month_Setup/pages/index"),
);
const ClosePayrollMonthSetupModule = lazy(() =>
  import("./modules/Close_Payroll_Month_Process/pages/index"),
);
const ArrearPolicyModule = lazy(() =>
  import("./modules/ArrearPolicy/pages/index"),
);
const RoundingPolicyModule = lazy(() =>
  import("./modules/SalaryRoundingPolicy/pages/index"),
);
const LeaveTypeModule = lazy(() => import("./modules/LeaveType/pages/index"));
const FinalSettlementPolicyModule = lazy(() =>
  import("./modules/Final_Settlement_Policy/pages/index"),
);
const salarypolicyModule = lazy(() =>
  import("./modules/Salarypolicy/pages/index"),
);
const OnetimeAllowance = lazy(() =>
  import("./modules/Onetime_Allowance/pages/index"),
);
const LoanType = lazy(() => import("./modules/LoanType/pages/index"));
const TaxSlab = lazy(() => import("./modules/LoanType/pages/index"));
const leaveManagementConfiguration = lazy(() =>
  import("./modules/leaveManagementConfiguration/pages/index"),
);
const PayrollProcessPolicy = lazy(() =>
  import("./modules/Payroll_Process_Policy/pages/index"),
);
const LeaveApplication = lazy(() =>
  import("./modules/LeaveApplication/pages/index"),
);
const tax_slabModule = lazy(() => import("./modules/Tax_Slab/pages/index"));
const allocate_leaves = lazy(() =>
  import("./modules/AllocateLeaves/pages/index"),
);
const employee_leave_balance = lazy(() =>
  import("./modules/EmployeeLeaveBalance/pages/index"),
);
const loan_manag_confModule = lazy(() =>
  import("./modules/Loan_manag_conf/pages/index"),
);
const gratuity_confModule = lazy(() =>
  import("./modules/Gratuity_Configuration/pages/index"),
);
const accrue_gratuity_confModule = lazy(() =>
  import("./modules/Accrue_Gratuity_Configuration/pages/index"),
);
const reimbursement_configurationModule = lazy(() =>
  import("./modules/Reimbursement_Configuration/pages/index"),
);
const reimbursement_claimModule = lazy(() =>
  import("./modules/Reimbursement_claim/pages/index"),
);
const employee_loan_requestModule = lazy(() =>
  import("./modules/Employee_Loan_Request/pages/index"),
);
const AttendanceConfigurationManagement = lazy(() =>
  import("./modules/Attendance_Configuration/pages/index"),
);
const EmployeeShiftManagement = lazy(() =>
  import("./modules/Employee_Shift/pages/index"),
);
const HolidaysModule = lazy(() => import("./modules/Holidays/pages/index"));
const Payroll_processSModule = lazy(() =>
  import("./modules/Payroll_Process/pages/index"),
);
const Attendance = lazy(() => import("./modules/Attendance/pages/index"));
const LeaveEncashment = lazy(() =>
  import("./modules/LeaveEncashment/pages/index"),
);
const EmployeeRoster = lazy(() =>
  import("./modules/EmployeeRoster/pages/index"),
);
const LeaveRegister = lazy(() => import("./modules/LeaveRegister/pages/index"));
const PayrollRegister = lazy(() =>
  import("./modules/PayrollRegister/pages/index"),
);
const UserModule = lazy(() => import("./modules/User/pages/index"));
const UploadPage = lazy(() => import("./modules/UploadPage/pages/index"));
const passwordModule = lazy(() =>
  import("./modules/Reset_Password/pages/index"),
);
const EmployeeRegister = lazy(() =>
  import("./modules/EmployeeRegister/pages/index"),
);
const Roster_PatternModule = lazy(() =>
  import("./modules/Roster_Pattern/pages/index"),
);
const companyModule = lazy(() => import("./modules/Company/page/index"));
const subsidiaryModule = lazy(() => import("./modules/Subsidiary/page/index"));
const leaveRequestModule = lazy(() =>
  import("./modules/LeaveRequest/pages/index"),
);
const workFlowPolicyModule = lazy(() =>
  import("./modules/WorkflowPolicy/index"),
);
const calendarModule = lazy(() => import("./modules/Calendar/pages/index"));
const leave_calendarModule = lazy(() =>
  import("./modules/Leave_Calendar/pages/index"),
);
const roster_calendarModule = lazy(() =>
  import("./modules/Roster_Calendar/pages/index"),
);
const attendance_calendarModule = lazy(() =>
  import("./modules/Attendance_Calendar/pages/index"),
);

const LeaveApprovalModule = lazy(() =>
  import("./modules/LeaveApproval/page/index"),
);

const loanRegisterModule = lazy(() =>
  import("./modules/LoanRegister/pages/index"),
);
const reimbursementRegisterModule = lazy(() =>
  import("./modules/ReimbursementRegister/pages/index"),
);

const jobVacancyModule = lazy(() => import("./modules/JobVacancy/pages/index"));

const AttendanceRequestModule = lazy(() =>
  import("./modules/AttendanceRequest/pages/index"),
);

const AttendanceApprovalModule = lazy(() =>
  import("./modules/AttendanceApproval/page/index"),
);

const PayrollPreview = lazy(() =>
  import("./modules/PayrollPreview/pages/index"),
);
const LoanRequest = lazy(() => import("./modules/Loan_Request/pages/index"));
const LoanApproval = lazy(() => import("./modules/LoanApproval/page/index"));

const InterviewSchedule = lazy(() =>
  import("./modules/Interview_Schedule/index"),
);
const ApplicantProfileModule = lazy(() =>
  import("./modules/ApplicantProfile/pages/index"),
);
const ResumeSearchEngineModule = lazy(() =>
  import("./modules/ResumeSearchEngine/pages/index"),
);
const JobOfferModule = lazy(() => import("./modules/Job_Offer/page/index"));
const RecruitmentDashboardModule = lazy(() =>
  import("./modules/RecruitmentDashboard/pages/index"),
);
const LeaveWorkflowStatus = lazy(() =>
  import("./modules/LeaveWorkflowStatus/page/index"),
);
const LoanWorkflowStatus = lazy(() =>
  import("./modules/LoanWorkflowStatus/page/index"),
);
const AttendanceWorkflowStatus = lazy(() =>
  import("./modules/AttendanceWorkflowStatus/page/index"),
);
const TeamLeaveCalender = lazy(() =>
  import("./modules/Leave_Calendar_Team/pages/index"),
);
const TeamAttendanceCalender = lazy(() =>
  import("./modules/Attendance_Calendar_Team/pages/index"),
);
const PortalHolidayCalendar = lazy(() =>
  import("./modules/PortalHolidayCalendar/pages/index"),
);
const EmpSalaryRevisionModule = lazy(() =>
  import("./modules/Emp_Salary_Revision/pages/index"),
);
const NewsEventTickerModule = lazy(() =>
  import("./modules/NewsEventTicker/pages/index"),
);
const RecruitmentConfiguration = lazy(() =>
  import("./modules/Recruitment_Portal_Config/pages/index"),
);

const DashboardAlertConfig = lazy(() =>
  import("./modules/Dashboard_Alert_Config/pages/index"),
);

const EmailConfiguration = lazy(() =>
  import("./modules/EmailConfiguration/pages/index"),
);

const AiApiConfiguration = lazy(() =>
  import("./modules/Ai_Api_Configuration/pages/index"),
);


const DesignationMapping = lazy(() =>
  import("./modules/DesignationMapping/pages/index"),
);
const ExitTypeExitReasonModule = lazy(() =>
  import("./modules/Exit_Type_Exit_Reason/pages/index"),
);

const SeparationModule = lazy(() => import("./modules/Separation/pages/index"));
const LeaveWorkflowAdmin = lazy(() =>
  import("./modules/LeaveWorkflowAdmin/page/index"),
);
const AttendanceWorkflowAdmin = lazy(() =>
  import("./modules/AttendanceWorkflowAdmin/page/index"),
);
const LoanWorkflowAdmin = lazy(() =>
  import("./modules/LoanWorkflowAdmin/page/index"),
);

const ChartOfAccounts = lazy(() =>
  import("./modules/ChartOfAccounts/pages/index"),
);

const AuditTrailReport = lazy(() =>
  import("./modules/Audit_Trail_Report/pages/index"),
);

const AppraisalRating = lazy(() =>
  import("./modules/Appraisal_Rating/pages/index"),
);

const AppraisalPeriodSetup = lazy(() =>
  import("./modules/AppraisalPeriodSetup/pages/index"),
);

const AppraisalConfig = lazy(() =>
  import("./modules/Appraisal_Configuration/pages/index"),
);

const GeneralEvaluationSetup = lazy(() =>
  import("./modules/AppraisalGeneralEvaluationSetup/pages/index"),
);

const HrEvaluationSetup = lazy(() =>
  import("./modules/AppraisalHrEvaluationSetup/pages/index"),
);

const AppraisalPublish = lazy(() =>
  import("./modules/Appraisal_Publishing/pages/index"),
);
const RequisitionJobVacancy = lazy(() =>
  import("./modules/RequisitionJobVacancy/pages/index"),
);

const HRRequisitionJobVacancy = lazy(() =>
  import("./modules/HRRequisitionJobVacancy/pages/index"),
);

const AppraisalEvaluationManagement = lazy(() =>
  import("./modules/Appraisal_Evaluation/pages/index"),
);
const DesignationWiseGoalSetup = lazy(() =>
  import("./modules/DesignationWiseGoalSetup/pages/index"),
);

const EmployeeGoalSetup = lazy(() =>
  import("./modules/EmployeeGoalSetup/pages/index"),
);

const EmployeeGoalSetupPortal = lazy(() =>
  import("./modules/EmployeeGoalSetupPortal/pages/index"),
);

const ContributionReport = lazy(() =>
  import("./modules/ContributionRreport/pages/index"),
);

const ReleasePayslip = lazy(() =>
  import("./modules/Release_Payslip/pages/index"),
);

const ResignationRequest = lazy(() =>
  import("./modules/Resignation_Request/pages/index"),
);

const ResignationApproval = lazy(() =>
  import("./modules/ResignationApproval/page/index"),
);

const ResignationWorkflowStatus = lazy(() =>
  import("./modules/ResignationWorkflowStatus/page/index"),
);
const DesignationDepMapforExitClearance = lazy(() =>
  import("./modules/Designation_Dep_Map_for_Exit_Clearance/pages/index"),
);

const ExitClearance = lazy(() =>
  import("./modules/Separate_Exit_Clearance/pages/index"),
);

const ResignationWorkflowAdmin = lazy(() =>
  import("./modules/ResignationWorkflowAdmin/page/index"),
);

const FinalSettlement = lazy(() =>
  import("./modules/FinalSettlement/pages/index"),
);
const GeoLocation = lazy(() => import("./modules/GeoLocation/pages/index"));

const AttendanceSummary = lazy(() =>
  import("./modules/Attendance_Summary/pages/index"),
);

const AttAppUser = lazy(() =>
  import("./modules/Attendance_App_User/pages/index"),
);

const FInalSettlementReport = lazy(() =>
  import("./modules/FinalSettlementReport/pages/index"),
);
const PayrollIncomeTaxReport = lazy(() =>
  import("./modules/PayrollIncomeTaxReport/pages/index"),
);
const OneTimeAllowanceModule = lazy(() =>
  import("./modules/One_Time_Allowances/pages/index"),
);

const PayrollGratuityReport = lazy(() =>
  import("./modules/PayrollGratuityReport/pages/index"),
);

const PayrollOvertimeReport = lazy(() =>
  import("./modules/PayrollOverTimeReport/pages/index"),
);

const CompanyDocument = lazy(() =>
  import("./modules/CompanyDocument/pages/index"),
);

const EmployeeDocument = lazy(() =>
  import("./modules/EmployeeDocument/pages/index"),
);

const CompanyDocumentPortal = lazy(() =>
  import("./modules/CompanyDocumentPortal/pages/index"),
);

const AppraisalReview = lazy(() =>
  import("./modules/Appraisal_Review/pages/index"),
);

const EmpAppraisalReview = lazy(() =>
  import("./modules/Appraisal_Review_Portal/pages/index"),
);

const AppraisalFinalization = lazy(() =>
  import("./modules/Appraisal_Finalization/pages/index"),
);

const AppraisalStatus = lazy(() =>
  import("./modules/Appraisal_Status_Employee_Wise/pages/index"),
);
const AttendanceCorrection = lazy(() =>
  import("./modules/AttendanceCorrection/pages/index"),
);

const BankAdvice = lazy(() =>
  import("./modules/BankPaymentAdvice/pages/index"),
);

const FacilitatorTicketCreation = lazy(() =>
  import("./modules/FacilitatorTicketCreation/pages/index"),
);

const Facilitator_Setup = lazy(() =>
  import("./modules/Facilitator_Setup/pages/index"),
);

const Failitator_Ownership = lazy(() =>
  import("./modules/Facilitator_Ownership/pages/index"),
);

const Customer_Setup = lazy(() =>
  import("./modules/Customer_Setup/pages/index"),
);

const Onboarding_Checklist = lazy(() =>
  import("./modules/Subsidiary_Wise_Onboarding_Checklist/pages/index"),
);
const project_setup = lazy(() => import("./modules/Project_Setup/pages/index"));

const ticket_status = lazy(() => import("./modules/Ticket_Status/pages/index"));
const ticket_setup = lazy(() => import("./modules/Ticket_Setup/pages/index"));

const project_timeline = lazy(() =>
  import("./modules/Project_Timeline/pages/index"),
);

const task_assignment_timeline = lazy(() =>
  import("./modules/Task_Assignment_Timeline/pages/index"),
);

const ticket_calendar = lazy(() =>
  import("./modules/Ticket_Calendar/pages/index"),
);

const time_logging = lazy(() =>
  import("./modules/Project_TimeLog/pages/index"),
);

const employee_onboarding_checklist = lazy(() =>
  import("./modules/Employee_Onboarding_Checklist/pages/index"),
);
const ticket_time_report = lazy(() =>
  import("./modules/TicketReport/pages/index"),
);
const ticket_activity = lazy(() =>
  import("./modules/Ticket_Activity/pages/index"),
);

const task_dashboard = lazy(() =>
  import("./modules/Task_Dashboard/pages/index"),
);

const subsidiary_wise_payroll_checklist = lazy(() =>
  import("./modules/Subsidiary_Wise_Payroll_Checklist/pages/index"),
);

const PortalTicketCreation = lazy(() =>
  import("./modules/PortalFacilitatorTicketCreation/pages/index"),
);

const portal_ticket_time_report = lazy(() =>
  import("./modules/PortalTicketReport/pages/index"),
);

const portal_ticket_calendar = lazy(() =>
  import("./modules/PortalTicket_Calendar/pages/index"),
);

const portal_task_assignment_timeline = lazy(() =>
  import("./modules/PortalTaskAssignmentTimeline/pages/index"),
);
const ticket_setup_portal = lazy(() =>
  import("./modules/Ticket_Setup_Portal/pages/index"),
);

const time_logging_portal = lazy(() =>
  import("./modules/Project_TimeLog_Portal/pages/index"),
);

const ticket_activity_portal = lazy(() =>
  import("./modules/Ticket_Activity_Portal/pages/index"),
);

const project_timeline_portal = lazy(() =>
  import("./modules/Project_Timeline_Portal/pages/index"),
);

const task_configuration = lazy(() =>
  import("./modules/TaskConfiguration/pages/index"),
);

const customer_user = lazy(() =>
  import("./modules/Customer_User_Management/pages/index"),
);

const cash_payment_against_loan = lazy(() =>
  import("./modules/Cash_Payment_Against_Loan/pages/index"),
);
const customer_config = lazy(() =>
  import("./modules/Customer_Configuration/pages/index"),
);
const tada_configuration = lazy(() =>
  import("./modules/Tada_Configuration/pages/index"),
);
const preapprovaltravelrequest = lazy(() =>
  import("./modules/PreApproval_Travel_Request/pages/index"),
);
const travel_request = lazy(() =>
  import("./modules/Travel_Request/pages/index"),
);
const travel_request_approval = lazy(() =>
  import("./modules/Travel_Request_Approval/page/index"),
);
const employee_temporary_shift_setup = lazy(() =>
  import("./modules/Temporary_Shift_Setup/pages/index"),
);

const reimbursement_claim_request = lazy(() =>
  import("./modules/Reimbursement_Claim_Request/pages/index"),
);
const project_sprint = lazy(() =>
  import("./modules/Project_Sprint/pages/index"),
);

const reimbursement_claim_approval = lazy(() =>
  import("./modules/Reimbursement_Claim_Approval/pages/index"),
);

const reimbursement_claim_workflow_status_approval = lazy(() =>
  import("./modules/Reimbursement_Workflow_Status/pages/index"),
);

const reimbursement_claim_workflow_status = lazy(() =>
  import("./modules/Reimbursement_Workflow_Portal/pages/index"),
);

const attendance_roster_request = lazy(() =>
  import("./modules/Attendance_Roster_Request/pages/index"),
);

const attendance_roster_approval = lazy(() =>
  import("./modules/Attendance_Roster_Approval/pages/index"),
);

const attendance_roster_workflow_status = lazy(() =>
  import("./modules/Attendance_Roster_Workflow/pages/index"),
);

const attendance_roster_workflow_status_portal = lazy(() =>
  import("./modules/Attendance_Roster_Workflow_Portal/pages/index"),
);

const post_approval_travel_request = lazy(() =>
  import("./modules/Post_Approval_Travel_Request/pages/index"),
);
const post_travel_request = lazy(() =>
  import("./modules/Post_Travel_Request_Portal/pages/index"),
);
const roster_calendar_team = lazy(() =>
  import("./modules/Roster_Calendar_Portal/pages/index"),
);

const travel_request_workflow_status = lazy(() =>
  import("./modules/Travel_Request_WorkflowStatus_Portal/page/index"),
);

const travel_request_workflow_status_approval = lazy(() =>
  import("./modules/Travel_Request_WorkflowStatus_Hrms/page/index"),
);

const company_att_machine_config = lazy(() =>
  import("./modules/Company_att_machine_config/pages/index"),
);
const interview_questionnaire = lazy(() =>
  import("./modules/Interview_Questionnaire/pages/index"),
);
const interview_recommendations = lazy(() =>
  import("./modules/Interview_Recommendations/pages/index"),
);

const job_requestion_approval = lazy(() =>
  import("./modules/JobRequestionApproval/page/index"),
);

const TravelRequestReportsModule = lazy(() =>
  import("./modules/TravelRequestReports/pages/index"),
);

const JobRequestionWorkflowStatus = lazy(() =>
  import("./modules/Job_Requestion_Workflow_Status/pages/index"),
);

const JobRequestionWorkflowStatusApproval = lazy(() =>
  import("./modules/JobRequestionWorkflowStatusApproval/page/index"),
);
const employee_task_portal = lazy(() =>
  import("./modules/employee_task_portal/pages/index"),
);

const policy_for_new_year_budget = lazy(() =>
  import("./modules/PolicyforNewYearBudget/pages/index"),
);

const department_wise_budget = lazy(() =>
  import("./modules/Department_Wise_Budget/pages/index"),
);
const portal_department_wise_budget = lazy(() =>
  import("./modules/Portal_Department_Wise_Budget/pages/index"),


); const BudgetApproval = lazy(() =>
  import("./modules/BudgetApproval/page/index"),
);
const budget_year_setup = lazy(() =>
  import("./modules/Budget_Year_Setup/pages/index"),
);
const budget_workflow_status = lazy (() =>
 import("./modules/Budget_Workflow_Status/pages/index")
);
const budget_workflow_status_portal = lazy (() =>
import ("./modules/Budget_Workflow_Status_Portal/pages/index"))

const manpower_budget_dashboard = lazy (() =>
import ("./modules/Manpower_Budget_Dashboard/pages/index"))
const ROUTES = {
  settings: SettingsPage,
  users: UserManagment,
  company: companyModule,
  bank: BankModule,
  branch: BranchModule,
  department: DepartmenModule,
  emptype: EmployeeTypeModule,
  religion: ReligionModule,
  region: RegionModule,
  designation: DesignationModule,
  form: FormModule,
  formdetails: FormDetailsModule,
  emppolicy: EmpPolicyModule,
  policy: PolicyModule,
  profile: EmplpyeeProfileModule,
  contact: ContactModule,
  academic: AcademicModule,
  experience: ExperienceModule,
  skills: SkillsModule,
  incident: IncidentModule,
  earning: EarningModule,
  deduction: DeductionModule,
  stoppage: StoppageAllowanceModule,
  exchange: ExchangeRateModule,
  compensation: CompensationBenefitsModule,
  earning_transaction: EarningDeductionTranModule,
  deduction_transaction: DeductionTranModule,
  employee_salary_earning: EmployeeSalaryEarningModule,
  employee_salary_deduction: EmployeeSalaryDeductionModule,
  employee_salary: EmployeeSalaryModule,
  salary_expatriate: EmployeeSalaryExpModule,
  compensation_expatriate: CompensationExpModule,
  employee_transfer: EmployeeTransferModule,
  // salary_revision: EmployeeSalaryRevisionModule,
  tax_setup: TaxSetupModule,
  fiscal_setup: FiscalSetupModule,
  payroll_month: PayrollMonthSetupModule,
  arrear_policy: ArrearPolicyModule,
  salary_rounding_policy: RoundingPolicyModule,
  leave_type: LeaveTypeModule,
  final_settlement_policy: FinalSettlementPolicyModule,
  salary_policy: salarypolicyModule,
  onetime_earning: OnetimeAllowance,
  leave_management_configuration: leaveManagementConfiguration,
  loan_type: LoanType,
  allocate_leaves: allocate_leaves,
  employee_leave_balance: employee_leave_balance,
  leave_application: LeaveApplication,
  payroll_process_policy: PayrollProcessPolicy,
  tax_slab: tax_slabModule,
  loan_management_configuration: loan_manag_confModule,
  gratuity_configuration: gratuity_confModule,
  accrue_gratuity_configuration: accrue_gratuity_confModule,
  reimbursement_configuration: reimbursement_configurationModule,
  reimbursement_claim: reimbursement_claimModule,
  employee_loan_request: employee_loan_requestModule,
  attendance_configuration: AttendanceConfigurationManagement,
  leave_encashment: LeaveEncashment,
  employee_roster: EmployeeRoster,
  employee_shift: EmployeeShiftManagement,
  holidays: HolidaysModule,
  leave_encashment: LeaveEncashment,
  payroll_process: Payroll_processSModule,
  attendance: Attendance,
  leave_register: LeaveRegister,
  payroll_register: PayrollRegister,
  user: UserModule,
  upload: UploadPage,
  password: passwordModule,
  employee_register: EmployeeRegister,
  roster_pattern: Roster_PatternModule,
  subsidiary: subsidiaryModule,
  calendar: calendarModule,
  leave_calendar: leave_calendarModule,
  roster_calendar: roster_calendarModule,
  attendance_calendar: attendance_calendarModule,
  leaverequest: leaveRequestModule,
  workflow_policy: workFlowPolicyModule,
  hod_setup: HODManagement,
  leaveapproval: LeaveApprovalModule,
  loan_register: loanRegisterModule,
  reimbursement_register: reimbursementRegisterModule,
  job_vacancy: jobVacancyModule,
  attendance_request: AttendanceRequestModule,
  attendance_approval: AttendanceApprovalModule,
  loan_request: LoanRequest,
  loan_approval: LoanApproval,
  payslip: PayrollPreview,
  applicant_profile: ApplicantProfileModule,
  interview_schedule: InterviewSchedule,
  applicant_profile: ApplicantProfileModule,
  resume_search_engine: ResumeSearchEngineModule,
  job_offer: JobOfferModule,
  recruitment_dashboard: RecruitmentDashboardModule,
  leaveworkflowstatus: LeaveWorkflowStatus,
  loanworkflowstatus: LoanWorkflowStatus,
  attendanceworkflowstatus: AttendanceWorkflowStatus,
  leave_calendar_team: TeamLeaveCalender,
  attendance_calendar_team: TeamAttendanceCalender,
  holiday_calendar: PortalHolidayCalendar,
  emp_salary_revision: EmpSalaryRevisionModule,
  news_event_ticker: NewsEventTickerModule,
  career: RecruitmentConfiguration,
  configuration: DashboardAlertConfig,
  email_configuration: EmailConfiguration,
  ai_api_configuration: AiApiConfiguration,
  exit_type_exit_reason: ExitTypeExitReasonModule,
  separation: SeparationModule,
  email_configuration: EmailConfiguration,
  designation_mapping: DesignationMapping,
  exit_type_exit_reason: ExitTypeExitReasonModule,
  leave_workflow: LeaveWorkflowAdmin,
  attendance_workflow: AttendanceWorkflowAdmin,
  loan_workflow: LoanWorkflowAdmin,
  chart_account: ChartOfAccounts,
  audit_trail: AuditTrailReport,
  appraisal_rating: AppraisalRating,
  appraisal_period_setup: AppraisalPeriodSetup,
  appraisal_configuration: AppraisalConfig,
  general_evaluation_setup: GeneralEvaluationSetup,
  hr_evaluation_setup: HrEvaluationSetup,
  appraisal_publish: AppraisalPublish,
  requisition_job_vacancy: RequisitionJobVacancy,
  hr_requisition_job_vacancy: HRRequisitionJobVacancy,
  appraisal_evaluation: AppraisalEvaluationManagement,
  designation_wise_goal_setup: DesignationWiseGoalSetup,
  employee_goal_setup: EmployeeGoalSetup,
  employee_goal_setup_portal: EmployeeGoalSetupPortal,
  contribution_report: ContributionReport,
  release_payslip: ReleasePayslip,
  employee_resignation: ResignationRequest,
  resignation_approval: ResignationApproval,
  resignation_workflow_status: ResignationWorkflowStatus,
  designation_dep_map_for_exit_clearance: DesignationDepMapforExitClearance,
  exit_clearance: ExitClearance,
  resignation_workflow: ResignationWorkflowAdmin,
  final_settlement: FinalSettlement,
  geo_location: GeoLocation,
  attendance_summary: AttendanceSummary,
  app_user: AttAppUser,
  final_settlement_report: FInalSettlementReport,
  income_tax_report: PayrollIncomeTaxReport,
  onetime_allowance: OneTimeAllowanceModule,
  gratuity_report: PayrollGratuityReport,
  overtime_report: PayrollOvertimeReport,
  company_doc: CompanyDocument,
  company_doc_portal: CompanyDocumentPortal,
  employee_doc: EmployeeDocument,
  appraisal_review: AppraisalReview,
  emp_appraisal: EmpAppraisalReview,
  attendance_correction: AttendanceCorrection,
  appraisal_finalization: AppraisalFinalization,
  appraisal_status: AppraisalStatus,
  bank_advice: BankAdvice,
  facilitator_ticket_creation: FacilitatorTicketCreation,

  facilitator_setup: Facilitator_Setup,

  facilitator_ownership: Failitator_Ownership,

  customer_setup: Customer_Setup,
  onboarding_checklist: Onboarding_Checklist,
  project_setup: project_setup,
  ticket_status: ticket_status,
  ticket_setup: ticket_setup,
  project_timeline: project_timeline,
  task_assignment_timeline: task_assignment_timeline,
  ticket_calendar: ticket_calendar,
  time_logging: time_logging,
  employee_onboarding_checklist: employee_onboarding_checklist,
  ticket_time_report: ticket_time_report,
  ticket_activity: ticket_activity,
  task_dashboard: task_dashboard,
  subsidiary_wise_payroll_checklist: subsidiary_wise_payroll_checklist,
  portal_ticket_creation: PortalTicketCreation,
  portal_ticket_time_report: portal_ticket_time_report,
  portal_ticket_calendar: portal_ticket_calendar,
  portal_task_assignment_timeline: portal_task_assignment_timeline,
  ticket_setup_portal: ticket_setup_portal,
  time_logging_portal: time_logging_portal,
  ticket_activity_portal: ticket_activity_portal,
  project_timeline_portal: project_timeline_portal,
  task_configuration: task_configuration,
  customer_user: customer_user,
  cash_payment_against_loan: cash_payment_against_loan,
  customer_config: customer_config,
  temporary_shift_setup: employee_temporary_shift_setup,
  reimbursement_claim_request: reimbursement_claim_request,
  tada_config: tada_configuration,
  preapproval_travel_request: preapprovaltravelrequest,
  travel_request: travel_request,
  travel_request_approval: travel_request_approval,
  temporary_shift_setup: employee_temporary_shift_setup,
  reimbursement_claim_approval: reimbursement_claim_approval,
  project_sprint: project_sprint,
  reimbursement_claim_workflow_status_approval: reimbursement_claim_workflow_status_approval,
  reimbursement_claim_workflow_status: reimbursement_claim_workflow_status,
  attendance_roster_request: attendance_roster_request,
  attendance_roster_approval: attendance_roster_approval,
  attendance_roster_workflow_status: attendance_roster_workflow_status,
  attendance_roster_workflow_status_portal: attendance_roster_workflow_status_portal,
  post_approval_travel_request: post_approval_travel_request,
  post_travel_request: post_travel_request,
  roster_calendar_team: roster_calendar_team,
  travel_request_workflow_status: travel_request_workflow_status,
  travel_request_workflow_status_approval: travel_request_workflow_status_approval,
  company_att_machine_config: company_att_machine_config,
  interview_questionnaire: interview_questionnaire,
  interview_recommendations: interview_recommendations,
  job_requestion_approval: job_requestion_approval,
  travel_request_reports: TravelRequestReportsModule,
  job_requestion_workflow: JobRequestionWorkflowStatus,
  job_requestion_workflow_approval: JobRequestionWorkflowStatusApproval,
  close_payroll_month: ClosePayrollMonthSetupModule,
  employee_task: employee_task_portal,
  policy_for_new_year_budget: policy_for_new_year_budget,
  department_wise_budget: department_wise_budget,
  portal_department_wise_budget: portal_department_wise_budget,
  budget_workflow_status : budget_workflow_status,
  budget_workflow_status_portal : budget_workflow_status_portal,
  department_wise_budget_approval: BudgetApproval,
  budget_setup_year: budget_year_setup,
  manpower_budget_dashboard : manpower_budget_dashboard,

};

export default function BasePage() {
  const dispatch = useDispatch();
  dispatch(fetchAllCountry());

  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
  // );
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Route path="/ask/ai-chatbot" component={AIChatbotManagement} />
        {/* <Route path='vehicles/read-all-vehicles' component={VehicleManagment} /> */}
        {Object.keys(UserAccess).map((access, key) => {
          const accessName = access.replace(/ /g, "").toLowerCase();

          const path = access
            .split(" ")
            .join("-")
            .toLowerCase();
          if (ROUTES[accessName]) {
            return (
              <Route
                key={key}
                path={`/${path}`}
                component={ROUTES[accessName]}
              />
            );
          }
        })}

        <>
          {<Redirect exact from="/" to="/dashboard" />}
          <ContentRoute path="/dashboard" component={Dashboard} />
        </>

        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
