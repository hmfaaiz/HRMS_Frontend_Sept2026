


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
import { User } from 'lucide-react';
// Field name and keys organized by sections
const SECTIONS = [
  {
    heading: "Office Information",
    fields: [
      { name: 'Company:', value: 'companyName' },
      { name: 'Subsidiary:', value: 'subsidiaryName' },
      { name: 'Department:', value: 'departmentName' },
      { name: 'Grade:', value: 'gradeName' },
      { name: 'Designation:', value: 'designationName' },
      { name: 'Employee Type:', value: 'employeeTypeName' },
      { name: 'Team:', value: 'teamName' },
    ]
  },
  {
    heading: "Personal Information",
    fields: [
      { name: 'Country:', value: 'countryName' },
      { name: 'City:', value: 'cityName' },
      { name: 'Location:', value: 'locationName' },
      { name: 'Region:', value: 'regionName' },
      { name: 'Marital Status:', value: 'maritalStatus' },
      { name: 'Gender:', value: 'gender' },
      { name: 'Date of Joining:', value: 'dateOfJoining', isDate: true },
      { name: 'Date of Confirmation:', value: 'dateOfConfirmation', isDate: true },
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
        <Accordion defaultActiveKey="0" className=" ">
          <Card>
            <Accordion.Collapse eventKey="0">

              <Card.Body className='bg-tsecondary '>
                <div>
                  {Object.keys(data).length ? (
                    <Row>
                      {/* Office Info */}
                      <Col md={3}>

                        <h6 className="font-bold mb-0 text-primary my-2">
                          Employee Information
                        </h6>
                        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 text-sm text-black gap-y-2 mt-2">
                          {SECTIONS[0].fields.map((field, idx) => (


                            <React.Fragment key={idx}>
                              <div className="font-medium">{field.name}</div>
                              <div> {data[field.value]
                                ? field.isDate
                                  ? formatDates(data[field.value])
                                  : data[field.value]
                                : 'N/A'}</div>
                            </React.Fragment>

                          ))}

                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 text-sm text-black gap-y-2 mt-2">
                          <React.Fragment>
                            <div className="font-medium min-w-[180px]">Reporting To:</div>
                            <div>{data.reportToName ?? 'N/A'}</div>
                          </React.Fragment>




                          <React.Fragment>
                            <div className="font-medium">Payroll Group:</div>
                            <div> {data?.payrollName ?? 'N/A'}</div>
                          </React.Fragment>

                        </div>

                      </Col>

                      {/* Personal Info */}
                      <Col md={3} className=' lg:ml-36 '>
                        <h6 className="font-bold mb-0 text-primary my-2 ">
                          {/* Personal Information */}&nbsp;
                        </h6>
                        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 text-sm text-black gap-y-2 mt-2">
                          {SECTIONS[1].fields.map((field, idx) => (
                            // <div key={idx} className="flex">
                            //   <div className='min-w-[180px]'>
                            //     <strong>{field.name}:</strong>{" "}
                            //   </div>
                            //   {data[field.value]
                            //     ? field.isDate
                            //       ? formatDates(data[field.value])
                            //       : data[field.value]
                            //     : 'N/A'}
                            // </div>

                            <React.Fragment key={idx}>
                              <div className="font-medium">{field.name}</div>
                              <div className=''> {data[field.value]
                                ? field.isDate
                                  ? formatDates(data[field.value])
                                  : data[field.value]
                                : 'N/A'}</div>
                            </React.Fragment>
                          ))}
                        </div>
                      </Col>

                      {/* Profile Image */}
                      <Col md={3} className="flex flex-col lg:ml-36  ">
                        <h6 className="font-bold mb-0 text-primary my-2 ">
                          {/* Employee Picture */}&nbsp;
                        </h6>
                        {/* <img
                          name="profile_image"
                          src={
                            data.profile_image
                              // ? `${data.profile_image}`
                              ? <User className='bg-white' />
                              // : toAbsoluteUrl('/media/users/profileImage.png')
                              : <User className='bg-white' />
                          }
                          alt="Profile"
                          width={120}
                          height={120}
                          style={{
                            borderRadius: '10px',
                            objectFit: 'cover',
                            border: '1px solid #ddd',
                            padding: '5px',
                            // backgroundColor: '#fff',
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = toAbsoluteUrl('/media/users/profileImage.png');
                          }}
                        /> */}

                        {data.profile_image ? (
                          <img
                            name="profile_image"
                            src={data.profile_image}
                            alt="Profile"
                            width={120}
                            height={120}
                            style={{
                              borderRadius: '10px',
                              objectFit: 'cover',
                              border: '1px solid #ddd',
                              padding: '5px',
                              // backgroundColor: '#fff',
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = toAbsoluteUrl('/media/users/profileImage.png');
                            }}
                          />
                        ) : (
                          // <div className="w-[120px] h-[120px] rounded-[10px] border border-gray-300 bg-white flex justify-center items-center p-[5px]">
                          //   <User className='text-primary' size={60} /> {/* Icon fallback */}
                          // </div>
                          <></>)}

                      </Col>
                    </Row>
                  ) : (
                    <p>No profile data available</p>
                  )}
                </div>
              </Card.Body>


            </Accordion.Collapse>
          </Card>
        </Accordion >
      )}
    </>
  );
};

export default EmployeeProfile;
