


// import React, { useEffect, useState } from 'react';
// import { Accordion, Card, Button, Row, Col } from 'react-bootstrap';
// import { getEmployeeProfileById } from '../../../_metronic/redux/dashboardCrud';
// import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
// import './form.css';
// import { formatDates } from '../common';
// import { toAbsoluteUrl } from '../../../_metronic/_helpers';

// // Field name and keys organized by sections
// const SECTIONS = [
//   {
//     heading: "Office Information",
//     fields: [
//       { name: 'Company', value: 'companyName' },
//       { name: 'Subsidiary', value: 'subsidiaryName' },
//       { name: 'Department', value: 'departmentName' },
//       { name: 'Reporting To', value: 'reportToName' },
//       { name: 'Grade', value: 'gradeName' },
//       { name: 'Designation', value: 'designationName' },
//       { name: 'Employee Type', value: 'employeeTypeName' },
//       { name: 'Payroll Group', value: 'payrollName' },
//       { name: 'Team', value: 'teamName' },
//       // { name: 'Default Shift', value: 'shiftName' },
//     ]
//   },
//   {
//     heading: "Personal Information",
//     fields: [
//       { name: 'Country', value: 'countryName' },
//       { name: 'City', value: 'cityName' },
//       { name: 'Location', value: 'locationName' },
//       { name: 'Region', value: 'regionName' },
//       { name: 'Marital Status', value: 'maritalStatus' },
//       { name: 'Gender', value: 'gender' },
//       { name: 'Date of Joining', value: 'dateOfJoining', isDate: true },
//       { name: 'Date of Confirmation', value: 'dateOfConfirmation', isDate: true },
//     ]
//   },
// ];

// const EmployeeProfile = ({ employeeId ,panelMode}) => {
//   const [data, setdata] = useState({});

//   // Fetch employee profile data when employeeId changes
//   useEffect(() => {
//     if (employeeId) {
//       getEmployeeProfileById(employeeId)
//         .then((res) => {
//           if (res?.data?.data) {
//             setdata(res.data.data);
//           }
//         })
//         .catch(() => {
//           setdata({});
//         });
//     } else {
//       setdata({});
//     }
//   }, [employeeId]);

//   return (
//     <>
//     {panelMode &&(
//     <Accordion defaultActiveKey="0"  className="mx-6">
//       <Card>
//         {/* <Card.Header>
//           <div className='accordion-header-btn '>
//             <Accordion.Toggle eventKey="0" className="flex-between-center">
//               Employee Detail
       
//             </Accordion.Toggle>
//           </div>
//         </Card.Header> */}
//         <Accordion.Collapse eventKey="0">
//           <Card.Body style={{ backgroundColor: '#E6F8FF' }}>
         
//           {/* "rgb(235 243 255)" */}
//             <div style={{ backgroundColor:  "#E6F8FF", padding: "20px", borderRadius: "5px", border: 'none' }}>
     
              

//             <div className="d-flex justify-content-between flex-column flex-md-row align-items-center">


//               {/* Employee Information Sections */}
//               {/* <h2 className='text-bold'>Employee Information</h2> */}

//               {Object.keys(data).length ? (
//               <div className="form-group row">
//               <div className="col-12 col-md-4 mt-3">
//                 <img
//                   name='profile_image'
//                   src={data.profile_image ? `${data.profile_image}` :toAbsoluteUrl("/media/users/profileImage.png") } // Fallback if no image
//                   alt="Profile"
//                   width={120}
//                   height={120}
//                   style={{
//                     borderRadius: '50%',  // Make the image circular
//                     objectFit: 'cover',   // Ensure the image covers the entire area without distortion
                  
//                   }}
//                     onError={(e) => {
//                     e.target.onerror = null; // Error loop rokne ke liye
//                     e.target.src = toAbsoluteUrl("/media/users/profileImage.png"); // Agar image load na ho toh fallback image set karo
//                   }}
//                 />
//               </div>
//             </div>
//               ) : (
//                 <p></p>
//               )}

//               </div>
//               <hr />
//               {Object.keys(data).length ? (
//                 SECTIONS.map((section, sectionIndex) => (
//                   <div key={sectionIndex} style={{ marginBottom: "2%" }}>
//                     <h5 className='text-bold mb-5 custom_color_1'>{section.heading}</h5>
                
