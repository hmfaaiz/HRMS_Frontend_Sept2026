
import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import {PreviewRegisterPDFGroupBy} from "./previewRegisterPDFGroupBy"


export const PayrollRegisterPreviewPage = () => {
  const [data, setData] = useState(null);
  const [previewData, setPreviewData] = useState(null);


  // useEffect(() => {
  //   const raw = localStorage.getItem('payroll_register_preview');
  
  //   if (raw) {
  //     const parsed = JSON.parse(raw);
  //     setData(parsed);
  //   }
  // }, []);


  useEffect(() => {
    const raw = localStorage.getItem('previewRegisterPdf');

    if (raw) {
      const parsed = JSON.parse(raw);
      setData(parsed);
     
    }


  }, []);

  if (!data) return <p>Loading preview...</p>;

  // Extract data
  const {groupBy,employeeData, labels ,earningColumns,deductionColumns,loanColumns,totals} = data;



  return (
    <>
    {groupBy ? (
      <PreviewRegisterPDFGroupBy />
    ) : (
      <PreviewRegisterPDF
        labels={labels}
        employeeData={employeeData}
        earningColumns={earningColumns}
        deductionColumns={deductionColumns}
        loanColumns={loanColumns}
        totals={totals}
      />
    )}
  </>
  

  );
};







const PreviewRegisterPDF = ({
  labels = {},
  earningColumns = [],
  deductionColumns = [],
  loanColumns = [],
  employeeData = [],
  totals = {}
}) => {
  const toFixed = (value) => Number(value || 0).toFixed(2);

  const isMultipleOf = (index, num) => (index + 1) % num === 0;
  localStorage.removeItem('previewRegisterPdf'); // Clear it
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 20, backgroundColor: '#f9f9f9', zoom: 0.6 , padding:20}}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Payroll Register</h1>

      <div className="header-info" style={{ marginBottom: 20 }}>
        {labels.monthLabel && <p>For the Month of: <strong>{labels.monthLabel}</strong></p>}
        {labels.subsidiaryLabel && <p>Subsidiary: <strong>{labels.subsidiaryLabel}</strong></p>}
        {labels.groupWiseLabel && <p>Payroll: <strong>{labels.groupWiseLabel}</strong></p>}
      </div>
      <div style={{ height: '100vh', overflow: 'auto' }}>

      <table className="payroll-table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
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
            {earningColumns.map((col, i) => <th key={`e-${i}`}>{col}</th>)}
            <th>Total Allowances</th>
            {deductionColumns.map((col, i) => <th key={`d-${i}`}>{col}</th>)}
            {loanColumns.map((col, i) => <th key={`l-${i}`}>{col}</th>)}
            <th>Total Deduction</th>
            <th>Net Payable Salary</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map((emp, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{index + 1}</td>
                <td>{emp.employeeCode}</td>
                <td>{emp.EmployeeName}</td>
                <td>{emp.departmentName}</td>
                <td>{emp.gradeName}</td>
                <td>{emp.designationName}</td>
                <td>{emp.dateOfJoining}</td>
                <td>{toFixed(emp.GrossPackage)}</td>
                <td>{emp.monthDays}</td>
                <td>{emp.paidDays}</td>
                <td>{emp.AbsentDays}</td>
                <td>{emp.OTHours}</td>

                {earningColumns.map((col, i) => (
                  <td key={`emp-e-${i}`}>{toFixed(emp[col])}</td>
                ))}

                <td>{toFixed(emp.totalAllowances)}</td>

                {deductionColumns.map((col, i) => (
                  <td key={`emp-d-${i}`}>{toFixed(emp[col])}</td>
                ))}

                {loanColumns.map((col, i) => (
                  <td key={`emp-l-${i}`}>{toFixed(emp[col])}</td>
                ))}

                <td>{toFixed(emp.totalDeductions)}</td>
                <td>{toFixed(emp.netPayableSalary)}</td>
              </tr>

              {isMultipleOf(index, 20) && (
                <tr key={`page-break-${index}`} className="page-break">
                  <td colSpan={earningColumns.length + deductionColumns.length + loanColumns.length + 17}></td>
                </tr>
              )}
            </React.Fragment>
          ))}

          {/* Grand Total Row */}
          <tr className="tfoot" style={{ fontWeight: 'bold', backgroundColor: '#ffeb3b' }}>
            <td colSpan="7" style={{ textAlign: 'left' }}>Grand Total</td>
            <td>{toFixed(totals.grossPackage)}</td>
            <td colSpan="4"></td>

            {earningColumns.map((col, i) => (
              <td key={`t-e-${i}`}>{toFixed(totals[col])}</td>
            ))}
            <td>{toFixed(totals.totalAllowances)}</td>

            {deductionColumns.map((col, i) => (
              <td key={`t-d-${i}`}>{toFixed(totals[col])}</td>
            ))}

            {loanColumns.map((col, i) => (
              <td key={`t-l-${i}`}>{toFixed(totals[col])}</td>
            ))}

            <td>{toFixed(totals.totalDeductions)}</td>
            <td>{toFixed(totals.netPayableSalary)}</td>
          </tr>
        </tbody>
      </table>

      </div>
    </div>
  );
};

export default PreviewRegisterPDF;
