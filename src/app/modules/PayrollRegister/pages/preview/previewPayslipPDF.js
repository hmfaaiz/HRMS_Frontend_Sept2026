// import React, { useEffect, useState } from 'react';

// const PreviewPayslipPDF = () => {
//     const [data, setData] = useState(null);

//     useEffect(() => {
//         const raw = localStorage.getItem('previewPayslipPdf');

//         if (raw) {
//             const parsed = JSON.parse(raw);
//             setData(parsed);

//             // localStorage.removeItem('previewPayslipPdf'); // Clear it
//         }
//     }, []);

//     if (!data) {
//         return <div>Loading...</div>; // Show loading message while the data is being fetched
//     }


//     const { employeeData, earningData, deductionData, loanData, totalEarningAmount, totalDeductionAmount, grossSalary, earningDeductionDifference, earningDeductionDifferenceInWords, leaveDetailData, monthName } = data[0];

//     return (
//         <div className="payslip-container payslip-page-break">
//          <div className='payslip-container-inner'>

//             <header className="payslip-header">
//                 <div className="payslip-header-content">
//                     <div className="payslip-left">
//                         <h3>{employeeData.companyName}</h3>
//                         {monthName && <p>Salary Slip of {monthName}</p>}
//                     </div>
//                     <div className="payslip-right">
//                         <p>{employeeData.companyAddress}</p>
//                     </div>
//                 </div>
//             </header>

//             <table className='payslip-table'>
//                 <tbody>
//                     {/* Employee Information */}
//                     <tr className="payslip-section-title">
//                         <td colSpan="6">Employee Information</td>
//                     </tr>
//                     <tr>
//                         <td>Employee ID:</td>
//                         <td colSpan="2">{employeeData.employeeCode}</td>
//                         <td>Designation:</td>
//                         <td colSpan="2">{employeeData.designationName}</td>
//                     </tr>
//                     <tr>
//                         <td>Employee Name:</td>
//                         <td colSpan="2">{employeeData.EmployeeName}</td>
//                         <td>Grade:</td>
//                         <td colSpan="2">{employeeData.gradeName}</td>
//                     </tr>

//                     {/* Employee Attendance */}
//                     <tr className="payslip-section-title">
//                         <td colSpan="4">Employee Attendance</td>
//                         <td colSpan="2">Salary Transferred To</td>
//                     </tr>
//                     <tr>
//                         <td className='payslip-tdWidth'>Working Days:</td>
//                         <td className="payslip-tdWidthEmpAtt payslip-right-align">{employeeData.monthDays}</td>
//                         <td className='payslip-tdWidth'>Payable Days:</td>
//                         <td className="payslip-tdWidthEmpAtt payslip-right-align">{employeeData.paidDays}</td>
//                         <td className='payslip-tdWidth'>Bank Name:</td>
//                         <td className='payslip-tdWidth'>{employeeData.bankName}</td>
//                     </tr>
//                     <tr>
//                         <td>Leaves Deducted:</td>
//                         <td className="payslip-tdWidthEmpAtt payslip-right-align">{employeeData.leaveCount}</td>
//                         <td>Total Lates:</td>
//                         <td className="payslip-tdWidthEmpAtt payslip-right-align">{employeeData.LateDaysCount}</td>
//                         <td>Account No:</td>
//                         <td>{employeeData.accountNumber}</td>
//                     </tr>
//                     <tr>
//                         <td>Lates per Day Deduction:</td>
//                         <td className="payslip-right-align">{employeeData.LateDaysCount ? employeeData.LatePerDayAmount : 0}</td>
//                         <td>Lates Deducted:</td>
//                         <td className="payslip-tdWidthEmpAtt payslip-right-align">{employeeData.lateCount}</td>
//                     </tr>

//                     {/* Salary Calculations */}
//                     <tr className="payslip-section-title">
//                         <td colSpan="6">Salary Calculations</td>
//                     </tr>
//                     <tr> 
//                         <td colSpan="3" className='payslip-tdWidthOther payslip-alligntd payslip-table-td'>
//                             <table className='payslip-td-width'>
//                                 <tbody>
//                                     <tr>
//                                         <td colSpan="3" ><strong>Basic & Allowances</strong></td>
//                                     </tr>



