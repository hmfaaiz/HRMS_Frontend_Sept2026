// import React, { useMemo, useState, useEffect } from "react"
// import { Formik } from "formik"
// import { isEqual } from "lodash"
// import { useBanksUIContext } from "../BanksUIContext"
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// import axios from "axios";
// import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
// import { useDispatch, useSelector } from "react-redux";
// import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
// import * as actions from "../../../../Dashboard/_redux/dashboardActions";
// import DatePicker from "react-datepicker";
// import {
//   fetchAllCity,
 
//   fetchAllSubCenter,
// } from "../../../../../../_metronic/redux/dashboardActions";


// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// const API_URL = process.env.REACT_APP_API_URL;


// const prepareFilter = (queryParams, values) => {
//   const { searchText } = values
//   const newQueryParams = { ...queryParams }
//   const filter = {}

//   if (searchText) {
//     filter.searchQuery = searchText
//     // filter.email = searchText
//   }
//   newQueryParams.filter = filter
//   return newQueryParams
// }

// export function BanksFilter({ listLoading, user, setCity,
//   seletCity,
//   setCenter,
//   center,
//   setSubcenter,
//   isUserForRead,
//   subCenter,
//   alarmTime,
//   setAlarmTime,
//   setVehicle, }) {

//   const [defCity, setDefaultCity] = useState({});
//   const dispatch = useDispatch();
//   const banksUIContext = useBanksUIContext()
//   const [Loading, setLoading] = useState(false)
//   const { countryId, cityId } = useSelector((state) => state.auth.user);
//   const dashboard = useSelector((state) => state.dashboard);
//   const [defCenter, setDefaultCenter] = useState({});
//   const [defSubcenter, setDefaultSubCenter] = useState({});
//   const [receiptDateFrom, setReceiptDateFrom] = useState(null);
//   const [receiptDateTo, setReceiptDateTo] = useState(null);
//   useEffect(() => {
//     console.log("bank step 1")
//     if (countryId) {
//       console.log("countryId id drop", countryId);
//       dispatch(fetchAllCity(1));
//     }
//   }, [countryId, dispatch]);

 

//   const banksUIProps = useMemo(() => {
//     return {
//       queryParams: banksUIContext.queryParams,
//       setQueryParams: banksUIContext.setQueryParams,
//     }
//   }, [banksUIContext])

//   async function fetchDonationReport(filterVal) {
//     try {
//         console.log("filter",filterVal.receiptDateFrom);
//      // console.log(`${API_URL}/edrs/donation-report`);
//      // console.log("filter value", filterVal)
//       const response = await axios.post(`${API_URL}/edrs/donation-report`, {
//         bookNo: filterVal.txtBookNo,
//         cityId: filterVal.cityId || "0",
//         centerId: filterVal.centerId || "0",
//         subCenterId: filterVal.subCenterId || "0",
//         dateFrom: filterVal.receiptDateFrom || "",
//         dateTo: filterVal.receiptDateTo,
               
//       });
//       console.log("donation report", response);
//       return response?.data?.data;
//     } catch (error) {
//       console.log("Error fetching data:", error);
//       console.error("Error fetching data:", error);
//     }
//   }

//   function getBase64ImageFromURL(url) {
//     return new Promise((resolve, reject) => {
//       var img = new Image();
//       img.setAttribute("crossOrigin", "anonymous");

//       img.onload = () => {
//         var canvas = document.createElement("canvas");
//         canvas.width = img.width;
//         canvas.height = img.height;

//         var ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0);

//         var dataURL = canvas.toDataURL("image/png");

//         resolve(dataURL);
//       };

//       img.onerror = (error) => {
//         reject(error);
//       };

//       img.src = url;
//     });
//   }

