// import React, { useEffect, useState } from "react";

// export const PreviewRegisterPDFGroupBy = () => {
//   const formatCurrency = (value) => value?.toFixed(2) || '0.00';
//   const [data, setData] = useState(null);

//     useEffect(() => {
//       const raw = localStorage.getItem('previewRegisterPdf');
  
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         setData(parsed);
//         console.log("parsed111",parsed)
//         localStorage.removeItem('payroll_register_preview'); // Clear it
//       }
  
  
//     }, []);
//   const labels = {
//     monthLabel: 'April 2025',
//     subsidiaryLabel: 'Subsidiary XYZ',
//     groupWiseLabel: 'Group A',
//   };

//   const earningColumns = ['Basic', 'HRA', 'Special Allowance'];
//   const deductionColumns = ['Provident Fund', 'Tax'];
//   const loanColumns = ['Loan 1', 'Loan 2', 'Loan 3'];

//   // Sample payroll data
//   const payrollData = {
//     "IT Department": [
//       {
//         employeeCode: "E001",
//         EmployeeName: "John Doe",
//         departmentName: "IT",
//         gradeName: "A",
//         designationName: "Developer",
//         dateOfJoining: "2020-01-15",
//         GrossPackage: 50000,
//         monthDays: 30,
//         paidDays: 28,
//         AbsentDays: 2,
//         OTHours: 5,
//         Basic: 20000,
//         HRA: 10000,
//         SpecialAllowance: 5000,
//         totalAllowances: 35000,
//         ProvidentFund: 2000,
//         Tax: 3000,
//         Loan1: 1000,
//         Loan2: 1500,
//         Loan3: 2000,
//         totalDeductions: 7500,
//         netPayableSalary: 27500
//       },
//       // More employees...
//     ],
//     "HR Department": [
//       {
//         employeeCode: "E002",
//         EmployeeName: "Jane Smith",
//         departmentName: "HR",
//         gradeName: "B",
//         designationName: "HR Manager",
//         dateOfJoining: "2018-03-10",
//         GrossPackage: 60000,
//         monthDays: 30,
//         paidDays: 30,
//         AbsentDays: 0,
//         OTHours: 0,
//         Basic: 25000,
//         HRA: 12000,
//         SpecialAllowance: 8000,
//         totalAllowances: 45000,
//         ProvidentFund: 3000,
//         Tax: 4000,
//         Loan1: 2000,
//         Loan2: 2500,
//         Loan3: 3000,
//         totalDeductions: 11500,
//         netPayableSalary: 38500
//       },
//       // More employees...
//     ]
//     // More categories...
//   };

//   // Calculate totals for each category
//   const totals = {
//     grossPackage: 0,
//     totalAllowances: 0,
//     totalDeductions: 0,
//     netPayableSalary: 0,
//   };

//   // Calculate the totals
//   Object.values(payrollData).forEach(category => {
//     category.forEach(employee => {
//       totals.grossPackage += employee.GrossPackage;
//       totals.totalAllowances += employee.totalAllowances;
//       totals.totalDeductions += employee.totalDeductions;
//       totals.netPayableSalary += employee.netPayableSalary;
//     });
//   });

//   return (
//     <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px', backgroundColor: '#f9f9f9' }}>
//       <h1 style={{ textAlign: 'center', color: '#333' }}>Payroll Register</h1>

//       <div style={{ marginBottom: '20px' }}>
//         {labels.monthLabel && <p>For the Month of: <strong>{labels.monthLabel}</strong></p>}
//         {labels.subsidiaryLabel && <p>Subsidiary: <strong>{labels.subsidiaryLabel}</strong></p>}
//         {labels.groupWiseLabel && <p>Payroll: <strong>{labels.groupWiseLabel}</strong></p>}
//       </div>