//                                     {earningData.map((earning, index) => (
//                                         <tr key={index}>
//                                             <td>{earning.EarningName}</td>
//                                             {earning?.Amount_Actual_2 ? (
//                                                 <>
//                                                     <td className='payslip-right-align'></td>
//                                                     <td className="payslip-right-align">{earning.Amount_Actual_2}</td>
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <td className="payslip-right-align">{earning.Amount_Actual}</td>
//                                                     <td className='payslip-right-align'></td>
//                                                 </>
//                                             )}

//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </td>
//                         <td colSpan="2" className='payslip-tdWidthOther payslip-alligntd payslip-table-td'>
//                             <table className='payslip-td-width'>
//                                 <tbody>
//                                     <tr>
//                                         <td colSpan="2"><strong>Deduction</strong></td>
//                                     </tr>
//                                     {deductionData.map((deduction, index) => (
//                                         <tr key={index}>
//                                             <td>{deduction.EarningName}</td>
//                                             <td className="payslip-right-align">{deduction.Amount_Actual}</td>
//                                         </tr>
//                                     ))}

//                                     {loanData.map((loan, index) => (
//                                         <tr key={index}>
//                                             <td>{loan.EarningName}</td>
//                                             <td className="payslip-right-align">{loan.Amount_Actual}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </td>
//                         <td colSpan="2" className='payslip-tdWidthOther payslip-alligntd payslip-table-td'>
//                             <table className='payslip-td-width'>
//                                 <tbody>
//                                     <tr>
//                                         <td colspan="1"><strong>Balance</strong></td>
//                                     </tr>
//                                     {deductionData.map((deduction, index) => (
//                                         <tr key={index}>
//                                             {deduction.Amount_Actual_2 && (
//                                                 <td className="payslip-right-align">{deduction.Amount_Actual_2}</td>
//                                             )}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </td>
//                     </tr>

//                     {/* Totals */}
//                     <tr>
//                         <td colSpan="2">Total Allowances:</td>
//                         <td className="payslip-right-align">{totalEarningAmount}</td>
//                         <td colSpan="2">Total Deductions:</td>
//                         <td className="payslip-right-align">{totalDeductionAmount}</td>
//                     </tr>
//                     <tr>
//                         <td colSpan="2"><strong>Gross Salary:</strong></td>
//                         <td className="payslip-right-align">{grossSalary}</td>
//                         <td colSpan="2"><strong>Net Payable Salary:</strong></td>
//                         <td className="payslip-right-align">{earningDeductionDifference}</td>
//                     </tr>
//                     <tr>
//                         <td colSpan="2">Amount in Words:</td>
//                         <td colSpan="4">{earningDeductionDifferenceInWords}</td>
//                     </tr>

//                     {/* Leave Balance */}
//                     {leaveDetailData.length > 0 && (
//                         <>
//                             <tr className="payslip-section-title">
//                                 <td colSpan="6">Leave Balance</td>
//                             </tr>
//                             <tr>
//                                 <td colSpan="2"><strong>Leave Type</strong></td>
//                                 <td colSpan="2"><strong>Allocated Leaves</strong></td>
//                                 <td colSpan="2"><strong>Remaining Leaves</strong></td>
//                             </tr>
//                             {leaveDetailData.map((leave, index) => (
//                                 <tr key={index}>
//                                     <td colSpan="2">{leave.name}</td>
//                                     <td colSpan="2" className="payslip-right-align">{leave.allocatedCount}</td>
//                                     <td colSpan="2" className="payslip-right-align">{leave.remainingCount}</td>
//                                 </tr>
//                             ))}
//                         </>
//                     )}
//                 </tbody>
//             </table>

//             {/* Signatures */}
//             <div className="payslip-signature-content">
//                 <div>Prepared By:</div>
//                 <div className="payslip-flex-column">
//                     <input className="payslip-input-field" />
//                     Accountant
//                 </div>
//                 <div>Approved By:</div>
//                 <div className="payslip-flex-column">
//                     <input className="payslip-input-field" />
//                     HR Manager
//                 </div>
//             </div>

