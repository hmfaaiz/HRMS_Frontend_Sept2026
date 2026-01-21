export const CustomerStatusCssClasses = ["danger", "success", "info", ""];
export const CustomerStatusTitles = ["Suspended", "Active", "Pending", ""];
export const CustomerTypeCssClasses = ["success", "primary", ""];
export const CustomerTypeTitles = ["Business", "Individual", ""];
export const defaultSorted = [{ dataField: "id", order: "asc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
];

export const initialFilter = {
  filter: {
    searchQuery: "",
  },

  sortOrder: "asc",
  pageSize: 5,
  pageNumber: 1,
};

export const uploadInfo = [
  {
    name: "dynasoft_employee_attendance",
    title: "Employee Attendance (Dynasoft)",
    description:
      "To upload Attendance Data in the HRMS, begin by downloading the attendance import Excel template. Fill in required fields such as Employee Code, Attendance Date, In Time, Out Time, and Machine ID, etc. ensuring all values follow the correct formats and no mandatory field is left blank. Do not modify column headers, add columns, or use merged cells. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees' attendance on Employee Attendance form to ensure the data has been uploaded accurately.",
  },
  {
    name: "employee_attendance_manual",
    title: "Employee Attendance",
    description:
      "To upload Attendance Data in the HRMS, begin by downloading the attendance import Excel template. Fill in required fields such as Employee Code, Attendance Date, In Time, Out Time, and Machine ID, etc. ensuring all values follow the correct formats and no mandatory field is left blank. Do not modify column headers, add columns, or use merged cells. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees' attendance on Employee Attendance form to ensure the data has been uploaded accurately.",
  },
  {
    name: "employee_attendance",
    title: "Attendance Machine",
    description:
      "To upload Attendance Machine Data in the HRMS, begin by downloading the attendance import Excel template. Fill in required fields such as Employee Code, Attendance Date, In Time, Out Time, and Machine ID, etc. ensuring all values follow the correct formats and no mandatory field is left blank. Do not modify column headers, add columns, or use merged cells. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees' machine attendance on Employee Attendance form to ensure the data has been uploaded accurately (after uploading activity system will take 15 minutes to move Machine Data in Attendance forms.",
  },
  {
    name: "employee_eobi_contribution",
    title: "Employee EOBI Contribution Balance",
    description:
      "To upload Employee EOBI Opening Balance data in the HRMS, download the EOBI Contribution import Excel template. Enter required details such as Employee Code, Registration No., Registration Date,Employee Contribution, Employer Contribution,  and Total Contribution, ensuring all mandatory fields are filled and formats are correct. Do not modify column headers, add columns, or use merged cells. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees' EOBI Contribution balance on EOBI Contribution reports to ensure the data has been uploaded accurately.",
  },
  {
    name: "employee_gratuity_contribution",
    title: "Employee Gratuity Contribution Balance",
    description:
      "To upload Employee Gratuity Opening Balance data in the HRMS, download the Gratuity balance import Excel template. Enter required details such as Employee Code, Registration Date, and Total Gratuity, ensuring all mandatory fields are filled and formats are correct. Do not modify column headers, add columns, or use merged cells. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees' Gratuity balance on Gratuity reports to ensure the data has been uploaded accurately.",
  },
  {
    name: "employee_leave",
    title: "Employee Leave Opening Balance",
    description:
      "To upload employee leave opening balances in the HRMS, download the leave balance Excel template. Enter required details such as Employee Code, Leave Type, Balance Cut-off Date, Opening Balance, ensuring all mandatory fields are filled and formats are correct. Do not modify column headers, add columns, or use merged cells. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees' leave balance on Employee Leave Application form to ensure the data has been uploaded accurately.",
  },
  {
    name: "Onetime_Earning_Deduction_Template",
    title: "One Time Allowance",
    description:
      "To upload employee Onetime Allowance in the HRMS, first download the Onetime Allowance Excel template. Fill in all required fields such as Employee Code, Allowance Name, Amounts, and Remarks, ensuring correct formats and no changes to column headers. Data uploaded from Excel Sheet will saved in Active Payroll Month, like for example if Nov-2025 is active payroll month then the sheet uploaded will save the data in Nov-2025. Avoid blank mandatory fields, merged cells, or added/deleted columns. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees’ Onetime data on the Onetime Allowance form to ensure the data has been uploaded accurately.",
  },
  {
    name: "employee_pf_contribution",
    title: "Employee Provident Fund Contribution Balance",
    description:
      "To upload Employee Provident Fund Opening Balance data in the HRMS, download the Provident Fund Contribution import Excel template. Enter required details such as Employee Code, Registration No., Registration Date,Employee Contribution, Employer Contribution,  and Total Contribution, ensuring all mandatory fields are filled and formats are correct. Do not modify column headers, add columns, or use merged cells. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees' Provident Fund Contribution balance on Provident Fund Contribution reports to ensure the data has been uploaded accurately.",
  },
  {
    name: "employee_profile",
    title: "Employee Profile",
    description:
      "To upload employee profile information into the Dynasoft Cloud HRMS via Excel Sheet, first download the template from the 'Template' button in Employee Profile section and fill it without changing column names or formats. Ensure all mandatory fields—such as Employee Code, Name, Date of Birth, Date of Joining, Department, Designation, Email, etc. are completed and correctly formatted. Avoid merged cells, extra spaces, or invalid data. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees in the directory to ensure the data has been uploaded accurately.",
  },
  {
    name: "employee_roster",
    title: "Employee Roster",
    description:
      "To upload Roster Data in the HRMS, begin by downloading the Roster import Excel template. Fill in required fields such as Employee Code, Roster Date, Shift Information, etc. ensuring all values follow the correct formats and no mandatory field is left blank. Do not modify column headers, add columns, or use merged cells. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees' Roster on Employee Roster form to ensure the data has been uploaded accurately.",
  },
  {
    name: "employee_salary",
    title: "Employee Salary",
    description:
      "To upload employee salary structures in the HRMS, first download the salary structure Excel template. Fill in all required fields such as Employee Code, Salary Components, Amounts, Payment Mode and Bank Information, and Currency, ensuring correct formats and no changes to column headers. Avoid blank mandatory fields, merged cells, or added/deleted columns. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees’ salary structure on the form to ensure the data has been uploaded accurately.",
  },
  {
    name: "employee_social_secruity_contribution",
    title: "Employee Social Security Contribution Balance",
    description:
      "To upload Employee Social Security Opening Balance data in the HRMS, download the Social Security Contribution import Excel template. Enter required details such as Employee Code, Registration No., Registration Date,Employee Contribution, Employer Contribution,  and Total Contribution, ensuring all mandatory fields are filled and formats are correct. Do not modify column headers, add columns, or use merged cells. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees' Social Security Contribution balance on Social Security Contribution reports to ensure the data has been uploaded accurately.",
  },
  {
    name: "tax_opening_balance",
    title: "Employee Tax Opening Balance",
    description:
      "To upload Employee Tax Opening Balance data in the HRMS, download the Income Tax import Excel template. Enter required details such as Employee Code, Allowances,Allowance Amount,  and Tax Deducted, ensuring all mandatory fields are filled and formats are correct. Do not modify column headers, add columns, or use merged cells. Once the sheet is ready and saved then browse the file, and upload it. The system will validate each record and generate an error report if issues exist; correct any highlighted errors and re-upload. After a successful import, verify a few employees' Income Tax balance on Income Tax reports to ensure the data has been uploaded accurately.",
  },
{
  name: "employee_goal_setup",
  title: "Employee Goal Setup",
  description:
    "To upload Employee Goal Setup data in the HRMS, download the goal setup import Excel template. Enter required details such as Employee Code, Competency Name, Goal Name, Goal Description, Weightage, Targeted End Date, and Comments (Yes / No), ensuring all mandatory fields are filled and formats are correct. Do not modify column headers, add or remove columns, or use merged cells. Once the sheet is completed and saved, browse and upload the file. The system will validate each record and generate an error report if any issues are found; correct the highlighted errors and re-upload the file. After a successful import, verify a few employees’ goals in the Employee Goal Setup screen to ensure the data has been uploaded accurately.",
}

];