//   async function createPdf(filterVal) {
//     // console.log("e",e)
//     // setStartDate(e);
//     // const getYear = moment(e).format("yyyy");
//     //pbookNo = e;
//     const pbookNo = filterVal.txtBookNo;
//     console.log("creaet PDF", filterVal)
//     if (filterVal != null) {
//       setLoading(true);
//       const data = await fetchDonationReport(filterVal);
//       console.log("donation report 1", data);
      
//       const table = {
//         headerRow: [
//           "SNo",
//           "Receipt#",
//           "Donor Name",
//           "Amount",
//           "Donation Type",
//           "Clerk",
//           "Center",
//           "Circle",
//           "Date",
//         ],
//         body: [],
//         footer: {
//           columns: [
//             'test123',
//             {
//               alignment: 'right',
//               text: 'Footer text'
//             }
//           ],
//           margin: [10, 0]
//         },
//       };

//       let total = 0;
//       let t = 0;
//       data &&
//         data.forEach((item, index) => {
//           console.log("index", data.length);

//           if (data.length - 1 == index) {
//             data.forEach((item) => { total += parseFloat(item.amount) })

//           }
//           const row = [
//             index+1,
//             item.receiptNo,
//             item.donorName,
//             item.amount,
//             item.type,
//             // item.city,

//             item.clerkName,
//             item.center,
//             item.subcenter,
//             item.createdon

//           ];
//           table.body.push(row);
//         });

//       // Add Row For Total Amount
//       const totall = [
//         "",
//         "",
//         "Total",
//         "RS." + addCommas(total),
//         "",
//         "",
//         "",
//         "",
//         ""
//       ]

//       table.body.push(totall); // For Adding Total Amount in ROW

//       function GetDate() {
//         const today = new Date();
//         const yyyy = today.getFullYear();
//         let mm = today.getMonth() + 1; // Months start at 0!
//         let dd = today.getDate();

//         if (dd < 10) dd = '0' + dd;
//         if (mm < 10) mm = '0' + mm;

//         const formattedToday = dd + '/' + mm + '/' + yyyy;
//         return formattedToday;
//         // document.getElementById('DATE').value = formattedToday;
//       }

//       const documentDefinition = {
//         pageSize: 'A4',
//         pageOrientation: 'landscape',
//         fontSize: 6,
//         margin: [5, 0, 0, 30],
//         width:250,
//         content: [
//           {
//             alignment: "justify",
//             columns: [
//               // {
//               //   width: 80,
//               //   image: await getBase64ImageFromURL(
//               //     `${toAbsoluteUrl("/media/logos/abdul-start-edhi (1).png")}`
//               //     //`${toAbsoluteUrl("/media/logos/edhi1.png")}`
//               //   ),
//               // },
//               {
//                 width: "*",
//                 alignment: "center",
//                 margin:[5,0,0,30],
//                 top:[50],
//                 text: [
//                   `DONATION REPORT\n 20-Receipt(s)
//                   BookNo# ${pbookNo} KARACHI`,
//                 ],
//                 style: "header",
//               },
//               {
//                 width: 200,
//                 image: await getBase64ImageFromURL(
//                   `${toAbsoluteUrl("/media/logos/edhi1.png")}`
//                 ),
//               },
//             ],
//           },
//           {
//             table: {
//               headerRows:1,
//               body: [table.headerRow, ...table.body],
//               fontSize: 2,
//               style: {
//                 body: {
//                   fontSize: 1,
//                   margin: [10, 0]
                  
//                 },
//               }
//             },
//           },
//         ],
//         footer: {
//           columns: [
//             'Date: ' + GetDate(),
//             {
//               alignment: 'right',
//               text: 'Signature________________________ \n Zonal Office                \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\ '
//             }
//           ],
//           margin: [10, 0]
//         },
//         styles: {
//           header: {
//             fontSize: 12,
//             bold: false,
//             margin: [50, 0, 0, 60],
//             alignment: "center",
//           },
//           body: {
//             fontSize: 2,
//             bold: false,
//             pageSize: 'A4',
//             pageOrientation: 'landscape'
//           }
//         },

