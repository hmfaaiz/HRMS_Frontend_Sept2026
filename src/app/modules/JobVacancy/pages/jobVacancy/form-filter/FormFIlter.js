import React, { useMemo, useState, useEffect, useCallback } from "react"
import { Field, Formik } from "formik"
import { isEqual } from "lodash"
import { useFormUIContext } from "../FormUIContext"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import DatePicker from "react-datepicker";
import { fetchAllDept, fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { debounce } from "redux-saga/effects";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { Form, Modal } from "react-bootstrap";
import {
  Card,
  CardHeader,
  Input,
} from "../../../../../../_metronic/_partials/controls"


pdfMake.vfs = pdfFonts.pdfMake.vfs;
const API_URL = process.env.REACT_APP_API_URL;


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


const prepareFilter = (queryParams, values) => {
  const {
    searchText,
    departmentId,
    designationId,
    priorityTypeId,
    desireFromDateOfApp,
    desireToDateOfApp
  } = values;

  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchText) {
    filter.searchQuery = searchText.trim();
  }

  if (departmentId) {
    filter.departmentId = departmentId;
  }

  if (designationId) {
    filter.designationId = designationId;
  }

  if (priorityTypeId) {
    filter.priorityTypeId = priorityTypeId;
  }

  if (desireFromDateOfApp) {
    filter.desireFromDateOfApp = desireFromDateOfApp;
  }

  if (desireToDateOfApp) {
    filter.desireToDateOfApp = desireToDateOfApp;
  }

  newQueryParams.filter = filter;
  return newQueryParams;
};

export function FormFIlter({ listLoading, user }) {


  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext()
  const [Loading, setLoading] = useState(false)



  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    }
  }, [FormUIContext])




  function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  // queryParams, setQueryParams,
  const applyFilter = (values) => {

    const newQueryParams = prepareFilter(formUIProps.queryParams, values)
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1

      formUIProps.setQueryParams(newQueryParams)
    }
  }

  const { dashboard } = useSelector((state) => state);
  useEffect(() => {

    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(412, "allPriorityTypeList"));

  }, []);

  const initialFilterValues = {
    searchText: "",
    departmentId: null,
    designationId: null,
    priorityTypeId: null,
    desireFromDateOfApp: null,
    desireToDateOfApp: null
  };
  // return (
  //   <>
  //     <Formik
  //       enableReinitialize={true}
  //       // initialValues={{

  //       //   searchText: "",

  //       // }}
  //       // initialValues={{
  //       //   searchText: "",
  //       //   departmentId: null,
  //       //   designationId: null,
  //       //   priorityTypeId: null,
  //       //   desireFromDateOfApp: null,
  //       //   desireToDateOfApp: null
  //       // }}
  //       initialValues={initialFilterValues}
  //       onSubmit={(values) => {


  //         applyFilter(values)
  //       }}
  //     >
  //       {({
  //         values,
  //         handleSubmit,
  //         handleBlur,
  //         handleChange,
  //         setFieldValue,
  //         handleReset,
  //         errors,
  //         touched,

  //       }) => (
  //         <form onSubmit={handleSubmit} >
  //           <Card>
  //             <CardHeader title={CurrentModuleName()} >
  //             </CardHeader>
  //           </Card>
  //           {/* <h6>{CurrentModuleName()}</h6> */}
  //           <div style={{ backgroundColor: "rgb(235 243 255)", marginTop: "15px", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
  //             {/* <h6>Employee</h6> */}
  //             <div className="from-group row">







  //               {/* Deparment Field Start */}
  //               <div className="col-12 col-md-4 mt-3">
  //                 <SearchSelect
  //                   name="departmentId"
  //                   label={
  //                     <span>
  //                       Department
  //                     </span>
  //                   }

  //                   onChange={(e) => {
  //                     setFieldValue("departmentId", e.value || null);
  //                     handleSubmit()
  //                   }}
  //                   value={
  //                     dashboard?.allDept?.find(
  //                       (option) => option.value === values.departmentId
  //                     ) || null
  //                   }

  //                   options={dashboard?.allDept}




  //                 />
  //               </div>

  //               {/* Deparment Field End */}

  //               <div className="col-12 col-md-4 mt-3">
  //                 <SearchSelect
  //                   name="designationId"
  //                   label={
  //                     <span>
  //                       Designation
  //                     </span>
  //                   }

  //                   onChange={(e) => {
  //                     setFieldValue("designationId", e.value || null);
  //                     handleSubmit()
  //                   }}
  //                   value={
  //                     dashboard?.allDesignations?.find(
  //                       (option) => option.value === values.designationId
  //                     ) || null
  //                   }

  //                   options={dashboard?.allDesignations}


  //                 />
  //               </div>

  //               {/* priority */}
  //               <div className="col-12 col-md-4 mt-3">
  //                 <SearchSelect
  //                   name="priorityTypeId"
  //                   label={
  //                     <span>
  //                       Priority
  //                     </span>
  //                   }

  //                   onChange={(e) => {
  //                     setFieldValue("priorityTypeId", e.value || null);
  //                     handleSubmit()
  //                   }}
  //                   value={
  //                     dashboard?.allPriorityTypeList?.find(
  //                       (option) => option.value === values.priorityTypeId
  //                     ) || null
  //                   }

  //                   options={dashboard?.allPriorityTypeList}


  //                 />
  //               </div>

  //               {/* job title */}
  //               <div className="col-12 col-md-4 mt-3">
  //                 <label>
  //                   <span>
  //                     Job Title
  //                   </span>
  //                 </label>
  //                 <Field

  //                   component={Input}
  //                   placeholder="Enter job title"

  //                   type="text"
  //                   name="searchText"
  //                   onBlur={handleBlur}
  //                   value={values.searchText}
  //                   onChange={(e) => {
  //                     setFieldValue("searchText", e.target.value.trim())
  //                     handleSubmit()
  //                   }}

  //                 />
  //               </div>



  //               <div className="col-12 col-md-4 mt-3">


  //                 <label>Desire Date of Appointment (From)</label>
  //                 <DatePicker
  //                   className="form-control"
  //                   placeholder="From Date "
  //                   selected={values?.desireFromDateOfApp ? new Date(values.desireFromDateOfApp) : null}

  //                   onChange={(date) => {
  //                     setFieldValue("desireFromDateOfApp", date);
  //                     setFieldValue("desireToDateOfApp", date);
  //                     handleSubmit()

  //                   }}
  //                   timeInputLabel="Time:"
  //                   dateFormat="dd/MM/yyyy"
  //                   // showTimeInput
  //                   name="desireFromDateOfApp"

  //                   autoComplete="off"



  //                 />

  //               </div>

  //               {/* Date To Selector */}
  //               <div className="col-12 col-md-4 mt-3">


  //                 <label>Desire Date of Appointment (To)</label>
  //                 <DatePicker
  //                   className="form-control"
  //                   placeholder="To Date "
  //                   selected={values?.desireToDateOfApp ? new Date(values.desireToDateOfApp) : null}

  //                   onChange={(date) => {
  //                     setFieldValue("desireToDateOfApp", date);
  //                     handleSubmit()

  //                   }}
  //                   timeInputLabel="Time:"
  //                   dateFormat="dd/MM/yyyy"
  //                   // showTimeInput
  //                   name="desireToDateOfApp"

  //                   autoComplete="off"



  //                 />

  //               </div>
  //             </div>
  //           </div>

  //         </form>
  //             <Modal.Footer>

  //         <button
  //           type="button"
  //           onClick={() => {
  //             handleReset();
  //             applyFilter(initialFilterValues);
  //           }}
  //           className="btn btn-danger btn-elevate"
  //         >
  //           Cancel
  //         </button>







  //       </Modal.Footer>
  //       )}


  //     </Formik>


  //   </>
  // )