//             <div className="payslip-footer">*** This is a system-generated document. ***</div>
//         </div>
//         </div>
//     );
// };

// export default PreviewPayslipPDF;



import React, { useEffect, useState } from 'react';

const PreviewPayslipPDF = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const raw = localStorage.getItem('previewPayslipPdf');

        if (raw) {
            const parsed = JSON.parse(raw);
            setData(parsed);  // Set the data from localStorage
        }
    }, []);

    if (data.length === 0) {
        return <div>Loading...</div>; // Show loading message while the data is being fetched
    }

    return (
        <div className="payslip-container payslip-page-break">
            {data.map((item, index) => {
                const {
                    employeeData,
                    earningData,
                    deductionData,
                    loanData,
                    totalEarningAmount,
                    totalDeductionAmount,
                    grossSalary,
                    earningDeductionDifference,
                    earningDeductionDifferenceInWords,
                    leaveDetailData,
                    monthName
                } = item;

                return (
                    <div className='payslip-container-inner' key={index}>
                        <header className="payslip-header">
                            <div className="payslip-header-content">
                                <div className="payslip-left">
                                    <h3>{employeeData.companyName}</h3>
                                    {monthName && <p>Salary Slip of {monthName}</p>}
                                </div>
                                <div className="payslip-right">
                                    <p>{employeeData.companyAddress}</p>
                                </div>
                            </div>
                        </header>

                        <table className='payslip-table'>
                            <tbody>
                                {/* Employee Information */}
                                <tr className="payslip-section-title">
                                    <td colSpan="6">Employee Information</td>
                                </tr>
                                <tr>
                                    <td>Employee ID:</td>
                                    <td colSpan="2">{employeeData.employeeCode}</td>
                                    <td>Designation:</td>
                                    <td colSpan="2">{employeeData.designationName}</td>
                                </tr>
                                <tr>
                                    <td>Employee Name:</td>
                                    <td colSpan="2">{employeeData.EmployeeName}</td>
                                    <td>Grade:</td>
                                    <td colSpan="2">{employeeData.gradeName}</td>
                                </tr>

                                {/* Employee Attendance */}
                                <tr className="payslip-section-title">
                                    <td colSpan="4">Employee Attendance</td>
                                    <td colSpan="2">Salary Transferred To</td>
                                </tr>
                                <tr>
                                    <td className='payslip-tdWidth'>Working Days:</td>
                                    <td className="payslip-tdWidthEmpAtt payslip-right-align">{employeeData.monthDays}</td>
                                    <td className='payslip-tdWidth'>Payable Days:</td>
                                    <td className="payslip-tdWidthEmpAtt payslip-right-align">{employeeData.paidDays}</td>
                                    <td className='payslip-tdWidth'>Bank Name:</td>
                                    <td className='payslip-tdWidth'>{employeeData.bankName}</td>
                                </tr>
                                <tr>
                                    <td>Leaves Deducted:</td>
                                    <td className="payslip-tdWidthEmpAtt payslip-right-align">{employeeData.leaveCount}</td>
                                    <td>Total Lates:</td>
                                    <td className="payslip-tdWidthEmpAtt payslip-right-align">{employeeData.LateDaysCount}</td>
                                    <td>Account No:</td>
                                    <td>{employeeData.accountNumber}</td>
                                </tr>
                                <tr>
                                    <td>Lates per Day Deduction:</td>
                                    <td className="payslip-right-align">{employeeData.LateDaysCount ? employeeData.LatePerDayAmount : 0}</td>
                                    <td>Lates Deducted:</td>
                                    <td className="payslip-tdWidthEmpAtt payslip-right-align">{employeeData.lateCount}</td>
                                </tr>

                                {/* Salary Calculations */}
                                <tr className="payslip-section-title">
                                    <td colSpan="6">Salary Calculations</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className='payslip-tdWidthOther payslip-alligntd payslip-table-td'>
                                        <table className='payslip-td-width'>
                                            <tbody>
                                                <tr>
                                                    <td colSpan="3"><strong>Basic & Allowances</strong></td>
                                                </tr>

                                                {earningData.map((earning, index) => (
                                                    <tr key={index}>
                                                        <td>{earning.EarningName}</td>
                                                        {earning?.Amount_Actual_2 ? (
                                                            <>
                                                                <td className='payslip-right-align'></td>
                                                                <td className="payslip-right-align">{earning.Amount_Actual_2}</td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td className="payslip-right-align">{earning.Amount_Actual}</td>
                                                                <td className='payslip-right-align'></td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                    <td colSpan="2" className='payslip-tdWidthOther payslip-alligntd payslip-table-td'>
                                        <table className='payslip-td-width'>
                                            <tbody>
                                                <tr>
                                                    <td colSpan="2"><strong>Deduction</strong></td>
                                                </tr>
                                                {deductionData.map((deduction, index) => (
                                                    <tr key={index}>
                                                        <td>{deduction.EarningName}</td>
                                                        <td className="payslip-right-align">{deduction.Amount_Actual}</td>
                                                    </tr>
                                                ))}

                                                {loanData.map((loan, index) => (
                                                    <tr key={index}>
                                                        <td>{loan.EarningName}</td>
                                                        <td className="payslip-right-align">{loan.Amount_Actual}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                    <td colSpan="2" className='payslip-tdWidthOther payslip-alligntd payslip-table-td'>
                                        <table className='payslip-td-width'>
                                            <tbody>
                                                <tr>
                                                    <td colSpan="1"><strong>Balance</strong></td>
                                                </tr>
                                                {deductionData.map((deduction, index) => (
                                                    <tr key={index}>
                                                        {deduction.Amount_Actual_2 && (
                                                            <td className="payslip-right-align">{deduction.Amount_Actual_2}</td>
                                                        )}
                                                    </tr>
                                                ))}

                                                {loanData.map((loan, index) => (
                                                    <tr key={index}>
                                                        {loan.Amount_Actual_2 && (
                                                            <td className="payslip-right-align">{loan.Amount_Actual_2}</td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                {/* Totals */}
                                <tr>
                                    <td colSpan="2">Total Allowances:</td>
                                    <td className="payslip-right-align">{totalEarningAmount}</td>
                                    <td colSpan="2">Total Deductions:</td>
                                    <td className="payslip-right-align">{totalDeductionAmount}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2"><strong>Gross Salary:</strong></td>
                                    <td className="payslip-right-align">{grossSalary}</td>
                                    <td colSpan="2"><strong>Net Payable Salary:</strong></td>
                                    <td className="payslip-right-align">{earningDeductionDifference}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2">Amount in Words:</td>
                                    <td colSpan="4">{earningDeductionDifferenceInWords}</td>
                                </tr>

                                {/* Leave Balance */}
                                {leaveDetailData.length > 0 && (
                                    <>
                                        <tr className="payslip-section-title">
                                            <td colSpan="6">Leave Balance</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2"><strong>Leave Type</strong></td>
                                            <td colSpan="2"><strong>Allocated Leaves</strong></td>
                                            <td colSpan="2"><strong>Remaining Leaves</strong></td>
                                        </tr>
                                        {leaveDetailData.map((leave, index) => (
                                            <tr key={index}>
                                                <td colSpan="2">{leave.name}</td>
                                                <td colSpan="2" className="payslip-right-align">{leave.allocatedCount}</td>
                                                <td colSpan="2" className="payslip-right-align">{leave.remainingCount}</td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>

                        {/* Signatures */}
                        <div className="payslip-signature-content">
                            <div>Prepared By:</div>
                            <div className="payslip-flex-column">
                                <input className="payslip-input-field" />
                                Accountant
                            </div>
                            <div>Approved By:</div>
                            <div className="payslip-flex-column">
                                <input className="payslip-input-field" />
                                HR Manager
                            </div>
                        </div>

                        <div className="payslip-footer">*** This is a system-generated document. ***</div>
                    </div>
                );
            })}
        </div>
    );
};

export default PreviewPayslipPDF;
