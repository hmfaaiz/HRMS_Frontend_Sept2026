
// import React, { useEffect, useState } from 'react';
// import { Accordion, Card, Row, Col } from 'react-bootstrap';
// import { getEmployeeProfileById } from '../../../_metronic/redux/dashboardCrud';
// import { formatDates } from '../common';
// import { toAbsoluteUrl } from '../../../_metronic/_helpers';
// import './form.css';
// import { User } from 'lucide-react';
// // Field name and keys organized by sections
// const SECTIONS = [
//   {
//     heading: "Office Information",
//     fields: [

//       { name: 'Employee Code:', value: 'employeeCode' },
//       { name: 'Designation:', value: 'designationName' },
//       { name: 'Grade:', value: 'gradeName' },
//       { name: 'Department:', value: 'departmentName' },
//       // Payroll group
//       // Reporting to
//       { name: 'Date of Joining:', value: 'dateOfJoining', isDate: true },
//       // Default shift
//       { name: 'Default Shift:', value: 'defaultShiftName' },
//       { name: 'Employee Type:', value: 'employeeTypeName' },
//       { name: 'Subsidiary:', value: 'subsidiaryName' },

//       // { name: 'Company:', value: 'companyName' },
//       // { name: 'Subsidiary:', value: 'subsidiaryName' },
//       // { name: 'Team:', value: 'teamName' },
//     ]
//   },
//   {
//     heading: "Personal Information",
//     fields: [
//       { name: 'Date of Birth:', value: 'dateOfBirth', isDate: true },
//       { name: 'Gender:', value: 'gender' },
//       { name: 'Marital Status:', value: 'maritalStatus' },
//       { name: 'Location:', value: 'locationName' },
//       { name: 'Cell:', value: 'phone_cell' },
//       { name: 'Id Card No.:', value: 'nic_no' },
//       //  Cell no.
//       // Id card no.

//       { name: 'Date of Confirmation:', value: 'dateOfConfirmation', isDate: true },
//       { name: 'Date of Contract Expiry', value: 'dateOfContractExpiry', isDate: true },
//       //  contract expiray




//       // { name: 'Country:', value: 'countryName' },
//       // { name: 'City:', value: 'cityName' },
//       // { name: 'Region:', value: 'regionName' },




//     ]
//   },
// ];

// const ViewSeparate = ({ employeeId, panelMode }) => {
//   const [data, setdata] = useState({});

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
//       {panelMode && (
//         <Accordion defaultActiveKey="0" className=" ">
//           <Card>
//             <Accordion.Collapse eventKey="0">

//               <Card.Body className='bg-tsecondary '>
//                 <div>
//                   {Object.keys(data).length ? (
//                     <Row>
//                       {/* Office Info */}
//                       <Col md={3}>

//                         <h6 className="font-bold mb-0 text-primary my-2">
//                           Employee Information
//                         </h6>
//                         {/* <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 text-sm text-black gap-y-2 mt-2">
//                           {SECTIONS[0].fields.map((field, idx) => (


//                             <React.Fragment key={idx}>
//                               <div className="font-medium">{field.name}</div>
//                               <div> {data[field.value]
//                                 ? field.isDate
//                                   ? formatDates(data[field.value])
//                                   : data[field.value]
//                                 : 'N/A'}</div>
//                             </React.Fragment>

//                           ))}

//                         </div> */}


//                         <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 text-sm text-black gap-y-2 mt-2">
//   {SECTIONS[0].fields.map((field, idx) => {
//     const fieldValue = data[field.value];

//     if (!fieldValue) return null; // agar empty/null hai to skip kar do

//     return (
//       <React.Fragment key={idx}>
//         <div className="font-medium">{field.name}</div>
//         <div>
//           {field.isDate ? formatDates(fieldValue) : fieldValue}
//         </div>
//       </React.Fragment>
//     );
//   })}
// </div>

//                         {/* <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 text-sm text-black gap-y-2 mt-2">
//                           <React.Fragment>
//                             <div className="font-medium min-w-[180px]">Reporting To:</div>
//                             <div>{data.reportToName ?? 'N/A'}</div>
//                           </React.Fragment>