return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialFilterValues}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          setFieldValue,
          handleReset,
        }) => (
          <>
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader title={CurrentModuleName()} />
              </Card>

              <div
                style={{
                  backgroundColor: "rgb(235 243 255)",
                  marginTop: "15px",
                  padding: "20px",
                  borderRadius: "5px",
                  border: "2px solid #adceff",
                }}
              >
                <div className="form-group row">
                  {/* Department */}
                  <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      name="departmentId"
                      label="Department"
                      onChange={(e) => {
                        setFieldValue("departmentId", e.value || null);
                        handleSubmit();
                      }}
                      value={
                        dashboard?.allDept?.find(
                          (option) => option.value === values.departmentId
                        ) || null
                      }
                      options={dashboard?.allDept}
                    />
                  </div>

                  {/* Designation */}
                  <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      name="designationId"
                      label="Designation"
                      onChange={(e) => {
                        setFieldValue("designationId", e.value || null);
                        handleSubmit();
                      }}
                      value={
                        dashboard?.allDesignations?.find(
                          (option) => option.value === values.designationId
                        ) || null
                      }
                      options={dashboard?.allDesignations}
                    />
                  </div>

                  {/* Priority */}
                  <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      name="priorityTypeId"
                      label="Priority"
                      onChange={(e) => {
                        setFieldValue("priorityTypeId", e.value || null);
                        handleSubmit();
                      }}
                      value={
                        dashboard?.allPriorityTypeList?.find(
                          (option) => option.value === values.priorityTypeId
                        ) || null
                      }
                      options={dashboard?.allPriorityTypeList}
                    />
                  </div>

                  {/* Job Title */}
                  <div className="col-12 col-md-4 mt-3">
                    <label>Job Title</label>
                    <Field
                      component={Input}
                      name="searchText"
                      placeholder="Enter job title"
                      type="text"
                      onBlur={handleBlur}
                      value={values.searchText}
                      onChange={(e) => {
                        setFieldValue("searchText", e.target.value.trim());
                        handleSubmit();
                      }}
                    />
                  </div>

                  {/* Date From */}
                  <div className="col-12 col-md-4 mt-3">
                    <label>Desire Date of Appointment (From)</label>
                    <DatePicker
                      className="form-control"
                      placeholder="From Date"
                      selected={
                        values?.desireFromDateOfApp
                          ? new Date(values.desireFromDateOfApp)
                          : null
                      }
                      onChange={(date) => {
                        setFieldValue("desireFromDateOfApp", date);
                        setFieldValue("desireToDateOfApp", date);
                        handleSubmit();
                      }}
                      dateFormat="dd/MM/yyyy"
                      name="desireFromDateOfApp"
                      autoComplete="off"
                    />
                  </div>

                  {/* Date To */}
                  <div className="col-12 col-md-4 mt-3">
                    <label>Desire Date of Appointment (To)</label>
                    <DatePicker
                      className="form-control"
                      placeholder="To Date"
                      selected={
                        values?.desireToDateOfApp
                          ? new Date(values.desireToDateOfApp)
                          : null
                      }
                      onChange={(date) => {
                        setFieldValue("desireToDateOfApp", date);
                        handleSubmit();
                      }}
                      dateFormat="dd/MM/yyyy"
                      name="desireToDateOfApp"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            </form>

            <Modal.Footer>
              <button
                type="button"
                onClick={() => {
                  handleReset(); // Resets form
                  applyFilter(initialFilterValues); // Clears filter state
                }}
                className="btn btn-danger btn-elevate"
              >
                Cancel
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}