//       <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
//         <thead>
//           <tr>
//             <th>S. No.</th>
//             <th>Employee Code</th>
//             <th>Employee Name</th>
//             <th>Department</th>
//             <th>Grade</th>
//             <th>Designation</th>
//             <th>Date of Joining</th>
//             <th>Gross Package</th>
//             <th>Working Days</th>
//             <th>Payable Days</th>
//             <th>Absent Days</th>
//             <th>Overtime Hours</th>
//             {earningColumns.map((col, index) => <th key={index}>{col}</th>)}
//             <th>Total Allowances</th>
//             {deductionColumns.map((col, index) => <th key={index}>{col}</th>)}
//             {loanColumns.map((col, index) => <th key={index}>{col}</th>)}
//             <th>Total Deduction</th>
//             <th>Net Payable Salary</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.entries(payrollData).map(([category, data], index) => (
//             <React.Fragment key={category}>
//               <tr style={{ backgroundColor: '#f1ce83' }}>
//                 <td colSpan={3} style={{ textAlign: 'left' }}><strong>{category}</strong></td>
//                 <td colSpan={18}></td>
//               </tr>
//               {data.map((employee, empIndex) => (
//                 <tr key={empIndex}>
//                   <td>{empIndex + 1}</td>
//                   <td>{employee.employeeCode}</td>
//                   <td>{employee.EmployeeName}</td>
//                   <td>{employee.departmentName}</td>
//                   <td>{employee.gradeName}</td>
//                   <td>{employee.designationName}</td>
//                   <td>{employee.dateOfJoining}</td>
//                   <td>{formatCurrency(employee.GrossPackage)}</td>
//                   <td>{employee.monthDays}</td>
//                   <td>{employee.paidDays}</td>
//                   <td>{employee.AbsentDays}</td>
//                   <td>{employee.OTHours}</td>
//                   {earningColumns.map((col, colIndex) => (
//                     <td key={colIndex}>{formatCurrency(employee[col] || 0)}</td>
//                   ))}
//                   <td>{formatCurrency(employee.totalAllowances)}</td>
//                   {deductionColumns.map((col, colIndex) => (
//                     <td key={colIndex}>{formatCurrency(employee[col] || 0)}</td>
//                   ))}
//                   {loanColumns.map((col, colIndex) => (
//                     <td key={colIndex}>{formatCurrency(employee[col] || 0)}</td>
//                   ))}
//                   <td>{formatCurrency(employee.totalDeductions)}</td>
//                   <td>{formatCurrency(employee.netPayableSalary)}</td>
//                 </tr>
//               ))}
//               {index % 20 === 19 && <tr><td colSpan="100%" style={{ height: '1px', pageBreakAfter: 'always' }}></td></tr>}
//             </React.Fragment>
//           ))}
//           <tr style={{ backgroundColor: '#83f183', fontWeight: 'bold' }}>
//             <td colSpan={7} style={{ textAlign: 'left' }}>Subtotal</td>
//             <td>{formatCurrency(totals.grossPackage)}</td>
//             <td colSpan={4}></td>
//             {earningColumns.map((col, index) => (
//               <td key={index}>{formatCurrency(totals[col] || 0)}</td>
//             ))}
//             <td>{formatCurrency(totals.totalAllowances)}</td>
//             {deductionColumns.map((col, index) => (
//               <td key={index}>{formatCurrency(totals[col] || 0)}</td>
//             ))}
//             {loanColumns.map((col, index) => (
//               <td key={index}>{formatCurrency(totals[col] || 0)}</td>
//             ))}
//             <td>{formatCurrency(totals.totalDeductions)}</td>
//             <td>{formatCurrency(totals.netPayableSalary)}</td>
//           </tr>
//           <tr style={{ backgroundColor: '#ffeb3b', fontWeight: 'bold' }}>
//             <td colSpan={7} style={{ textAlign: 'left' }}>Grand Total</td>
//             <td>{formatCurrency(totals.grossPackage)}</td>
//             <td colSpan={4}></td>
//             {earningColumns.map((col, index) => (
//               <td key={index}>{formatCurrency(totals[col] || 0)}</td>
//             ))}
//             <td>{formatCurrency(totals.totalAllowances)}</td>
//             {deductionColumns.map((col, index) => (
//               <td key={index}>{formatCurrency(totals[col] || 0)}</td>
//             ))}
//             {loanColumns.map((col, index) => (
//               <td key={index}>{formatCurrency(totals[col] || 0)}</td>
//             ))}
//             <td>{formatCurrency(totals.totalDeductions)}</td>
//             <td>{formatCurrency(totals.netPayableSalary)}</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };
import React, { useEffect, useState } from "react";