//                           <React.Fragment>
//                             <div className="font-medium">Payroll Group:</div>
//                             <div> {data?.payrollName ?? 'N/A'}</div>
//                           </React.Fragment>

//                         </div> */}


//                         <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 text-sm text-black gap-y-2 mt-2">
//   {data.reportToName && (
//     <React.Fragment>
//       <div className="font-medium min-w-[180px]">Reporting To:</div>
//       <div>{data.reportToName}</div>
//     </React.Fragment>
//   )}

//   {data?.payrollName && (
//     <React.Fragment>
//       <div className="font-medium">Payroll Group:</div>
//       <div>{data.payrollName}</div>
//     </React.Fragment>
//   )}
// </div>


//                       </Col>

//                       {/* Personal Info */}
//                       {/* <Col md={3} className=' lg:ml-36 '>
//                         <h6 className="font-bold mb-0 text-primary my-2 ">
//                       &nbsp;
//                         </h6>
//                         <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 text-sm text-black gap-y-2 mt-2">
//                           {SECTIONS[1].fields.map((field, idx) => (
                           

//                             <React.Fragment key={idx}>
//                               <div className="font-medium">{field.name}</div>
//                               <div className=''> {data[field.value]
//                                 ? field.isDate
//                                   ? formatDates(data[field.value])
//                                   : data[field.value]
//                                 : 'N/A'}</div>
//                             </React.Fragment>
//                           ))}
//                         </div>
//                       </Col> */}

//                       <Col md={3} className=' lg:ml-36 '>
//   <h6 className="font-bold mb-0 text-primary my-2 ">
//     {/* Personal Information */}&nbsp;
//   </h6>
//   <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 text-sm text-black gap-y-2 mt-2">
//     {SECTIONS[1].fields.map((field, idx) => (
//       data[field.value] && (   // sirf tab render hoga jab data ho
//         <React.Fragment key={idx}>
//           <div className="font-medium">{field.name}</div>
//           <div className=''>
//             {field.isDate
//               ? formatDates(data[field.value])
//               : data[field.value]}
//           </div>
//         </React.Fragment>
//       )
//     ))}
//   </div>
// </Col>


//                       {/* Profile Image */}
//                       <Col md={3} className="flex flex-col lg:ml-36  ">
//                         <h6 className="font-bold mb-0 text-primary my-2 ">
//                           {/* Employee Picture */}&nbsp;
//                         </h6>
//                         {/* <img
//                           name="profile_image"
//                           src={
//                             data.profile_image
//                               // ? `${data.profile_image}`
//                               ? <User className='bg-white' />
//                               // : toAbsoluteUrl('/media/users/profileImage.png')
//                               : <User className='bg-white' />
//                           }
//                           alt="Profile"
//                           width={120}
//                           height={120}
//                           style={{
//                             borderRadius: '10px',
//                             objectFit: 'cover',
//                             border: '1px solid #ddd',
//                             padding: '5px',
//                             // backgroundColor: '#fff',
//                           }}
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = toAbsoluteUrl('/media/users/profileImage.png');
//                           }}
//                         /> */}

//                         {data.profile_image ? (
//                           <img
//                             name="profile_image"
//                             src={data.profile_image}
//                             alt="Profile"
//                             width={120}
//                             height={120}
//                             style={{
//                               borderRadius: '10px',
//                               objectFit: 'cover',
//                               border: '1px solid #ddd',
//                               padding: '5px',
//                               // backgroundColor: '#fff',
//                             }}
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src = toAbsoluteUrl('/media/users/profileImage.png');
//                             }}
//                           />
//                         ) : (
//                           // <div className="w-[120px] h-[120px] rounded-[10px] border border-gray-300 bg-white flex justify-center items-center p-[5px]">
//                           //   <User className='text-primary' size={60} /> {/* Icon fallback */}
//                           // </div>
//                           <></>)}

//                       </Col>
//                     </Row>
//                   ) : (
//                     <p>No profile data available</p>
//                   )}
//                 </div>
//               </Card.Body>


//             </Accordion.Collapse>
//           </Card>
//         </Accordion >
//       )}
//     </>
//   );
// };

// export default ViewSeparate;