//                     <Row>
//                       {section.fields.map((field, fieldIndex) => (
//                         <Col key={fieldIndex} md={3}> {/* Four columns layout */}
//                           <strong>{field.name}: </strong> 
//                           {data[field.value] ? 
//                             (field.isDate ? formatDates(data[field.value]) : data[field.value]) 
//                             : 'N/A' // Display 'N/A' if no value
//                           }
//                         </Col>
//                       ))}
//                     </Row>
//                     <hr /> {/* Separator between sections */}
//                   </div>
//                 ))
//               ) : (
//                 <p>Please Choose an Employee</p> // Improved message for clarity
//               )}
//             </div>
//           </Card.Body>
//         </Accordion.Collapse>
//       </Card>
//     </Accordion>
//    )}
//    </>
//   );
// };

// export default EmployeeProfile;



import React, { useEffect, useState } from 'react';
import { Accordion, Card, Row, Col } from 'react-bootstrap';
import { getEmployeeProfileById } from '../../../_metronic/redux/dashboardCrud';
import { formatDates } from '../common';
import { toAbsoluteUrl } from '../../../_metronic/_helpers';
import './form.css';

// Field name and keys organized by sections
const SECTIONS = [
  {
    heading: "Office Information",
    fields: [
      { name: 'Company', value: 'companyName' },
      { name: 'Subsidiary', value: 'subsidiaryName' },
      { name: 'Department', value: 'departmentName' },
      { name: 'Grade', value: 'gradeName' },
      { name: 'Designation', value: 'designationName' },
      { name: 'Employee Type', value: 'employeeTypeName' },
      { name: 'Team', value: 'teamName' },
    ]
  },
  {
    heading: "Personal Information",
    fields: [
      { name: 'Country', value: 'countryName' },
      { name: 'City', value: 'cityName' },
      { name: 'Location', value: 'locationName' },
      { name: 'Region', value: 'regionName' },
      { name: 'Marital Status', value: 'maritalStatus' },
      { name: 'Gender', value: 'gender' },
      { name: 'Date of Joining', value: 'dateOfJoining', isDate: true },
      { name: 'Date of Confirmation', value: 'dateOfConfirmation', isDate: true },
    ]
  },
];

const EmployeeProfile = ({ employeeId, panelMode }) => {
  const [data, setdata] = useState({});

  useEffect(() => {
    if (employeeId) {
      getEmployeeProfileById(employeeId)
        .then((res) => {
          if (res?.data?.data) {
            setdata(res.data.data);
          }
        })
        .catch(() => {
          setdata({});
        });
    } else {
      setdata({});
    }
  }, [employeeId]);

  return (
    <>
      {panelMode && (
        <Accordion defaultActiveKey="0" className="mx-6">
          <Card>
            <Accordion.Collapse eventKey="0">
              <Card.Body style={{ backgroundColor: '#E6F8FF' }}>
                <div
                  style={{
                    backgroundColor: '#E6F8FF',
                    padding: '20px',
                    borderRadius: '5px',
                    border: 'none',
                  }}
                >
                  {Object.keys(data).length ? (
                    SECTIONS.map((section, sectionIndex) => (
                      <div key={sectionIndex} style={{ marginBottom: '2%' }}>
                        <h5 className="text-bold mb-5 custom_color_1">{section.heading}</h5>

                        <Row className="align-items-start">
                          {/* Fields on the left */}
                          <Col md={9}>
                            <Row>
                              {section.fields.map((field, fieldIndex) => (
                                <Col key={fieldIndex} md={4} className="mb-3">
                                  <strong>{field.name}: </strong>
                                  {data[field.value]
                                    ? field.isDate
                                      ? formatDates(data[field.value])
                                      : data[field.value]
                                    : 'N/A'}
                                </Col>
                              ))}

                              {/* Add Reporting To & Payroll Group below others in Office Info */}
                              {sectionIndex === 0 && (
                                <>
                                  <Col md={4} className="mb-3">
                                    <strong>Reporting To: </strong>
                                    {data.reportToName ?? 'N/A'}
                                  </Col>
                                  <Col md={4} className="mb-3">
                                    <strong>Payroll Group: </strong>
                                    {data.payrollName ?? 'N/A'}
                                  </Col>
                                </>
                              )}
                            </Row>
                          </Col>

                          {/* Profile image on the right in Office Info only */}
                          {sectionIndex === 0 && (
                            <Col md={3} className="text-end">
                              <img
                                name="profile_image"
                                src={
                                  data.profile_image
                                    ? `${data.profile_image}`
                                    : toAbsoluteUrl('/media/users/profileImage.png')
                                }
                                alt="Profile"
                                width={120}
                                height={120}
                                style={{
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = toAbsoluteUrl('/media/users/profileImage.png');
                                }}
                              />
                            </Col>
                          )}
                        </Row>

                        {/* <hr /> */}
                      </div>
                    ))
                  ) : (
                    <p>Please Choose an Employee</p>
                  )}
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      )}
    </>
  );
};

export default EmployeeProfile;
