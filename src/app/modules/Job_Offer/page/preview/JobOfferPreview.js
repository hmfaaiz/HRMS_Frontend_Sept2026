import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../_redux/formAction";
import { ToastContainer } from 'react-toastify';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from '../../../../../_metronic/_helpers';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Download, MailPlus } from 'lucide-react';
import { amountFormat } from '../../../../utils/common';
const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL;
const JobOfferPreview = () => {
    const [data, setData] = useState(null);

    const dispatch = useDispatch(); //
    const FormUIContext = useFormUIContext(); //
    const [formUIProps2, setFormUIProps2] = useState(null);
    const { pdfGenerateLoading, emailSendLoading } = useSelector((state) => {
        return {
            pdfGenerateLoading: state.job_offer?.pdfGenerateLoading,
            emailSendLoading: state.job_offer?.emailSendLoading,
        };
    }, shallowEqual);
    const formUIProps = useMemo(() => {
        return {
            applicantId: FormUIContext?.selectedApplicant,

            applicantVacancyId: FormUIContext?.applicantVacancyId,
            jobVacancyId: FormUIContext?.selectedJob,
            headOfHrId: FormUIContext?.headOfHrId,
            hrId: FormUIContext?.hrId,
        };
    }, [FormUIContext]);

    useEffect(() => {
        const raw = localStorage.getItem('JobOfferPreview');
        let rawForm = localStorage.getItem('formUIProps');
        setFormUIProps2(JSON.parse(rawForm));



        localStorage.removeItem('JobOfferPreview'); // Clear it
        if (raw) {
            const parsed = JSON.parse(raw);
            setData(parsed);
        }
    }, []);


    useEffect(() => {
        if (formUIProps2) {

        }
    }, [formUIProps2]);



    if (!data) return <p>No data found. Please go back...</p>;



    const generateOfferLetter = (values, type) => {

        const updatedBody = {
            ...values,
            regenerated: false, // add new field here
        };
        type.to_generate
            ? dispatch(actions.Generatejob_offer_letter(updatedBody))
            : dispatch(actions.SendJobOfferEmail(updatedBody));

    }




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
        hrDesignation, locationName
    } = data;
    return (
        <>
            <ToastContainer />

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: "100%",
                minHeight: '100vh',
                //   backgroundColor: '#f0f0f0', // Optional for contrast 
                padding: '20px'
            }}>
                <div className='p-5'>


                    <div className="col-12 col-md-12 mt-4 row p-5">
                        <div className="flex justify-between items-center gap-4">


                            <OverlayTrigger
                                overlay={<Tooltip id="products-edit-tooltip">Generate Offer Letter</Tooltip>}
                            >
                                <a title="" className=""
                                    disabled={

                                        formUIProps2 == null || pdfGenerateLoading || emailSendLoading
                                    }
                                    onClick={() => {
                                        generateOfferLetter({
                                            applicantId: formUIProps2?.applicantId,
                                            applicantVacancyId: formUIProps2?.applicantVacancyId,
                                            jobVacancyId: formUIProps2?.jobVacancyId,
                                            headOfHrId: formUIProps2?.headOfHrId,
                                            hrId: formUIProps2?.hrId,

                                        },
                                            { to_generate: true, to_send: false });
                                    }}>

                                    <Download className="w-4 h-4 text-black cursor-pointer" />
                                    {pdfGenerateLoading && (
                                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                                    )}
                                </a>
                            </OverlayTrigger>




                            <OverlayTrigger
                                overlay={<Tooltip id="products-edit-tooltip">Send Offer Letter</Tooltip>}
                            >
                                <a title="" className=""
                                    disabled={

                                        formUIProps2 == null || pdfGenerateLoading || emailSendLoading
                                    }
                                    onClick={() => {
                                        generateOfferLetter({
                                            applicantId: formUIProps2?.applicantId,
                                            applicantVacancyId: formUIProps2?.applicantVacancyId,
                                            jobVacancyId: formUIProps2?.jobVacancyId,
                                            headOfHrId: formUIProps2?.headOfHrId,
                                            hrId: formUIProps2?.hrId,

                                        },
                                            { to_generate: false, to_send: true });
                                    }}>

                                    <MailPlus className="w-4 h-4 text-black cursor-pointer" />
                                    {emailSendLoading && (
                                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                                    )}
                                </a>
                            </OverlayTrigger>

                        </div>
                    </div>
                    <div style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '12px',
                        padding: '10px',
                        maxWidth: "800px",
                        width: '100%',
                        backgroundColor: 'white',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                    }}>
                        {/* <div className="header" style={{
                            backgroundColor: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            padding: '70px',
                            position: 'relative'
                        }}>
                            <img src={`${UPLOAD_URL}/${companyLogo}`} alt="Company Logo" style={{
                                position: 'absolute',
                                left: 0,
                                marginLeft: '45px',
                                height: 'auto',
                                width: '30%'
                            }} />

                        
                        </div> */}

                        <div style={{
                            width: "200px",
                            maxWidth: "20%",
                            height: "auto",
                            backgroundColor: 'white',
                            // boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            // fontSize: '12px',
                            padding: '45px',
                        }}>
                            <img
                                src={`${UPLOAD_URL}/${companyLogo}`}
                                alt="Company Logo"
                                style={{
                                    left: 0,
                                    width: "100%",  // container ke andar adjust ho jaye
                                    height: "auto",
                                    display: "block"
                                }}
                            />
                        </div>

                        <h1 className="headerHeading" style={{ textAlign: 'center', textDecoration: 'underline', fontWeight: 'bold' }}>JOB OFFER</h1>

                        <div className="content" style={{ margin: 'auto', padding: '40px' }}>
                            <table style={{ width: '100%', fontSize: '12px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ paddingTop: '20px', fontWeight: '900' }}>Dear {recipientName},</td>
                                        <td style={{ textAlign: 'right', fontWeight: '900' }}> Date: {date}</td>
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
                                    {monthlySalary && <tr><td style={{ fontWeight: '900' }}>Monthly Fixed Salary</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{amountFormat(monthlySalary)}</td></tr>}
                                    {nic_no && <tr><td style={{ fontWeight: '900' }}>ID Card No</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{nic_no}</td></tr>}
                                    {passportNo && <tr><td style={{ fontWeight: '900' }}>Passport No</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{passportNo}</td></tr>}
                                    {appointmentType && <tr><td style={{ fontWeight: '900' }}>Appointment Type</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{appointmentType}</td></tr>}
                                    {jobPreferences && <tr><td style={{ fontWeight: '900' }}>Job Preferences</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{jobPreferences}</td></tr>}
                                    {startDate && <tr><td style={{ fontWeight: '900' }}>Commencement Date</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{startDate}</td></tr>}
                                    {probationPeriod && <tr><td style={{ fontWeight: '900' }}>Probation Period</td><td style={{ padding: '0 20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: '' }}>{probationPeriod} Months</td></tr>}

                                </tbody>
                            </table>



                            <div className="jobOfferLetter" style={{ marginTop: '10px' }} dangerouslySetInnerHTML={{ __html: jobOfferLetter }}></div>
                            <br />
                            {/* Signature */}
                            <div>
                                <div><p>We look forward to welcoming you to the team!</p>

                                    <strong>Best regards,</strong></div>


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
                                    <br />
                                    <br />
                                    <br />
                                </div>
                                <div>

                                    <strong>Candidate Acceptance</strong>

                                    <p>I,<strong> {recipientName}</strong>, accept this offer and agree to the terms outlined above.</p>
                                    <br />
                                    <br />
                                    <p><strong> Signature: ___________________ Date: ___________________</strong></p>


                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div >


        </>
    );
};

export default JobOfferPreview;