//         defaultStyle: {
//           columnGap: 20,
//           pageSize: 'A4',
//           pageOrientation: 'landscape'
//         },
//       };

//       setLoading(false);

//       try {
//         pdfMake.createPdf(documentDefinition).download();
//       } catch (error) {
//         // Handle the error
//         console.error(error);
//       }
//     }
//   }

//   function addCommas(nStr) {
//     nStr += '';
//     var x = nStr.split('.');
//     var x1 = x[0];
//     var x2 = x.length > 1 ? '.' + x[1] : '';
//     var rgx = /(\d+)(\d{3})/;
//     while (rgx.test(x1)) {
//       x1 = x1.replace(rgx, '$1' + ',' + '$2');
//     }
//     return x1 + x2;
//   }

//   // queryParams, setQueryParams,
//   const applyFilter = (values) => {

//     const newQueryParams = prepareFilter(banksUIProps.queryParams, values)
//     if (!isEqual(newQueryParams, banksUIProps.queryParams)) {
//       newQueryParams.pageNumber = 1
//       // update list by queryParams
//       console.log("update list by queryParams");
//       console.log(newQueryParams);
//       banksUIProps.setQueryParams(newQueryParams)
//     }
//   }

//   return (
//     <>
//       <Formik
//         enableReinitialize={true}
//         initialValues={{
//           donorName: "", // values => All=""/Susspended=0/Active=1/Pending=2
//           receiptNo: "", // values => All=""/Business=0/Individual=1
//           searchText: "",
//           cityId: [],
//           centerId: [],
//           subCenterId: [],
//           alarmTimeId: [],
//         }}
//         onSubmit={(values) => {
//           console.log(1);
//           // createPdf(values);
//           applyFilter(values)
//         }}
//       >
//         {({
//           values,
//           handleSubmit,
//           handleBlur,
//           handleChange,
//           setFieldValue,
//           errors,
//           touched,

//         }) => (
//           <form onSubmit={handleSubmit} className="form form-label-right">
//             <div className="row">

//               <div className="col-12 col-md-12">
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="searchText"
//                   placeholder="Search"
//                   onBlur={handleBlur}
//                   value={values.searchText}
//                   onChange={(e) => {
//                     setFieldValue("searchText", e.target.value.trim())
//                     handleSubmit()
//                   }}
//                 />
//                 <small className="form-text text-muted">
//                   <b>Search</b> in all fields
//                 </small>
//               </div>
//             </div>
//           </form>
//         )}
//       </Formik>

//       <Formik
//         enableReinitialize={true}
//         // initialValues={{
//         //   donorName: "", // values => All=""/Susspended=0/Active=1/Pending=2
//         //   receiptNo: "", // values => All=""/Business=0/Individual=1
//         //   searchText: "",
//         //   cityId: '0',
//         //   centerId: '0',
//         //   subCenterId: '0',
//         //   alarmTimeId: [],
//         // }}
//         onSubmit={(values) => {
//            console.log("values", values);
//           //createPdf(values);
//           //applyFilter(values)
//         }}
//       >
//         {({
//           values,
//           handleSubmit,
//           handleBlur,
//           handleChange,
//           setFieldValue,
//           errors,
//           touched,

//         }) => (
//           <form onSubmit={handleSubmit} className="form form-label-right">
//             <div className="row">
//               {/* <div className="col-12 col-md-4">
//                 <label>Date From</label>
//                 <DatePicker
//                   className="form-control"
//                   placeholder="Enter Date From"
//                   // selected={receiptDateFrom}
//                   // onChange={(date) => {
//                   //   setFieldValue("receiptDateFrom", date);
//                   //   setReceiptDateFrom(date);
//                   // }}
//                   timeInputLabel="Time:"
//                   dateFormat="dd/MM/yyyy"
//                   showTimeInput
//                   name="incidentlocationReachdateTime"
//                   disabled={isUserForRead}
//                 />
//               </div> */}
//               {/* <div className="col-12 col-md-4">
//                 <label>Date To</label>
//                 <DatePicker
//                   className="form-control"
//                   placeholder="Enter Date To"
//                   // selected={receiptDateTo}
//                   // onChange={(date) => {
//                   //   setFieldValue("receiptDateTo", date);
//                   //   setReceiptDateTo(date);
//                   // }}
//                   timeInputLabel="Time:"
//                   dateFormat="dd/MM/yyyy"
//                   showTimeInput
//                   name="incidentlocationReachdateTime"
//                   disabled={isUserForRead}
//                 />
//               </div> */}
//              {/* <div className="col-12 col-md-12">
             