export const PreviewRegisterPDFGroupBy = () => {
  const formatCurrency = (value) => value?.toFixed(2) || '0.00';
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('previewRegisterPdf');

    if (raw) {
      const parsed = JSON.parse(raw);
      setData(parsed);
      console.log("Parsed Data:", parsed);
      localStorage.removeItem('previewRegisterPdf'); // Clear it
    }
  }, []);

  if (!data) {
    return <div>Loading...</div>; // Show loading message while the data is being fetched
  }

  const { labels, earningColumns, deductionColumns, loanColumns, obj, totals } = data;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Payroll Register</h1>

      <div style={{ marginBottom: '20px' }}>
        {labels?.monthLabel && <p>For the Month of: <strong>{labels.monthLabel}</strong></p>}
        {labels?.subsidiaryLabel && <p>Subsidiary: <strong>{labels.subsidiaryLabel}</strong></p>}
        {labels?.groupWiseLabel && <p>Payroll: <strong>{labels.groupWiseLabel}</strong></p>}
      </div>
      <div style={{ height: '60vh', overflow: 'auto' }}>
      <table className="payroll-register-groupBy" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr>
            <th>S. No.</th>
            <th>Employee Code</th>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Grade</th>
            <th>Designation</th>
            <th>Date of Joining</th>
            <th>Gross Package</th>
            <th>Working Days</th>
            <th>Payable Days</th>
            <th>Absent Days</th>
            <th>Overtime Hours</th>
            {earningColumns.map((col, index) => <th key={index}>{col}</th>)}
            <th>Total Allowances</th>
            {deductionColumns.map((col, index) => <th key={index}>{col}</th>)}
            {loanColumns.map((col, index) => <th key={index}>{col}</th>)}
            <th>Total Deduction</th>
            <th>Net Payable Salary</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(obj).map(([departmentName, { data: employees, totals: deptTotals }], index) => (
            <React.Fragment key={departmentName}>
              {/* Department Title Row */}
              <tr style={{ backgroundColor: '#f1ce83' }}>
                <td colSpan={3} style={{ textAlign: 'left' }}><strong>{departmentName}</strong></td>
                <td colSpan={18}></td>
              </tr>
              {/* Employee Rows */}
              {employees.map((employee, empIndex) => (
                <tr key={empIndex}>
                  <td>{empIndex + 1}</td>
                  <td>{employee.employeeCode}</td>
                  <td>{employee.EmployeeName}</td>
                  <td>{employee.departmentName}</td>
                  <td>{employee.gradeName}</td>
                  <td>{employee.designationName}</td>
                  <td>{employee.dateOfJoining}</td>
                  <td>{formatCurrency(employee.GrossPackage)}</td>
                  <td>{employee.monthDays}</td>
                  <td>{employee.paidDays}</td>
                  <td>{employee.AbsentDays}</td>
                  <td>{employee.OTHours}</td>
                  {earningColumns.map((col, colIndex) => (
                    <td key={colIndex}>{formatCurrency(employee[col] || 0)}</td>
                  ))}
                  <td>{formatCurrency(employee.totalAllowances)}</td>
                  {deductionColumns.map((col, colIndex) => (
                    <td key={colIndex}>{formatCurrency(employee[col] || 0)}</td>
                  ))}
                  {loanColumns.map((col, colIndex) => (
                    <td key={colIndex}>{formatCurrency(employee[col] || 0)}</td>
                  ))}
                  <td>{formatCurrency(employee.totalDeductions)}</td>
                  <td>{formatCurrency(employee.netPayableSalary)}</td>
                </tr>
              ))}
              {/* Subtotal Row for Department */}
              <tr style={{ backgroundColor: '#83f183', fontWeight: 'bold' }}>
                <td colSpan={7} style={{ textAlign: 'left' }}>Subtotal</td>
                <td>{formatCurrency(deptTotals.grossPackage)}</td>
                <td colSpan={4}></td>
                {earningColumns.map((col, index) => (
                  <td key={index}>{formatCurrency(deptTotals[col] || 0)}</td>
                ))}
                <td>{formatCurrency(deptTotals.totalAllowances)}</td>
                {deductionColumns.map((col, index) => (
                  <td key={index}>{formatCurrency(deptTotals[col] || 0)}</td>
                ))}
                {loanColumns.map((col, index) => (
                  <td key={index}>{formatCurrency(deptTotals[col] || 0)}</td>
                ))}
                <td>{formatCurrency(deptTotals.totalDeductions)}</td>
                <td>{formatCurrency(deptTotals.netPayableSalary)}</td>
              </tr>
            </React.Fragment>
          ))}
          {/* Grand Total Row */}
          <tr style={{ backgroundColor: '#ffeb3b', fontWeight: 'bold' }}>
            <td colSpan={7} style={{ textAlign: 'left' }}>Grand Total</td>
            <td>{formatCurrency(totals.grossPackage)}</td>
            <td colSpan={4}></td>
            {earningColumns.map((col, index) => (
              <td key={index}>{formatCurrency(totals[col] || 0)}</td>
            ))}
            <td>{formatCurrency(totals.totalAllowances)}</td>
            {deductionColumns.map((col, index) => (
              <td key={index}>{formatCurrency(totals[col] || 0)}</td>
            ))}
            {loanColumns.map((col, index) => (
              <td key={index}>{formatCurrency(totals[col] || 0)}</td>
            ))}
            <td>{formatCurrency(totals.totalDeductions)}</td>
            <td>{formatCurrency(totals.netPayableSalary)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  );
};
