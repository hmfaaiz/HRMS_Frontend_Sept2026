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

const SettingsPage = lazy(() =>
  import("./modules/Settings/pages/SettingsPage")
);

const UserManagment = lazy(() => import("./modules/UserMangement/pages"));

const BankModule = lazy(() => import("./modules/Banks/pages/index"));
const BranchModule = lazy(() => import("./modules/BankBranch/pages/index"));
const DepartmenModule = lazy(() => import("./modules/Department/pages/index"));
const EmployeeTypeModule = lazy(() =>
  import("./modules/EmployeeType/pages/index")
);
const ReligionModule = lazy(() => import("./modules/Religion/pages/index"));
const RegionModule = lazy(() => import("./modules/Region/pages/index"));
const DesignationModule = lazy(() =>
  import("./modules/Designation/pages/index")
);
const FormModule = lazy(() => import("./modules/Forms/pages/index"));
const FormDetailsModule = lazy(() =>
  import("./modules/FormDetails/pages/index")
);
const EmpPolicyModule = lazy(() =>
  import("./modules/EmployeePolicy/pages/index")
);
const PolicyModule = lazy(() => import("./modules/Policy/pages/index"));
const EmplpyeeProfileModule = lazy(() =>
  import("./modules/EmployeeProfile/pages/index")
);
const ContactModule = lazy(() => import("./modules/Contact/pages/index"));
const AcademicModule = lazy(() => import("./modules/Academic/pages/index"));
const ExperienceModule = lazy(() => import("./modules/Experience/pages/index"));
const SkillsModule = lazy(() => import("./modules/Skills/pages/index"));
const IncidentModule = lazy(() => import("./modules/incident/pages/index"));
const EarningModule = lazy(() => import("./modules/Eearning/pages/index"));
const DeductionModule = lazy(() => import("./modules/Deduction/pages/index"));
const StoppageAllowanceModule = lazy(() =>
  import("./modules/StoppageAllowance/pages/index")
);
const ExchangeRateModule = lazy(() =>
  import("./modules/ExchangeRate/pages/index")
);
const CompensationBenefitsModule = lazy(() =>
  import("./modules/compensation_benefits/pages/index")
);
const EarningDeductionTranModule = lazy(() =>
  import("./modules/Compensation_Earning_Transaction/pages/index")
);
const DeductionTranModule = lazy(() =>
  import("./modules/Compensation_Deduction_Transaction/pages/index")
);
const EmployeeSalaryEarningModule = lazy(() =>
  import("./modules/Employee_Salary_Earning/pages/index")
);
const EmployeeSalaryDeductionModule = lazy(() =>
  import("./modules/Employee_Salary_Deduction/pages/index")
);
const EmployeeSalaryModule = lazy(() =>
  import("./modules/Employee_Salary_Setup/pages/index")
);
const EmployeeSalaryExpModule = lazy(() =>
  import("./modules/Employee_Salary_Expatriate/pages/index")
);
const CompensationExpModule = lazy(() =>
  import("./modules/Compensation_Expatriate/pages/index")
);
const EmployeeTransferModule = lazy(() =>
  import("./modules/Employee_Transfer/pages/index")
);
const EmployeeSalaryRevisionModule = lazy(() =>
  import("./modules/Employee_Salary_Revision/pages/index")
);
const TaxSetupModule = lazy(() => import("./modules/Tax_Setup/pages/index"));
const FiscalSetupModule = lazy(() =>
  import("./modules/Fiscal_Setup/pages/index")
);
const PayrollMonthSetupModule = lazy(() =>
  import("./modules/Payroll_Month_Setup/pages/index")
);
const ArrearPolicyModule = lazy(() =>
  import("./modules/ArrearPolicy/pages/index")
);
const RoundingPolicyModule = lazy(() =>
  import("./modules/SalaryRoundingPolicy/pages/index")
);
const LeaveTypeModule = lazy(() => import("./modules/LeaveType/pages/index"));
const FinalSettlementPolicyModule = lazy(() =>
  import("./modules/Final_Settlement_Policy/pages/index")
);
const salarypolicyModule = lazy(() =>
  import("./modules/Salarypolicy/pages/index")
);
const OnetimeAllowance = lazy(() =>
  import("./modules/Onetime_Allowance/pages/index")
);
const LoanType = lazy(() => import("./modules/LoanType/pages/index"));
const TaxSlab = lazy(() => import("./modules/LoanType/pages/index"));
const leaveManagementConfiguration = lazy(() =>
  import("./modules/leaveManagementConfiguration/pages/index")
);
const PayrollProcessPolicy = lazy(() =>
  import("./modules/Payroll_Process_Policy/pages/index")
);
const LeaveApplication = lazy(() =>
  import("./modules/LeaveApplication/pages/index")
);
const tax_slabModule = lazy(() => import("./modules/Tax_Slab/pages/index"));
const allocate_leaves = lazy(() =>
  import("./modules/AllocateLeaves/pages/index")
);
const employee_leave_balance = lazy(() =>
  import("./modules/EmployeeLeaveBalance/pages/index")
);
const loan_manag_confModule = lazy(() =>
  import("./modules/Loan_manag_conf/pages/index")
);
const gratuity_confModule = lazy(() =>
  import("./modules/Gratuity_Configuration/pages/index")
);
const accrue_gratuity_confModule = lazy(() =>
  import("./modules/Accrue_Gratuity_Configuration/pages/index")
);
const reimbursement_configurationModule = lazy(() =>
  import("./modules/Reimbursement_Configuration/pages/index")
);
const reimbursement_claimModule = lazy(() =>
  import("./modules/Reimbursement_claim/pages/index")
);
const employee_loan_requestModule = lazy(() =>
  import("./modules/Employee_Loan_Request/pages/index")
);
const AttendanceConfigurationManagement = lazy(() =>
  import("./modules/Attendance_Configuration/pages/index")
);
const EmployeeShiftManagement = lazy(() =>
  import("./modules/Employee_Shift/pages/index")
);
const HolidaysModule = lazy(() => import("./modules/Holidays/pages/index"));
const Payroll_processSModule = lazy(() =>
  import("./modules/Payroll_Process/pages/index")
);
const Attendance = lazy(() => import("./modules/Attendance/pages/index"));
const LeaveEncashment = lazy(() =>
  import("./modules/LeaveEncashment/pages/index")
);
const EmployeeRoster = lazy(() =>
  import("./modules/EmployeeRoster/pages/index")
);
const LeaveRegister = lazy(() => import("./modules/LeaveRegister/pages/index"));
const PayrollRegister = lazy(() =>
  import("./modules/PayrollRegister/pages/index")
);
const UserModule = lazy(() => import("./modules/User/pages/index"));
const UploadPage = lazy(() => import("./modules/UploadPage/pages/index"));
const passwordModule = lazy(() =>
  import("./modules/Reset_Password/pages/index")
);
const EmployeeRegister = lazy(() =>
  import("./modules/EmployeeRegister/pages/index")
);
const Roster_PatternModule = lazy(() =>
  import("./modules/Roster_Pattern/pages/index")
);
const companyModule = lazy(() => import("./modules/Company/page/index"));
const subsidiaryModule = lazy(() => import("./modules/Subsidiary/page/index"));
const calendarModule = lazy(() => import("./modules/Calendar/pages/index"));

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
  salary_revision: EmployeeSalaryRevisionModule,
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
  calendar:calendarModule,
};

export default function BasePage() {
  const dispatch = useDispatch();
  dispatch(fetchAllCountry());

  const auth = useSelector(({ auth }) => auth, shallowEqual);

  const UserAccess = auth?.userAccess;

  const SettingsAccess = auth?.userAccess?.Settings;
  // const isDashboardAccess = SettingsAccess?.some((obj) =>
  //   Object.values(obj).includes("read-all-vehicles-dashboard")
  // );
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
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
