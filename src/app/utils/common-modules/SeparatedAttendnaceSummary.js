// import React, { useEffect, useState } from 'react';
// import { Accordion, Card, Row, Col } from 'react-bootstrap';
// import './form.css';
// import { getSeparatedAttSummaryEmpById } from '../../modules/Dashboard/_redux/dashboardCrud';

// const SeparatedAttendanceSummary = ({ employeeId, panelMode,hitAttSummary,data }) => {

//     // const [data, setData] = useState(presentData || {});




// // useEffect(() => {
// //     if (employeeId) {
// //         getSeparatedAttSummaryEmpById(employeeId)
// //             .then((res) => {
// //                 const result = res?.data?.data;

// //                 // if false -> set empty object
// //                 if (!result || result === false) {
// //                     setData({});
// //                 } else {
// //                     setData( result);
// //                 }
// //             })
// //             .catch(() => setData({}));
// //     } else {
// //         setData({});
// //     }
// // }, [employeeId,hitAttSummary]);
//   if (!panelMode) return null;
//     return (
//         <Accordion defaultActiveKey="0">
//             <Card>
//                 <Accordion.Collapse eventKey="0">
//                     <Card.Body className="bg-tsecondary">
//                         {Object.keys(data).length === 0 ? (
//                             <p>No attendance summary available</p>
//                         ) : (
//                             <>
//                                 <div className="mb-4 flex items-center gap-4">
//                                     <h6 className="font-bold mb-0 text-primary my-2">
//                                         Attendance Summary
//                                     </h6>
//                                 </div>

//                                 {/* Attendance Summary Fields */}
//                                 <div className="mb-4 text-sm">
//                                     <Row className="mb-2">
//                                         <Col md={3} className="font-medium">Paid Days</Col>
//                                         <Col md={3}>{data?.PresentDays || '0'}</Col>

//                                          <Col md={3} className="font-medium">Total Working Hours</Col>
//                                         <Col md={3}>{data?.TotalWorkingHours || '0'}</Col>

                                      
//                                     </Row>

//                                     <Row className="mb-2">

                                        
//                                         {/* <Col md={3} className="font-medium">Holidays</Col>
//                                         <Col md={3}>{data?.Holidays || '0'}</Col> */}

                                       
//                                     </Row>

//                                     {/* <Row className="mb-2">
//                                         <Col md={3} className="font-medium">Absent (Half Day)</Col>
//                                         <Col md={3}>{data?.AbsentDays_Halfday || '0'}</Col>

//                                         <Col md={3} className="font-medium">Absent (Late Count)</Col>
//                                         <Col md={3}>{data?.AbsentDays_LateCount || '0'}</Col>
//                                     </Row> */}

//                                     <Row className="mb-2">
//                                          <Col md={3} className="font-medium">Absent Days</Col>
//                                         <Col md={3}>{data?.AbsentDays || '0'}</Col>
                                       

//                                          <Col md={3} className="font-medium">Final Settlement Applicable</Col>
//                                         <Col md={3}>{data?.forFinalSettlement === 1 ? "Yes" : "No"}</Col>

//                                         {/* <Col md={3} className="font-medium">Total Short Hours</Col>
//                                         <Col md={3}>{data?.TotalShortHours || '0'}</Col> */}
//                                     </Row>

//                                     <Row className="mb-2">
//                                         {/* <Col md={3} className="font-medium">Late Per Day Amount</Col>
//                                         <Col md={3}>
//                                             {data?.LatePerDayAmount
//                                                 ? Number(data?.LatePerDayAmount).toLocaleString()
//                                                 : '0'}
//                                         </Col> */}

//                                         {/* <Col md={3} className="font-medium">Late Days Count</Col>
//                                         <Col md={3}>{data?.LateDaysCount || '0'}</Col> */}   
                                        
//                                           {/* <Col md={3} className="font-medium">Total Days</Col>
//                                         <Col md={3}>{data?.Total_Days || '0'}</Col> */}
//                                     </Row>

//                                     <Row className="mb-2">
                                       

//                                           <Col md={3} className="font-medium">Leave Days</Col>
//                                         <Col md={3}>{data?.LeaveDays || '0'}</Col>
//                                     </Row>
//                                 </div>
//                             </>
//                         )}
//                     </Card.Body>
//                 </Accordion.Collapse>
//             </Card>
//         </Accordion>
//     );
// };

// export default SeparatedAttendanceSummary;
import React from 'react';
import { Accordion, Card, Row, Col } from 'react-bootstrap';
import './form.css';

const SeparatedAttendanceSummary = ({ data, panelMode }) => {
  if (!panelMode) return null;

  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Accordion.Collapse eventKey="0">
          <Card.Body className="bg-tsecondary">
            {Object.keys(data).length === 0 ? (
              <p>No attendance summary available</p>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-4">
                  <h6 className="font-bold mb-0 text-primary my-2">
                    Attendance Summary
                  </h6>
                </div>

                <div className="mb-4 text-sm">
                  <Row className="mb-2">
                    <Col md={3} className="font-medium">Total Days</Col>
                    <Col md={3}>{data?.TotalDays || '0'}</Col>

                    <Col md={3} className="font-medium">Paid Days</Col>
                    <Col md={3}>{data?.PaidDays || '0'}</Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={3} className="font-medium">Absent Days</Col>
                    <Col md={3}>{data?.AbsentDays || '0'}</Col>

                    <Col md={3} className="font-medium">Leave Days</Col>
                    <Col md={3}>{data?.LeaveDays || '0'}</Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={3} className="font-medium">OT Hours</Col>
                    <Col md={3}>{data?.OTHours || '0'}</Col>

                    <Col md={3} className="font-medium">Encashment Days</Col>
                    <Col md={3}>{data?.EncashmentDays || '0'}</Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={3} className="font-medium">Total Working Hours</Col>
                    <Col md={3}>{data?.TotalWorkingHours || '0'}</Col>

                    <Col md={3} className="font-medium">Final Settlement Applicable</Col>
                    <Col md={3}>{data?.forFinalSettlement === 1 ? 'Yes' : 'No'}</Col>
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

export default SeparatedAttendanceSummary;
