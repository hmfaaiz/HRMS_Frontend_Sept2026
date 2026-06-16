
// import React from 'react';
// import { Accordion, Card, Row, Col } from 'react-bootstrap';
// import './form.css';

// const SeparatedAttendanceSummary = ({ data, panelMode }) => {
//   if (!panelMode) return null;

//   return (
//     <Accordion defaultActiveKey="0">
//       <Card>
//         <Accordion.Collapse eventKey="0">
//           <Card.Body className="bg-tsecondary">
//             {Object.keys(data).length === 0 ? (
//               <p>No attendance summary available</p>
//             ) : (
//               <>
//                 <div className="mb-4 flex items-center gap-4">
//                   <h6 className="font-bold mb-0 text-primary my-2">
//                     Attendance Summary
//                   </h6>
//                 </div>

//                 <div className="mb-4 text-sm">
//                   <Row className="mb-2">
//                     <Col md={3} className="font-medium">From Date</Col>
//                     <Col md={3}>{data?.DateFrom || '0'}</Col>

//                     <Col md={3} className="font-medium">To Date</Col>
//                     <Col md={3}>{data?.DateTo || '0'}</Col>
//                   </Row>

//                   <Row className="mb-2">
//                     <Col md={3} className="font-medium">Paid Days</Col>
//                     <Col md={3}>{data?.PresentDays || '0'}</Col>

//                     <Col md={3} className="font-medium">Absent Days</Col>
//                     <Col md={3}>{data?.AbsentDays || '0'}</Col>


//                   </Row>

//                   <Row className="mb-2">

//                     <Col md={3} className="font-medium">Leave Days</Col>
//                     <Col md={3}>{data?.LeaveDays || '0'}</Col>


//                     <Col md={3} className="font-medium">Encashment Days</Col>
//                     <Col md={3}>{data?.EncashmentDays || '0'}</Col>
//                   </Row>

//                   <Row className="mb-2">

//                     <Col md={3} className="font-medium">OT Hours</Col>
//                     <Col md={3}>{data?.OTHours || '0'}</Col>

//                     <Col md={3} className="font-medium">Total Working Hours</Col>
//                     <Col md={3}>{data?.TotalWorkingHours || '0'}</Col>


//                   </Row>
//                 </div>
//               </>
//             )}
//           </Card.Body>
//         </Accordion.Collapse>
//       </Card>
//     </Accordion>
//   );
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
            {!data?.length ? (
              <div>No attendance summary available</div>
            ) : (
              <>
                <h5 className="mb-4">Attendance Summary</h5>

                {data.map((item, index) => (
                  <Card
                    key={item.Id}
                    className="mb-4 border shadow-sm"
                  >
                    <Card.Header
                      className="d-flex justify-content-between align-items-center"
                    >
                      {/* <span>
              <strong>Settlement #{item.forFinalSettlement}</strong>
            </span> */}

                      <span className="badge bg-primary text-white">
                        {item.DateFrom} - {item.DateTo}
                      </span>
                    </Card.Header>

                    <Card.Body>
                      <Row className="mb-3">
                        <Col md={2}>
                          <strong>Paid Days</strong>
                          <div>{item.PresentDays || 0}</div>
                        </Col>

                        <Col md={2}>
                          <strong>Absent Days</strong>
                          <div>{item.AbsentDays || 0}</div>
                        </Col>

                        <Col md={2}>
                          <strong>Leave Days</strong>
                          <div>{item.LeaveDays || 0}</div>
                        </Col>

                        <Col md={2}>
                          <strong>Encashment Days</strong>
                          <div>{item.EncashmentDays || 0}</div>
                        </Col>


                        <Col md={2}>
                          <strong>OT Hours</strong>
                          <div>{item.OTHours || 0}</div>
                        </Col>

                        <Col md={2}>
                          <strong>Total Working Hours</strong>
                          <div>{item.TotalWorkingHours || 0}</div>
                        </Col>
                      </Row>

                      <Row className="mb-3">


                        {/* <Col md={3}>
                <strong>Late Days</strong>
                <div>{item.LateDaysCount || 0}</div>
              </Col>

              <Col md={3}>
                <strong>Late Amount</strong>
                <div>{item.LatePerDayAmount || 0}</div>
              </Col> */}
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </>
            )}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default SeparatedAttendanceSummary;
