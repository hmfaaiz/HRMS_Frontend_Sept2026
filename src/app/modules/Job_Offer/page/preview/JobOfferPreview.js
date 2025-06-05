import React, { useEffect, useState } from 'react';

const JobOfferPreview = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem('JobOfferPreview');
        localStorage.removeItem('JobOfferPreview'); // Clear it
        if (raw) {
            const parsed = JSON.parse(raw);
            setData(parsed);
        }
    }, []);

    if (!data) return <p>No data found. Please go back...</p>;

    const {
        companyLogo,
        recipientName,
        date,
        companyName,
        designation,
        department,
        monthlySalary,
        nic_no,
        passportNo,
        appointmentType,
        jobPreferences,
        startDate,
        probationPeriod,
        noticePeriod,
        jobOfferLetter,
        directorName,
        headOfHrDesignation,
        hrName,
        hrDesignation,locationName
    } = data;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height:"100%",
            minHeight: '100vh',
            //   backgroundColor: '#f0f0f0', // Optional for contrast 
            padding: '20px'
        }}>
            <div style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                padding: '10px',
                maxWidth: "800px",
                width: '100%',
                backgroundColor: 'white',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
            }}>
                <div className="header" style={{
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    padding: '70px',
                    position: 'relative'
                }}>
                    <img src={companyLogo} alt="Company Logo" style={{
                        position: 'absolute',
                        left: 0,
                        marginLeft: '45px',
                        height: 'auto',
                        width: '30%'
                    }} />
                </div>

                <h1 className="headerHeading" style={{ textAlign: 'center', textDecoration: 'underline', fontWeight: 'bold' }}>JOB OFFER</h1>

                <div className="content" style={{ margin: 'auto', padding: '40px' }}>
                    <table style={{ width: '100%', fontSize: '12px' }}>
                        <tbody>
                            <tr>
                                <td style={{ paddingTop: '20px' }}><strong>Dear {recipientName},</strong> </td>
                                <td style={{ textAlign: 'right' }}>Date: {date}</td>
                            </tr>
                        </tbody>
                    </table>

                    <p>
                        The <strong>{companyName} </strong>is delighted to offer you the below-mentioned position based in  <strong>{locationName}</strong> under the
                        following terms and conditions:
                    </p>

                    <table className="details" style={{
    width: '100%',
    fontSize: '11px',
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
  }}>
                        <tbody>
                            {designation && <tr><td style={{ fontWeight: '900' }}>Designation (Position)</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{designation}</td></tr>}
                            {department && <tr><td style={{ fontWeight: '900' }}>Department</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{department}</td></tr>}
                            {monthlySalary && <tr><td style={{ fontWeight: '900' }}>Monthly Fixed Salary</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{monthlySalary}</td></tr>}
                            {nic_no && <tr><td style={{ fontWeight: '900' }}>ID Card No</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{nic_no}</td></tr>}
                            {passportNo && <tr><td style={{ fontWeight: '900' }}>Passport No</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{passportNo}</td></tr>}
                            {appointmentType && <tr><td style={{ fontWeight: '900' }}>Appointment Type</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{appointmentType}</td></tr>}
                            {jobPreferences && <tr><td style={{ fontWeight: '900' }}>Job Preferences</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{jobPreferences}</td></tr>}
                            {startDate && <tr><td style={{ fontWeight: '900' }}>Commencement Date</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{startDate}</td></tr>}
                            {probationPeriod && <tr><td style={{ fontWeight: '900' }}>Probation Period</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{probationPeriod} Months</td></tr>}
                          
                        </tbody>
                    </table>

                    {/* <div className="jobOfferLetter" style={{ marginTop: '10px' }}>
                        {jobOfferLetter}
                    </div> */}

                      <div  className="jobOfferLetter" style={{ marginTop: '10px' }} dangerouslySetInnerHTML={{__html: jobOfferLetter}}></div>

                    <div className="footer" style={{ marginTop: '30px' }}>
                        <div
                            className="signature"
                            style={{
                                marginTop: '40px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '11px'
                            }}
                        >
                            {directorName && (
                                <div>
                                    <hr />
                                    <strong>{directorName}</strong><br />
                                    {headOfHrDesignation && <>{headOfHrDesignation}<br /></>}
                                    {companyName && <>{companyName}</>}
                                </div>
                            )}

                            {hrName && (
                                <div>
                                    <hr />
                                    <strong>{hrName}</strong><br />
                                    {hrDesignation && <>{hrDesignation}<br /></>}
                                    {companyName && <>{companyName}</>}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobOfferPreview;
