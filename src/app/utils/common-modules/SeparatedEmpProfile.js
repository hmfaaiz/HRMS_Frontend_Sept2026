import React, { useEffect, useState } from 'react';
import { Accordion, Card, Row, Col } from 'react-bootstrap';
import { formatDates, calculateServicePeriod } from '../common';
import { toAbsoluteUrl } from '../../../_metronic/_helpers';
import './form.css';
import { User } from 'lucide-react';
import { getSeparatedEmployeeById } from '../../modules/Dashboard/_redux/dashboardCrud';

const SeparatedEmpProfile = ({ employeeId, panelMode }) => {
    const [data, setData] = useState({});
    const [calculateServicePeriodData, setCalculateServicePeriodData] = useState();

    useEffect(() => {
        if (employeeId) {
            getSeparatedEmployeeById(employeeId)
                .then((res) => {
                    if (res?.data?.data) setData(res.data?.data);
                })
                .catch(() => setData({}));
        } else setData({});
    }, [employeeId]);

    if (!panelMode) return null;
    // useEffect(() => {
    //     if (data?.dateOfJoining && data?.lastWorkingDate) {
    //         setCalculateServicePeriodData(calculateServicePeriod(data?.dateOfJoining, data?.lastWorkingDate))
    //     }

    // }, [data])

    

    return (
        <Accordion defaultActiveKey="0">
            <Card>
                <Accordion.Collapse eventKey="0">
                    <Card.Body className="bg-tsecondary">
                        {Object.keys(data).length === 0 ? (
                            <p>No profile data available</p>
                        ) : (
                            <>
                                {/* Profile Picture */}
                                <div className="mb-4 flex items-center gap-4">
                                    {/* {data.profile_image ? (
                    <img
                      src={data.profile_image}
                      alt="Profile"
                      width={120}
                      height={120}
                      style={{ borderRadius: '10px', objectFit: 'cover', border: '1px solid #ddd', padding: '5px' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = toAbsoluteUrl('/media/users/profileImage.png'); }}
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-[10px] border border-gray-300 bg-white flex justify-center items-center p-[5px]">
                      <User className="text-primary" size={60} />
                    </div>
                  )} */}
                                    <h6 className="font-bold mb-0 text-primary my-2">Separation Detail</h6>
                                </div>

                                {/* Leaving Reasons */}
                                <div className="mb-4 text-sm">
                                    <h6 className="font-bold mb-2">Leaving Reasons</h6>
                                    <Row className="mb-2 text-sm">
                                        <Col md={3} className="font-medium bold">Exit Type</Col>
                                        <Col md={3}>{data?.ExitType?.formName || 'N/A'}</Col>
                                        <Col md={3} className="font-medium bold">Exit Remarks</Col>
                                        <Col md={3} >{data?.exitRemark || 'N/A'}</Col>

                                    </Row>
                                    <Row>


                                        <Col md={3} className="font-medium">Exit Reason</Col>
                                        <Col md={3}>{data?.ExitReason.exitReason || 'N/A'}</Col>
                                    </Row>
                                </div>

                                {/* Resignation & Notice Period Info */}
                                <div className="mb-4 text-sm">
                                    <h6 className="font-bold mb-2">Resignation & Notice Period Info</h6>
                                    <Row className="mb-2 text-sm">
                                        <Col md={3} className="font-medium">Accepted By</Col>
                                        <Col md={3} >{data?.AcceptedEmployee?.fullName || 'N/A'}</Col>
                                        <Col md={3} className="font-medium">Date of Resignation Acceptance</Col>
                                        <Col md={3} >{data?.resignationAcceptanceDate ? formatDates(data?.resignationAcceptanceDate) : 'N/A'}</Col>
                                    </Row>
                                    <Row className="mb-2 text-sm">
                                        <Col md={3} className="font-medium">Remarks</Col>
                                        <Col md={3} >{data?.acceptanceRemarks || 'N/A'}</Col>
                                        <Col md={3} className="font-medium">Final Settlement Policy</Col>
                                        <Col md={3} >{data?.finalSettlementPolicy || 'N/A'}</Col>
                                    </Row>
                                    <Row className="mb-2 text-sm">
                                        <Col md={3} className="font-medium">Resignation Submission Date</Col>
                                        <Col md={3} >{data?.resignationDate ? formatDates(data?.resignationDate) : 'N/A'}</Col>
                                        <Col md={3} className="font-medium">Last Working Date</Col>
                                        <Col md={3} >{data?.lastWorkingDate ? formatDates(data?.lastWorkingDate) : 'N/A'}</Col>
                                    </Row>
                                    <Row className="mb-2 text-sm">
                                        <Col md={3} className="font-medium">Total Service Period</Col>
                                        <Col md={3} >  {data?.Employee?.dateOfJoining && data?.lastWorkingDate
                                            ? calculateServicePeriod(data?.Employee?.dateOfJoining, data?.lastWorkingDate)
                                            : 'N/A'}</Col>
                                        <Col md={3} className="font-medium">Notice Period Days</Col>
                                        <Col md={3} >{data?.noticePeriodDays || 'N/A'}</Col>
                                    </Row>
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
};

export default SeparatedEmpProfile;