//                 <label>Bank</label>
//                 <input

//                   className="form-control"
//                   //onBlur={(e) => createPdf(e.target.value)}
//                   // values={values.txtBookNo}
//                   // onChange={(e) => {
//                   //   setFieldValue("txtBookNo", e.target.value.trim())
//                   //   // handleSubmit()
//                   // }}
//                   name="txtBankSearch"
//                   placeholder="Enter Bank Name"
//                 // onBlur={handleBlur}

//                 />


//               </div>*/}

             
//             </div>
//             <div className="row">
//             {/* <div className="col-12 col-md-4">
//                 <SearchSelect
//                   name="cityId"
//                   label="Select City*"
//                   isDisabled={false}
//                   onBlur={() => {
//                     //   handleBlur({ target: { name: "cityId" } });
//                   }}
//                   // onChange={(e) => {
//                   //   setFieldValue("cityId", e.value || null);
//                   //   setDefaultCity(e);
//                   //   dispatch(fetchAllCityCenters(e.value));
//                   // }}
//                   // value={defCity}
//                   // error={errors.cityId}
//                   // touched={touched.cityId}
//                   // options={dashboard.allCity}
//                 />
//               </div> */}
//               {/* <div className="col-12 col-md-4">
//                 <SearchSelect
//                   name="centerId"
//                   label="Select Circle*"
//                   isDisabled={isUserForRead && true}
//                   // onBlur={() => {
//                   //   handleBlur({ target: { name: "centerId" } });
//                   // }}
//                   // onChange={(e) => {
//                   //   setFieldValue("centerId", e.value || '0');
//                   //   setDefaultCenter(e);
//                   //   dispatch(fetchAllSubCenter(e.value));
//                   // }}
//                   // value={defCenter}
//                   // // error={user.centerId}
//                   // // touched={touched.centerId}
//                   // options={dashboard.cityCenters}
//                 />
//               </div> */}
//               {/* <div className="col-12 col-md-4">
//                 <SearchSelect
//                   name="subCenterId"
//                   label="Center*"
//                   isDisabled={isUserForRead && true}
//                   // onBlur={() => {
//                   //   handleBlur({ target: { name: "subCenterId" } });
//                   // }}
//                   // onChange={(e) => {
//                   //   setFieldValue("subCenterId", e.value || null);
//                   //   setDefaultSubCenter(e);
//                   //   console.log("sub center id", e.value);
//                   //   // setDefaultDriver([]);
//                   //   // dispatch(fetchDrivers(e.value));
//                   // }}
//                   // value={defSubcenter}
//                   // error={errors.subCenterId}
//                   // touched={touched.subCenterId}
//                   // options={dashboard.allSubCenter}
//                 />
//               </div> */}
//             </div>
//             {/* <div className="row">
//               <div className="col-md-12">
//                 <button
//                   type="submit"
//                   onClick={() => handleSubmit()}
//                   className="btn btn-primary btn-elevate"
//                 >
//                   Search
//                   {(
//                     <span className="ml-3 mr-3"></span>
//                   )}
//                 </button>
//               </div>

//             </div> */}
//           </form>
//         )}
//       </Formik>
//     </>
//   )

//   return (
//     <>

//     </>
//   )
// }
