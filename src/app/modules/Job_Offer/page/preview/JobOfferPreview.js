import React, { useEffect, useState } from 'react';

const JobOfferPreview = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem('JobOfferPreview');
        console.log("JobOfferPreview11111", raw);
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
                                <td style={{ paddingTop: '20px' }}>Dear {recipientName},</td>
                                <td style={{ textAlign: 'right' }}>Date: {date}</td>
                            </tr>
                        </tbody>
                    </table>

                    <p>
                        The {companyName} is delighted to offer you the below-mentioned position based in {locationName} under the
                        following terms and conditions:
                    </p>

                    <table className="details" style={{ width: '100%', fontSize: '11px' }}>
                        <tbody>
                            {designation && <tr><td style={{ fontWeight: 'bold' }}>Designation (Position)</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: 'bold' }}>{designation}</td></tr>}
                            {department && <tr><td style={{ fontWeight: 'bold' }}>Department</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: 'bold' }}>{department}</td></tr>}
                            {monthlySalary && <tr><td style={{ fontWeight: 'bold' }}>Monthly Fixed Salary</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: 'bold' }}>{monthlySalary}</td></tr>}
                            {nic_no && <tr><td style={{ fontWeight: 'bold' }}>ID Card No</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: 'bold' }}>{nic_no}</td></tr>}
                            {passportNo && <tr><td style={{ fontWeight: 'bold' }}>Passport No</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: 'bold' }}>{passportNo}</td></tr>}
                            {appointmentType && <tr><td style={{ fontWeight: 'bold' }}>Appointment Type</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: 'bold' }}>{appointmentType}</td></tr>}
                            {jobPreferences && <tr><td style={{ fontWeight: 'bold' }}>Job Preferences</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: 'bold' }}>{jobPreferences}</td></tr>}
                            {startDate && <tr><td style={{ fontWeight: 'bold' }}>Commencement Date</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: 'bold' }}>{startDate}</td></tr>}
                            {probationPeriod && <tr><td style={{ fontWeight: 'bold' }}>Probation Period</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: 'bold' }}>{probationPeriod} Months</td></tr>}
                            {noticePeriod && <tr><td style={{ fontWeight: 'bold' }}>Notice Period</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: 'bold' }}>{noticePeriod} Days</td></tr>}
                        </tbody>
                    </table>

                    <div className="jobOfferLetter" style={{ marginTop: '10px' }}>
                        {jobOfferLetter}
                    </div>

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
